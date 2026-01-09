import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.markviii.encryption',
  appName: 'Mark-VIII',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.108:3000',
    cleartext: true
  },
  android: {
    backgroundColor: '#1e293b'
  }
};

export default config;
