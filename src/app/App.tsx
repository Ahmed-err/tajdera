import { useEffect, useMemo, useState } from 'react'
import { DirectionProvider } from './providers/DirectionProvider'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { computeMetrics } from '../features/metrics/shameMeter'
import { pickRoast } from '../features/roast/roastEngine'
import { loadState, resetState, saveState } from '../lib/storage/localStorageRepo'
import type { PersistedState, SinEntry, SpendingCategory } from '../types/budget'

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const isWeekendPeakExpense = (amount: number, monthlyBudget: number): boolean => {
  const day = new Date().getDay()
  const isThursdayOrFriday = day === 4 || day === 5
  const peakThreshold = monthlyBudget * 0.12
  return isThursdayOrFriday && amount >= peakThreshold
}

function App() {
  const handleReset = () => {
    setState(resetState())
    setLastFlags({ mujamalatDuty: false, weekendPeak: false })
  }

  const handleShareRoast = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  const [state, setState] = useState<PersistedState>(() => loadState())
  const [lastFlags, setLastFlags] = useState({ mujamalatDuty: false, weekendPeak: false })
  const [shakeTick, setShakeTick] = useState(0)

  useEffect(() => {
    saveState(state)
  }, [state])

  const metrics = useMemo(
    () => computeMetrics(state.config.monthlyBudget, state.sins),
    [state.config.monthlyBudget, state.sins],
  )

  const latestCategory = state.sins[0]?.category
  const latestMujamalatDuty = state.sins[0]?.mujamalatDuty ?? false
  const roast = useMemo(
    () =>
      pickRoast({
        tier: metrics.tier,
        roastIntensity: state.config.roastIntensity,
        category: latestCategory,
        mujamalatDuty: latestMujamalatDuty || lastFlags.mujamalatDuty,
        weekendPeak: lastFlags.weekendPeak,
      }),
    [
      metrics.tier,
      state.config.roastIntensity,
      latestCategory,
      latestMujamalatDuty,
      lastFlags.mujamalatDuty,
      lastFlags.weekendPeak,
    ],
  )

  const handleLogSin = (payload: {
    amount: number
    category: SpendingCategory
    excuse: string
    mujamalatDuty: boolean
  }) => {
    const weekendPeak = isWeekendPeakExpense(payload.amount, state.config.monthlyBudget)
    const mujamalatDuty = payload.category === 'mujamalat' && payload.mujamalatDuty

    const nextSin: SinEntry = {
      id: createId(),
      amount: payload.amount,
      category: payload.category,
      excuse: payload.excuse,
      mujamalatDuty,
      createdAt: new Date().toISOString(),
    }

    if (payload.amount >= state.config.monthlyBudget * 0.18) {
      setShakeTick((prev) => prev + 1)
    }

    setLastFlags({
      mujamalatDuty,
      weekendPeak,
    })

    setState((prev) => ({
      ...prev,
      sins: [nextSin, ...prev.sins],
    }))
  }

  return (
    <DirectionProvider>
      <DashboardPage
        monthlyBudget={state.config.monthlyBudget}
        roastIntensity={state.config.roastIntensity}
        metrics={metrics}
        sins={state.sins}
        roast={roast}
        shakeTick={shakeTick}
        onBudgetChange={(monthlyBudget) =>
          setState((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              monthlyBudget: Number.isFinite(monthlyBudget) && monthlyBudget > 0 ? monthlyBudget : 1,
            },
          }))
        }
        onIntensityChange={(roastIntensity) =>
          setState((prev) => ({
            ...prev,
            config: {
              ...prev.config,
              roastIntensity,
            },
          }))
        }
        onReset={handleReset}
        onLogSin={handleLogSin}
        onShareRoast={handleShareRoast}
      />
    </DirectionProvider>
  )
}

export default App
