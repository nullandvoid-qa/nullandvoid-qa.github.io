/**
 * Mobile Testing Labs
 * Real device + emulator configurations for mobile QA
 */

window.TG_MOBILE_LABS = [
  {
    id: "lab-android-basic",
    name: "Android Emulator — Básico",
    type: "emulator",
    device: "Pixel 5",
    os: "Android",
    version: "13",
    screen: "6.0 inch",
    resolution: "1080x2340",
    setup: `
# Android Setup
1. Instale Android Studio
2. Abra AVD Manager
3. Crie Pixel 5 emulator (Android 13)
4. Run: emulator -avd Pixel_5_API_33

# Teste
import { browser } from '@wdio/globals'
await browser.launch({
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:app': '/path/to/app.apk'
  }]
});
    `,
    tools: ["Appium", "WebDriver.io", "Android Studio"],
    cost: "Free"
  },
  {
    id: "lab-ios-basic",
    name: "iOS Simulator — Básico",
    type: "emulator",
    device: "iPhone 14",
    os: "iOS",
    version: "16",
    screen: "6.1 inch",
    resolution: "1170x2532",
    setup: `
# iOS Setup (macOS only)
1. Instale Xcode
2. Abra Xcode Simulator
3. Device → iPhone 14

# Teste
import { browser } from '@wdio/globals'
await browser.launch({
  capabilities: [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 14',
    'appium:app': '/path/to/app.ipa'
  }]
});
    `,
    tools: ["Appium", "WebDriver.io", "Xcode"],
    cost: "Free"
  },
  {
    id: "lab-saucelabs",
    name: "Sauce Labs — Devices Reais",
    type: "real-devices",
    devices: ["iPhone 13", "iPhone 14", "Pixel 6", "Pixel 7"],
    os: ["iOS", "Android"],
    setup: `
# Sauce Labs Real Device Cloud
1. Sign up em saucelabs.com
2. Get API key
3. Configure credentials

# Setup
const opts = {
  path: '/wd/hub',
  port: 443,
  protocol: 'https',
  user: 'your_username',
  key: 'your_api_key'
};

// Capabilities para iPhone real
const caps = {
  platformName: 'iOS',
  'appium:deviceName': 'iPhone_13_real',
  'sauce:options': {
    testName: 'Mobile QA Test'
  }
};
    `,
    tools: ["Appium", "Sauce Labs", "WebDriver.io"],
    cost: "Pago (trial grátis)"
  },
  {
    id: "lab-browserstack",
    name: "BrowserStack — App Testing",
    type: "real-devices",
    devices: ["iPhone", "Samsung", "OnePlus", "Pixel"],
    os: ["iOS", "Android"],
    setup: `
# BrowserStack Setup
1. Cadastre em browserstack.com
2. Get username & API key

# Automação
const client = webdriverio.remote({
  host: 'hub.browserstack.com',
  port: 443,
  secure: true,
  user: 'username',
  key: 'api_key',
  capabilities: {
    'bstack:options': {
      osVersion: '14',
      deviceName: 'iPhone 12',
      realMobile: true
    }
  }
});
    `,
    tools: ["Appium", "BrowserStack", "WebDriver.io"],
    cost: "Pago (trial disponível)"
  }
];

window.TG_MOBILE_AUTOMATION_EXAMPLES = [
  {
    id: "mobile-tap",
    name: "Tap/Click em Elemento",
    code: `// Tap em botão mobile
const button = await $('~my_button_id'); // iOS
// ou
const button = await $('id=my_button'); // Android

await button.click();
await browser.pause(1000);`
  },
  {
    id: "mobile-scroll",
    name: "Scroll Vertical",
    code: `// Scroll até elemento aparecer
const element = await $('text=Continue');
await element.scrollIntoView();

// Scroll genérico
await browser.execute('mobile: scroll', {
  direction: 'down',
  percent: 75
});`
  },
  {
    id: "mobile-gesture",
    name: "Gestos (Swipe, Long Press)",
    code: `// Swipe left
await browser.touchAction({
  type: 'swipe',
  direction: 'left',
  duration: 1000
});

// Long press
const element = await $('id=my_element');
await browser.touchAction({
  type: 'longPress',
  element: element.elementId,
  duration: 2000
});`
  },
  {
    id: "mobile-input",
    name: "Input de Texto (Teclado)",
    code: `// Digitar texto
const input = await $('id=email_input');
await input.click();
await input.setValue('user@example.com');

// Para password (hidden keyboard)
await browser.hideKeyboard();`
  },
  {
    id: "mobile-orientation",
    name: "Trocar Orientação",
    code: `// Muda para landscape
await browser.setOrientation('LANDSCAPE');
await browser.pause(1000);

// Volta para portrait
await browser.setOrientation('PORTRAIT');

// Valida orientação
const orientation = await browser.getOrientation();
expect(orientation).toBe('LANDSCAPE');`
  },
  {
    id: "mobile-performance",
    name: "Medir Performance Mobile",
    code: `// Captura logs de performance
const logs = await browser.getLogs('performance');

// Mede time to interactive
const startTime = Date.now();
await $('~main_content').waitForDisplayed({ timeout: 5000 });
const loadTime = Date.now() - startTime;

console.log(\`Time to Load: \${loadTime}ms\`);
expect(loadTime).toBeLessThan(3000);`
  }
];

window.TG_MOBILE_BEST_PRACTICES = [
  {
    category: "Test Isolation",
    tips: [
      "Comece cada teste com app clean (reinstalar)",
      "Limpe dados entre testes (localStorage, BD)",
      "Use IDs estáveis (não dependa de text content)"
    ]
  },
  {
    category: "Emulator vs Real",
    tips: [
      "Emulatores: rápido, barato, debugging fácil",
      "Real devices: comportamento real, rede real, bateria real",
      "Usa emulator para CI/CD, real para QA"
    ]
  },
  {
    category: "Performance",
    tips: [
      "Monitora battery drain",
      "Valida load time < 3s (mobile)",
      "Testa com network throttling (3G, LTE)"
    ]
  },
  {
    category: "Gestos",
    tips: [
      "Testa all swipe directions (up, down, left, right)",
      "Valida double tap, pinch-to-zoom",
      "Testa com orientação portrait e landscape"
    ]
  }
];
