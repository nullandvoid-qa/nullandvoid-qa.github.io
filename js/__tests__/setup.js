// Test setup - mock browser APIs
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; },
};

global.lang = 'pt'; // Mock the lang variable for getCurrentLangKey

global.navigator = {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
};

global.HTMLElement = class {
  constructor() {
    this.classList = {
      _classes: new Set(),
      add(className) { this._classes.add(className); },
      remove(className) { this._classes.delete(className); },
      toggle(className, force) {
        if (force === undefined) {
          if (this._classes.has(className)) {
            this._classes.delete(className);
            return false;
          } else {
            this._classes.add(className);
            return true;
          }
        }
        if (force) this._classes.add(className);
        else this._classes.delete(className);
        return force;
      },
      contains(className) { return this._classes.has(className); },
    };
  }
};

global.HTMLCanvasElement = class HTMLCanvasElement extends global.HTMLElement {
  constructor() {
    super();
    this.width = 1920;
    this.height = 1080;
    this._context = null;
  }

  getContext(type) {
    if (String(type).toLowerCase() !== '2d') return null;
    if (this._context) return this._context;
    this._context = {
      fillStyle: '#000',
      strokeStyle: '#000',
      font: '16px Arial',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      globalAlpha: 1,
      shadowBlur: 0,
      shadowColor: 'transparent',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      strokeRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      setLineDash: jest.fn(),
      createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      measureText: jest.fn(text => ({ width: String(text || '').length * 8 })),
      fillText: jest.fn(),
      strokeText: jest.fn(),
    };
    return this._context;
  }

  toDataURL() {
    return 'data:image/png;base64,AAAA';
  }
};

global.document = {
  documentElement: { lang: 'pt-BR', setAttribute: jest.fn() },
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  getElementById: jest.fn(() => ({ classList: new global.HTMLElement().classList, innerHTML: '', textContent: '', addEventListener: jest.fn() })),
  createElement: jest.fn((type) => {
    if (String(type).toLowerCase() === 'canvas') {
      return new global.HTMLCanvasElement();
    }
    return { classList: new global.HTMLElement().classList, innerHTML: '', textContent: '', setAttribute: jest.fn(), addEventListener: jest.fn(), querySelector: jest.fn(), querySelectorAll: jest.fn(() => []) };
  }),
  addEventListener: jest.fn(),
};