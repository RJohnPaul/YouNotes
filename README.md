<p align="center">
  <img src="https://github.com/RJohnPaul/YouNotes/blob/67253a9687c34fc289b2898b3338b49ad80312a1/younotes.png" alt="YouNotes Logo"/>
</p>

## Younotes

YouNotes is an AI-powered tool that automatically generates concise, well-structured notes from YouTube videos and text transcripts. Transform hours of content into digestible summaries with just a click!

## Features

- 🎥 YouTube video summarization
- 📝 Text transcript processing
- 🤖 AI-powered content analysis
- 🚀 Fast and responsive web interface
- 🔒 Secure user authentication
- 📱 Mobile-friendly design

## Demo

[Link to live demo-](https://you-notes-rouge.vercel.app/)

## Tech Stack

- Frontend: React, Next.js
- Backend: Node.js, Express
- AI Processing: Google's Generative AI
- Authentication: Supabase
- Styling: Tailwind CSS
- API Integration: RapidAPI (YouTube transcript retrieval)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- Google AI API key
- RapidAPI key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/RJohnPaul/YouNotes.git
   ```

2. Install dependencies
   ```
   cd younotes
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_API_KEY=your_google_ai_api_key
   NEXT_PUBLIC_RAPID_API_KEY=your_rapid_api_key
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Sign up or log in to your YouNotes account
2. Paste a YouTube URL or input a transcript in the provided field
3. Click "Generate Notes"
4. View and copy your automatically generated notes

## Contributing

We welcome contributions to YouNotes! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Google Generative AI](https://ai.google.dev/)
- [Supabase](https://supabase.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [RapidAPI](https://rapidapi.com/)
