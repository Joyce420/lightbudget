import React, { useState, useMemo } from 'react';
import { Transaction, AppSettings } from '../types';
import { APP_LOGO_URL } from '../data/initialData';
import { formatCurrency } from '../utils/helpers';

interface HomeScreenProps {
  transactions: Transaction[];
  settings: AppSettings;
  selectedYear: number;
  selectedMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: (year: number, month: number) => void;
  onDeleteTransaction: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  transactions,
  settings,
  selectedYear,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onDeleteTransaction,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allLedgerOpen, setAllLedgerOpen] = useState(false);
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Filter transactions for currently selected month or search
  const currentMonthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      const matchesMonth =
        d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.remark.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.account.toLowerCase().includes(q)
        );
      }
      return matchesMonth;
    });
  }, [transactions, selectedYear, selectedMonth, searchQuery]);

  // Totals for this month
  const { totalExpense, totalIncome, balance } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    currentMonthTransactions.forEach((t) => {
      if (t.type === 'expense') exp += t.amount;
      else inc += t.amount;
    });
    return {
      totalExpense: exp,
      totalIncome: inc,
      balance: inc - exp,
    };
  }, [currentMonthTransactions]);

  // Budget calculations
  const budget = settings.monthlyBudget || 4500;
  const budgetUsedPct = Math.min(100, Math.round((totalExpense / budget) * 100));
  const budgetRemaining = Math.max(0, budget - totalExpense);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === selectedYear && today.getMonth() + 1 === selectedMonth;
  const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const remainingDays = isCurrentMonth ? Math.max(0, daysInSelectedMonth - today.getDate()) : 0;

  // Group transactions by date string
  const groupedTransactions = useMemo(() => {
    const map = new Map<string, { label: string; dateStr: string; items: Transaction[]; expSubtotal: number; incSubtotal: number }>();

    currentMonthTransactions.forEach((tx) => {
      const d = new Date(tx.date);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      let label = `${d.getMonth() + 1}月${d.getDate()}日`;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(todayStart.getDate() - 1);
      const itemDay = new Date(d);
      itemDay.setHours(0, 0, 0, 0);
      if (itemDay.getTime() === todayStart.getTime()) {
        label = `今天 · ${d.getMonth() + 1}月${d.getDate()}日`;
      } else if (itemDay.getTime() === yesterdayStart.getTime()) {
        label = `昨天 · ${d.getMonth() + 1}月${d.getDate()}日`;
      }

      if (!map.has(dateKey)) {
        map.set(dateKey, {
          label,
          dateStr: dateKey,
          items: [],
          expSubtotal: 0,
          incSubtotal: 0,
        });
      }
      const entry = map.get(dateKey)!;
      entry.items.push(tx);
      if (tx.type === 'expense') entry.expSubtotal += tx.amount;
      else entry.incSubtotal += tx.amount;
    });

    return Array.from(map.values()).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }, [currentMonthTransactions]);

  const displayedGroups = groupedTransactions.slice(0, 2);

  return (
    <div className="flex-1 w-full bg-background pt-16 pb-28">
      {/* Fixed Top Header */}
      <header className="fixed top-0 w-full z-30 pt-safe bg-background/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(16,60,54,0.03)] border-b border-border-subtle/30">
        <div className="h-16 px-5 flex items-center justify-between max-w-[430px] mx-auto w-full">
          <div className="flex items-center gap-2">
            <img
              src={APP_LOGO_URL}
              alt="轻记账 Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-primary font-bold text-[20px] tracking-tight">
              轻记账
            </span>
          </div>

          <button
            id="search-toggle-btn"
            type="button"
            aria-label="搜索账目"
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 rounded-full bg-surface shadow-sm flex items-center justify-center text-primary active:scale-95 transition-transform duration-150 cursor-pointer border border-border-subtle/40"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="px-5 pb-3 max-w-[430px] mx-auto w-full">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-border-subtle">
              <span className="material-symbols-outlined text-muted-text text-[18px]">
                search
              </span>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索分类、备注或支付账户..."
                className="bg-transparent text-[14px] text-primary outline-none flex-1 placeholder-muted-text"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-muted-text hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col w-full max-w-[430px] mx-auto px-5 gap-4">
        {/* Month Navigator */}
        <div className="flex items-center justify-between bg-surface-container-low px-4 py-1.5 rounded-full mt-2">
          <button
            id="prev-month-btn"
            aria-label="上一月"
            type="button"
            onClick={onPrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          <label className="relative flex items-center gap-1 cursor-pointer active:opacity-75 transition-opacity">
            <input
              aria-label="选择月份"
              type="month"
              value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-').map(Number);
                if (year && month) onSelectMonth(year, month);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="material-symbols-outlined text-secondary-container text-primary-container text-[18px]">
              calendar_today
            </span>
            <span className="text-[16px] font-semibold text-primary tracking-tight">
              {selectedYear} 年 {selectedMonth} 月
            </span>
            <span className="material-symbols-outlined text-muted-text text-[16px]">
              arrow_drop_down
            </span>
          </label>

          <button
            id="next-month-btn"
            aria-label="下一月"
            type="button"
            onClick={onNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-surface active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* Monthly Overview Hero Card */}
        <div className="relative overflow-hidden rounded-[20px] bg-primary text-on-primary p-6 shadow-md">
          {/* Subtle Decorative Ambient Glow */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-on-primary-container uppercase tracking-wider">
                本月累计支出
              </span>
              <div className="flex items-center gap-1 bg-surface-tint/40 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                <span className="text-[11px] text-primary-fixed font-medium">记账中</span>
              </div>
            </div>

            {/* Big Amount */}
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] text-secondary-container font-semibold">¥</span>
              <span className="text-[40px] text-on-primary tracking-tight leading-none font-bold font-mono">
                {totalExpense.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Income and Balance Row */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="flex flex-col bg-primary-container/80 backdrop-blur-sm rounded-[14px] p-3">
                <span className="text-[12px] text-on-primary-container">本月收入</span>
                <span className="text-[16px] text-secondary-fixed mt-0.5 tracking-tight font-bold font-mono">
                  +¥
                  {totalIncome.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex flex-col bg-primary-container/80 backdrop-blur-sm rounded-[14px] p-3">
                <span className="text-[12px] text-on-primary-container">本月结余</span>
                <span className="text-[16px] text-on-primary mt-0.5 tracking-tight font-bold font-mono">
                  ¥
                  {balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Progress Card */}
        <div className="bg-surface rounded-[20px] p-4 shadow-sm flex flex-col gap-2 border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                account_balance_wallet
              </span>
              <span className="text-[16px] font-semibold text-primary">
                月预算 {formatCurrency(budget)}
              </span>
            </div>
            <div className="text-[13px] text-muted-text">
              剩余 <span className="font-semibold text-primary text-[15px]">{formatCurrency(budgetRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                budgetUsedPct > 90
                  ? 'bg-expense-danger'
                  : 'bg-gradient-to-r from-secondary-container to-secondary'
              }`}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[13px] text-muted-text">
            <span>
              已使用 {budgetUsedPct}% · 剩余 {formatCurrency(budgetRemaining)}
            </span>
            <span>{isCurrentMonth ? `还剩 ${remainingDays} 天` : `${daysInSelectedMonth} 天`}</span>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[18px] font-bold text-primary">最近流水</span>
            <span className="text-[13px] text-muted-text">
              {'近 2 日记账'}
            </span>
          </div>

          {displayedGroups.length === 0 ? (
            <div className="bg-surface rounded-[20px] p-8 text-center text-muted-text border border-border-subtle/50">
              <span className="material-symbols-outlined text-[36px] mb-2 text-muted-text/50">
                receipt_long
              </span>
              <p className="text-[14px]">本月暂无记账流水，点击下方 “+” 记一笔吧</p>
            </div>
          ) : (
            displayedGroups.map((group) => (
              <div
                key={group.dateStr}
                className="bg-surface rounded-[20px] p-4 shadow-sm flex flex-col gap-2 border border-border-subtle/50"
              >
                {/* Date header */}
                <div className="flex items-center justify-between pb-1 border-b border-border-subtle/30">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-3.5 rounded-full ${
                        group.label.includes('今天')
                          ? 'bg-primary'
                          : 'bg-muted-text/50'
                      }`}
                    />
                    <span className="font-bold text-[15px] text-primary">
                      {group.label}
                    </span>
                  </div>
                  <span className="text-[13px] text-muted-text">
                    支出 ¥{group.expSubtotal.toFixed(2)}
                    {group.incSubtotal > 0 && ` · 收入 +¥${group.incSubtotal.toFixed(2)}`}
                  </span>
                </div>

                {/* Transaction items */}
                <div className="flex flex-col divide-y divide-surface-container-low/60">
                  {group.items.map((item) => {
                    const isExpense = item.type === 'expense';
                    const timeStr = item.date.includes('T')
                      ? item.date.split('T')[1].slice(0, 5)
                      : '12:00';

                    // Avatar badge color mapping
                    let iconBg = 'bg-surface-container text-primary';
                    if (item.category === '餐饮') {
                      iconBg = 'bg-expense-danger/10 text-expense-danger';
                    } else if (item.category === '交通') {
                      iconBg = 'bg-primary-fixed text-primary-container';
                    } else if (item.category === '购物' || item.category === '日用') {
                      iconBg = 'bg-secondary-fixed text-on-secondary-fixed';
                    } else if (item.category === '兼职' || item.category === '工资') {
                      iconBg = 'bg-tertiary-fixed text-tertiary-container';
                    }

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTxDetail(item)}
                        className="flex items-center justify-between py-2.5 active:bg-surface-container-low/50 rounded-xl px-1 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                          >
                            <span className="material-symbols-outlined text-[22px]">
                              {item.categoryIcon || 'receipt'}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[15px] font-semibold text-primary truncate">
                              {item.remark || item.category}
                            </span>
                            <span className="text-[12px] text-muted-text truncate">
                              {item.account} · {timeStr}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[17px] font-bold font-mono tracking-tight ${
                              isExpense ? 'text-primary' : 'text-tertiary-container'
                            }`}
                          >
                            {isExpense ? '-' : '+'}¥{item.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* View All Button */}
          <button
            id="view-all-tx-btn"
            type="button"
            onClick={() => setAllLedgerOpen(true)}
            className="w-full py-3.5 bg-surface rounded-[20px] shadow-sm flex items-center justify-center gap-1.5 text-muted-text hover:text-primary active:scale-[0.99] transition-all my-1 border border-border-subtle/50 cursor-pointer"
          >
            <span className="text-[14px] font-semibold">
              {`查看全部账目 (共 ${transactions.length} 笔)`}
            </span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {allLedgerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)]">
          <header className="h-16 shrink-0 px-5 flex items-center justify-between bg-background border-b border-border-subtle/50">
            <button
              type="button"
              aria-label="返回首页"
              onClick={() => setAllLedgerOpen(false)}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-primary active:bg-surface-container"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-[18px] font-bold text-primary">全部账目</h2>
            <span className="text-[13px] text-muted-text">{transactions.length} 笔</span>
          </header>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-text py-12">还没有账目，记下第一笔吧。</p>
            ) : (
              <div className="bg-surface rounded-2xl border border-border-subtle/50 divide-y divide-border-subtle/50">
                {[...transactions]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((tx) => (
                    <button
                      type="button"
                      key={tx.id}
                      onClick={() => setSelectedTxDetail(tx)}
                      className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-surface-container-low"
                    >
                      <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{tx.categoryIcon || 'receipt_long'}</span>
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-semibold text-primary truncate">{tx.remark || tx.category}</span>
                        <span className="block text-[12px] text-muted-text">{tx.category} · {tx.account} · {new Date(tx.date).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      <span className={`font-mono font-bold ${tx.type === 'expense' ? 'text-primary' : 'text-tertiary-container'}`}>
                        {tx.type === 'expense' ? '-' : '+'}¥{tx.amount.toFixed(2)}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Detail Dialog */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="text-[16px] font-bold text-primary">账目详情</span>
              <button
                type="button"
                onClick={() => setSelectedTxDetail(null)}
                className="text-muted-text hover:text-primary p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-muted-text">类型</span>
                <span className="text-[14px] font-semibold text-primary">
                  {selectedTxDetail.type === 'expense' ? '支出' : '收入'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-muted-text">金额</span>
                <span className="text-[20px] font-bold font-mono text-primary">
                  {selectedTxDetail.type === 'expense' ? '-' : '+'}¥
                  {selectedTxDetail.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-muted-text">分类</span>
                <span className="text-[14px] text-primary">
                  {selectedTxDetail.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-muted-text">账户</span>
                <span className="text-[14px] text-primary">
                  {selectedTxDetail.account}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-muted-text">时间</span>
                <span className="text-[13px] text-primary">
                  {selectedTxDetail.date.replace('T', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[14px] text-muted-text">备注</span>
                <span className="text-[14px] text-primary text-right max-w-[200px]">
                  {selectedTxDetail.remark || '无备注'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('确定要删除这笔流水吗？')) {
                    onDeleteTransaction(selectedTxDetail.id);
                    setSelectedTxDetail(null);
                  }
                }}
                className="flex-1 py-2.5 bg-error-container text-expense-danger rounded-xl text-[14px] font-bold hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                删除账目
              </button>
              <button
                type="button"
                onClick={() => setSelectedTxDetail(null)}
                className="flex-1 py-2.5 bg-surface-container text-primary rounded-xl text-[14px] font-semibold hover:bg-surface-variant transition-colors cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
