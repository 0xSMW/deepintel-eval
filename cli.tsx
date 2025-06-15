#!/usr/bin/env node

import React, { useEffect, useState } from 'react'
import { render, Box, Text, useApp, useInput } from 'ink'
import Spinner from 'ink-spinner'
import TextInput from 'ink-text-input'
import SelectInput from 'ink-select-input'

interface SettingsMenuProps {
  defaultModels: string[]
  defaultEvaluator: string
  onSubmit: (models: string[], evaluator: string) => void
}

// Available providers and some popular model names. Feel free to extend this list.
const PROVIDERS = [
  { label: 'xai', value: 'xai' },
  { label: 'openai', value: 'openai' },
  { label: 'anthropic', value: 'anthropic' },
  { label: 'google', value: 'google' },
]

const MODELS_BY_PROVIDER: Record<string, { label: string; value: string }[]> = {
  xai: [
    // { label: 'grok-3.5', value: 'grok-3.5-latest' },
    // { label: 'grok-3.5-mini', value: 'grok-3.5-mini' },
    { label: 'grok-3-latest', value: 'grok-3-latest' },
    { label: 'grok-3-fast-latest', value: 'grok-3-fast-latest' },
    { label: 'grok-3-mini-latest', value: 'grok-3-mini-latest' },
    { label: 'grok-3-mini-fast-latest', value: 'grok-3-mini-fast-latest' },
  ],
  openai: [
    { label: 'gpt-4.1-2025-04-14', value: 'gpt-4.1-2025-04-14' },
    { label: 'gpt-4.1-mini-2025-04-14', value: 'gpt-4.1-mini-2025-04-14' },
    { label: 'gpt-4.1-nano-2025-04-14', value: 'gpt-4.1-nano-2025-04-14' },
    { label: 'gpt-4.5-preview-2025-02-27', value: 'gpt-4.5-preview-2025-02-27' },
    { label: 'gpt-4o-2024-08-06', value: 'gpt-4o-2024-08-06' },
    { label: 'gpt-4o-audio-preview-2024-12-17', value: 'gpt-4o-audio-preview-2024-12-17' },
    { label: 'gpt-4o-realtime-preview-2024-12-17', value: 'gpt-4o-realtime-preview-2024-12-17' },
    { label: 'gpt-4o-mini-2024-07-18', value: 'gpt-4o-mini-2024-07-18' },
    { label: 'gpt-4o-mini-audio-preview-2024-12-17', value: 'gpt-4o-mini-audio-preview-2024-12-17' },
    { label: 'gpt-4o-mini-realtime-preview-2024-12-17', value: 'gpt-4o-mini-realtime-preview-2024-12-17' },
    { label: 'gpt-4o-mini-search-preview-2025-03-11', value: 'gpt-4o-mini-search-preview-2025-03-11' },
    { label: 'gpt-4o-search-preview-2025-03-11', value: 'gpt-4o-search-preview-2025-03-11' },
    { label: 'gpt-4o-2025-05-13', value: 'gpt-4o-2025-05-13' },
    { label: 'gpt-4.5-turbo', value: 'gpt-4.5-turbo' },
    { label: 'gpt-3.5-turbo-0125', value: 'gpt-3.5-turbo-0125' },
    { label: 'o1-2024-12-17', value: 'o1-2024-12-17' },
    { label: 'o1-pro-2025-03-19', value: 'o1-pro-2025-03-19' },
    { label: 'o1-mini-2024-09-12', value: 'o1-mini-2024-09-12' },
    { label: 'o3-pro-2025-06-10', value: 'o3-pro-2025-06-10' },
    { label: 'o3-2025-04-16', value: 'o3-2025-04-16' },
    { label: 'o3-mini-2025-01-31', value: 'o3-mini-2025-01-31' },
    { label: 'o4-mini-2025-04-16', value: 'o4-mini-2025-04-16' },
    { label: 'codex-mini-latest', value: 'codex-mini-latest' },
    { label: 'computer-use-preview-2025-03-11', value: 'computer-use-preview-2025-03-11' },
    { label: 'gpt-image-1', value: 'gpt-image-1' },
  ],
  anthropic: [
    { label: 'claude-opus-4-20250514', value: 'claude-opus-4-20250514' },
    { label: 'claude-sonnet-4-20250514', value: 'claude-sonnet-4-20250514' },
    { label: 'claude-3-7-sonnet-20250219', value: 'claude-3-7-sonnet-20250219' },
    { label: 'claude-3-5-haiku-20241022', value: 'claude-3-5-haiku-20241022' },
    { label: 'claude-3-5-sonnet-20241022', value: 'claude-3-5-sonnet-20241022' },
    { label: 'claude-3-5-sonnet-20240620', value: 'claude-3-5-sonnet-20240620' },
    { label: 'claude-3-opus-20240229', value: 'claude-3-opus-20240229' },
    { label: 'claude-3-sonnet-20240229', value: 'claude-3-sonnet-20240229' },
    { label: 'claude-3-haiku-20240307', value: 'claude-3-haiku-20240307' },
  ],
  google: [
    { label: 'gemini-2.5-flash-preview-05-20', value: 'gemini-2.5-flash-preview-05-20' },
    { label: 'gemini-2.5-flash-preview-native-audio-dialog', value: 'gemini-2.5-flash-preview-native-audio-dialog' },
    { label: 'gemini-2.5-flash-exp-native-audio-thinking-dialog', value: 'gemini-2.5-flash-exp-native-audio-thinking-dialog' },
    { label: 'gemini-2.5-flash-preview-tts', value: 'gemini-2.5-flash-preview-tts' },
    { label: 'gemini-2.5-pro-preview-06-05', value: 'gemini-2.5-pro-preview-06-05' },
    { label: 'gemini-2.5-pro-preview-tts', value: 'gemini-2.5-pro-preview-tts' },
    { label: 'gemini-2.0-flash', value: 'gemini-2.0-flash' },
    { label: 'gemini-2.0-flash-preview-image-generation', value: 'gemini-2.0-flash-preview-image-generation' },
    { label: 'gemini-2.0-flash-lite', value: 'gemini-2.0-flash-lite' },
    { label: 'gemini-1.5-flash', value: 'gemini-1.5-flash' },
    { label: 'gemini-1.5-flash-8b', value: 'gemini-1.5-flash-8b' },
    { label: 'gemini-1.5-pro', value: 'gemini-1.5-pro' },
    { label: 'gemini-embedding-exp', value: 'gemini-embedding-exp' },
    { label: 'imagen-3.0-generate-002', value: 'imagen-3.0-generate-002' },
    { label: 'veo-2.0-generate-001', value: 'veo-2.0-generate-001' },
    { label: 'gemini-2.0-flash-live-001', value: 'gemini-2.0-flash-live-001' },
  ],
}

type MenuStep =
  | 'chooseModelProvider'
  | 'chooseModel'
  | 'addMoreModels'
  | 'chooseEvalProvider'
  | 'chooseEvalModel'

const SettingsMenu = ({ defaultModels, defaultEvaluator, onSubmit }: SettingsMenuProps) => {
  const [step, setStep] = useState<MenuStep>('chooseModelProvider')
  const [currentProvider, setCurrentProvider] = useState<string>('')
  const [models, setModels] = useState<string[]>(defaultModels)
  const [evalProvider, setEvalProvider] = useState<string>('')
  const [freeInput, setFreeInput] = useState<string>('')

  // Helper to render a SelectInput with a back option if desired
  const renderSelect = (
    items: { label: string; value: string }[],
    onSelect: (v: string) => void,
    extra?: { showBack?: boolean; onBack?: () => void },
  ) => (
    <SelectInput
      items={[
        ...items,
        ...(extra?.showBack
          ? [{ label: '← Back', value: '__back' } as const]
          : []),
      ]}
      onSelect={(item) => {
        if (item.value === '__back') extra?.onBack?.()
        else onSelect(item.value as string)
      }}
    />
  )

  // Step: choose provider for a model
  if (step === 'chooseModelProvider') {
    return (
      <Box flexDirection="column">
        <Text color="green">Select provider for model {models.length + 1}:</Text>
        {renderSelect(PROVIDERS, (provider) => {
          setCurrentProvider(provider)
          setStep('chooseModel')
        })}
        {models.length > 0 && (
          <Text>
            Already selected: {models.join(', ')} (press ↑/↓ to navigate, Enter to
            choose)
          </Text>
        )}
      </Box>
    )
  }

  // Step: choose a model within the selected provider
  if (step === 'chooseModel') {
    const modelItems = MODELS_BY_PROVIDER[currentProvider] ?? []
    // If no predefined models we fall back to text input
    if (modelItems.length === 0) {
      return (
        <Box flexDirection="column">
          <Text>
            Enter model name for provider "{currentProvider}" and press Enter:
          </Text>
          <TextInput
            value={freeInput}
            onChange={setFreeInput}
            onSubmit={(value) => {
              setModels([...models, `${currentProvider}:${value}`])
              setFreeInput('')
              setStep('addMoreModels')
            }}
          />
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        <Text color="green">Select model from {currentProvider}:</Text>
        {renderSelect(modelItems, (model) => {
          setModels([...models, `${currentProvider}:${model}`])
          setStep('addMoreModels')
        }, { showBack: true, onBack: () => setStep('chooseModelProvider') })}
      </Box>
    )
  }

  // Ask if user wants to add more models or move on
  if (step === 'addMoreModels') {
    return (
      <Box flexDirection="column">
        <Text color="green">Current models: {models.join(', ')}</Text>
        {renderSelect(
          [
            { label: 'Add another model', value: 'add' },
            { label: 'Proceed to evaluator selection', value: 'next' },
          ],
          (choice) => {
            if (choice === 'add') {
              setStep('chooseModelProvider')
            } else {
              setStep('chooseEvalProvider')
            }
          },
        )}
      </Box>
    )
  }

  // Evaluator provider selection
  if (step === 'chooseEvalProvider') {
    return (
      <Box flexDirection="column">
        <Text color="green">Select provider for evaluator model:</Text>
        {renderSelect(PROVIDERS, (provider) => {
          setEvalProvider(provider)
          setStep('chooseEvalModel')
        }, { showBack: true, onBack: () => setStep('addMoreModels') })}
      </Box>
    )
  }

  // Evaluator model selection
  if (step === 'chooseEvalModel') {
    const items = MODELS_BY_PROVIDER[evalProvider] ?? []
    if (items.length === 0) {
      return (
        <Box flexDirection="column">
          <Text>
            Enter evaluator model name for provider "{evalProvider}" and press
            Enter:
          </Text>
          <TextInput
            value={freeInput}
            onChange={setFreeInput}
            onSubmit={(value) => {
              onSubmit(models, `${evalProvider}:${value}`)
            }}
          />
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        <Text color="green">Select evaluator model from {evalProvider}:</Text>
        {renderSelect(items, (model) => {
          onSubmit(models, `${evalProvider}:${model}`)
        }, { showBack: true, onBack: () => setStep('chooseEvalProvider') })}
      </Box>
    )
  }

  return null // Should never reach
}

import { generateText } from 'ai'
import { xai } from '@ai-sdk/xai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import * as fs from 'node:fs/promises'

interface PromptItem {
  id: string
  type: 'factual' | 'hypothetical'
  question: string
}

function getModel(spec: string) {
  const [provider, model] = spec.includes(':')
    ? spec.split(':', 2)
    : ['xai', spec]
  if (provider === 'xai') return xai(model)
  if (provider === 'openai') return openai(model)
  if (provider === 'anthropic') return anthropic(model)
  if (provider === 'google') return google(model)
  throw new Error(`Unknown provider '${provider}'`)
}

async function evaluate(
  evalModel: string,
  question: string,
  answer: string,
  type: 'factual' | 'hypothetical',
) {
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

interface ResultItem {
  id: string
  question: string
  answer: string
  scores: Record<string, number>
  explanation: string
}

interface Props {
  models: string[]
  evaluator: string
  promptsPath: string
}

const App = ({ models, evaluator, promptsPath }: Props) => {
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
  let promptsPath = 'prompts.json'
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

interface StartViewProps {
  models: string[]
  evaluator: string
// Simple welcome screen shown on startup
const StartView = ({ onStart }: { onStart: () => void }) => {
  // Handle key presses: Enter to continue, q to quit
  useInput((input, key) => {
    if (key.return) {
      onStart()
    } else if (input.toLowerCase() === 'q' || key.escape) {
      process.exit(0)
    }
  })

  return (
    <Box flexDirection="column">
      <Text color="cyan">DeepIntel Evaluation Harness</Text>
      <Text>Press Enter to configure and start an evaluation (q to quit).</Text>
    </Box>
  )
}

const Root = () => {
  const [phase, setPhase] = useState<'start' | 'settings' | 'run'>(
    interactive ? 'start' : 'run',
  )
  const [settings, setSettings] = useState<null | {
    models: string[]
    evaluator: string
  }>(interactive ? null : { models: targets, evaluator })

  // Start view
  if (phase === 'start') {
    return <StartView onStart={() => setPhase('settings')} />
  }

  // Settings menu
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

  // Run evaluations
  return (
    <App
      models={settings.models}
      evaluator={settings.evaluator}
      promptsPath={promptsPath}
    />
  )
}

render(<Root />)
