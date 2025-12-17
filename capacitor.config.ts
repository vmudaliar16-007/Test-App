
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vanvision.app',
  appName: 'AI Van Lifestyle',
  webDir: 'dist', // Or 'build', depending on your bundler (Vite uses dist, CRA uses build)
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false, // We control this in App.tsx
      backgroundColor: "#0f172a",
      androidSplashResourceName: "splash",
      iosSplashResourceName: "Splash",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: true, // Allows content to go under the status bar
      style: "DARK"
    }
  }
};

export default config;
