import type { RoastTier, SinEntry, SocialStatus } from '../../types/budget'

export interface BudgetMetrics {
  totalSpent: number
  remaining: number
  percentUsed: number
  tier: RoastTier
  socialStatus: SocialStatus
  dailyAllowance: number
}

export const computeMetrics = (monthlyBudget: number, sins: SinEntry[]): BudgetMetrics => {
  const totalSpent = sins.reduce((sum, sin) => sum + sin.amount, 0)
  const remaining = monthlyBudget - totalSpent
  const percentUsed = monthlyBudget <= 0 ? 0 : (totalSpent / monthlyBudget) * 100

  let tier: RoastTier = 'safe'
  if (percentUsed >= 100) tier = 'bankrupt'
  else if (percentUsed >= 80) tier = 'danger'
  else if (percentUsed >= 50) tier = 'warning'

  const remainingRatio = monthlyBudget <= 0 ? 0 : remaining / monthlyBudget
  let socialStatus: SocialStatus = 'high'
  if (remaining <= 0) socialStatus = 'zero'
  else if (remainingRatio <= 0.2) socialStatus = 'low'
  else if (remainingRatio <= 0.5) socialStatus = 'mid'

  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysLeft = Math.max(1, lastDay - now.getDate() + 1)
  const dailyAllowance = Math.max(0, remaining / daysLeft)

  return {
    totalSpent,
    remaining,
    percentUsed: Number(percentUsed.toFixed(1)),
    tier,
    socialStatus,
    dailyAllowance: Number(dailyAllowance.toFixed(1)),
  }
}

export const tierColor = (tier: RoastTier): string => {
  switch (tier) {
    case 'safe':
      return 'var(--ring-ok)'
    case 'warning':
      return 'var(--ring-warning)'
    case 'danger':
      return 'var(--ring-danger)'
    case 'bankrupt':
      return 'var(--ring-bankrupt)'
    default:
      return 'var(--ring-ok)'
  }
}

export const statusColor = (status: SocialStatus): string => {
  switch (status) {
    case 'high':
      return '#f5c86f'
    case 'mid':
      return '#4ecdc4'
    case 'low':
      return '#ff8a5b'
    case 'zero':
      return '#ff4f6d'
    default:
      return '#f5c86f'
  }
}
