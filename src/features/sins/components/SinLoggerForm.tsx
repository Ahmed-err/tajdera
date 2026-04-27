import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SpendingCategory } from '../../../types/budget'
import { getCategoryMeta } from '../../../lib/i18n/messages'
import { haptic } from '../../../lib/haptics'
import { BottomSheetSelect } from './BottomSheetSelect'

interface SinLoggerFormProps {
  amountLabel: string
  amountPlaceholder: string
  categoryLabel: string
  excuseLabel: string
  excusePlaceholder: string
  submitLabel: string
  mujamalatDutyLabel: string
  mujamalatHint: string
  errorAmount: string
  errorAmountMax: string
  sinAddedLabel: string
  currency: string
  onSubmit: (payload: {
    amount: number
    category: SpendingCategory
    excuse: string
    mujamalatDuty: boolean
  }) => void
}

const categories: SpendingCategory[] = ['zayada', 'mushwar', 'mujamalat', 'other']
const MAX_AMOUNT = 1_000_000_000
const MAX_EXCUSE_LEN = 280

export const SinLoggerForm = ({
  amountLabel,
  amountPlaceholder,
  categoryLabel,
  excuseLabel,
  excusePlaceholder,
  submitLabel,
  mujamalatDutyLabel,
  mujamalatHint,
  errorAmount,
  errorAmountMax,
  sinAddedLabel,
  currency,
  onSubmit,
}: SinLoggerFormProps) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<SpendingCategory>('zayada')
  const [excuse, setExcuse] = useState('')
  const [mujamalatDuty, setMujamalatDuty] = useState(false)
  const [amountError, setAmountError] = useState('')
  const [successTick, setSuccessTick] = useState(0)

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (amountError) setAmountError('')
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const parsedAmount = Number(amount)

    if (!parsedAmount || parsedAmount <= 0 || !Number.isFinite(parsedAmount)) {
      void haptic.error()
      setAmountError(errorAmount)
      return
    }
    if (parsedAmount > MAX_AMOUNT) {
      void haptic.error()
      setAmountError(errorAmountMax)
      return
    }

    void haptic.success()
    onSubmit({
      amount: parsedAmount,
      category,
      excuse: excuse.trim().slice(0, MAX_EXCUSE_LEN),
      mujamalatDuty,
    })

    setAmount('')
    setExcuse('')
    setMujamalatDuty(false)
    setAmountError('')
    setSuccessTick((t) => t + 1)
  }

  const excuseLen = excuse.length

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe">
      <div>
        <label className="mb-2 block text-sm text-textMuted">{amountLabel}</label>
        <div className="relative">
          <input
            className={`w-full rounded-[var(--radius-md)] border bg-panelSoft px-3 py-3 text-right text-text outline-none ring-accent/50 transition focus:ring-2 ${
              amountError ? 'border-danger/70' : 'border-white/10'
            }`}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_AMOUNT}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={amountPlaceholder}
            aria-invalid={!!amountError}
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-textMuted">
            {currency}
          </span>
        </div>
        <AnimatePresence>
          {amountError && (
            <motion.p
              key="err"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-xs text-danger"
            >
              {amountError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="mb-2 block text-sm text-textMuted">{categoryLabel}</label>
        <BottomSheetSelect
          value={category}
          onChange={setCategory}
          options={categories.map((item) => {
            const meta = getCategoryMeta(item)
            return { value: item, label: `${meta.icon} ${meta.label}` }
          })}
        />
      </div>

      {category === 'mujamalat' && (
        <div className="rounded-[var(--radius-md)] border border-amber-200/25 bg-amber-200/10 p-3">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm text-amber-100">{mujamalatDutyLabel}</span>
            <input
              type="checkbox"
              checked={mujamalatDuty}
              onChange={(e) => setMujamalatDuty(e.target.checked)}
              className="h-5 w-5 accent-amber-400"
            />
          </label>
          {mujamalatDuty && (
            <p className="mt-2 text-xs text-amber-200">{mujamalatHint}</p>
          )}
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-textMuted">{excuseLabel}</label>
          <span className={`text-xs ${excuseLen > MAX_EXCUSE_LEN * 0.9 ? 'text-warning' : 'text-textMuted/50'}`}>
            {excuseLen}/{MAX_EXCUSE_LEN}
          </span>
        </div>
        <textarea
          className="h-20 w-full resize-none rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-3 text-right text-text outline-none ring-accent/50 transition focus:ring-2"
          value={excuse}
          maxLength={MAX_EXCUSE_LEN}
          onChange={(e) => setExcuse(e.target.value)}
          placeholder={excusePlaceholder}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="flex-1 rounded-[var(--radius-md)] bg-accent px-4 py-3 font-bold text-white transition hover:brightness-110 active:opacity-75"
        >
          {submitLabel}
        </button>
        <AnimatePresence>
          {successTick > 0 && (
            <motion.span
              key={successTick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setTimeout(() => setSuccessTick(0), 1200)}
              className="text-sm font-semibold text-green-400"
            >
              {sinAddedLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
