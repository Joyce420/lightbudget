import { CategoryItem, Transaction, AppSettings } from '../types';

export const APP_LOGO_URL = `${import.meta.env.BASE_URL}lightbudget-icon.png`;

export const DEFAULT_SETTINGS: AppSettings = {
  monthlyBudget: 4500,
  defaultAccount: '现金',
  theme: 'light',
  currencySymbol: '¥',
  currencyCode: 'CNY',
};

export const DEFAULT_EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'dining', name: '餐饮', icon: 'restaurant', type: 'expense', color: '#002521' },
  { id: 'daily', name: '日用', icon: 'local_grocery_store', type: 'expense', color: '#103c36' },
  { id: 'traffic', name: '交通', icon: 'directions_subway', type: 'expense', color: '#caf167' },
  { id: 'shopping', name: '购物', icon: 'shopping_bag', type: 'expense', color: '#103c36' },
  { id: 'entertainment', name: '娱乐', icon: 'sports_esports', type: 'expense', color: '#717976' },
  { id: 'housing', name: '住房', icon: 'home', type: 'expense', color: '#57ae88' },
  { id: 'fruit', name: '果蔬', icon: 'nutrition', type: 'expense', color: '#4e6700' },
  { id: 'medical', name: '医疗', icon: 'local_hospital', type: 'expense', color: '#E85D4A' },
  { id: 'study', name: '学习', icon: 'school', type: 'expense', color: '#3d665f' },
  { id: 'digital', name: '数码', icon: 'devices', type: 'expense', color: '#103c36' },
  { id: 'pets', name: '宠物', icon: 'pets', type: 'expense', color: '#80d8af' },
  { id: 'more', name: '更多', icon: 'grid_view', type: 'expense', color: '#717976' },
];

export const DEFAULT_INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'salary', name: '工资', icon: 'payments', type: 'income', color: '#57ae88' },
  { id: 'part_time', name: '兼职', icon: 'work', type: 'income', color: '#80d8af' },
  { id: 'bonus', name: '奖金', icon: 'redeem', type: 'income', color: '#caf167' },
  { id: 'investment', name: '理财', icon: 'trending_up', type: 'income', color: '#005138' },
  { id: 'red_packet', name: '红包', icon: 'featured_seasonal_and_gifts', type: 'income', color: '#E85D4A' },
  { id: 'other_income', name: '其他', icon: 'attach_money', type: 'income', color: '#717976' },
];

export const ACCOUNT_OPTIONS = ['微信支付', '支付宝', '银行卡', '交通卡', '现金'];

const BASE_TRANSACTIONS: Transaction[] = [
  // 今天: 2026-09-22
  {
    id: 'tx-01',
    type: 'expense',
    amount: 38.5,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-22T12:45:00',
    remark: '午餐 麦当劳超值套餐',
  },
  {
    id: 'tx-02',
    type: 'expense',
    amount: 6.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '交通卡',
    date: '2026-09-22T08:30:00',
    remark: '地铁通勤',
  },
  {
    id: 'tx-03',
    type: 'expense',
    amount: 83.5,
    category: '购物',
    categoryIcon: 'shopping_bag',
    account: '支付宝',
    date: '2026-09-22T19:15:00',
    remark: '名创优品日用品',
  },

  // 昨天: 2026-09-21
  {
    id: 'tx-04',
    type: 'income',
    amount: 200.0,
    category: '兼职',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-09-21T21:05:00',
    remark: '设计兼职稿费',
  },
  {
    id: 'tx-05',
    type: 'expense',
    amount: 15.0,
    category: '餐饮',
    categoryIcon: 'local_cafe',
    account: '微信支付',
    date: '2026-09-21T14:10:00',
    remark: '瑞幸生椰拿铁',
  },

  // 2026-09-20
  {
    id: 'tx-06',
    type: 'expense',
    amount: 65.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-20T18:30:00',
    remark: '晚餐 烤肉拌饭与饮料',
  },
  {
    id: 'tx-07',
    type: 'expense',
    amount: 12.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '交通卡',
    date: '2026-09-20T09:00:00',
    remark: '往返地铁',
  },

  // 2026-09-18
  {
    id: 'tx-08',
    type: 'expense',
    amount: 200.0,
    category: '娱乐',
    categoryIcon: 'sports_esports',
    account: '微信支付',
    date: '2026-09-18T20:00:00',
    remark: '周末影院观影与零食',
  },
  {
    id: 'tx-09',
    type: 'expense',
    amount: 45.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '支付宝',
    date: '2026-09-18T13:15:00',
    remark: '周末轻食沙拉',
  },

  // 2026-09-15
  {
    id: 'tx-10',
    type: 'expense',
    amount: 650.0,
    category: '住房',
    categoryIcon: 'home',
    account: '银行卡',
    date: '2026-09-15T10:00:00',
    remark: '9月水电燃气及物业费',
  },
  {
    id: 'tx-11',
    type: 'expense',
    amount: 28.0,
    category: '餐饮',
    categoryIcon: 'local_cafe',
    account: '微信支付',
    date: '2026-09-15T15:20:00',
    remark: '星巴克冷萃咖啡',
  },

  // 2026-09-14
  {
    id: 'tx-12',
    type: 'expense',
    amount: 146.5,
    category: '日用',
    categoryIcon: 'local_grocery_store',
    account: '支付宝',
    date: '2026-09-14T19:40:00',
    remark: '山姆超市零食与纸巾',
  },
  {
    id: 'tx-13',
    type: 'expense',
    amount: 42.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-14T12:10:00',
    remark: '日式拉面午市单人餐',
  },

  // 2026-09-12
  {
    id: 'tx-14',
    type: 'expense',
    amount: 120.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '支付宝',
    date: '2026-09-12T22:30:00',
    remark: '加班打车费',
  },
  {
    id: 'tx-15',
    type: 'expense',
    amount: 32.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '现金',
    date: '2026-09-12T12:20:00',
    remark: '快餐便当',
  },

  // 2026-09-10 (工资发放日)
  {
    id: 'tx-16',
    type: 'income',
    amount: 8300.0,
    category: '工资',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-09-10T10:00:00',
    remark: '9月基本薪资到账',
  },
  {
    id: 'tx-17',
    type: 'expense',
    amount: 230.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-10T19:30:00',
    remark: '发薪日与朋友聚餐庆祝',
  },

  // 2026-09-08
  {
    id: 'tx-18',
    type: 'expense',
    amount: 55.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-08T12:40:00',
    remark: '工作日商务简餐',
  },
  {
    id: 'tx-19',
    type: 'expense',
    amount: 8.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '交通卡',
    date: '2026-09-08T08:45:00',
    remark: '地铁通勤',
  },
  {
    id: 'tx-20',
    type: 'expense',
    amount: 265.0,
    category: '日用',
    categoryIcon: 'local_grocery_store',
    account: '支付宝',
    date: '2026-09-08T20:10:00',
    remark: '洗发水沐浴露与个护消耗品',
  },

  // 2026-09-06
  {
    id: 'tx-21',
    type: 'expense',
    amount: 98.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-06T13:00:00',
    remark: '周末早午餐Brunch',
  },
  {
    id: 'tx-22',
    type: 'expense',
    amount: 285.0,
    category: '日用',
    categoryIcon: 'shopping_bag',
    account: '支付宝',
    date: '2026-09-06T16:00:00',
    remark: '宜家家居置物架与收纳盒',
  },

  // 2026-09-04
  {
    id: 'tx-23',
    type: 'expense',
    amount: 36.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-04T12:15:00',
    remark: '老乡鸡香菇滑鸡套餐',
  },
  {
    id: 'tx-24',
    type: 'expense',
    amount: 6.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '交通卡',
    date: '2026-09-04T08:30:00',
    remark: '地铁通勤',
  },

  // 2026-09-03
  {
    id: 'tx-25',
    type: 'expense',
    amount: 188.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '支付宝',
    date: '2026-09-03T17:20:00',
    remark: '机场快轨与高铁接驳',
  },
  {
    id: 'tx-26',
    type: 'expense',
    amount: 75.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-03T19:40:00',
    remark: '出差返程简餐',
  },

  // 2026-09-02
  {
    id: 'tx-27',
    type: 'expense',
    amount: 45.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-02T12:30:00',
    remark: '黄焖鸡米饭与酸梅汤',
  },
  {
    id: 'tx-28',
    type: 'expense',
    amount: 2.0,
    category: '交通',
    categoryIcon: 'directions_subway',
    account: '支付宝',
    date: '2026-09-02T08:15:00',
    remark: '共享单车骑行卡',
  },

  // 2026-09-01
  {
    id: 'tx-29',
    type: 'expense',
    amount: 591.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-01T19:00:00',
    remark: '月初部门聚餐平摊',
  },

  // 补充笔数达到42笔，且保证类别与总额完全匹配:
  // 餐饮总计: 38.5 + 15 + 65 + 45 + 28 + 42 + 32 + 230 + 55 + 98 + 36 + 75 + 45 + 591 = 1395.50 -> 加54.50 = 1450.00
  {
    id: 'tx-30',
    type: 'expense',
    amount: 54.5,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-09-01T12:00:00',
    remark: '开学季午餐',
  },

  // 8月与往月数据（展示往期与趋势）
  {
    id: 'tx-31',
    type: 'expense',
    amount: 1200.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-08-25T18:00:00',
    remark: '8月餐饮开销总揽',
  },
  {
    id: 'tx-32',
    type: 'expense',
    amount: 3000.0,
    category: '住房',
    categoryIcon: 'home',
    account: '银行卡',
    date: '2026-08-15T10:00:00',
    remark: '8月房租与公摊',
  },
  {
    id: 'tx-33',
    type: 'income',
    amount: 8500.0,
    category: '工资',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-08-10T10:00:00',
    remark: '8月薪资',
  },
  {
    id: 'tx-34',
    type: 'expense',
    amount: 1500.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-07-20T12:00:00',
    remark: '7月聚餐与餐饮',
  },
  {
    id: 'tx-35',
    type: 'expense',
    amount: 2300.0,
    category: '住房',
    categoryIcon: 'home',
    account: '银行卡',
    date: '2026-07-15T10:00:00',
    remark: '7月房租',
  },
  {
    id: 'tx-36',
    type: 'income',
    amount: 8500.0,
    category: '工资',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-07-10T10:00:00',
    remark: '7月薪资',
  },
  {
    id: 'tx-37',
    type: 'expense',
    amount: 4900.0,
    category: '日用',
    categoryIcon: 'shopping_bag',
    account: '支付宝',
    date: '2026-06-18T20:00:00',
    remark: '618年中购物大促',
  },
  {
    id: 'tx-38',
    type: 'income',
    amount: 8500.0,
    category: '工资',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-06-10T10:00:00',
    remark: '6月薪资',
  },
  {
    id: 'tx-39',
    type: 'expense',
    amount: 3600.0,
    category: '餐饮',
    categoryIcon: 'restaurant',
    account: '微信支付',
    date: '2026-05-20T12:00:00',
    remark: '5月开支',
  },
  {
    id: 'tx-40',
    type: 'income',
    amount: 8200.0,
    category: '工资',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-05-10T10:00:00',
    remark: '5月薪资',
  },
  {
    id: 'tx-41',
    type: 'expense',
    amount: 4100.0,
    category: '住房',
    categoryIcon: 'home',
    account: '银行卡',
    date: '2026-04-15T10:00:00',
    remark: '4月综合开销',
  },
  {
    id: 'tx-42',
    type: 'income',
    amount: 8000.0,
    category: '工资',
    categoryIcon: 'payments',
    account: '银行卡',
    date: '2026-04-10T10:00:00',
    remark: '4月薪资',
  },
];

// Rebase demo dates to the device's current local month so “今天/昨天” are always truthful.
const currentLocalDate = new Date();
export const INITIAL_TRANSACTIONS: Transaction[] = BASE_TRANSACTIONS.map((tx) => {
  const base = new Date(tx.date);
  const monthOffset = (base.getFullYear() - 2026) * 12 + (base.getMonth() - 8);
  const currentDay = currentLocalDate.getDate();
  const scaledDay = monthOffset === 0
    ? Math.max(1, Math.min(currentDay, Math.round((base.getDate() / 22) * currentDay)))
    : base.getDate();
  const localDate = new Date(
    currentLocalDate.getFullYear(),
    currentLocalDate.getMonth() + monthOffset,
    scaledDay,
    base.getHours(),
    base.getMinutes(),
  );
  const yyyy = localDate.getFullYear();
  const mm = String(localDate.getMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getDate()).padStart(2, '0');
  const hh = String(localDate.getHours()).padStart(2, '0');
  const min = String(localDate.getMinutes()).padStart(2, '0');
  return { ...tx, date: `${yyyy}-${mm}-${dd}T${hh}:${min}:00` };
});

export const MONTHLY_TREND_DATA = [
  { month: '4月', year: 2026, monthNum: 4, expense: 4100, income: 8000, expensePct: 48, incomePct: 80 },
  { month: '5月', year: 2026, monthNum: 5, expense: 3600, income: 8200, expensePct: 42, incomePct: 82 },
  { month: '6月', year: 2026, monthNum: 6, expense: 4900, income: 8500, expensePct: 58, incomePct: 85 },
  { month: '7月', year: 2026, monthNum: 7, expense: 3800, income: 8500, expensePct: 45, incomePct: 85 },
  { month: '8月', year: 2026, monthNum: 8, expense: 4200, income: 8500, expensePct: 50, incomePct: 85 },
  { month: '9月', year: 2026, monthNum: 9, expense: 3420.5, income: 8500, expensePct: 40, incomePct: 85 },
];
