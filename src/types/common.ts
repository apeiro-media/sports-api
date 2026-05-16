export interface TranslatedString {
  en: string | null;
  ar: string | null;
}

export interface Country {
  name: TranslatedString;
  alpha2: string | null;
  alpha3: string | null;
  flag?: string | null;
}

export interface Score {
  current: number;
  display: number;
  period1: number | null;
  period2: number | null;
  normaltime: number | null;
  overtime: number | null;
  penalties: number | null;
  aggregated: number | null;
}
