import { generateText } from 'ai'
import type { PromptItem } from '../types.js'
import { getModel } from './models.js'

export interface EvalResult {
  scores: Record<string, number>
  explanation: string
}

export async function evaluate(
  evalModel: string,
  question: string,
  answer: string,
  type: PromptItem['type'],
): Promise<EvalResult> {
  const criteria =
    type === 'factual'
      ? 'Depth, Specificity, Reasoning, Presentation, Accuracy, Sourcing'
      : 'Depth, Specificity, Reasoning, Presentation, Plausibility, Grounding'

  const prompt = `You are an expert analyst evaluating an AI response.\n\nQuestion:\n${question}\n\nAnswer:\n${answer}\n\nAssess the answer on the following criteria: ${criteria}. Rate each from 0-5 and reply with a JSON object where keys are the criteria names and values are the scores. After the JSON, provide a short paragraph summarizing strengths and weaknesses.`

  const { text } = await generateText({
    model: getModel(evalModel),
    prompt,
    temperature: 0,
  })
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  let scores: Record<string, number> = {}
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      scores = JSON.parse(text.slice(firstBrace, lastBrace + 1))
    } catch {}
  }
  const explanation = lastBrace !== -1 ? text.slice(lastBrace + 1).trim() : text
  return { scores, explanation }
}
