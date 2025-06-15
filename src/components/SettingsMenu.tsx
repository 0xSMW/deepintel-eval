import React, { useState } from 'react'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'
import TextInput from 'ink-text-input'
import type { PromptItem } from '../types.js'
import { MODELS_BY_PROVIDER, PROVIDERS } from '../lib/models.js'

export interface SettingsMenuProps {
  defaultModels: string[]
  defaultEvaluator: string
  onSubmit: (models: string[], evaluator: string) => void
}

type MenuStep =
  | 'chooseModelProvider'
  | 'chooseModel'
  | 'addMoreModels'
  | 'chooseEvalProvider'
  | 'chooseEvalModel'

export const SettingsMenu = ({
  defaultModels,
  defaultEvaluator,
  onSubmit,
}: SettingsMenuProps) => {
  const [step, setStep] = useState<MenuStep>('chooseModelProvider')
  const [currentProvider, setCurrentProvider] = useState('')
  const [models, setModels] = useState<string[]>(defaultModels)
  const [evalProvider, setEvalProvider] = useState('')
  const [freeInput, setFreeInput] = useState('')

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

  if (step === 'chooseModelProvider') {
    return (
      <Box flexDirection="column">
        <Text color="green">
          Select provider for model {models.length + 1}:
        </Text>
        {renderSelect(PROVIDERS, (provider) => {
          setCurrentProvider(provider)
          setStep('chooseModel')
        })}
        {models.length > 0 && (
          <Text>
            Already selected: {models.join(', ')} (press ↑/↓ to navigate, Enter
            to choose)
          </Text>
        )}
      </Box>
    )
  }

  if (step === 'chooseModel') {
    const modelItems = MODELS_BY_PROVIDER[currentProvider] ?? []
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
        {renderSelect(
          modelItems,
          (model) => {
            setModels([...models, `${currentProvider}:${model}`])
            setStep('addMoreModels')
          },
          { showBack: true, onBack: () => setStep('chooseModelProvider') },
        )}
      </Box>
    )
  }

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

  if (step === 'chooseEvalProvider') {
    return (
      <Box flexDirection="column">
        <Text color="green">Select provider for evaluator model:</Text>
        {renderSelect(
          PROVIDERS,
          (provider) => {
            setEvalProvider(provider)
            setStep('chooseEvalModel')
          },
          { showBack: true, onBack: () => setStep('addMoreModels') },
        )}
      </Box>
    )
  }

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
        {renderSelect(
          items,
          (model) => {
            onSubmit(models, `${evalProvider}:${model}`)
          },
          { showBack: true, onBack: () => setStep('chooseEvalProvider') },
        )}
      </Box>
    )
  }

  return null
}
