export type SpendingCategory = 'zayada' | 'mushwar' | 'mujamalat' | 'other'

export type RoastTier = 'safe' | 'warning' | 'danger' | 'bankrupt'

export type SocialStatus = 'high' | 'mid' | 'low' | 'zero'

export interface BudgetConfig {
  monthlyBudget: number
  currency: 'SDG'
  roastIntensity: 1 | 2 | 3
}

export interface SinEntry {
  id: string
  amount: number
  category: SpendingCategory
  excuse: string
  mujamalatDuty: boolean
  createdAt: string
}

export interface PersistedState {
  version: 1
  config: BudgetConfig
  sins: SinEntry[]
}

export interface RoastLine {
  id: string
  text: string
  intensity: 1 | 2 | 3
  categoryHint?: SpendingCategory
}
