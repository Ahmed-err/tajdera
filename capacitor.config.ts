import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sarmadax.girishatk',
  appName: 'Girishatk',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#072325',
    },
  },
  android: {
    backgroundColor: '#072325',
  },
};

export default config;
