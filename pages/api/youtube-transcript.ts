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
      const err = error as any;
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data)
        console.error('Response status:', err.response.status)
        console.error('Response headers:', err.response.headers)
        res.status(err.response.status).json({ error: err.response.data })
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request data:', err.request)
        res.status(500).json({ error: 'No response received from the server' })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', (err as Error).message)
        const errorMessage = (err as Error).message;
        res.status(500).json({ error: errorMessage })
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}