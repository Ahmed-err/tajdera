import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Option<T extends string> {
  value: T
  label: string
}

interface BottomSheetSelectProps<T extends string> {
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  className?: string
}

export function BottomSheetSelect<T extends string>({
  value,
  options,
  onChange,
  className = '',
}: BottomSheetSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  const pick = (v: T) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full rounded-[var(--radius-md)] border border-white/10 bg-panelSoft px-3 py-3 text-right text-text outline-none ring-accent/50 transition focus:ring-2 ${className}`}
      >
        {selected?.label ?? ''}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-panel pb-safe"
            >
              <div className="mx-auto mb-3 mt-3 h-1 w-10 rounded-full bg-white/20" />
              <ul className="pb-6">
                {options.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => pick(opt.value)}
                      className={`w-full px-6 py-4 text-right text-base transition active:bg-white/5 ${
                        opt.value === value
                          ? 'font-bold text-accent'
                          : 'text-text'
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
