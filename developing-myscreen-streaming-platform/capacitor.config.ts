import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuração do app nativo (compilado via Codemagic).
 *
 * Observações importantes para IPTV:
 *  - `allowMixedContent: true` é necessário porque boa parte dos streams
 *    públicos da lista iptv-org ainda é servida em http:// (não https).
 *  - `androidScheme: "https"` mantém o WebView em um contexto seguro,
 *    o que é exigido para APIs modernas (fetch, fullscreen, MSE/hls.js).
 */
const config: CapacitorConfig = {
  appId: "com.worldchannel.app",
  appName: "World Channel",
  webDir: "dist",

  android: {
    allowMixedContent: true,
    backgroundColor: "#05060b",
  },

  ios: {
    backgroundColor: "#05060b",
    contentInset: "always",
  },

  server: {
    androidScheme: "https",
    iosScheme: "https",
    // permite que o WebView carregue os streams/logos remotos
    cleartext: true,
  },

  plugins: {
    SplashScreen: {
      backgroundColor: "#05060b",
      launchAutoHide: true,
      showSpinner: false,
    },
  },
};

export default config;
