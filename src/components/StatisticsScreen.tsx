import React, { useMemo, useState } from 'react';
import { Transaction, AppSettings } from '../types';
import { MONTHLY_TREND_DATA } from '../data/initialData';
import { formatCurrency } from '../utils/helpers';

interface StatisticsScreenProps {
  transactions: Transaction[];
  settings: AppSettings;
  selectedYear: number;
  selectedMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  transactions,
  settings,
  selectedYear,
  selectedMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const [activeBarMonth, setActiveBarMonth] = useState<string | null>(null);

  // Month transactions
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
    });
  }, [transactions, selectedYear, selectedMonth]);

  // Overall totals
  const { totalExpense, totalIncome, balance } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    monthTransactions.forEach((t) => {
      if (t.type === 'expense') exp += t.amount;
      else inc += t.amount;
    });
    return {
      totalExpense: exp,
      totalIncome: inc,
      balance: inc - exp,
    };
  }, [monthTransactions]);

  // Budget
  const budget = settings.monthlyBudget || 4500;
  const budgetUsedPct = Math.min(100, Math.round((totalExpense / budget) * 100));
  const budgetRemaining = Math.max(0, budget - totalExpense);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, { name: string; amount: number; color: string; icon: string }>();

    // Mapping colors and icons
    const colorMap: Record<string, string> = {
      餐饮: '#002521',
      餐饮美食: '#002521',
      日用: '#103c36',
      日用购物: '#103c36',
      购物: '#103c36',
      住房: '#57ae88',
      住房租金: '#57ae88',
      交通: '#caf167',
      交通出行: '#caf167',
      娱乐: '#717976',
      休闲娱乐: '#717976',
    };

    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        let name = t.category;
        if (name === '餐饮') name = '餐饮美食';
        else if (name === '购物' || name === '日用') name = '日用购物';
        else if (name === '住房') name = '住房租金';
        else if (name === '交通') name = '交通出行';
        else if (name === '娱乐') name = '休闲娱乐';

        const cur = map.get(name) || {
          name,
          amount: 0,
          color: colorMap[name] || '#404846',
          icon: t.categoryIcon || 'category',
        };
        cur.amount += t.amount;
        map.set(name, cur);
      });

    const list = Array.from(map.values()).sort((a, b) => b.amount - a.amount);
    const expTotal = totalExpense > 0 ? totalExpense : 1;

    return list.map((item) => ({
      ...item,
      percentage: ((item.amount / expTotal) * 100).toFixed(1),
      pctNum: (item.amount / expTotal) * 100,
    }));
  }, [monthTransactions, totalExpense]);

  // Donut SVG circumference calculation
  // Circumference for r=38 is 2 * PI * 38 = 238.76
  const CIRCUMFERENCE = 238.76;
  const donutSlices = useMemo(() => {
    let accumulatedOffset = 0;
    return categoryStats.map((cat) => {
      const dash = (cat.pctNum / 100) * CIRCUMFERENCE;
      const offset = -accumulatedOffset;
      accumulatedOffset += dash;
      return {
        ...cat,
        dash,
        offset,
      };
    });
  }, [categoryStats]);

  return (
    <div className="flex-1 w-full bg-background pt-16 pb-28">
      {/* Header */}
      <header className="fixed top-0 w-full z-30 pt-safe bg-background/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(16,60,54,0.03)] border-b border-border-subtle/30">
        <div className="h-16 px-5 flex items-center justify-between max-w-[430px] mx-auto w-full">
          <h1 className="text-primary font-bold text-[22px] tracking-tight">统计</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col w-full max-w-[430px] mx-auto px-5 gap-4">
        {/* Month Selector */}
        <section className="w-full flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-2 shadow-sm mt-2">
          <button
            id="prev-month-btn"
            type="button"
            aria-label="上个月"
            onClick={onPrevMonth}
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="material-symbols-outlined text-muted-text text-[18px]">
              calendar_month
            </span>
            <span className="text-[18px] font-semibold text-primary tracking-tight">
              {selectedYear} 年 {selectedMonth} 月
            </span>
            <span className="material-symbols-outlined text-muted-text text-[18px]">
              keyboard_arrow_down
            </span>
          </div>
          <button
            id="next-month-btn"
            type="button"
            aria-label="下个月"
            onClick={onNextMonth}
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </section>

        {/* Top 3-item Summary Card */}
        <section className="w-full bg-surface rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-border-subtle/50">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] font-semibold text-muted-text">本月总支出</span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-[38px] font-bold text-primary tracking-tight font-mono">
              ¥
              {Math.floor(totalExpense).toLocaleString('en-US')}
            </span>
            <span className="text-[22px] font-semibold text-primary tracking-tight font-mono">
              .{(totalExpense % 1).toFixed(2).slice(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle/40">
              <span className="text-[12px] text-muted-text flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-variant" />
                总收入
              </span>
              <span className="text-[16px] text-tertiary-fixed-variant mt-0.5 font-bold tracking-tight font-mono">
                +¥
                {totalIncome.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex flex-col bg-surface-container-lowest p-2.5 rounded-lg border border-border-subtle/40">
              <span className="text-[12px] text-muted-text flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                本月结余
              </span>
              <span className="text-[16px] text-primary mt-0.5 font-bold tracking-tight font-mono">
                ¥
                {balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </section>

        {/* Monthly Budget Progress Card */}
        <section className="w-full bg-surface rounded-2xl p-5 shadow-sm flex flex-col gap-2 border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                account_balance_wallet
              </span>
              <span className="text-[18px] font-semibold text-primary">月度预算</span>
            </div>
            <span className="text-[12px] text-muted-text font-medium">
              已使用 {budgetUsedPct}% · 剩余{' '}
              <strong className="text-primary font-semibold">
                {formatCurrency(budgetRemaining)}
              </strong>
            </span>
          </div>

          <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                budgetUsedPct > 90 ? 'bg-expense-danger' : 'bg-secondary-container'
              }`}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-muted-text pt-0.5 text-[13px]">
            <span>已支出 {formatCurrency(totalExpense)}</span>
            <span>总额 {formatCurrency(budget)}</span>
          </div>
        </section>

        {/* Expense Category Breakdown Donut Card */}
        <section className="w-full bg-surface rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                donut_large
              </span>
              <span className="text-[18px] font-semibold text-primary">支出分类占比</span>
            </div>
            <span className="text-[12px] text-muted-text font-medium">
              共 {categoryStats.length} 项类别
            </span>
          </div>

          {/* SVG Donut Chart */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-1">
            <svg
              aria-hidden="true"
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#edefe9"
                strokeWidth="12"
              />

              {/* Dynamic Slices */}
              {donutSlices.map((slice, idx) => (
                <circle
                  key={slice.name}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={activeCategoryIndex === idx ? 14 : 12}
                  strokeDasharray={`${slice.dash} ${CIRCUMFERENCE}`}
                  strokeDashoffset={slice.offset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveCategoryIndex(idx)}
                  onMouseLeave={() => setActiveCategoryIndex(null)}
                />
              ))}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[12px] text-muted-text leading-none font-medium">
                {activeCategoryIndex !== null
                  ? categoryStats[activeCategoryIndex]?.name
                  : '总支出'}
              </span>
              <span className="text-[18px] text-primary font-bold mt-1 font-mono">
                {activeCategoryIndex !== null
                  ? `¥${categoryStats[activeCategoryIndex]?.amount.toFixed(2)}`
                  : `¥${Math.round(totalExpense).toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Legend and Detailed List */}
          <div className="flex flex-col gap-1.5 pt-1">
            {categoryStats.map((item, index) => {
              const isHovered = activeCategoryIndex === index;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setActiveCategoryIndex(index)}
                  onMouseLeave={() => setActiveCategoryIndex(null)}
                  className={`flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
                    isHovered ? 'bg-surface-container-low' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[15px] text-on-surface font-medium">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-muted-text font-mono">
                      {item.percentage}%
                    </span>
                    <span className="text-[14px] text-primary min-w-[76px] text-right font-semibold font-mono">
                      ¥{item.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6-Month Trend Bar Chart Card */}
        <section className="w-full bg-surface rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-border-subtle/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                bar_chart
              </span>
              <span className="text-[18px] font-semibold text-primary">收支趋势</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary-container" />
                <span className="text-[12px] text-muted-text">支出</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-secondary-container" />
                <span className="text-[12px] text-muted-text">收入</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="w-full flex flex-col gap-2 pt-2">
            <div className="h-40 w-full flex items-end justify-between px-1">
              {MONTHLY_TREND_DATA.map((item) => {
                const isCurrent = item.monthNum === selectedMonth;
                const isHovered = activeBarMonth === item.month;

                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setActiveBarMonth(item.month)}
                    onMouseLeave={() => setActiveBarMonth(null)}
                    onClick={() => setActiveBarMonth(item.month)}
                    className="flex flex-col items-center gap-1.5 w-11 group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -translate-y-24 bg-primary text-on-primary text-[11px] p-2 rounded-lg shadow-xl z-20 whitespace-nowrap pointer-events-none animate-in fade-in">
                        <div>{item.month}收支</div>
                        <div>支: ¥{item.expense.toLocaleString()}</div>
                        <div>收: ¥{item.income.toLocaleString()}</div>
                      </div>
                    )}

                    <div className="flex items-end gap-1 h-32 w-full justify-center">
                      {/* Expense bar */}
                      <div
                        className={`w-2.5 rounded-t-sm transition-all duration-300 ${
                          isCurrent
                            ? 'bg-primary shadow-sm ring-1 ring-primary/20'
                            : 'bg-primary-container'
                        } group-hover:opacity-85`}
                        style={{ height: `${item.expensePct}%` }}
                        title={`支出: ¥${item.expense}`}
                      />
                      {/* Income bar */}
                      <div
                        className="w-2.5 bg-secondary-container rounded-t-sm transition-all duration-300 group-hover:opacity-85"
                        style={{ height: `${item.incomePct}%` }}
                        title={`收入: ¥${item.income}`}
                      />
                    </div>

                    <span
                      className={`text-[12px] ${
                        isCurrent
                          ? 'text-primary font-bold'
                          : 'text-muted-text group-hover:text-primary'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
