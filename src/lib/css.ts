// ─── Runtime CSS-in-JS Utility ────────────────────────────────
type StyleValue = string | number | StyleObject;
type StyleObject = { [key: string]: StyleValue };

const injected = new Map<string, boolean>();

function toKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function hashStr(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

const MEDIA: Record<string, string> = {
  '@sm': '@media (min-width: 640px)',
  '@md': '@media (min-width: 768px)',
  '@lg': '@media (min-width: 1024px)',
  '@xl': '@media (min-width: 1280px)',
};

const PSEUDO: Record<string, string> = {
  _hover:       '&:hover',
  _focus:       '&:focus',
  _active:      '&:active',
  _placeholder: '&::placeholder',
  _before:      '&::before',
  _after:       '&::after',
  _groupHover:  '.group:hover &',
};

type NestedItem =
  | { selector: string; styles: StyleObject; media?: undefined }
  | { media: string; selector: string; styles: StyleObject };

function buildRules(styles: StyleObject, selector: string): string[] {
  let declarations = '';
  const nested: NestedItem[] = [];

  for (const [key, value] of Object.entries(styles)) {
    if (key in PSEUDO) {
      const resolvedSelector = PSEUDO[key].replace('&', selector);
      nested.push({ selector: resolvedSelector, styles: value as StyleObject });
    } else if (key in MEDIA) {
      nested.push({ media: MEDIA[key], selector, styles: value as StyleObject });
    } else if (typeof value === 'object' && value !== null) {
      nested.push({ selector: `${selector}${key}`, styles: value as StyleObject });
    } else {
      declarations += `${toKebab(key)}:${value};`;
    }
  }

  const rules: string[] = [];
  if (declarations) rules.push(`${selector}{${declarations}}`);

  for (const item of nested) {
    if ('media' in item && item.media) {
      const inner = buildRules(item.styles, item.selector).join('');
      if (inner) rules.push(`${item.media}{${inner}}`);
    } else {
      rules.push(...buildRules(item.styles, item.selector));
    }
  }

  return rules;
}

function injectStyle(className: string, styles: StyleObject): void {
  if (injected.has(className)) return;
  injected.set(className, true);

  const rules = buildRules(styles, `.${className}`);
  const cssText = rules.join('');
  if (!cssText) return;

  let sheet = document.getElementById('__css_util__') as HTMLStyleElement | null;
  if (!sheet) {
    sheet = document.createElement('style');
    sheet.id = '__css_util__';
    document.head.appendChild(sheet);
  }
  sheet.textContent += cssText;
}

export function css(styles: StyleObject): string {
  if (!styles) return '';
  const key = JSON.stringify(styles);
  const className = `c${hashStr(key)}`;
  if (typeof document !== 'undefined') {
    injectStyle(className, styles);
  }
  return className;
}

export function cx(...args: (string | undefined | null | false)[]): string {
  return args.filter(Boolean).join(' ');
}
