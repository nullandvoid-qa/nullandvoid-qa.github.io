describe('app-init', () => {
  beforeEach(() => {
    jest.resetModules();
    const element = {
      dataset: { persona: 'beginner' },
      tagName: 'DIV',
      hasAttribute: jest.fn(() => false),
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
    };
    document.querySelectorAll = jest.fn(() => [element]);
    document.getElementById = jest.fn(() => null);
    document.__eventHandlers = { click: [], keydown: [] };
    document.addEventListener = jest.fn((event, listener) => {
      if (!document.__eventHandlers[event]) {
        document.__eventHandlers[event] = [];
      }
      document.__eventHandlers[event].push(listener);
    });
    window.document = document;
    window.NVApp = { helpers: { setPersona: jest.fn() }, state: {} };
    window.showToast = jest.fn();
  });

  test('binds click and keyboard activation for persona cards', () => {
    const element = {
      dataset: { persona: 'beginner' },
      tagName: 'DIV',
      hasAttribute: jest.fn(() => false),
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
    };

    document.querySelectorAll.mockReturnValue([element]);

    jest.isolateModules(() => {
      require('../app-init.js');
    });

    expect(document.querySelectorAll).toHaveBeenCalledWith('.persona-card');
    expect(element.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(element.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(element.setAttribute).toHaveBeenCalledWith('role', 'button');
    expect(element.setAttribute).toHaveBeenCalledWith('tabindex', '0');

    const keydownHandler = element.addEventListener.mock.calls.find(([event]) => event === 'keydown')[1];
    const preventDefault = jest.fn();
    keydownHandler({ key: 'Enter', preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(window.NVApp.helpers.setPersona).toHaveBeenCalledWith('beginner');
  });

  test('closes search results with Escape key', () => {
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';
    searchResults.className = '';
    document.body.appendChild(searchResults);

    document.getElementById = jest.fn((id) => (id === 'search-results' ? searchResults : null));

    jest.isolateModules(() => {
      require('../app-init.js');
    });

    const escapeEvent = { key: 'Escape', preventDefault: jest.fn() };
    const keydownHandlers = document.__eventHandlers['keydown'];
    expect(Array.isArray(keydownHandlers)).toBe(true);
    expect(keydownHandlers.length).toBeGreaterThan(0);
    const spy = jest.spyOn(searchResults.classList, 'add');
    keydownHandlers.forEach((handler) => handler(escapeEvent));

    expect(spy).toHaveBeenCalledWith('hidden');
    expect(searchResults.classList.contains('hidden')).toBe(true);
  });
});
