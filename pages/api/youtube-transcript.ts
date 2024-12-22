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
      console.error('Error fetching transcript:', error)
      res.status(500).json({ error: 'An error occurred while fetching the transcript' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}