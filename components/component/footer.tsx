import Link from "next/link"
import React from "react"
import { Globe, GithubIcon } from "lucide-react"

export function footer() {
  return (
    <footer className="bg-black border-t border-gray-700 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Link href="https://github.com/RJohnPaul" className="text-white hover:text-gray-300 transition-colors" prefetch={false}>
            <GithubIcon className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
        <p className="text-sm text-gray-300">&copy; YouNotes. All rights reserved.</p>
        <a 
          className="text-sm hover:text-gray-300 text-white transition-colors flex items-center space-x-2" 
          target="_blank" 
          rel="noopener noreferrer"
          href="https://john-porfolio.vercel.app"
        >
          <Globe className="h-4 w-4" />
          <span>By John Paul</span>
        </a>
      </div>
    </footer>
  )
}