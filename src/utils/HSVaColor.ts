import { hsvToCmyk, hsvToHex, hsvToHsl, hsvToRgb } from './Color';

/**
 * Simple class which holds the properties
 * of the color representation model hsla (hue saturation lightness alpha)
 */
export class HSVaColor {
  private h: number;
  private s: number;
  private v: number;
  private a: number;

  private mapper = (original, next) => (precision = -1): string => {
    return next(precision >= 0 ? original.map(v => Number(v.toFixed(precision))) : original);
  };

  constructor(h = 0, s = 0, v = 0, a = 1) {
    this.h = h;
    this.s = s;
    this.v = v;
    this.a = (a > 1) ? a / 100 : a;
  }

  toHSVA(): [number, number, number, number] {
    const hsva: [number, number, number, number] = [this.h, this.s, this.v, this.a];
    hsva.toString = this.mapper(hsva, arr => `hsva(${ arr[0] }, ${ arr[1] }%, ${ arr[2] }%, ${ this.readableAlpha() })`);

    return hsva;
  }

  toHSLA(): Array<number> {
    const hsla = [...hsvToHsl(this.h, this.s, this.v), this.a];
    hsla.toString = this.mapper(hsla, arr => `hsla(${ arr[0] }, ${ arr[1] }%, ${ arr[2] }%, ${ this.readableAlpha() })`);

    return hsla;
  }

  toHSL(): Array<number> {
    const hsl = hsvToHsl(this.h, this.s, this.v);
    hsl.toString = this.mapper(hsl, arr => `hsl(${ arr[0] }, ${ arr[1] }%, ${ arr[2] }%)`);

    return hsl;
  }

  toRGBA(): Array<number> {
    const rgba = [...hsvToRgb(this.h, this.s, this.v), this.a];
    rgba.toString = this.mapper(rgba, arr => `rgba(${ Math.round(arr[0]) }, ${ Math.round(arr[1]) }, ${ Math.round(arr[2]) }, ${ this.readableAlpha() })`);

    return rgba;
  }

  toRGB(): Array<number> {
    const rgb = hsvToRgb(this.h, this.s, this.v);
    rgb.toString = this.mapper(rgb, arr => `rgb(${ Math.round(arr[0]) }, ${ Math.round(arr[1]) }, ${ Math.round(arr[2]) })`);

    return rgb;
  }

  toCMYK(): Array<number> {
    const cmyk = hsvToCmyk(this.h, this.s, this.v);
    cmyk.toString = this.mapper(cmyk, arr => `cmyk(${ arr[0] }%, ${ arr[1] }%, ${ arr[2] }%, ${ arr[3] }%)`);

    return cmyk;
  }

  toHEXA(): Array<string> {
    const hex = hsvToHex(this.h, this.s, this.v);

    // Check if alpha channel make sense, convert it to 255 number space, convert
    // To hex and pad it with zeros if needed.
    const alpha =
      this.a >= 1
        ? ''
        : Number((this.a * 255).toFixed(0))
          .toString(16)
          .toUpperCase()
          .padStart(2, '0');

    alpha && hex.push(alpha);
    hex.toString = (): string => `#${ hex.join('').toUpperCase() }`;

    return hex;
  }

  toHEX(): Array<string> {
    const hex = hsvToHex(this.h, this.s, this.v);

    hex.toString = (): string => `#${ hex.join('').toLowerCase() }`;

    return hex;
  }

  set alpha(a) {
    this.a = (a > 1) ? a / 100 : a;
  }

  get alpha() {
    return this.a;
  }

  set hue(h) {
    this.h = Math.round(h);
  }

  get hue() {
    return this.h;
  }

  set saturation(s) {
    this.s = Math.round(s);
  }

  get saturation() {
    return this.s;
  }

  set value(v) {
    this.v = Math.round(v);
  }

  get value() {
    return this.v;
  }

  clone(): HSVaColor {
    return new HSVaColor(this.h, this.s, this.v, this.a);
  }

  readableAlpha(): number {
    return Math.round((this.a + Number.EPSILON) * 100) / 100;
  }
}
