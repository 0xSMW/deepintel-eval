import React from 'react'
import { Box, Text, useInput } from 'ink'
import SelectInput from 'ink-select-input'

export interface StartViewProps {
  models: string[]
  evaluator: string
  onStart: () => void
  onSettings: () => void
}

export const StartView = ({
  models,
  evaluator,
  onStart,
  onSettings,
}: StartViewProps) => {
  useInput((input, key) => {
    if (input.toLowerCase() === 'q' || key.escape) {
      process.exit(0)
    }
  })

  return (
    <Box flexDirection="column">
      <Text color="cyan">DeepIntel Evaluation Harness</Text>
      <Text>Current models: {models.join(', ')}</Text>
      <Text>Evaluator: {evaluator}</Text>
      <Text>
        Select an option and press Enter (↑/↓ to navigate, q or Esc to quit).
      </Text>
      <SelectInput
        items={[
          { label: 'Start', value: 'start' },
          { label: 'Settings', value: 'settings' },
        ]}
        onSelect={(item) => {
          if (item.value === 'start') onStart()
          else onSettings()
        }}
      />
    </Box>
  )
}
