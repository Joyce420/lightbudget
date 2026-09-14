import { Transaction, AppSettings } from '../types';
import { INITIAL_TRANSACTIONS, DEFAULT_SETTINGS } from '../data/initialData';

const STORAGE_KEY_TX = 'lightbudget_transactions_v3';
const STORAGE_KEY_SETTINGS = 'lightbudget_settings_v1';

export function loadTransactions(): Transaction[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TX);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
  }
  return INITIAL_TRANSACTIONS;
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function formatCurrency(amount: number, symbol = '¥'): string {
  const parts = Math.abs(amount).toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${symbol}${intPart}.${parts[1]}`;
}

export function splitCurrencyParts(amount: number) {
  const parts = Math.abs(amount).toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return {
    integer: intPart,
    decimal: `.${parts[1]}`,
  };
}

export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = ['ID', '类型', '金额', '分类', '账户', '时间', '备注'];
  const rows = transactions.map((t) => [
    t.id,
    t.type === 'expense' ? '支出' : '收入',
    t.amount.toFixed(2),
    t.category,
    t.account,
    t.date,
    `"${(t.remark || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `轻记账_流水导出_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
