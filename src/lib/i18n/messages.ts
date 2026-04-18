import categories from '../../data/categories.ar.json'
import type { RoastTier, SocialStatus, SpendingCategory } from '../../types/budget'

type MessageSet = {
  appTitle: string
  appSubtitle: string
  budget: string
  spent: string
  remaining: string
  shameMeter: string
  sinLogger: string
  amount: string
  category: string
  excuse: string
  saveSin: string
  noHistory: string
  sinHistory: string
  roastNow: string
  morningRoast: string
  dailyAllowance: string
  monthlyBudget: string
  roastIntensity: string
  reset: string
  mujamalatDuty: string
  mujamalatNote: string
  shareRoast: string
  copied: string
  statusTitle: string
  tiers: Record<RoastTier, string>
  statuses: Record<SocialStatus, string>
  statusSubtitle: Record<SocialStatus, string>
}

export const messages: MessageSet = {
  appTitle: 'قريشاتك',
  appSubtitle: 'عمك الساخر ماسك حسابك قرش قرش',
  budget: 'ميزانية الشهر',
  spent: 'الصرفتو',
  remaining: 'الباقي',
  shameMeter: 'عداد الفلس',
  sinLogger: 'دفتر الذنوب',
  amount: 'كم صرفت؟',
  category: 'نوع الجريمة',
  excuse: 'العذر الشين',
  saveSin: 'أضف الذنب',
  noHistory: 'لسه سجلّك نظيف',
  sinHistory: 'الفضائح الأخيرة',
  roastNow: 'روستة الليلة',
  morningRoast: 'تحية الصباح',
  dailyAllowance: 'مسموح تصرف اليوم',
  monthlyBudget: 'حدد سقف الشهر',
  roastIntensity: 'قوة الكلام',
  reset: 'صفّر الحساب',
  mujamalatDuty: 'دي مجاملة واجبة',
  mujamalatNote: 'واجب طبعاً، بس جيبك ما بواجب معاك',
  shareRoast: 'شارك الروستة',
  copied: 'تم النسخ',
  statusTitle: 'الحالة الاجتماعية للجيب',
  tiers: {
    safe: 'ماشي الحال',
    warning: 'أدب روحك',
    danger: 'جيبك يصيح',
    bankrupt: 'ع الحديد',
  },
  statuses: {
    high: 'المرطب',
    mid: 'المستور',
    low: 'المكاجر',
    zero: 'المساهر',
  },
  statusSubtitle: {
    high: 'الجيب متكي ومبسوط',
    mid: 'الأمور ماشّة لكن بدون استعراض',
    low: 'شد الحزام قبل يفوتك الشهر',
    zero: 'سهر وهم لحدي الراتب الجاي',
  },
}

type CategoryData = {
  id: SpendingCategory
  label: string
  icon: string
}

export const getCategoryMeta = (category: SpendingCategory): { label: string; icon: string } => {
  const source = categories as CategoryData[]
  const item = source.find((entry) => entry.id === category)
  if (!item) return { label: category, icon: '💸' }
  return { label: item.label, icon: item.icon }
}
