import {
  Match,
  TranslatedString,
  Country,
  Team,
  Tournament,
  Features,
  EventFilters,
} from '../types';
import { buildScore } from '../utils/scoreBuilder';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildTranslatedString(rawName: string | undefined, translations: any, fallbackName: string): TranslatedString {
  const en = rawName ?? fallbackName;
  const ar = translations?.ar ?? null;
  return { en, ar };
}

function buildCountryFromCategory(category: any): Country {
  return {
    name: buildTranslatedString(
      category?.country?.name,
      category?.fieldTranslations?.nameTranslation,
      category?.country?.name ?? ''
    ),
    alpha2: category?.country?.alpha2 ?? null,
    alpha3: category?.country?.alpha3 ?? null,
    flag: category?.flag ?? null,
  };
}

function buildCountryFromTeam(team: any): Country {
  return {
    name: buildTranslatedString(
      team?.country?.name,
      team?.fieldTranslations?.nameTranslation,
      team?.country?.name ?? ''
    ),
    alpha2: team?.country?.alpha2 ?? null,
    alpha3: team?.country?.alpha3 ?? null,
  };
}

function buildTournament(event: any): Tournament {
  const unique = event?.tournament?.uniqueTournament ?? {};
  const category = event?.tournament?.category ?? {};
  const rawTournament = event?.tournament ?? {};

  return {
    id: unique.id ?? 0,
    categoryId: category.id ?? 0,
    priority: rawTournament.priority ?? 0,
    isGroup: rawTournament.isGroup ?? false,
    groupName: rawTournament.groupName ?? null,
    groupSign: rawTournament.groupSign ?? null,
    isLive: rawTournament.isLive ?? false,
    userCount: unique.userCount ?? 0,
    name: buildTranslatedString(unique.name, unique.fieldTranslations?.nameTranslation, rawTournament.name ?? ''),
    colors: {
      primary: unique.primaryColorHex ?? '#000000',
      secondary: unique.secondaryColorHex ?? '#000000',
    },
    country: buildCountryFromCategory(category),
    season: {
      id: event?.season?.id ?? 0,
      name: event?.season?.name ?? '',
      year: event?.season?.year ?? '',
    },
    round: {
      number: event?.roundInfo?.round ?? 0,
      name: event?.roundInfo?.name ?? null,
      slug: event?.roundInfo?.slug ?? null,
      cupRoundType: event?.roundInfo?.cupRoundType ?? null,
      totalMatchesInRound: event?.cupMatchesInRound ?? null,
    },
    hasEventPlayerStatistics: unique.hasEventPlayerStatistics ?? false,
    displayInverseHomeAwayTeams: unique.displayInverseHomeAwayTeams ?? false,
    hasPerformanceGraphFeature: unique.hasPerformanceGraphFeature ?? false,
  };
}

function buildTeam(team: any, scoreRaw: any): Team {
  if (!team) team = {};
  return {
    id: team.id ?? 0,
    nameCode: team.nameCode ?? '',
    national: team.national ?? false,
    gender: team.gender ?? null,
    userCount: team.userCount ?? 0,
    priority: team.priority ?? null,
    name: buildTranslatedString(team.name, team.fieldTranslations?.nameTranslation, ''),
    shortName: buildTranslatedString(
      team.shortName ?? team.name,
      team.fieldTranslations?.shortNameTranslation,
      team.shortName ?? team.name ?? ''
    ),
    colors: {
      primary: team.teamColors?.primary ?? '#000000',
      secondary: team.teamColors?.secondary ?? '#000000',
      text: team.teamColors?.text ?? '#ffffff',
    },
    country: buildCountryFromTeam(team),
    score: buildScore(scoreRaw),
    parentTeamId: team.parentTeam?.id ?? null,
    subTeamIds: team.subTeams?.map((s: any) => s.id) ?? [],
  };
}

function buildFeatures(event: any): Features {
  return {
    hasGlobalHighlights: event?.hasGlobalHighlights ?? false,
    hasXg: event?.hasXg ?? false,
    hasEventPlayerStatistics: event?.hasEventPlayerStatistics ?? false,
    hasEventPlayerHeatMap: event?.hasEventPlayerHeatMap ?? false,
    crowdsourcingDataDisplayEnabled: event?.crowdsourcingDataDisplayEnabled ?? false,
    crowdsourcingEnabled: event?.crowdsourcingEnabled ?? false,
    detailId: event?.detailId ?? null,
  };
}

function buildFilters(event: any): EventFilters {
  return {
    category: event?.eventFilters?.category ?? [],
    level: event?.eventFilters?.level ?? [],
    gender: event?.eventFilters?.gender ?? [],
  };
}

// ─── Main Transformer ────────────────────────────────────────────────────────

/**
 * Transforms a raw SofaScore event into our standardized Jawla Match format.
 */
export function transformMatch(event: any): Match {
  return {
    id: event?.id ?? 0,
    slug: event?.slug ?? '',
    startTimestamp: event?.startTimestamp ?? 0,
    lastPeriod: event?.lastPeriod ?? null,
    finalResultOnly: event?.finalResultOnly ?? false,
    feedLocked: event?.feedLocked ?? false,
    isEditor: event?.isEditor ?? false,
    status: {
      code: event?.status?.code ?? 0,
      description: event?.status?.description ?? '',
      type: event?.status?.type ?? '',
    },
    statusTime: {
      prefix: event?.statusTime?.prefix ?? '',
      initial: event?.statusTime?.initial ?? 0,
      max: event?.statusTime?.max ?? 0,
      timestamp: event?.statusTime?.timestamp ?? null,
      extra: event?.statusTime?.extra ?? 0,
    },
    time: {
      currentPeriodStartTimestamp: event?.time?.currentPeriodStartTimestamp ?? null,
      initial: event?.time?.initial ?? 0,
      max: event?.time?.max ?? 0,
      extra: event?.time?.extra ?? 0,
      injuryTime1: event?.time?.injuryTime1 ?? null,
      injuryTime2: event?.time?.injuryTime2 ?? null,
      periodLength: event?.time?.periodLength ?? null,
      overtimeLength: event?.time?.overtimeLength ?? null,
      totalPeriodCount: event?.time?.totalPeriodCount ?? null,
    },
    tournament: buildTournament(event),
    home: buildTeam(event?.homeTeam, event?.homeScore),
    away: buildTeam(event?.awayTeam, event?.awayScore),
    features: buildFeatures(event),
    var: {
      homeTeam: event?.var?.homeTeam ?? false,
      awayTeam: event?.var?.awayTeam ?? false,
    },
    changes: {
      fields: event?.changes?.fields ?? [],
      timestamp: event?.changes?.timestamp ?? null,
    },
    filters: buildFilters(event),
    previousLeg: event?.previousLegEventId ? { id: event?.previousLegEventId } : null,
    aggregatedWinnerCode: event?.aggregatedWinnerCode ?? null,
  };
}
