import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.e5a3da0e649841398a03e694ac899da0',
  appName: 'Key Scanner',
  webDir: 'dist',
  server: {
    url: 'https://e5a3da0e-6498-4139-8a03-e694ac899da0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;