import type { NextApiRequest, NextApiResponse } from 'next';
import { YoutubeTranscript } from 'youtube-transcript';

// Helper function to fetch transcript with timeout
const fetchWithTimeout = (url: string, timeout = 10000) => {
  return Promise.race([
    YoutubeTranscript.fetchTranscript(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);
};

// Helper function to retry fetching the transcript in case of failure
const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url);
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying... (${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'No URL provided' });
    }

    try {
      // Fetch the transcript with retries and timeout handling
      const transcript = await fetchWithRetry(url);

      // Combine all transcript parts into a single string
      const fullText = (transcript as { text: string }[]).map((part) => part.text).join(' ');

      res.status(200).json({ transcript: fullText });
    } catch (error) {
      console.error('Error fetching transcript:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
        details: error,
      });

      if (error instanceof Error && error.message === 'Request timed out') {
        res.status(504).json({ error: 'The request timed out. Please try again later.' });
      } else if (error instanceof Error && (error.message.includes('network') || error.message.includes('ECONNRESET'))) {
        res.status(502).json({ error: 'Bad Gateway. Please try again later.' });
      } else {
        res.status(500).json({ error: 'An error occurred while fetching the transcript' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}