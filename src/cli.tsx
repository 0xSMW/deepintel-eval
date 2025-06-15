#!/usr/bin/env node

import React, { useState } from 'react'
import { render, useInput } from 'ink'
import { App } from './app.js'
import { StartView } from './components/StartView.js'
import { SettingsMenu } from './components/SettingsMenu.js'

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

const Root = () => {
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
    <App
      models={settings.models}
      evaluator={settings.evaluator}
      promptsPath={promptsPath}
    />
  )
}

render(<Root />)
