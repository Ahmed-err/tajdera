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
        <p className="text-sm text-accentGoldLight">{title}</p>
        <button
          onClick={() => void onShare(roast.text)}
          className="rounded-lg border border-accentGold/40 px-3 py-1 text-xs font-bold text-accentGoldLight transition hover:bg-accentGold/20"
        >
          {shareLabel}
        </button>
      </div>
      <p className="text-xl font-bold leading-relaxed text-text">"{roast.text}"</p>
      {copiedLabel ? <p className="mt-2 text-xs text-accentGoldLight/80">{copiedLabel}</p> : null}
    </div>
  )
}
