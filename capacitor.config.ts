import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.joyce.lightbudget',
  appName: '轻记账',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
