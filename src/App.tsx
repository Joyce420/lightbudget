import React, { useState, useEffect } from 'react';
import { Transaction, AppSettings, CloudSyncState } from './types';
import {
  loadTransactions,
  saveTransactions,
  loadSettings,
  saveSettings,
} from './utils/helpers';
import { HomeScreen } from './components/HomeScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { RecordModal } from './components/RecordModal';
import { isCloudConfigured } from './lib/supabase';
import {
  clearCloudData,
  deleteCloudTransaction,
  initializeCloudData,
  upsertCloudSettings,
  upsertCloudTransaction,
} from './services/cloudData';

function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'statistics' | 'settings'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [cloudSyncState, setCloudSyncState] = useState<CloudSyncState>(
    isCloudConfigured ? 'connecting' : 'local',
  );
  
  // Active month/year follows the user device local date by default.
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);

  // Record modal state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const runCloudWrite = (operation: () => Promise<void>, failureMessage: string) => {
    if (!isCloudConfigured) return;
    setCloudSyncState('connecting');
    void operation()
      .then(() => setCloudSyncState('synced'))
      .catch((error) => {
        console.error(`${failureMessage}: ${describeError(error)}`);
        setCloudSyncState('error');
        showToast(`${failureMessage}，数据已保存在本机`);
      });
  };

  useEffect(() => {
    if (!isCloudConfigured) return;
    let active = true;

    void initializeCloudData(transactions, settings)
      .then((cloudData) => {
        if (!active) return;
        setTransactions(cloudData.transactions);
        setSettings(cloudData.settings);
        setCloudSyncState('synced');
      })
      .catch((error) => {
        if (!active) return;
        console.error(`Cloud initialization failed: ${describeError(error)}`);
        setCloudSyncState('error');
        showToast('云端连接失败，已继续使用本机账本');
      });

    return () => {
      active = false;
    };
    // Cloud hydration must run once per app launch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  // Persist transactions on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Persist settings on change
  useEffect(() => {
    saveSettings(settings);
    // Dark mode class on html/body if needed
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleSaveNewTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [created, ...prev]);
    runCloudWrite(() => upsertCloudTransaction(created), '云端记账失败');
    showToast(`记账成功 - ${newTx.category} ¥${newTx.amount.toFixed(2)}`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    runCloudWrite(() => deleteCloudTransaction(id), '云端删除失败');
    showToast('已删除该笔记账');
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const nextSettings = { ...settings, ...newSettings };
    setSettings(nextSettings);
    runCloudWrite(() => upsertCloudSettings(nextSettings), '云端设置同步失败');
  };

  const handleClearAllData = () => {
    setTransactions([]);
    localStorage.removeItem('lightbudget_transactions_v3');
    runCloudWrite(clearCloudData, '云端数据清空失败');
    showToast('已清空全部本地数据');
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-background text-on-surface flex flex-col antialiased selection:bg-secondary-container selection:text-primary">
      {/* Active Tab Screen */}
      <main className="min-h-0 flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain pt-[env(safe-area-inset-top)]">
        {currentTab === 'home' && (
          <HomeScreen
            transactions={transactions}
            settings={settings}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {currentTab === 'statistics' && (
          <StatisticsScreen
            transactions={transactions}
            settings={settings}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            transactions={transactions}
            onUpdateSettings={handleUpdateSettings}
            onClearData={handleClearAllData}
            showToast={showToast}
            cloudSyncState={cloudSyncState}
          />
        )}
      </main>

      {/* Floating Record Entry Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveNewTransaction}
        defaultAccount={settings.defaultAccount}
      />

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenRecord={() => setIsRecordModalOpen(true)}
      />

      {/* Interactive Delight Toast */}
      <div
        id="toastMessage"
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 transform ${
          toastVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-secondary-container text-[18px]">
          check_circle
        </span>
        <span className="text-[13px] font-semibold">{toastMessage}</span>
      </div>
    </div>
  );
}
