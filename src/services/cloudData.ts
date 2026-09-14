import { AppSettings, Transaction } from '../types';
import { isCloudConfigured, supabase } from '../lib/supabase';

type TransactionRow = {
  id: string;
  type: Transaction['type'];
  amount: number | string;
  category: string;
  category_icon: string;
  account: string;
  occurred_at: string;
  remark: string | null;
};

type SettingsRow = {
  monthly_budget: number | string;
  default_account: string;
  theme: AppSettings['theme'];
  currency_symbol: string;
  currency_code: string;
};

function requireClient() {
  if (!supabase) throw new Error('Supabase 尚未配置');
  return supabase;
}

async function ensureUserId(): Promise<string> {
  const client = requireClient();
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw sessionError;
  if (sessionData.session?.user.id) return sessionData.session.user.id;

  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user?.id) throw new Error('无法创建云端身份');
  return data.user.id;
}

function toRow(transaction: Transaction, userId: string) {
  return {
    id: transaction.id,
    user_id: userId,
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    category_icon: transaction.categoryIcon,
    account: transaction.account,
    occurred_at: transaction.date,
    remark: transaction.remark || '',
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    category: row.category,
    categoryIcon: row.category_icon,
    account: row.account,
    date: row.occurred_at,
    remark: row.remark || '',
  };
}

function settingsToRow(settings: AppSettings, userId: string) {
  return {
    user_id: userId,
    monthly_budget: settings.monthlyBudget,
    default_account: settings.defaultAccount,
    theme: settings.theme,
    currency_symbol: settings.currencySymbol,
    currency_code: settings.currencyCode,
    updated_at: new Date().toISOString(),
  };
}

function settingsFromRow(row: SettingsRow): AppSettings {
  return {
    monthlyBudget: Number(row.monthly_budget),
    defaultAccount: row.default_account,
    theme: row.theme,
    currencySymbol: row.currency_symbol,
    currencyCode: row.currency_code,
  };
}

export async function initializeCloudData(
  localTransactions: Transaction[],
  localSettings: AppSettings,
): Promise<{ transactions: Transaction[]; settings: AppSettings }> {
  if (!isCloudConfigured) {
    return { transactions: localTransactions, settings: localSettings };
  }

  const client = requireClient();
  const userId = await ensureUserId();
  const [transactionsResult, settingsResult] = await Promise.all([
    client.from('transactions').select('*').order('occurred_at', { ascending: false }),
    client.from('user_settings').select('*').maybeSingle(),
  ]);

  if (transactionsResult.error) throw transactionsResult.error;
  if (settingsResult.error) throw settingsResult.error;

  let transactions = (transactionsResult.data as TransactionRow[]).map(fromRow);
  let settings = settingsResult.data
    ? settingsFromRow(settingsResult.data as SettingsRow)
    : localSettings;

  // First connection: migrate the existing local ledger instead of replacing it.
  if (transactions.length === 0 && localTransactions.length > 0) {
    const { error } = await client
      .from('transactions')
      .upsert(localTransactions.map((transaction) => toRow(transaction, userId)));
    if (error) throw error;
    transactions = localTransactions;
  }

  if (!settingsResult.data) {
    const { error } = await client.from('user_settings').upsert(settingsToRow(localSettings, userId));
    if (error) throw error;
    settings = localSettings;
  }

  return { transactions, settings };
}

export async function upsertCloudTransaction(transaction: Transaction): Promise<void> {
  if (!isCloudConfigured) return;
  const client = requireClient();
  const userId = await ensureUserId();
  const { error } = await client.from('transactions').upsert(toRow(transaction, userId));
  if (error) throw error;
}

export async function deleteCloudTransaction(id: string): Promise<void> {
  if (!isCloudConfigured) return;
  const client = requireClient();
  const { error } = await client.from('transactions').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertCloudSettings(settings: AppSettings): Promise<void> {
  if (!isCloudConfigured) return;
  const client = requireClient();
  const userId = await ensureUserId();
  const { error } = await client.from('user_settings').upsert(settingsToRow(settings, userId));
  if (error) throw error;
}

export async function clearCloudData(): Promise<void> {
  if (!isCloudConfigured) return;
  const client = requireClient();
  const { error } = await client.from('transactions').delete().not('id', 'is', null);
  if (error) throw error;
}
