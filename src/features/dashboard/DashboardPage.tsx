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
  onDeleteSin: (id: string) => void
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
  onDeleteSin,
  onLogSin,
  onShareRoast,
}: DashboardPageProps) => {
  const m = messages
  const ringColor = tierColor(metrics.tier)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [scope, animate] = useAnimate()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    if (shakeTick === 0) return
    void animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.42, ease: 'linear' })
  }, [animate, scope, shakeTick])

  const shareRoast = async (text: string): Promise<boolean> => {
    const didCopy = await onShareRoast(text)
    setCopyFeedback(didCopy ? m.copied : 'ما قدرنا ننسخ الرسالة')
    setTimeout(() => setCopyFeedback(''), 2000)
    return didCopy
  }

  const handleReset = () => {
    setShowResetConfirm(false)
    onReset()
  }

  const displayPercent = Math.min(metrics.percentUsed, 100)

  return (
    <main ref={scope} className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-8">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text md:text-5xl">{m.appTitle}</h1>
          <p className="mt-2 text-sm text-textMuted md:text-base">{m.appSubtitle}</p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-panel px-3 py-2 text-xs text-textMuted">
          اللهجة السودانية 🇸🇩
        </div>
      </header>

      {/* Metrics + Settings */}
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Shame meter card */}
        <article className="rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{m.shameMeter}</h2>
            <AnimatePresence mode="wait">
              <motion.span
                key={metrics.tier}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold"
              >
                {m.tiers[metrics.tier]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            {/* Donut ring */}
            <div
              className="grid h-36 w-36 flex-shrink-0 place-items-center rounded-full p-3 transition-all duration-500"
              style={ringGradient(displayPercent, ringColor)}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-bg text-center">
                <div>
                  <p className="text-3xl font-extrabold">{displayPercent}%</p>
                  <p className="text-xs text-textMuted">{m.spent}</p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
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
                <p className={`mt-1 text-sm font-bold ${metrics.remaining < 0 ? 'text-danger' : 'text-text'}`}>
                  {formatMoney(metrics.remaining)} ج.س
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full transition-colors duration-500"
              style={{ backgroundColor: ringColor }}
              initial={{ width: 0 }}
              animate={{ width: `${displayPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* Social status */}
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

        {/* Settings sidebar */}
        <aside className="space-y-4 rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe">
          <MorningRoast
            title={m.morningRoast}
            allowanceLabel={m.dailyAllowance}
            dailyAllowance={metrics.dailyAllowance}
          />

          <div>
            <label className="mb-2 block text-sm text-textMuted">{m.monthlyBudget}</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={1_000_000_000}
                value={monthlyBudget}
                onChange={(e) => onBudgetChange(Number(e.target.value))}
                className="w-full rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-2 text-right outline-none focus:ring-2 focus:ring-accent/50"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-textMuted">
                ج.س
              </span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-textMuted">{m.roastIntensity}</label>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accentGoldLight">
                {m.roastIntensityLabels[roastIntensity - 1]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={roastIntensity}
              onChange={(e) => onIntensityChange(Number(e.target.value) as 1 | 2 | 3)}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-textMuted/60">
              {m.roastIntensityLabels.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full rounded-[var(--radius-md)] border border-danger/60 bg-danger/10 px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger/20 active:scale-95"
          >
            {m.reset}
          </button>
        </aside>
      </section>

      {/* Roast banner */}
      <section className="mb-6">
        <RoastBanner
          title={m.roastNow}
          roast={roast}
          shareLabel={m.shareRoast}
          copiedLabel={copyFeedback}
          onShare={shareRoast}
        />
      </section>

      {/* Sin logger + history */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-bold">{m.sinLogger}</h2>
          <SinLoggerForm
            amountLabel={m.amount}
            amountPlaceholder={m.amountPlaceholder}
            categoryLabel={m.category}
            excuseLabel={m.excuse}
            excusePlaceholder={m.excusePlaceholder}
            submitLabel={m.saveSin}
            mujamalatDutyLabel={m.mujamalatDuty}
            mujamalatHint={m.mujamalatNote}
            errorAmount={m.errorAmount}
            errorAmountMax={m.errorAmountMax}
            sinAddedLabel={m.sinAdded}
            currency={m.currency}
            onSubmit={onLogSin}
          />
        </div>
        <SinHistoryList
          title={m.sinHistory}
          emptyLabel={m.noHistory}
          sinCountLabel={m.sinCount}
          deleteLabel={m.deleteSin}
          sins={sins}
          onDelete={onDeleteSin}
        />
      </section>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-[var(--radius-lg)] bg-panel p-6 shadow-luxe"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 text-center text-base font-bold text-text">{m.resetConfirm}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-[var(--radius-md)] border border-white/20 px-4 py-2 text-sm font-semibold text-textMuted transition hover:bg-white/10"
                >
                  {m.confirmNo}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-[var(--radius-md)] bg-danger px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
                >
                  {m.confirmYes}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
