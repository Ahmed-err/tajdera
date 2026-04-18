import type { SinEntry } from '../../../types/budget'
import { getCategoryMeta, messages } from '../../../lib/i18n/messages'

interface SinHistoryListProps {
  title: string
  emptyLabel: string
  sins: SinEntry[]
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ar-SD', { maximumFractionDigits: 0 }).format(value)

export const SinHistoryList = ({ title, emptyLabel, sins }: SinHistoryListProps) => {
  return (
    <section className="rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe">
      <h3 className="mb-4 text-lg font-bold text-text">{title}</h3>
      {sins.length === 0 ? (
        <p className="text-sm text-textMuted">{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {sins.map((sin) => (
            <li
              key={sin.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-panelSoft p-3"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm text-textMuted">
                  {getCategoryMeta(sin.category).icon} {getCategoryMeta(sin.category).label}
                </span>
                <span className="font-bold text-danger">{formatMoney(sin.amount)} ج.س</span>
              </div>
              {sin.mujamalatDuty ? (
                <p className="mb-1 text-xs text-amber-200">{messages.mujamalatNote}</p>
              ) : null}
              {sin.excuse ? (
                <p className="text-sm leading-relaxed text-textMuted">{sin.excuse}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
