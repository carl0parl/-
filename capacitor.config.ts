import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.laboratorio.vozdestreza',
  appName: 'Lab Voz y Destreza',
  webDir: 'dist',
  android: { backgroundColor: '#07090F' },
  plugins: {
    SplashScreen: { launchShowDuration: 1200, backgroundColor: '#07090F', showSpinner: false, androidScaleType: 'CENTER_INSIDE' }
  }
};
export default config;
