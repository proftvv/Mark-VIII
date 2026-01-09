import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.markviii.encryption',
  appName: 'Mark-VIII',
  webDir: 'out',
  server: {
    url: 'https://mark-viii.vercel.app',
    cleartext: true
  },
  android: {
    backgroundColor: '#1e293b'
  }
};

export default config;
