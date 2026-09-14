import React from 'react';

interface BottomNavProps {
  currentTab: 'home' | 'statistics' | 'settings';
  onTabChange: (tab: 'home' | 'statistics' | 'settings') => void;
  onOpenRecord: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenRecord,
}) => {
  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(16,60,54,0.06)] border-t border-border-subtle/50"
    >
      <div className="relative flex items-center justify-between h-16 px-5 max-w-[430px] mx-auto">
        {/* 首页 */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'home'
              ? 'text-primary font-bold'
              : 'text-muted-text hover:text-primary'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            receipt_long
          </span>
          <span className="text-[12px] leading-tight mt-0.5">首页</span>
        </button>

        {/* FAB 记账 */}
        <div className="relative -top-5 flex justify-center">
          <button
            id="nav-fab-record"
            aria-label="记账"
            type="button"
            onClick={onOpenRecord}
            className="w-14 h-14 rounded-full bg-secondary-container text-primary-container flex items-center justify-center shadow-[0_8px_24px_0_rgba(202,241,103,0.55)] hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[30px] font-bold text-primary">
              add
            </span>
          </button>
        </div>

        {/* 右侧两个：统计 & 设置 */}
        <div className="flex items-center gap-6">
          <button
            id="nav-tab-statistics"
            type="button"
            onClick={() => onTabChange('statistics')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
              currentTab === 'statistics'
                ? 'text-primary font-bold'
                : 'text-muted-text hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings:
                  currentTab === 'statistics' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              pie_chart
            </span>
            <span className="text-[12px] leading-tight mt-0.5">统计</span>
          </button>

          <button
            id="nav-tab-settings"
            type="button"
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
              currentTab === 'settings'
                ? 'text-primary font-bold'
                : 'text-muted-text hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings:
                  currentTab === 'settings' ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              settings
            </span>
            <span className="text-[12px] leading-tight mt-0.5">设置</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
