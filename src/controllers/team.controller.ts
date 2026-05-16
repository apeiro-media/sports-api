import { Context } from 'hono';
import { teamService } from '../services/team.service';

function getLang(c: Context) {
  return c.req.query('lang') || 'en';
}

export const getTeamInfo = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getTeamInfo(Number(teamId), getLang(c)));
};

export const getSquad = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getSquad(Number(teamId), getLang(c)));
};

export const getRanking = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getRanking(Number(teamId), getLang(c)));
};

export const getUniqueTournaments = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getUniqueTournaments(Number(teamId), getLang(c)));
};

export const getAllUniqueTournaments = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getAllUniqueTournaments(Number(teamId), getLang(c)));
};

export const getTransfers = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getTransfers(Number(teamId), getLang(c)));
};

export const getAchievements = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getAchievements(Number(teamId), getLang(c)));
};

export const getTeamStatisticsSeasons = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getTeamStatisticsSeasons(Number(teamId), getLang(c)));
};

export const getPlayerStatisticsSeasons = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getPlayerStatisticsSeasons(Number(teamId), getLang(c)));
};

export const getStandingsSeasons = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getStandingsSeasons(Number(teamId), getLang(c)));
};

export const getSeasonStatistics = async (c: Context) => {
  const { teamId, uniqueTournamentId, seasonId } = c.req.param();
  return c.json(
    await teamService.getSeasonStatistics(
      Number(teamId),
      Number(uniqueTournamentId),
      Number(seasonId),
      getLang(c),
    ),
  );
};

export const getNextEvents = async (c: Context) => {
  const { teamId, page } = c.req.param();
  return c.json(await teamService.getNextEvents(Number(teamId), Number(page)));
};

export const getLastEvents = async (c: Context) => {
  const { teamId, page } = c.req.param();
  return c.json(await teamService.getLastEvents(Number(teamId), Number(page)));
};

export const getFeaturedEvent = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getFeaturedEvent(Number(teamId), getLang(c)));
};

export const getPerformance = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getPerformance(Number(teamId), getLang(c)));
};

export const getMediaSummary = async (c: Context) => {
  const { teamId } = c.req.param();
  const country = c.req.query('country') || 'MA';
  return c.json(await teamService.getMediaSummary(Number(teamId), country, getLang(c)));
};

export const getVideos = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getVideos(Number(teamId), getLang(c)));
};

export const getOfficialTweets = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getOfficialTweets(Number(teamId), getLang(c)));
};

export const getNews = async (c: Context) => {
  const { teamId } = c.req.param();
  const page = Number(c.req.query('page')) || 1;
  const perPage = Number(c.req.query('per_page')) || 12;
  return c.json(await teamService.getNews(Number(teamId), getLang(c), page, perPage));
};

export const getSeo = async (c: Context) => {
  const { teamId } = c.req.param();
  return c.json(await teamService.getSeo(Number(teamId), getLang(c)));
};
