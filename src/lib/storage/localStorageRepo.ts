import type { PersistedState } from '../../types/budget'

const STORAGE_KEY = 'girishak-state-v1'

const defaultState: PersistedState = {
  version: 1,
  config: {
    monthlyBudget: 120000,
    currency: 'SDG',
    roastIntensity: 3,
  },
  sins: [],
}

export const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as PersistedState
    if (parsed?.version !== 1) return defaultState

    return {
      ...defaultState,
      ...parsed,
      config: { ...defaultState.config, ...parsed.config },
      sins: (parsed.sins ?? []).map((sin) => ({
        ...sin,
        mujamalatDuty: Boolean(sin.mujamalatDuty),
      })),
    }
  } catch {
    return defaultState
  }
}

export const saveState = (state: PersistedState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const resetState = (): PersistedState => {
  localStorage.removeItem(STORAGE_KEY)
  return defaultState
}
