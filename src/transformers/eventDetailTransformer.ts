import type {
  EventDetail,
  Incident,
  BestPlayers,
  AiInsights,
  HeadToHead,
  Managers,
  Highlight,
  MediaSummary,
} from '../types';

export function transformEventDetail(raw: any): EventDetail {
  const e = raw.event;
  return {
    id: e.id,
    slug: e.slug,
    startTimestamp: e.startTimestamp,
    status: e.status,
    winnerCode: e.winnerCode,
    homeScore: e.homeScore,
    awayScore: e.awayScore,
    venue: e.venue
      ? {
          name: e.venue.stadium?.name || e.venue.name,
          city: e.venue.city?.name,
          capacity: e.venue.capacity,
          country: e.venue.country?.name,
        }
      : null,
    referee: e.referee
      ? {
          name: e.referee.name,
          yellowCards: e.referee.yellowCards,
          redCards: e.referee.redCards,
          games: e.referee.games,
        }
      : null,
    hasXg: !!e.hasXg,
    hasGlobalHighlights: !!e.hasGlobalHighlights,
    defaultPeriodCount: e.defaultPeriodCount || 2,
    defaultPeriodLength: e.defaultPeriodLength || 45,
    roundInfo: e.roundInfo
      ? { round: e.roundInfo.round, name: e.roundInfo.name }
      : null,
  };
}

export function transformIncidents(raw: any): Incident[] {
  if (!raw.incidents || !Array.isArray(raw.incidents)) return [];

  return raw.incidents.map((inc: any) => {
    const result: Incident = {
      id: inc.id,
      incidentType: inc.incidentType,
      time: inc.time,
      addedTime: inc.addedTime,
      isHome: !!inc.isHome,
    };

    if (inc.incidentClass) result.incidentClass = inc.incidentClass;
    if (inc.player?.shortName || inc.player?.name) result.playerName = inc.player.shortName || inc.player.name;
    if (inc.assist1?.shortName || inc.assist1?.name) result.assistName = inc.assist1.shortName || inc.assist1.name;
    if (inc.homeScore !== undefined) result.homeScore = inc.homeScore;
    if (inc.awayScore !== undefined) result.awayScore = inc.awayScore;
    if (inc.reason) result.reason = inc.reason;
    if (inc.playerIn?.shortName || inc.playerIn?.name) result.playerIn = inc.playerIn.shortName || inc.playerIn.name;
    if (inc.playerOut?.shortName || inc.playerOut?.name) result.playerOut = inc.playerOut.shortName || inc.playerOut.name;
    if (inc.injury !== undefined) result.injury = inc.injury;
    if (inc.text) result.text = inc.text;
    if (inc.length !== undefined) result.length = inc.length;

    return result;
  });
}

export function transformBestPlayers(raw: any): BestPlayers {
  const mapPlayer = (bp: any) => ({
    name: bp.player?.name,
    shortName: bp.player?.shortName || bp.player?.name,
    id: bp.player?.id,
    position: bp.player?.position,
    jerseyNumber: bp.player?.jerseyNumber,
    rating: bp.value,
  });

  return {
    bestHomeTeamPlayers: (raw.bestHomeTeamPlayers || []).map(mapPlayer),
    bestAwayTeamPlayers: (raw.bestAwayTeamPlayers || []).map(mapPlayer),
    playerOfTheMatch: raw.playerOfTheMatch ? mapPlayer(raw.playerOfTheMatch) : null,
  };
}

export function transformAiInsights(raw: any): AiInsights {
  return {
    predictions: {
      yellowCards: raw.predictions?.yellowCards || 0,
      corners: raw.predictions?.corners || 0,
      bothTeamsToScore: !!raw.predictions?.bothTeamsToScore,
      homeScore: raw.predictions?.homeNormaltimeScore || 0,
      awayScore: raw.predictions?.awayNormaltimeScore || 0,
      winProbability: {
        home: raw.predictions?.winningProbability?.home || 0,
        draw: raw.predictions?.winningProbability?.draw || 0,
        away: raw.predictions?.winningProbability?.away || 0,
      },
    },
    sections: raw.sections || [],
    halftimeSections: raw.halftimeSections || [],
  };
}

export function transformH2H(raw: any): HeadToHead {
  return {
    homeWins: raw.teamDuel?.homeWins || 0,
    awayWins: raw.teamDuel?.awayWins || 0,
    draws: raw.teamDuel?.draws || 0,
  };
}

export function transformManagers(raw: any): Managers {
  return {
    home: {
      name: raw.homeManager?.name,
      shortName: raw.homeManager?.shortName || raw.homeManager?.name,
      id: raw.homeManager?.id,
    },
    away: {
      name: raw.awayManager?.name,
      shortName: raw.awayManager?.shortName || raw.awayManager?.name,
      id: raw.awayManager?.id,
    },
  };
}

export function transformTvChannels(raw: any): Record<string, number[]> {
  return raw.countryChannels || {};
}

const mapHighlight = (h: any): Highlight => ({
  id: h.id,
  title: h.title,
  subtitle: h.subtitle,
  url: h.url,
  thumbnailUrl: h.thumbnailUrl,
  sourceUrl: h.sourceUrl,
  mediaType: h.mediaType,
  keyHighlight: !!h.keyHighlight,
});

export function transformHighlights(raw: any): Highlight[] {
  if (!raw.highlights || !Array.isArray(raw.highlights)) return [];
  return raw.highlights.map(mapHighlight);
}

export function transformMediaSummary(raw: any): MediaSummary {
  return {
    highlightedItem: raw.highlightedItem?.item ? mapHighlight(raw.highlightedItem.item) : null,
    mediaItems: (raw.mediaItems || []).map((m: any) => mapHighlight(m.item)),
    itemsCount: raw.itemsCount || 0,
  };
}
