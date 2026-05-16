import { TranslatedString, Country, Score } from './common';

export interface TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface Team {
  // --- Identity ---
  id: number;
  nameCode: string;
  national: boolean;
  gender: 'M' | 'F' | null;        // retained: needed to route to correct SofaScore gender endpoint
  userCount: number;
  priority: number | null;

  // --- Names (translated) ---
  name: TranslatedString;
  shortName: TranslatedString;

  // --- Appearance ---
  colors: TeamColors;

  // --- Location ---
  country: Country;

  // --- Score ---
  score: Score;

  // --- SofaScore API reference keys ---
  parentTeamId: number | null;      // fetch parent club: /api/v1/team/{parentTeamId}
  subTeamIds: number[];             // fetch sub-teams: /api/v1/team/{id}
}
