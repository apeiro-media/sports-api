import { Context } from 'hono';
import { leagueService } from '../services/league.service';

function getLang(c: Context) {
  return c.req.query('lang') || 'en';
}

export const getTournament = async (c: Context) => {
  const { tournamentId } = c.req.param();
  const data = await leagueService.getTournament(Number(tournamentId), getLang(c));
  return c.json(data);
};

export const getRounds = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  const data = await leagueService.getRounds(Number(tournamentId), Number(seasonId), getLang(c));
  return c.json(data);
};

export const getTournamentRoundEvents = async (c: Context) => {
  const { tournamentId, seasonId, round } = c.req.param();
  const { registry } = await import('../providers/registry');
  const provider = registry.getDefault();
  const data = await provider.getTournamentRoundEvents({
    tournamentId: Number(tournamentId),
    seasonId: Number(seasonId),
    round: Number(round),
    lang: getLang(c)
  });
  return c.json(data);
};

export const getStandings = async (c: Context) => {
  const { tournamentId, seasonId, type } = c.req.param();
  const data = await leagueService.getStandings(Number(tournamentId), Number(seasonId), type as any, getLang(c));
  return c.json(data);
};

export const getTeamEvents = async (c: Context) => {
  const { tournamentId, seasonId, type } = c.req.param();
  const data = await leagueService.getTeamEvents(Number(tournamentId), Number(seasonId), type, getLang(c));
  return c.json(data);
};

export const getTeamPerformanceGraph = async (c: Context) => {
  const { tournamentId, seasonId, teamId } = c.req.param();
  const data = await leagueService.getTeamPerformanceGraph(Number(tournamentId), Number(seasonId), Number(teamId), getLang(c));
  return c.json(data);
};

export const getMedia = async (c: Context) => {
  const { tournamentId } = c.req.param();
  const data = await leagueService.getMedia(Number(tournamentId), getLang(c));
  return c.json(data);
};

export const getTeamOfTheWeek = async (c: Context) => {
  const { tournamentId, seasonId, periodId } = c.req.param();
  const data = await leagueService.getTeamOfTheWeek(Number(tournamentId), Number(seasonId), Number(periodId), getLang(c));
  return c.json(data);
};

export const getTeamOfTheWeekPeriods = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  const data = await leagueService.getTeamOfTheWeekPeriods(Number(tournamentId), Number(seasonId), getLang(c));
  return c.json(data);
};

export const getPlayerOfTheSeasonRace = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  const data = await leagueService.getPlayerOfTheSeasonRace(Number(tournamentId), Number(seasonId), getLang(c));
  return c.json(data);
};

export const getVenues = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  const data = await leagueService.getVenues(Number(tournamentId), Number(seasonId), getLang(c));
  return c.json(data);
};

export const getStatisticsInfo = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  const data = await leagueService.getStatisticsInfo(Number(tournamentId), Number(seasonId), getLang(c));
  return c.json(data);
};

export const getStatistics = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  const type = c.req.query('type') as 'teams' | 'players' || 'players';
  const limit = Number(c.req.query('limit')) || 0;
  const offset = Number(c.req.query('offset')) || 0;
  const fields = c.req.query('fields') || '';
  const accumulation = c.req.query('accumulation') || 'total';

  const data = await leagueService.getStatistics(Number(tournamentId), Number(seasonId), type, limit, offset, fields, accumulation, getLang(c));
  return c.json(data);
};

export const getTeamStatisticsTypes = async (c: Context) => {
  const { tournamentId, seasonId } = c.req.param();
  return c.json(await leagueService.getTeamStatisticsTypes(Number(tournamentId), Number(seasonId), getLang(c)));
};

export const getTopTeams = async (c: Context) => {
  const { tournamentId, seasonId, type } = c.req.param();
  return c.json(await leagueService.getTopTeams(Number(tournamentId), Number(seasonId), type, getLang(c)));
};

export const getTranslationDescription = async (c: Context) => {
  const { id } = c.req.param();
  return c.json(await leagueService.getTranslationDescription(Number(id), getLang(c)));
};
