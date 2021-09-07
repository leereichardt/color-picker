export interface ColorTypeRegex {
  cmyk: RegExp;
  rgba: RegExp;
  hsla: RegExp;
  hsva: RegExp;
  hexa: RegExp;
}

export interface ColorType {
  [index: number]: string;
}

export interface ColorTypeMatch {
  type: string | null;
  regex?: RegExp;
  match?: Array<any>; // fixme - Sort this any type out
}

export interface ParsedHSVA {
  values: Array<number | undefined> | null;
  type: string;
  alpha?: number;
}
