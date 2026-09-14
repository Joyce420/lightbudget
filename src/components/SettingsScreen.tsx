import React, { useState } from 'react';
import { AppSettings, CloudSyncState, Transaction } from '../types';
import { APP_LOGO_URL, ACCOUNT_OPTIONS, DEFAULT_EXPENSE_CATEGORIES } from '../data/initialData';
import { exportTransactionsToCSV, formatCurrency } from '../utils/helpers';

interface SettingsScreenProps {
  settings: AppSettings;
  transactions: Transaction[];
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearData: () => void;
  showToast: (msg: string) => void;
  cloudSyncState: CloudSyncState;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  transactions,
  onUpdateSettings,
  onClearData,
  showToast,
  cloudSyncState,
}) => {
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(settings.monthlyBudget || 4500));

  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);

  const handleSaveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      onUpdateSettings({ monthlyBudget: val });
      setBudgetDialogOpen(false);
      showToast(`月度预算已更新为 ${formatCurrency(val)}`);
    } else {
      alert('请输入有效预算金额');
    }
  };

  const handleExport = () => {
    exportTransactionsToCSV(transactions);
    showToast(`全部 ${transactions.length} 笔本地流水已导出`);
  };

  const handlePurge = () => {
    onClearData();
    setPurgeConfirmOpen(false);
    showToast('已清空所有本地记录');
  };

  return (
    <div className="flex-1 w-full bg-background pt-16 pb-28">
      {/* Header */}
      <header className="fixed top-0 w-full z-30 pt-safe bg-background/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(16,60,54,0.03)] border-b border-border-subtle/30">
        <div className="h-16 px-5 flex items-center justify-between max-w-[430px] mx-auto w-full">
          <div className="flex items-center gap-2">
            <img
              src={APP_LOGO_URL}
              alt="轻记账 LightBudget Logo"
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-[20px] text-primary font-bold tracking-tight">
              设置
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col w-full max-w-[430px] mx-auto px-5 pb-6 gap-5">
        {/* Storage & Privacy Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container p-4 shadow-sm mt-2 border border-border-subtle/50">
          <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full bg-secondary-container/30 pointer-events-none blur-xl" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-secondary-container text-[24px]">
                verified_user
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold text-primary tracking-tight truncate">
                  {cloudSyncState === 'synced' ? '云端账本' : '本机账本'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[12px] font-semibold">
                  {cloudSyncState === 'synced'
                    ? '已同步'
                    : cloudSyncState === 'connecting'
                      ? '同步中'
                      : cloudSyncState === 'error'
                        ? '待重试'
                        : '离线优先'}
                </span>
              </div>
              <p className="text-[13px] text-muted-text mt-0.5 flex items-center gap-1 truncate">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    cloudSyncState === 'error' ? 'bg-expense-danger' : 'bg-secondary'
                  }`}
                />
                {cloudSyncState === 'synced'
                  ? '本机与云端均已安全保存'
                  : cloudSyncState === 'connecting'
                    ? '正在连接安全云端…'
                    : cloudSyncState === 'error'
                      ? '云端暂不可用 · 本机数据不受影响'
                      : '已安全保存在本地 · 配置后可云同步'}
              </p>
            </div>
          </div>
        </div>

        {/* Group 1: 记账设置 */}
        <section className="flex flex-col gap-1.5">
          <div className="px-1">
            <span className="text-[12px] text-muted-text font-semibold tracking-wider uppercase">
              记账设置
            </span>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border-subtle/50">
            {/* 月度预算 */}
            <button
              type="button"
              onClick={() => setBudgetDialogOpen(true)}
              className="flex items-center justify-between min-h-[56px] px-4 active:bg-surface-container-low transition-colors duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    account_balance_wallet
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">月度预算</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] text-primary font-semibold font-mono">
                  {formatCurrency(settings.monthlyBudget)}
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>

            <div className="h-[1px] bg-surface-container-low ml-14 mr-4" />

            {/* 默认账户 */}
            <button
              type="button"
              onClick={() => setAccountDialogOpen(true)}
              className="flex items-center justify-between min-h-[56px] px-4 active:bg-surface-container-low transition-colors duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    credit_card
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">默认账户</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-muted-text">{settings.defaultAccount}</span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>

            <div className="h-[1px] bg-surface-container-low ml-14 mr-4" />

            {/* 分类管理 */}
            <button
              type="button"
              onClick={() => setCategoriesDialogOpen(true)}
              className="flex items-center justify-between min-h-[56px] px-4 active:bg-surface-container-low transition-colors duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    category
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">分类管理</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-muted-text">
                  {DEFAULT_EXPENSE_CATEGORIES.length} 个可用分类
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* Group 2: 数据管理 */}
        <section className="flex flex-col gap-1.5">
          <div className="px-1">
            <span className="text-[12px] text-muted-text font-semibold tracking-wider uppercase">
              数据管理
            </span>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border-subtle/50">
            {/* 导出 CSV */}
            <button
              id="exportBtn"
              type="button"
              onClick={handleExport}
              className="w-full flex items-center justify-between min-h-[56px] px-4 active:bg-surface-container-low transition-colors duration-150 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    download
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">导出 CSV 账单</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-muted-text">
                  导出全部 {transactions.length} 笔流水
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>

            <div className="h-[1px] bg-surface-container-low ml-14 mr-4" />

            {/* 清空全部数据 */}
            <button
              id="purgeBtn"
              type="button"
              onClick={() => setPurgeConfirmOpen(true)}
              className="w-full flex items-center justify-between min-h-[56px] px-4 active:bg-error-container/20 transition-colors duration-150 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-expense-danger text-[18px]">
                    delete_forever
                  </span>
                </div>
                <span className="text-[15px] text-expense-danger font-semibold">
                  清空全部数据
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-expense-danger text-[11px] font-bold">
                  危险
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* Group 3: 外观与体验 */}
        <section className="flex flex-col gap-1.5">
          <div className="px-1">
            <span className="text-[12px] text-muted-text font-semibold tracking-wider uppercase">
              外观与体验
            </span>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border-subtle/50">
            {/* 外观主题 */}
            <div className="flex items-center justify-between min-h-[64px] px-4 py-2 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    palette
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">外观主题</span>
              </div>

              {/* Segmented Control Pill */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-full w-auto">
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ theme: 'auto' });
                    showToast('已切换至 跟随系统 模式');
                  }}
                  className={`py-1 px-3 text-center rounded-full text-[12px] transition-all cursor-pointer ${
                    settings.theme === 'auto'
                      ? 'bg-surface text-primary font-bold shadow-sm'
                      : 'text-muted-text'
                  }`}
                >
                  跟随系统
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ theme: 'light' });
                    showToast('已切换至 浅色 模式');
                  }}
                  className={`py-1 px-3 text-center rounded-full text-[12px] transition-all cursor-pointer ${
                    settings.theme === 'light'
                      ? 'bg-surface text-primary font-bold shadow-sm'
                      : 'text-muted-text'
                  }`}
                >
                  浅色
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ theme: 'dark' });
                    showToast('已切换至 深色 模式');
                  }}
                  className={`py-1 px-3 text-center rounded-full text-[12px] transition-all cursor-pointer ${
                    settings.theme === 'dark'
                      ? 'bg-surface text-primary font-bold shadow-sm'
                      : 'text-muted-text'
                  }`}
                >
                  深色
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-surface-container-low ml-14 mr-4" />

            {/* 货币符号 */}
            <button
              type="button"
              onClick={() => setCurrencyDialogOpen(true)}
              className="flex items-center justify-between min-h-[56px] px-4 active:bg-surface-container-low transition-colors duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    payments
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">货币符号</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-muted-text">
                  {settings.currencyCode} ({settings.currencySymbol})
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* Group 4: 关于与隐私 */}
        <section className="flex flex-col gap-1.5">
          <div className="px-1">
            <span className="text-[12px] text-muted-text font-semibold tracking-wider uppercase">
              关于与隐私
            </span>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border-subtle/50">
            {/* 隐私声明 */}
            <button
              type="button"
              onClick={() => setPrivacyDialogOpen(true)}
              className="flex items-center justify-between min-h-[64px] px-4 active:bg-surface-container-low transition-colors duration-150 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    lock_reset
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[15px] text-on-surface font-medium truncate">
                    隐私与数据存储说明
                  </span>
                  <span className="text-[12px] text-muted-text leading-snug mt-0.5 line-clamp-2">
                    {cloudSyncState === 'synced'
                      ? '数据采用本机与云端双重保存，并按用户身份隔离。'
                      : '数据优先保存在本机，请定期导出备份。'}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px] shrink-0">
                chevron_right
              </span>
            </button>

            <div className="h-[1px] bg-surface-container-low ml-14 mr-4" />

            {/* 关于轻记账 */}
            <div className="flex items-center justify-between min-h-[56px] px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    info
                  </span>
                </div>
                <span className="text-[15px] text-on-surface font-medium">关于轻记账</span>
              </div>
              <span className="text-[12px] text-muted-text font-mono">
                版本 1.1.0 (Build 202609)
              </span>
            </div>
          </div>
        </section>

        {/* Footnote Philosophy */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
          <div className="w-6 h-6 rounded-full bg-secondary-container/50 flex items-center justify-center mb-1.5">
            <span className="material-symbols-outlined text-primary text-[14px]">spa</span>
          </div>
          <p className="text-[12px] text-muted-text tracking-wide">
            轻盈记录每一天 · 无弹窗广告 · 纯粹记账
          </p>
        </div>
      </div>

      {/* Budget Edit Modal */}
      {budgetDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle">
            <h3 className="text-[16px] font-bold text-primary mb-3">设置月度预算</h3>
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2.5 rounded-xl mb-4 border border-border-subtle">
              <span className="text-[20px] font-bold text-primary font-mono">¥</span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="bg-transparent text-[18px] text-primary font-bold font-mono outline-none w-full"
                placeholder="4500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBudgetDialogOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-[14px] font-semibold text-primary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveBudget}
                className="flex-1 py-2.5 rounded-xl bg-secondary-container text-primary text-[14px] font-bold shadow-sm"
              >
                确定保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Account Modal */}
      {accountDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle">
            <h3 className="text-[16px] font-bold text-primary mb-3">选择默认支付账户</h3>
            <div className="flex flex-col gap-1 mb-4">
              {ACCOUNT_OPTIONS.map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ defaultAccount: acc });
                    setAccountDialogOpen(false);
                    showToast(`默认账户已切换为 ${acc}`);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-[14px] cursor-pointer ${
                    settings.defaultAccount === acc
                      ? 'bg-secondary-container/30 text-primary font-bold'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span>{acc}</span>
                  {settings.defaultAccount === acc && (
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAccountDialogOpen(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container text-[14px] font-semibold text-primary"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Categories View Modal */}
      {categoriesDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle max-h-[80vh] flex flex-col">
            <h3 className="text-[16px] font-bold text-primary mb-3">分类管理 (12个可用分类)</h3>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto p-1 mb-4">
              {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-low text-center"
                >
                  <span className="material-symbols-outlined text-[24px] text-primary mb-1">
                    {cat.icon}
                  </span>
                  <span className="text-[12px] text-primary font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCategoriesDialogOpen(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container text-[14px] font-semibold text-primary"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Currency Modal */}
      {currencyDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle">
            <h3 className="text-[16px] font-bold text-primary mb-3">选择货币符号</h3>
            <div className="flex flex-col gap-1 mb-4">
              {[
                { code: 'CNY', symbol: '¥', name: '人民币 CNY' },
                { code: 'USD', symbol: '$', name: '美元 USD' },
                { code: 'EUR', symbol: '€', name: '欧元 EUR' },
                { code: 'HKD', symbol: 'HK$', name: '港币 HKD' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ currencyCode: c.code, currencySymbol: c.symbol });
                    setCurrencyDialogOpen(false);
                    showToast(`货币已切换为 ${c.name}`);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-[14px] cursor-pointer ${
                    settings.currencyCode === c.code
                      ? 'bg-secondary-container/30 text-primary font-bold'
                      : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="font-mono text-[14px]">{c.symbol}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrencyDialogOpen(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container text-[14px] font-semibold text-primary"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Privacy Notice Modal */}
      {privacyDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[22px]">
                verified_user
              </span>
              <h3 className="text-[16px] font-bold text-primary">隐私与数据存储</h3>
            </div>
            <p className="text-[13px] text-muted-text leading-relaxed mb-4">
              轻记账采用离线优先架构，流水会先保存在设备本地。启用云同步后，数据会通过加密连接保存到 Supabase，并使用行级权限按当前身份隔离；未配置云端时不会上传任何账单。
              <br />
              <br />
              请定期在「数据管理」中导出 CSV 备份，以便长期保存。
            </p>
            <button
              type="button"
              onClick={() => setPrivacyDialogOpen(false)}
              className="w-full py-2.5 rounded-xl bg-secondary-container text-primary font-bold text-[14px]"
            >
              我已知晓
            </button>
          </div>
        </div>
      )}

      {/* Purge Confirm Dialog */}
      {purgeConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-[2px]">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-border-subtle">
            <h3 className="text-[16px] font-bold text-expense-danger mb-2">确定清空全部数据？</h3>
            <p className="text-[13px] text-muted-text mb-4">
              此操作将清除本机及已连接云端的全部流水记录并恢复至空白账本，不可撤销。
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPurgeConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container text-[14px] font-semibold text-primary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handlePurge}
                className="flex-1 py-2.5 rounded-xl bg-expense-danger text-white text-[14px] font-bold shadow-sm"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
