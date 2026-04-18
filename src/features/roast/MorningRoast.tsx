interface MorningRoastProps {
  title: string
  allowanceLabel: string
  dailyAllowance: number
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ar-SD', { maximumFractionDigits: 0 }).format(value)

const getGreeting = (dailyAllowance: number): string => {
  const hour = new Date().getHours()
  const day = new Date().getDay() // 0=Sun,4=Thu,5=Fri

  if (dailyAllowance <= 0) {
    if (hour < 12) return 'صباح الهم يا زول، الخزنة فاضية تماماً.'
    if (hour < 18) return 'الظهر جا وما جا معاه فلوس، ساكت البيت.'
    return 'مساء الوجع، ما في قرش واحد في الحساب.'
  }

  if (day === 4 || day === 5) {
    if (dailyAllowance < 500) return 'الخميس الونيس جا وجيبك ساكت، اتجنب السوق.'
    return 'الخميس وناس، بس لا تنساق مع الجو وتصرف كل شي.'
  }

  if (hour < 6) return 'ليه صاحي دا الوقت؟ ارجع نام وفكر في الفلوس بكرة.'
  if (hour < 12) {
    if (dailyAllowance < 1000) return 'صباح الخير، اليوم حزام مشدود — الميزانية ضيقة.'
    return 'صباح الفل، اصرف بعقل وربنا يفتح.'
  }
  if (hour < 17) {
    if (dailyAllowance < 1000) return 'الضهر ولا لسه وصلت الحد — خف على نفسك.'
    return 'نهار تمام، بس لا تنسى الحساب موجود.'
  }
  if (hour < 21) {
    return 'المساء رقيق، لا تخليه يحوشك على صرف مو ضروري.'
  }
  return 'الليل الحلو ما بيجي بالصرف يا صديق، ارتاح.'
}

export const MorningRoast = ({ title, allowanceLabel, dailyAllowance }: MorningRoastProps) => {
  const greeting = getGreeting(dailyAllowance)

  return (
    <article className="rounded-[var(--radius-lg)] border border-accentGold/35 bg-accentGold/10 p-4 shadow-luxe">
      <p className="text-xs font-semibold uppercase tracking-widest text-accentGoldLight/70">{title}</p>
      <p className="mt-2 text-base font-bold leading-snug text-text">{greeting}</p>
      <div className="mt-3 flex items-center justify-between border-t border-accentGold/20 pt-2">
        <p className="text-xs text-accentGoldLight/80">{allowanceLabel}</p>
        <p className="text-sm font-extrabold text-accentGoldLight">
          {formatMoney(dailyAllowance)} <span className="font-normal opacity-70">ج.س</span>
        </p>
      </div>
    </article>
  )
}
