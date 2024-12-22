import type { NextApiRequest, NextApiResponse } from 'next'
import { YoutubeTranscript } from 'youtube-transcript'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'No URL provided' })
    }

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url)
      
      // Combine all transcript parts into a single string
      const fullText = transcript.map(part => part.text).join(' ')

      res.status(200).json({ transcript: fullText })
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching transcript:', {
          message: error.message,
          stack: error.stack,
          details: error, // This might give additional library-specific error details
        });
      } else {
        console.error('Error fetching transcript:', {
          message: String(error),
          details: error, // This might give additional library-specific error details
        });
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}