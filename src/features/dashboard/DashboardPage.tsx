import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import type { BudgetMetrics } from '../metrics/shameMeter'
import { statusColor, tierColor } from '../metrics/shameMeter'
import { RoastBanner } from '../roast/RoastBanner'
import { MorningRoast } from '../roast/MorningRoast'
import { SinHistoryList } from '../sins/components/SinHistoryList'
import { SinLoggerForm } from '../sins/components/SinLoggerForm'
import type { RoastLine, SinEntry, SpendingCategory } from '../../types/budget'
import { messages } from '../../lib/i18n/messages'

interface DashboardPageProps {
  monthlyBudget: number
  roastIntensity: 1 | 2 | 3
  metrics: BudgetMetrics
  sins: SinEntry[]
  roast: RoastLine
  shakeTick: number
  onBudgetChange: (amount: number) => void
  onIntensityChange: (value: 1 | 2 | 3) => void
  onReset: () => void
  onLogSin: (payload: {
    amount: number
    category: SpendingCategory
    excuse: string
    mujamalatDuty: boolean
  }) => void
  onShareRoast: (text: string) => Promise<boolean>
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ar-SD', { maximumFractionDigits: 0 }).format(value)

const ringGradient = (percent: number, color: string) => {
  const clamped = Math.min(percent, 100)
  return {
    background: `conic-gradient(${color} ${clamped}%, rgba(255,255,255,0.08) ${clamped}% 100%)`,
  }
}

export const DashboardPage = ({
  monthlyBudget,
  roastIntensity,
  metrics,
  sins,
  roast,
  shakeTick,
  onBudgetChange,
  onIntensityChange,
  onReset,
  onLogSin,
  onShareRoast,
}: DashboardPageProps) => {
  const m = messages
  const ringColor = tierColor(metrics.tier)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (shakeTick === 0) return
    void animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.42, ease: 'linear' })
  }, [animate, scope, shakeTick])

  const shareRoast = async (text: string): Promise<boolean> => {
    const didCopy = await onShareRoast(text)
    setCopyFeedback(didCopy ? m.copied : 'ما قدرنا ننسخ الرسالة')
    setTimeout(() => setCopyFeedback(''), 1800)
    return didCopy
  }

  return (
    <main ref={scope} className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text md:text-5xl">{m.appTitle}</h1>
          <p className="mt-2 text-sm text-textMuted md:text-base">{m.appSubtitle}</p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-panel px-3 py-2 text-xs text-textMuted">
          اللهجة السودانية
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{m.shameMeter}</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm">{m.tiers[metrics.tier]}</span>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="grid h-36 w-36 place-items-center rounded-full p-3" style={ringGradient(metrics.percentUsed, ringColor)}>
              <div className="grid h-full w-full place-items-center rounded-full bg-bg text-center">
                <div>
                  <p className="text-3xl font-extrabold">{metrics.percentUsed}%</p>
                  <p className="text-xs text-textMuted">{m.spent}</p>
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 text-center md:w-auto md:min-w-[380px]">
              <div className="rounded-[var(--radius-md)] bg-panelSoft p-3">
                <p className="text-xs text-textMuted">{m.budget}</p>
                <p className="mt-1 text-sm font-bold">{formatMoney(monthlyBudget)} ج.س</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-panelSoft p-3">
                <p className="text-xs text-textMuted">{m.spent}</p>
                <p className="mt-1 text-sm font-bold text-danger">{formatMoney(metrics.totalSpent)} ج.س</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-panelSoft p-3">
                <p className="text-xs text-textMuted">{m.remaining}</p>
                <p className="mt-1 text-sm font-bold">{formatMoney(metrics.remaining)} ج.س</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-sm text-textMuted">{m.statusTitle}</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={metrics.socialStatus}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="rounded-[var(--radius-md)] px-4 py-3"
                style={{ backgroundColor: `${statusColor(metrics.socialStatus)}1f` }}
              >
                <p className="font-bold" style={{ color: statusColor(metrics.socialStatus) }}>
                  {m.statuses[metrics.socialStatus]}
                </p>
                <p className="text-sm text-textMuted">{m.statusSubtitle[metrics.socialStatus]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </article>
        <aside className="space-y-4 rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe">
          <MorningRoast
            title={m.morningRoast}
            allowanceLabel={m.dailyAllowance}
            dailyAllowance={metrics.dailyAllowance}
          />
          <div>
            <label className="mb-2 block text-sm text-textMuted">{m.monthlyBudget}</label>
            <input
              type="number"
              min={1}
              value={monthlyBudget}
              onChange={(event) => onBudgetChange(Number(event.target.value))}
              className="w-full rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-2 text-right outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-textMuted">{m.roastIntensity}</label>
            <input
              type="range"
              min={1}
              max={3}
              value={roastIntensity}
              onChange={(event) => onIntensityChange(Number(event.target.value) as 1 | 2 | 3)}
              className="w-full accent-accent"
            />
          </div>
          <button
            onClick={onReset}
            className="w-full rounded-[var(--radius-md)] border border-danger/60 bg-danger/10 px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger/20"
          >
            {m.reset}
          </button>
        </aside>
      </section>

      <section className="mb-6">
        <RoastBanner
          title={m.roastNow}
          roast={roast}
          shareLabel={m.shareRoast}
          copiedLabel={copyFeedback}
          onShare={shareRoast}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-bold">{m.sinLogger}</h2>
          <SinLoggerForm
            amountLabel={m.amount}
            categoryLabel={m.category}
            excuseLabel={m.excuse}
            submitLabel={m.saveSin}
            mujamalatDutyLabel={m.mujamalatDuty}
            mujamalatHint={m.mujamalatNote}
            onSubmit={onLogSin}
          />
        </div>
        <SinHistoryList title={m.sinHistory} emptyLabel={m.noHistory} sins={sins} />
      </section>
    </main>
  )
}
