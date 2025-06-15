import React, { useEffect, useState } from 'react'
import { Box, Text, useApp } from 'ink'
import Spinner from 'ink-spinner'
import * as fs from 'node:fs/promises'
import { generateText } from 'ai'
import { getModel } from './lib/models.js'
import { evaluate } from './lib/evaluate.js'
import type { PromptItem, ResultItem } from './types.js'

export interface AppProps {
  models: string[]
  evaluator: string
  promptsPath: string
}

export const App = ({ models, evaluator, promptsPath }: AppProps) => {
  const [status, setStatus] = useState('Starting…')
  const { exit } = useApp()

  useEffect(() => {
    ;(async () => {
      try {
        setStatus('Loading prompts…')
        const prompts: PromptItem[] = JSON.parse(
          await fs.readFile(promptsPath, 'utf8'),
        )
        const results: Record<string, ResultItem[]> = {}
        for (const spec of models) {
          const modelInstance = getModel(spec)
          const perModel: ResultItem[] = []
          for (const item of prompts) {
            setStatus(`Asking ${spec} - ${item.id}…`)
            const { text: answer } = await generateText({
              model: modelInstance,
              prompt: item.question,
              temperature: 0.7,
            })
            const evalRes = await evaluate(
              evaluator,
              item.question,
              answer.trim(),
              item.type,
            )
            perModel.push({
              id: item.id,
              question: item.question,
              answer: answer.trim(),
              ...evalRes,
            })
          }
          results[spec] = perModel
        }
        const summary: Record<string, Record<string, number>> = {}
        for (const [spec, list] of Object.entries(results)) {
          const agg: Record<string, number> = {}
          for (const r of list) {
            for (const [k, v] of Object.entries(r.scores)) {
              agg[k] = (agg[k] ?? 0) + v
            }
          }
          for (const k in agg) {
            agg[k] = agg[k] / list.length
          }
          summary[spec] = agg
        }
        await fs.writeFile(
          'results.json',
          JSON.stringify({ results, summary }, null, 2),
        )
        setStatus('Wrote results.json')
        exit()
      } catch (err) {
        setStatus(`Error: ${(err as Error).message}`)
        exit()
      }
    })()
  }, [])

  return (
    <Box>
      <Text>
        <Spinner /> {status}
      </Text>
    </Box>
  )
}
