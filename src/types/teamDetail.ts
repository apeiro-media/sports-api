import { TranslatedString, Country } from './common';

export interface TeamInfo {
  id: number;
  name: TranslatedString;
  shortName: TranslatedString;
  nameCode: string;
  national: boolean;
  gender: 'M' | 'F' | null;
  userCount: number;
  foundationDateTimestamp: number | null;
  venue: TeamVenue | null;
  manager: TeamManager | null;
  country: Country;
  colors: { primary: string; secondary: string; text: string };
  parentTeamId: number | null;
  subTeamIds: number[];
}

export interface TeamVenue {
  id: number;
  name: string;
  city: string | null;
  capacity: number | null;
  country: string | null;
}

export interface TeamManager {
  id: number;
  name: string;
  shortName: string;
  nationality: string | null;
}

export interface SquadPlayer {
  id: number;
  name: string;
  shortName: string;
  position: string | null;
  jerseyNumber: string | null;
  dateOfBirthTimestamp: number | null;
  height: number | null;
  nationality: string | null;
  countryAlpha2: string | null;
  marketValue: number | null;
  marketValueCurrency: string | null;
}

export interface Transfer {
  id: number;
  playerName: string;
  playerId: number | null;
  type: 'in' | 'out';
  transferFee: number | null;
  transferFeeDescription: string | null;
  fromTeamId: number | null;
  fromTeamName: string | null;
  toTeamId: number | null;
  toTeamName: string | null;
  transferDateTimestamp: number | null;
}

export interface Achievement {
  id: number;
  tournamentId: number | null;
  tournamentName: string | null;
  seasons: { year: string; name: string }[];
}

export interface TeamRanking {
  position: number | null;
  points: number | null;
}

export interface PerformanceEntry {
  eventId: number;
  opponentId: number;
  opponentName: string;
  opponentNameCode: string;
  isHome: boolean;
  result: 'W' | 'D' | 'L';
  goalsScored: number;
  goalsConceded: number;
  startTimestamp: number;
}

export interface TeamMedia {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  mediaType: number;
  sourceUrl: string;
}

export interface TeamTweet {
  id: string;
  text: string;
  url: string;
  createdAt: string | null;
}
