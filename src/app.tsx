import React, { useEffect, useState } from 'react'
import { Box, Text, useApp, useInput, render } from 'ink'
import Spinner from 'ink-spinner'
import * as fs from 'node:fs/promises'
import { generateText } from 'ai'
import { getModel } from './lib/models.js'
import { evaluate } from './lib/evaluate.js'
import { StartView } from './components/StartView.js'
import { SettingsMenu } from './components/SettingsMenu.js'
import type { PromptItem, ResultItem } from './types.js'

export interface HarnessProps {
  models: string[]
  evaluator: string
  promptsPath: string
}

export const Harness = ({ models, evaluator, promptsPath }: HarnessProps) => {
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

function parseArgs() {
  const args = process.argv.slice(2)
  let targets: string[] = ['xai:grok-3-mini']
  let evaluator = ''
  let promptsPath = 'prompts/prompts.json'
  let interactive = true
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--model' || arg === '--models') {
      targets = args[++i]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (arg === '--evaluator') {
      evaluator = args[++i]
    } else if (arg === '--prompts') {
      promptsPath = args[++i]
    } else if (arg === '--no-interactive' || arg === '--auto') {
      interactive = false
    }
  }
  if (!evaluator) evaluator = targets[0]
  return { targets, evaluator, promptsPath, interactive }
}

const { targets, evaluator, promptsPath, interactive } = parseArgs()

const App = () => {
  useInput((input, key) => {
    if (key.escape) {
      process.exit(0)
    }
  })

  const [phase, setPhase] = useState<'start' | 'settings' | 'run'>(
    interactive ? 'start' : 'run',
  )
  const [settings, setSettings] = useState<null | {
    models: string[]
    evaluator: string
  }>(interactive ? null : { models: targets, evaluator })

  if (phase === 'start') {
    return (
      <StartView
        models={targets}
        evaluator={evaluator}
        onStart={() => {
          setSettings({ models: targets, evaluator })
          setPhase('run')
        }}
        onSettings={() => setPhase('settings')}
      />
    )
  }

  if (phase === 'settings' || !settings) {
    return (
      <SettingsMenu
        defaultModels={targets}
        defaultEvaluator={evaluator}
        onSubmit={(models, evalModel) => {
          setSettings({ models, evaluator: evalModel })
          setPhase('run')
        }}
      />
    )
  }

  return (
    <Harness
      models={settings.models}
      evaluator={settings.evaluator}
      promptsPath={promptsPath}
    />
  )
}

render(<App />)
