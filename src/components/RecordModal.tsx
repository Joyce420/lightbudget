import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionType, CategoryItem } from '../types';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  ACCOUNT_OPTIONS,
} from '../data/initialData';

function toDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatRecordDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '选择时间';

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return isToday ? `今天 ${time}` : `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
}

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  defaultAccount: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultAccount,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState<string>('0');
  const [selectedCategory, setSelectedCategory] = useState<string>('餐饮');
  const [selectedIcon, setSelectedIcon] = useState<string>('restaurant');
  const [account, setAccount] = useState<string>(defaultAccount || '现金');
  const [remark, setRemark] = useState<string>('');
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string>(() =>
    toDateTimeLocal(new Date()),
  );

  const categories =
    type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  const handleKeyClick = (val: string) => {
    if (amountStr === '0.00' || amountStr === '0') {
      setAmountStr(val === '.' ? '0.' : val);
      return;
    }
    if (val === '.' && amountStr.includes('.')) return;
    if (amountStr.includes('.') && amountStr.split('.')[1].length >= 2) return;
    if (amountStr.length >= 8) return;
    setAmountStr((prev) => prev + val);
  };

  const handleDeleteKey = () => {
    if (amountStr.length > 0) {
      const next = amountStr.slice(0, -1);
      setAmountStr(next || '0');
    }
  };

  const handleClear = () => {
    setAmountStr('0');
  };

  const handleCategorySelect = (cat: CategoryItem) => {
    setSelectedCategory(cat.name);
    setSelectedIcon(cat.icon);
  };

  const handleSave = () => {
    const num = parseFloat(amountStr);
    if (isNaN(num) || num <= 0) {
      alert('请输入有效记账金额');
      return;
    }

    const dateStr = `${selectedDateTime}:00`;

    onSave({
      type,
      amount: num,
      category: selectedCategory,
      categoryIcon: selectedIcon,
      account,
      date: dateStr,
      remark: remark.trim() || selectedCategory,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end [height:100dvh]">
        {/* Dim backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#002521]/45 backdrop-blur-[3px] transition-opacity cursor-pointer"
        />

        {/* Bottom Sheet Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-50 flex flex-col max-w-[480px] mx-auto w-full bg-surface rounded-t-[28px] shadow-2xl overflow-hidden max-h-[100dvh] sm:max-h-[88dvh] border-t border-border-subtle"
        >
          {/* Drag Pill */}
          <div className="w-full pt-3 pb-1 flex shrink-0 justify-center items-center">
            <div className="w-10 h-1.5 rounded-full bg-surface-variant" />
          </div>

          {/* Header: Close & Type Toggle */}
          <div className="px-5 pt-1 pb-3 flex shrink-0 items-center justify-between">
            <button
              id="modal-close-btn"
              type="button"
              onClick={onClose}
              className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Segmented Switcher */}
            <div className="flex items-center p-1 bg-surface-container-low rounded-full">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setSelectedCategory('餐饮');
                  setSelectedIcon('restaurant');
                }}
                className={`px-5 py-1.5 rounded-full font-semibold text-[14px] transition-all duration-200 cursor-pointer ${
                  type === 'expense'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-muted-text hover:text-on-surface'
                }`}
              >
                支出
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setSelectedCategory('工资');
                  setSelectedIcon('payments');
                }}
                className={`px-5 py-1.5 rounded-full font-semibold text-[14px] transition-all duration-200 cursor-pointer ${
                  type === 'income'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-muted-text hover:text-on-surface'
                }`}
              >
                收入
              </button>
            </div>

            <div className="w-10" />
          </div>

          {/* Body Content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] px-5 space-y-3.5 pb-2">
            {/* Amount Box */}
            <div className="bg-surface-container-low rounded-2xl px-4 py-3 flex items-center justify-between shadow-[0_2px_12px_rgba(16,60,54,0.03)] border border-border-subtle/40">
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                <span className="text-[28px] text-primary font-bold">¥</span>
                <div className="flex items-baseline overflow-hidden">
                  <span
                    id="amount-display-val"
                    className="text-[38px] text-primary tracking-tight font-bold font-mono"
                  >
                    {amountStr || '0.00'}
                  </span>
                  <span className="w-[2.5px] h-7 bg-primary rounded-full ml-1 inline-block animate-pulse" />
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="w-8 h-8 rounded-full bg-surface-container-highest/60 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest active:scale-90 transition-all cursor-pointer"
                title="清除"
              >
                <span className="material-symbols-outlined text-[18px]">backspace</span>
              </button>
            </div>

            {/* Category Grid (6 items) */}
            <div className="grid grid-cols-3 gap-2.5">
              {categories.slice(0, 6).map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-secondary-container/25 shadow-[0_0_0_1.5px_#caf167]'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low active:scale-95'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center mb-1.5 transition-transform ${
                        isActive
                          ? 'bg-primary text-secondary-fixed shadow-sm'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{
                          fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <span
                      className={`text-[13px] ${
                        isActive ? 'text-primary font-semibold' : 'text-muted-text'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Account & Date Pills + Remark Input */}
            <div className="bg-surface-container-lowest rounded-xl p-3 space-y-2.5 shadow-sm border border-border-subtle/50">
              <div className="flex items-center justify-between gap-2 relative">
                {/* Account Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-primary cursor-pointer active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px] text-muted-text">
                      account_balance_wallet
                    </span>
                    <span className="text-[13px] font-semibold">{account}</span>
                    <span className="material-symbols-outlined text-[14px] text-muted-text">
                      expand_more
                    </span>
                  </button>

                  {/* Account Dropdown */}
                  {showAccountMenu && (
                    <div className="absolute top-9 left-0 z-30 bg-surface rounded-xl shadow-lg border border-border-subtle py-1 min-w-[120px]">
                      {ACCOUNT_OPTIONS.map((acc) => (
                        <button
                          key={acc}
                          type="button"
                          onClick={() => {
                            setAccount(acc);
                            setShowAccountMenu(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-[13px] hover:bg-surface-container-low flex items-center justify-between ${
                            account === acc ? 'text-primary font-bold' : 'text-on-surface'
                          }`}
                        >
                          {acc}
                          {account === acc && (
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              check
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Pill */}
                <label className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-primary cursor-pointer active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-[16px] text-muted-text">
                    calendar_today
                  </span>
                  <span className="text-[13px]">{formatRecordDate(selectedDateTime)}</span>
                  <span className="material-symbols-outlined text-[14px] text-muted-text">
                    expand_more
                  </span>
                  <input
                    id="record-date-input"
                    type="datetime-local"
                    value={selectedDateTime}
                    onChange={(event) => setSelectedDateTime(event.target.value)}
                    aria-label="选择记账日期和时间"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>

              {/* Remark Note Input */}
              <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2 rounded-xl">
                <span className="material-symbols-outlined text-[18px] text-muted-text">
                  edit_note
                </span>
                <input
                  id="record-remark-input"
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="写点备注..."
                  className="bg-transparent text-primary text-[15px] placeholder-muted-text outline-none flex-1 min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Pinned Bottom Controls: Save Action & Numeric Keypad */}
          <div className="w-full shrink-0 max-h-[42dvh] overflow-y-auto bg-surface-container-low/80 backdrop-blur-md pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] flex flex-col items-center border-t border-border-subtle/40">
            {/* Primary Save Button */}
            <div className="w-full px-5 mb-2">
              <button
                id="btn-save-record"
                type="button"
                onClick={handleSave}
                className="w-full h-[50px] bg-secondary-fixed text-primary font-bold text-[18px] rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_20px_0_rgba(202,241,103,0.45)] active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                <span>保存 (¥{amountStr || '0.00'})</span>
              </button>
            </div>

            {/* Soft Numeric Keypad */}
            <div className="w-full grid grid-cols-3 gap-1.5 px-5 pb-3 select-none">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleKeyClick(val)}
                  className="h-10 rounded-lg bg-surface text-primary font-semibold text-[22px] active:bg-surface-variant active:scale-95 flex items-center justify-center shadow-sm transition-all cursor-pointer"
                >
                  {val}
                </button>
              ))}
              <button
                id="keypad-del-btn"
                type="button"
                onClick={handleDeleteKey}
                aria-label="退格"
                className="h-10 rounded-lg bg-surface-variant/70 text-primary active:bg-surface-variant active:scale-95 flex items-center justify-center shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">backspace</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
