import React, { useState } from 'react'
import { Bot, Send, Sparkles, Zap, MessageSquare } from 'lucide-react'

interface AIAssistantProps {
  className?: string
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ className }) => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickPrompts = [
    "Analyze contract for risks",
    "Draft privacy policy",
    "Check compliance status",
    "Review contract terms",
    "Generate legal brief",
    "Assess IP portfolio"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false)
      setPrompt('')
      // In a real app, this would send to AI service
      console.log('AI Prompt:', prompt)
    }, 2000)
  }

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">AI Legal Assistant</h3>
            <p className="text-sm text-gray-500">Ask me anything about your legal matters</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me to analyze a contract, draft a document, or help with legal research..."
            className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-3 right-3 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="h-4 w-4 text-teal-500" />
          <span className="text-sm font-medium text-gray-700">Quick Prompts:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleQuickPrompt(quickPrompt)}
              className="px-3 py-1 text-sm bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Zap className="h-4 w-4 mr-1" />
            <span>Powered by GPT-4</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>24/7 Available</span>
          </div>
        </div>
      </div>
    </div>
  )
}