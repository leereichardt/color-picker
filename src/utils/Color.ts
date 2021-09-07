import { ColorType, ColorTypeMatch, ColorTypeRegex, ParsedHSVA } from './ColorInterface';

const { min, max, floor, round } = Math;

function standardizeColor(name: string): null | string | CanvasGradient | CanvasPattern {
  // Since invalid color's will be parsed as black, filter them out
  if (name.toLowerCase() === 'black') {
    return '#000';
  }

  const ctx = (document.createElement('canvas') as HTMLCanvasElement).getContext('2d');
  if (ctx === null) {
    return null;
  }
  ctx.fillStyle = name;

  return ctx.fillStyle === '#000' ? null : ctx.fillStyle;
}

export function hsvToRgb(h: number, s: number, v: number): Array<number> {
  const hLocal = (h / 360) * 6;
  const sLocal = s / 100;
  const vLocal = v / 100;

  const i = floor(hLocal);

  const f = hLocal - i;
  const p = vLocal * (1 - sLocal);
  const q = vLocal * (1 - f * sLocal);
  const t = vLocal * (1 - (1 - f) * sLocal);

  const mod = i % 6;
  const r = [vLocal, q, p, p, t, vLocal][mod];
  const g = [t, vLocal, vLocal, q, p, p][mod];
  const b = [p, p, t, vLocal, vLocal, q][mod];

  return [r * 255, g * 255, b * 255];
}

export function hsvToHex(h: number, s: number, v: number): Array<string> {
  return hsvToRgb(h, s, v).map(rgb =>
    round(rgb)
      .toString(16)
      .padStart(2, '0'),
  );
}

export function hsvToCmyk(h: number, s: number, v: number): Array<number> {
  const rgb = hsvToRgb(h, s, v);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const k = min(1 - r, 1 - g, 1 - b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return [c * 100, m * 100, y * 100, k * 100];
}

export function hsvToHsl(h: number, s: number, v: number): Array<number> {
  let sLocal = s / 100;
  const vLocal = v / 100;

  const l = ((2 - sLocal) * vLocal) / 2;

  if (l !== 0) {
    if (l === 1) {
      sLocal = 0;
    } else if (l < 0.5) {
      sLocal = (sLocal * vLocal) / (l * 2);
    } else {
      sLocal = (sLocal * vLocal) / (2 - l * 2);
    }
  }

  return [h, sLocal * 100, l * 100];
}

function rgbToHsv(red: number, green: number, blue: number): Array<number> {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const minVal = min(r, g, b);
  const maxVal = max(r, g, b);
  const delta = maxVal - minVal;

  let h;
  let s;
  const v = maxVal;
  if (delta === 0) {
    h = 0;
    s = 0;
  } else {
    s = delta / maxVal;
    const dr = ((maxVal - r) / 6 + delta / 2) / delta;
    const dg = ((maxVal - g) / 6 + delta / 2) / delta;
    const db = ((maxVal - b) / 6 + delta / 2) / delta;

    if (r === maxVal) {
      h = db - dg;
    } else if (g === maxVal) {
      h = 1 / 3 + dr - db;
    } else if (b === maxVal) {
      h = 2 / 3 + dg - dr;
    }

    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  return [h * 360, s * 100, v * 100];
}

function cmykToHsv(cyan: number, magenta: number, yellow: number, key: number): Array<number> {
  const c = cyan / 100;
  const m = magenta / 100;
  const y = yellow / 100;
  const k = key / 100;

  const r = (1 - min(1, c * (1 - k) + k)) * 255;
  const g = (1 - min(1, m * (1 - k) + k)) * 255;
  const b = (1 - min(1, y * (1 - k) + k)) * 255;

  return [...rgbToHsv(r, g, b)];
}

function hslToHsv(hue: number, saturation: number, lightness: number): Array<number> {
  let s = saturation / 100;
  const l = lightness / 100;
  s *= l < 0.5 ? l : 1 - l;

  const ns = ((2 * s) / (l + s)) * 100;
  const v = (l + s) * 100;

  return [hue, Number.isNaN(ns) ? 0 : ns, v];
}

function hexToHsv(hex: string): Array<number> | null {
  const hexRgb = hex.match(/.{2}/g);
  if (hexRgb !== null) {
    const [red, green, blue] = hexRgb.map(v => Number.parseInt(v, 16));

    return rgbToHsv(red, green, blue);
  }

  return null;
}

function getColorType(colorString: string | CanvasGradient | CanvasPattern | null): ColorTypeMatch {
  // Regular expressions to match different types of color representation
  const regex: ColorTypeRegex = {
    cmyk: /^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i,
    rgba: /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
    hsla: /^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
    hsva: /^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
    hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i,
  };

  const colorType = Object.entries(regex).find(([, colorRegex]): ColorType => colorRegex.exec(colorString));
  if (colorType !== undefined) {
    const match = colorType[1].exec(colorString);

    return {
      type: colorType[0],
      regex: colorType[1],
      match,
    };
  }

  return {
    type: null,
  };
}

/**
 * Try's to parse a string which represents a color to a HSV array.
 * Current supported types are cmyk, rgba, hsla and hexadecimal.
 */
export function parseToHSVA(colorString: string): ParsedHSVA {
  // Check if string is a color-name
  const string = colorString.match(/^[a-zA-Z]+$/) !== null ? standardizeColor(colorString) : colorString;
  const { type, match } = getColorType(string);
  /**
   * Takes an Array of any type, convert strings which represents
   * a number to a number an anything else to undefined.
   * */
  const numarize = (array): Array<number | undefined> => array.map(v => (/^(|\d+)\.\d+|\d+$/.test(v) ? Number(v) : undefined));

  if (type === null || match === null) {
    return { values: null, type: 'hexa' };
  }

  // Match[2] does only contain a truly value if rgba, hsla, or hsla got matched
  const hasValidAlphaChannel = (a): boolean => !!match[2] === (typeof a === 'number');
  const isValidAlpha = (a): boolean => a >= 0 && a <= 1 && hasValidAlphaChannel(a);

  if (type === 'cmyk') {
    const [, c, m, y, k] = numarize(match);
    if (c && m && y && k && c <= 100 && m <= 100 && y <= 100 && k <= 100) {
      return { values: cmykToHsv(c, m, y, k), type };
    }
  }

  if (type === 'rgba') {
    const [, , , r, g, b, a] = numarize(match);

    if (r && g && b && a && r <= 255 && g <= 255 && b <= 255 && isValidAlpha(a)) {
      return { values: [...rgbToHsv(r, g, b), a], alpha: a, type };
    }
  }

  if (type === 'hexa') {
    let [, hex] = match;

    if (hex.length === 4 || hex.length === 3) {
      hex = hex
        .split('')
        .map(v => v + v)
        .join('');
    }

    const raw = hex.substring(0, 6);
    let a = hex.substring(6);

    // Convert 0 - 255 to 0 - 1 for opacity
    a = a ? parseInt(a, 16) / 255 : undefined;
    const hsvValue = hexToHsv(raw);

    if (hsvValue !== undefined) {
      return { values: [...hsvValue, a], alpha: a, type };
    }
  }

  if (type === 'hsla') {
    const [, , , h, s, l, a] = numarize(match);

    if (h && s && l && a && h <= 360 && s <= 100 && l <= 100 && a >= 0 && a <= 1 && isValidAlpha(a)) {
      return { values: [...hslToHsv(h, s, l), a], alpha: a, type };
    }
  }

  if (type === 'hsva') {
    const [, , , h, s, v, a] = numarize(match);

    if (h && s && v && a && h <= 360 && s <= 100 && v <= 100 && a >= 0 && a <= 1 && isValidAlpha(a)) {
      return { values: [h, s, v, a], alpha: a, type };
    }
  }

  return { values: null, type: 'hexa' };
}

export const isValidHex = string => string.match(/^#?[\dA-Fa-f]{6,8}$/i);

export const alphaToHex = alpha => alpha >= 1
  ? ''
  : Number((alpha * 255).toFixed(0))
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');
