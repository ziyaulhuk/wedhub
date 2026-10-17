import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ziyaul.wedhub',
  appName: 'WedHub',
  webDir: 'dist',
  // Launcher icons + splash live in android/app/src/main/res (mipmap-*/ic_launcher*,
  // drawable*/splash.png) - restored from the original app's resources/.
  server: {
    androidScheme: 'https'
  }
};

export default config;
