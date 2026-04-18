import { useState } from 'react'
import type { SpendingCategory } from '../../../types/budget'
import { getCategoryMeta } from '../../../lib/i18n/messages'

interface SinLoggerFormProps {
  amountLabel: string
  categoryLabel: string
  excuseLabel: string
  submitLabel: string
  mujamalatDutyLabel: string
  mujamalatHint: string
  onSubmit: (payload: {
    amount: number
    category: SpendingCategory
    excuse: string
    mujamalatDuty: boolean
  }) => void
}

const categories: SpendingCategory[] = ['zayada', 'mushwar', 'mujamalat', 'other']

export const SinLoggerForm = ({
  amountLabel,
  categoryLabel,
  excuseLabel,
  submitLabel,
  mujamalatDutyLabel,
  mujamalatHint,
  onSubmit,
}: SinLoggerFormProps) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<SpendingCategory>('zayada')
  const [excuse, setExcuse] = useState('')
  const [mujamalatDuty, setMujamalatDuty] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) return

    onSubmit({
      amount: parsedAmount,
      category,
      excuse: excuse.trim(),
      mujamalatDuty,
    })

    setAmount('')
    setExcuse('')
    setMujamalatDuty(false)
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe">
      <div>
        <label className="mb-2 block text-sm text-textMuted">{amountLabel}</label>
        <input
          className="w-full rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-2 text-right text-text outline-none ring-accent/50 transition focus:ring-2"
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-textMuted">{categoryLabel}</label>
        <select
          className="w-full rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-2 text-right text-text outline-none ring-accent/50 transition focus:ring-2"
          value={category}
          onChange={(event) => setCategory(event.target.value as SpendingCategory)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {getCategoryMeta(item).icon} {getCategoryMeta(item).label}
            </option>
          ))}
        </select>
      </div>
      {category === 'mujamalat' ? (
        <div className="rounded-[var(--radius-md)] border border-amber-200/25 bg-amber-200/10 p-3">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span className="text-sm text-amber-100">{mujamalatDutyLabel}</span>
            <input
              type="checkbox"
              checked={mujamalatDuty}
              onChange={(event) => setMujamalatDuty(event.target.checked)}
              className="h-5 w-5 accent-amber-400"
            />
          </label>
          {mujamalatDuty ? <p className="mt-2 text-xs text-amber-200">{mujamalatHint}</p> : null}
        </div>
      ) : null}
      <div>
        <label className="mb-2 block text-sm text-textMuted">{excuseLabel}</label>
        <textarea
          className="h-24 w-full rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-2 text-right text-text outline-none ring-accent/50 transition focus:ring-2"
          value={excuse}
          onChange={(event) => setExcuse(event.target.value)}
          placeholder="اكتب عذرك هنا..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2 font-bold text-white transition hover:brightness-110"
      >
        {submitLabel}
      </button>
    </form>
  )
}
