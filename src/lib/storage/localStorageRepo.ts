import { Preferences } from '@capacitor/preferences'
import type { PersistedState, SinEntry } from '../../types/budget'

const STORAGE_KEY = 'girishak-state-v1'

const defaultState: PersistedState = {
  version: 1,
  config: {
    monthlyBudget: 120000,
    currency: 'SDG',
    roastIntensity: 2,
  },
  sins: [],
}

const VALID_CATEGORIES = new Set(['zayada', 'mushwar', 'mujamalat', 'other'])
const VALID_INTENSITIES = new Set([1, 2, 3])

const sanitizeSin = (raw: unknown): SinEntry | null => {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Record<string, unknown>
  const amount = Number(s.amount)
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9) return null
  if (!VALID_CATEGORIES.has(s.category as string)) return null
  return {
    id: typeof s.id === 'string' && s.id.length > 0 ? s.id.slice(0, 64) : `${Date.now()}`,
    amount,
    category: s.category as SinEntry['category'],
    excuse: typeof s.excuse === 'string' ? s.excuse.slice(0, 300) : '',
    mujamalatDuty: Boolean(s.mujamalatDuty),
    createdAt: typeof s.createdAt === 'string' ? s.createdAt : new Date().toISOString(),
  }
}

export const loadState = async (): Promise<PersistedState> => {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    if (!value) return defaultState
    const parsed = JSON.parse(value) as PersistedState
    if (parsed?.version !== 1) return defaultState

    const intensity = Number(parsed?.config?.roastIntensity)
    const monthlyBudget = Number(parsed?.config?.monthlyBudget)

    return {
      version: 1,
      config: {
        monthlyBudget: Number.isFinite(monthlyBudget) && monthlyBudget > 0 ? monthlyBudget : defaultState.config.monthlyBudget,
        currency: 'SDG',
        roastIntensity: (VALID_INTENSITIES.has(intensity) ? intensity : defaultState.config.roastIntensity) as 1 | 2 | 3,
      },
      sins: Array.isArray(parsed.sins)
        ? parsed.sins.map(sanitizeSin).filter((s): s is SinEntry => s !== null).slice(0, 500)
        : [],
    }
  } catch {
    return defaultState
  }
}

export const saveState = async (state: PersistedState): Promise<void> => {
  try {
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(state) })
  } catch {
    // storage unavailable — silently ignore
  }
}

export const resetState = async (): Promise<PersistedState> => {
  try {
    await Preferences.remove({ key: STORAGE_KEY })
  } catch {
    // ignore
  }
  return { ...defaultState, sins: [], config: { ...defaultState.config } }
}
