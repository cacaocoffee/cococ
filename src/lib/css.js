// ─── Runtime CSS-in-JS Utility ────────────────────────────────
const injected = new Map();

function toKebab(str) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function hashStr(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

const MEDIA = {
  '@sm': '@media (min-width: 640px)',
  '@md': '@media (min-width: 768px)',
  '@lg': '@media (min-width: 1024px)',
  '@xl': '@media (min-width: 1280px)',
};

const PSEUDO = {
  _hover:       '&:hover',
  _focus:       '&:focus',
  _active:      '&:active',
  _placeholder: '&::placeholder',
  _before:      '&::before',
  _after:       '&::after',
  _groupHover:  '.group:hover &',
};

function buildRules(styles, selector) {
  let declarations = '';
  const nested = [];

  for (const [key, value] of Object.entries(styles)) {
    if (key in PSEUDO) {
      const resolvedSelector = PSEUDO[key].replace('&', selector);
      nested.push({ selector: resolvedSelector, styles: value });
    } else if (key in MEDIA) {
      nested.push({ media: MEDIA[key], selector, styles: value });
    } else if (typeof value === 'object' && value !== null) {
      nested.push({ selector: `${selector}${key}`, styles: value });
    } else {
      declarations += `${toKebab(key)}:${value};`;
    }
  }

  const rules = [];
  if (declarations) rules.push(`${selector}{${declarations}}`);

  for (const item of nested) {
    if (item.media) {
      const inner = buildRules(item.styles, item.selector).join('');
      if (inner) rules.push(`${item.media}{${inner}}`);
    } else {
      rules.push(...buildRules(item.styles, item.selector));
    }
  }

  return rules;
}

function injectStyle(className, styles) {
  if (injected.has(className)) return;
  injected.set(className, true);

  const rules = buildRules(styles, `.${className}`);
  const cssText = rules.join('');
  if (!cssText) return;

  let sheet = document.getElementById('__css_util__');
  if (!sheet) {
    sheet = document.createElement('style');
    sheet.id = '__css_util__';
    document.head.appendChild(sheet);
  }
  sheet.textContent += cssText;
}

export function css(styles) {
  if (!styles) return '';
  const key = JSON.stringify(styles);
  const className = `c${hashStr(key)}`;
  if (typeof document !== 'undefined') {
    injectStyle(className, styles);
  }
  return className;
}

// Helper: combine class names (filters falsy values)
export function cx(...args) {
  return args.filter(Boolean).join(' ');
}
