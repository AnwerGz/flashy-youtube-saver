
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8d37f687d2ea4dae993038530fe6ba3d',
  appName: 'flashy-youtube-saver',
  webDir: 'dist',
  server: {
    url: 'https://8d37f687-d2ea-4dae-9930-38530fe6ba3d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Permissions: {
      requestPermissions: ['storage']
    }
  }
};

export default config;
