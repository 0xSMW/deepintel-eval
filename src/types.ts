export interface PromptItem {
  id: string
  type: 'factual' | 'hypothetical'
  question: string
}

export interface ResultItem {
  id: string
  question: string
  answer: string
  scores: Record<string, number>
  explanation: string
}
