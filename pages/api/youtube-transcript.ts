import type { NextApiRequest, NextApiResponse } from 'next';
import { getSubtitles } from 'youtube-captions-scraper';

/**
 * Helper function to extract the YouTube video ID from various URL formats.
 * @param url - The YouTube video URL.
 * @returns The extracted video ID or null if extraction fails.
 */
function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Extract video ID from standard YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
    const videoID = parsed.searchParams.get('v');
    if (videoID) return videoID;

    // Handle shortened YouTube URLs (e.g., https://youtu.be/VIDEO_ID)
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '');
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Middleware to handle CORS.
 * @param req - The incoming API request.
 * @param res - The API response.
 * @returns A promise that resolves when CORS headers are set.
 */
async function handleCors(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigins = ['https://you-notes-rouge.vercel.app/', 'http://localhost:3000', 'https://younotes.onrender.com/'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin || '');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

/**
 * API Route Handler to fetch YouTube transcripts.
 * Supports CORS and handles various error scenarios.
 * @param req - The incoming API request.
 * @param res - The API response.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  const corsHandled = await handleCors(req, res);
  if (corsHandled) return;

  // Ensure the request method is POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Extract and validate request body
  const { url, lang = 'en' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  // Extract video ID from the provided URL
  const videoID = getYouTubeVideoId(url);
  if (!videoID) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    // Attempt to fetch subtitles in the specified language
    let subtitles = await getSubtitles({ videoID, lang });

    // If no subtitles found in the specified language, fallback to English
    if ((!subtitles || subtitles.length === 0) && lang !== 'en') {
      console.warn(`Subtitles not found for lang="${lang}". Falling back to English.`);
      subtitles = await getSubtitles({ videoID, lang: 'en' });
    }

    if (!subtitles || subtitles.length === 0) {
      throw new Error('No subtitles available for this video.');
    }

    // Combine all subtitle texts into a single string
    const fullText = subtitles.map((part) => part.text).join(' ');

    return res.status(200).json({ transcript: fullText });
  } catch (error: any) {
    console.error('Error fetching YouTube transcript:', error.message);

    // Specific error handling based on error message
    if (error.message.includes('Could not find captions')) {
      return res.status(404).json({ error: 'Could not find captions for the provided video.' });
    }

    if (error.message.includes('Transcript is empty')) {
      return res.status(404).json({ error: 'Transcript is empty or could not be fetched. Try a different language.' });
    }

    // Generic error response
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
}