import { AnimatePresence, motion } from 'framer-motion'
import type { RoastLine } from '../../types/budget'

interface RoastBannerProps {
  title: string
  roast: RoastLine
  shareLabel: string
  copiedLabel?: string
  onShare: (text: string) => Promise<boolean>
}

export const RoastBanner = ({ title, roast, shareLabel, copiedLabel, onShare }: RoastBannerProps) => {
  return (
    <div className="rounded-[var(--radius-lg)] border border-accentGold/35 bg-accentGold/10 p-5 shadow-luxe">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accentGoldLight/70">{title}</p>
        <button
          onClick={() => void onShare(roast.text)}
          className="rounded-lg border border-accentGold/40 px-3 py-1 text-xs font-bold text-accentGoldLight transition hover:bg-accentGold/20 active:scale-95"
          aria-label="انسخ الروستة"
        >
          {copiedLabel || shareLabel}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={roast.id + roast.text}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold leading-relaxed text-text"
        >
          <span className="text-accentGoldLight/60 text-2xl leading-none">"</span>
          {roast.text}
          <span className="text-accentGoldLight/60 text-2xl leading-none">"</span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
