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
  amountPlaceholder: string
  category: string
  excuse: string
  excusePlaceholder: string
  saveSin: string
  noHistory: string
  sinHistory: string
  roastNow: string
  morningRoast: string
  dailyAllowance: string
  monthlyBudget: string
  roastIntensity: string
  roastIntensityLabels: [string, string, string]
  reset: string
  mujamalatDuty: string
  mujamalatNote: string
  shareRoast: string
  copied: string
  statusTitle: string
  sinCount: string
  deleteSin: string
  deleteConfirm: string
  resetConfirm: string
  confirmYes: string
  confirmNo: string
  sinAdded: string
  errorAmount: string
  errorAmountMax: string
  currency: string
  tiers: Record<RoastTier, string>
  statuses: Record<SocialStatus, string>
  statusSubtitle: Record<SocialStatus, string>
}

export const messages: MessageSet = {
  appTitle: 'قريشاتك',
  appSubtitle: 'عمك عباس ماسك حسابك قرش قرش',
  budget: 'ميزانية الشهر',
  spent: 'الصرفتو',
  remaining: 'الباقي',
  shameMeter: 'عداد الفلس',
  sinLogger: 'سجل الفضائح',
  amount: 'كم صرفت؟',
  amountPlaceholder: 'أدخل المبلغ بالجنيه السوداني',
  category: 'نوع الجريمة',
  excuse: 'العذر الشين',
  excusePlaceholder: 'اكتب عذرك هنا... (اختياري)',
  saveSin: 'أضف البلوة',
  noHistory: 'لسه سجلّك نظيف — ما صرفت شي!',
  sinHistory: 'الفضائح الأخيرة',
  roastNow: 'بهدلة الليلة',
  morningRoast: 'صباح البهدلة',
  dailyAllowance: 'مسموح تصرف اليوم',
  monthlyBudget: 'حدد سقف الشهر',
  roastIntensity: 'قوة البهدلة',
  roastIntensityLabels: ['خفيفة', 'متوسطة', 'قوية'],
  reset: 'صفّر الحساب',
  mujamalatDuty: 'دي مجاملة واجبة',
  mujamalatNote: 'واجب طبعاً، بس جيبك ما بواجب معاك',
  shareRoast: 'شارك البهدلة',
  copied: '✓ تم النسخ',
  statusTitle: 'الحالة الاجتماعية للجيب',
  sinCount: 'بلوة',
  deleteSin: 'شيلو',
  deleteConfirm: 'تحذف البلوة دي؟',
  resetConfirm: 'تصفّر كل الحساب؟ الفضائح كلها حتطير!',
  confirmYes: 'امسح ياخ',
  confirmNo: 'لا ياخ',
  sinAdded: '✓ تسجّل البلوة',
  errorAmount: 'لازم تكتب مبلغ صحيح أكبر من صفر',
  errorAmountMax: 'المبلغ كبير شديد يا زول!',
  currency: 'ج.س',
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
