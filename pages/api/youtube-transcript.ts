import type { NextApiRequest, NextApiResponse } from 'next';
import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(url);

    if (!transcript || transcript.length === 0) {
      throw new Error('Transcript is empty or could not be fetched');
    }

    // Merge transcript parts into a single string
    const fullText = transcript.map(part => part.text).join(' ');
    return res.status(200).json({ transcript: fullText });
  } catch (error) {
    console.error('Error in transcript API:', error);

    if (error instanceof Error && error.message === 'Request timed out') {
      return res.status(504).json({ error: 'Request timed out. Try again later.' });
    }
    if (error instanceof Error && (error.message.includes('network') || error.message.includes('ECONNRESET'))) {
      return res.status(502).json({ error: 'Bad Gateway. Please try again later.' });
    }
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}