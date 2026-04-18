import { motion, AnimatePresence } from 'framer-motion'
import type { SinEntry } from '../../../types/budget'
import { getCategoryMeta, messages } from '../../../lib/i18n/messages'

interface SinHistoryListProps {
  title: string
  emptyLabel: string
  sinCountLabel: string
  deleteLabel: string
  sins: SinEntry[]
  onDelete: (id: string) => void
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ar-SD', { maximumFractionDigits: 0 }).format(value)

const formatDate = (iso: string): string => {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)

    if (diffMin < 1) return 'الآن'
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `منذ ${diffHr} ساعة`
    const diffDay = Math.floor(diffHr / 24)
    if (diffDay < 7) return `منذ ${diffDay} يوم`
    return date.toLocaleDateString('ar-SD', { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export const SinHistoryList = ({ title, emptyLabel, sinCountLabel, deleteLabel, sins, onDelete }: SinHistoryListProps) => {
  return (
    <section className="rounded-[var(--radius-lg)] bg-panel p-5 shadow-luxe">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-text">{title}</h3>
        {sins.length > 0 && (
          <span className="rounded-full bg-danger/20 px-2.5 py-0.5 text-xs font-bold text-danger">
            {sins.length} {sinCountLabel}
          </span>
        )}
      </div>

      {sins.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <span className="text-3xl">🌟</span>
          <p className="text-sm text-textMuted">{emptyLabel}</p>
        </div>
      ) : (
        <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          <AnimatePresence initial={false}>
            {sins.map((sin) => {
              const meta = getCategoryMeta(sin.category)
              return (
                <motion.li
                  key={sin.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[var(--radius-md)] border border-white/10 bg-panelSoft p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-textMuted">
                          {meta.icon} {meta.label}
                        </span>
                        <span className="font-bold text-danger whitespace-nowrap">
                          {formatMoney(sin.amount)} ج.س
                        </span>
                      </div>
                      {sin.mujamalatDuty && (
                        <p className="mt-1 text-xs text-amber-200">{messages.mujamalatNote}</p>
                      )}
                      {sin.excuse && (
                        <p className="mt-1 text-sm leading-relaxed text-textMuted line-clamp-2">{sin.excuse}</p>
                      )}
                      <p className="mt-1 text-xs text-textMuted/50">{formatDate(sin.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => onDelete(sin.id)}
                      title={deleteLabel}
                      aria-label={deleteLabel}
                      className="flex-shrink-0 rounded-md px-2 py-1 text-xs text-textMuted/40 transition hover:bg-danger/20 hover:text-danger"
                    >
                      ✕
                    </button>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}
