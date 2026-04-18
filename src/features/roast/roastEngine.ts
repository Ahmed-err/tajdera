import roasts from '../../data/roasts.sudanese.ar.json'
import type { RoastLine, RoastTier, SpendingCategory } from '../../types/budget'

type RoastData = {
  tiers: Record<RoastTier, RoastLine[]>
}

const roastData = roasts as RoastData

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

const MUJAMALAT_DUTY_ROAST = 'واجب طبعاً، بس جيبك ما بواجب معاك'
const WEEKEND_ROAST = 'الخميس الونيس ضيع قريشاتك، حتأكل شنو يوم الأحد؟'

interface RoastPickOptions {
  tier: RoastTier
  roastIntensity: 1 | 2 | 3
  category?: SpendingCategory
  mujamalatDuty?: boolean
  weekendPeak?: boolean
}

export const pickRoast = ({
  tier,
  roastIntensity,
  category,
  mujamalatDuty = false,
  weekendPeak = false,
}: RoastPickOptions): RoastLine => {
  if (weekendPeak) {
    return {
      id: 'weekend-peak',
      text: WEEKEND_ROAST,
      intensity: 3,
    }
  }

  if (mujamalatDuty) {
    return {
      id: 'mujamalat-duty',
      text: MUJAMALAT_DUTY_ROAST,
      intensity: 1,
      categoryHint: 'mujamalat',
    }
  }

  const bucket = roastData.tiers[tier] ?? roastData.tiers.safe
  const intensityFiltered = bucket.filter((line) => line.intensity <= roastIntensity)
  const basePool = intensityFiltered.length ? intensityFiltered : bucket
  const categoryPool = category
    ? basePool.filter((line) => line.categoryHint === category)
    : []

  const selectedPool = categoryPool.length ? categoryPool : basePool
  return randomItem(selectedPool)
}
