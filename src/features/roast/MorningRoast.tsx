interface MorningRoastProps {
  title: string
  allowanceLabel: string
  dailyAllowance: number
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ar-SD', { maximumFractionDigits: 0 }).format(value)

export const MorningRoast = ({ title, allowanceLabel, dailyAllowance }: MorningRoastProps) => {
  const greeting = dailyAllowance <= 0 ? 'ياخ أمسك نفسك اليوم، الخزنة فاضية.' : 'صباح الخير، اصرف بعقل.'

  return (
    <article className="rounded-[var(--radius-lg)] border border-accentGold/35 bg-accentGold/10 p-4 shadow-luxe">
      <p className="text-sm text-accentGoldLight">{title}</p>
      <p className="mt-2 text-base font-bold text-text">{greeting}</p>
      <p className="mt-1 text-sm text-accentGoldLight">
        {allowanceLabel}: {formatMoney(dailyAllowance)} ج.س
      </p>
    </article>
  )
}
