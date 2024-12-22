import type { NextApiRequest, NextApiResponse } from 'next';
import { getSubtitles } from 'youtube-captions-scraper';

// Simple helper to extract video ID from a typical YouTube URL
function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // ?v=xxxx or short URLs
    const videoID = parsed.searchParams.get('v');
    if (videoID) return videoID;

    // Handle youtu.be/xxxx short links
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '');
    }
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Allow users to pass in a preferred language; default to 'en' if not provided
  const { url, lang = 'en' } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const videoID = getYouTubeVideoId(url);
    if (!videoID) {
      throw new Error('Could not determine YouTube video ID from the URL');
    }

    // Attempt to fetch subtitles with the specified or default language
    let subtitles = await getSubtitles({ videoID, lang });

    // If no subtitles found, try also the default 'en' to see if at least English tracks are available
    if ((!subtitles || subtitles.length === 0) && lang !== 'en') {
      subtitles = await getSubtitles({ videoID, lang: 'en' });
    }

    if (!subtitles || subtitles.length === 0) {
      throw new Error('Transcript is empty or could not be fetched. Try a different language.');
    }

    // Merge transcript parts into a single string
    const fullText = subtitles.map((part) => part.text).join(' ');
    return res.status(200).json({ transcript: fullText });
  } catch (error) {
    console.error('Error in transcript API:', error);

    // Basic error checks (timeouts, network issues, etc.) may vary by environment
    if (error instanceof Error && error.message === 'Request timed out') {
      return res.status(504).json({ error: 'Request timed out. Try again later.' });
    }
    if (error instanceof Error && (error.message.includes('network') || error.message.includes('ECONNRESET'))) {
      return res.status(502).json({ error: 'Bad Gateway. Please try again later.' });
    }
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}