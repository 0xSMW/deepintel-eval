import { xai } from '@ai-sdk/xai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'

export const PROVIDERS = [
  { label: 'xai', value: 'xai' },
  { label: 'openai', value: 'openai' },
  { label: 'anthropic', value: 'anthropic' },
  { label: 'google', value: 'google' },
]

export const MODELS_BY_PROVIDER: Record<
  string,
  { label: string; value: string }[]
> = {
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
    {
      label: 'gpt-4.5-preview-2025-02-27',
      value: 'gpt-4.5-preview-2025-02-27',
    },
    { label: 'gpt-4o-2024-08-06', value: 'gpt-4o-2024-08-06' },
    {
      label: 'gpt-4o-audio-preview-2024-12-17',
      value: 'gpt-4o-audio-preview-2024-12-17',
    },
    {
      label: 'gpt-4o-realtime-preview-2024-12-17',
      value: 'gpt-4o-realtime-preview-2024-12-17',
    },
    { label: 'gpt-4o-mini-2024-07-18', value: 'gpt-4o-mini-2024-07-18' },
    {
      label: 'gpt-4o-mini-audio-preview-2024-12-17',
      value: 'gpt-4o-mini-audio-preview-2024-12-17',
    },
    {
      label: 'gpt-4o-mini-realtime-preview-2024-12-17',
      value: 'gpt-4o-mini-realtime-preview-2024-12-17',
    },
    {
      label: 'gpt-4o-mini-search-preview-2025-03-11',
      value: 'gpt-4o-mini-search-preview-2025-03-11',
    },
    {
      label: 'gpt-4o-search-preview-2025-03-11',
      value: 'gpt-4o-search-preview-2025-03-11',
    },
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
    {
      label: 'computer-use-preview-2025-03-11',
      value: 'computer-use-preview-2025-03-11',
    },
    { label: 'gpt-image-1', value: 'gpt-image-1' },
  ],
  anthropic: [
    { label: 'claude-opus-4-20250514', value: 'claude-opus-4-20250514' },
    { label: 'claude-sonnet-4-20250514', value: 'claude-sonnet-4-20250514' },
    {
      label: 'claude-3-7-sonnet-20250219',
      value: 'claude-3-7-sonnet-20250219',
    },
    { label: 'claude-3-5-haiku-20241022', value: 'claude-3-5-haiku-20241022' },
    {
      label: 'claude-3-5-sonnet-20241022',
      value: 'claude-3-5-sonnet-20241022',
    },
    {
      label: 'claude-3-5-sonnet-20240620',
      value: 'claude-3-5-sonnet-20240620',
    },
    { label: 'claude-3-opus-20240229', value: 'claude-3-opus-20240229' },
    { label: 'claude-3-sonnet-20240229', value: 'claude-3-sonnet-20240229' },
    { label: 'claude-3-haiku-20240307', value: 'claude-3-haiku-20240307' },
  ],
  google: [
    {
      label: 'gemini-2.5-flash-preview-05-20',
      value: 'gemini-2.5-flash-preview-05-20',
    },
    {
      label: 'gemini-2.5-flash-preview-native-audio-dialog',
      value: 'gemini-2.5-flash-preview-native-audio-dialog',
    },
    {
      label: 'gemini-2.5-flash-exp-native-audio-thinking-dialog',
      value: 'gemini-2.5-flash-exp-native-audio-thinking-dialog',
    },
    {
      label: 'gemini-2.5-flash-preview-tts',
      value: 'gemini-2.5-flash-preview-tts',
    },
    {
      label: 'gemini-2.5-pro-preview-06-05',
      value: 'gemini-2.5-pro-preview-06-05',
    },
    {
      label: 'gemini-2.5-pro-preview-tts',
      value: 'gemini-2.5-pro-preview-tts',
    },
    { label: 'gemini-2.0-flash', value: 'gemini-2.0-flash' },
    {
      label: 'gemini-2.0-flash-preview-image-generation',
      value: 'gemini-2.0-flash-preview-image-generation',
    },
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

export function getModel(spec: string) {
  const [provider, model] = spec.includes(':')
    ? spec.split(':', 2)
    : ['xai', spec]
  if (provider === 'xai') return xai(model)
  if (provider === 'openai') return openai(model)
  if (provider === 'anthropic') return anthropic(model)
  if (provider === 'google') return google(model)
  throw new Error(`Unknown provider '${provider}'`)
}
