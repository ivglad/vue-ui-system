// Единый источник токенов темы. Здесь нет стилей — только данные.
// Позже эти токены трансформируются в пресет PrimeVue и CSS‑переменные.

import { SCHEMA_VERSION, defaultTokens, validateTokens, migrateTokens } from './schema'

// Текущее состояние токенов по умолчанию (каркас)
export let tokens = structuredClone(defaultTokens)

export function loadTokens(next) {
  // Валидация и возможная миграция
  const { valid, tokens: validated, errors } = validateTokens(next)
  if (!valid) {
    console.warn('[theme/tokens] Validation errors:', errors)
  }
  const migrated = migrateTokens(validated)
  tokens = structuredClone(migrated)
  return tokens
}

export function exportTokens() {
  return structuredClone({ ...tokens, version: SCHEMA_VERSION })
}
