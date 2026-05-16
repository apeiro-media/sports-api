import { registry } from '../providers/registry';
import {
  transformTeamInfo,
  transformSquad,
  transformTransfers,
  transformAchievements,
  transformRanking,
  transformPerformance,
  transformTeamEvents,
  transformTeamMedia,
  transformTeamTweets,
} from '../transformers/teamTransformer';

class TeamService {
  private get provider() {
    return registry.getDefault();
  }

  // ─── Core team info ───────────────────────────────────────────────────────

  async getTeamInfo(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}`, lang);
    return transformTeamInfo(raw);
  }

  async getSquad(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/players`, lang);
    return transformSquad(raw);
  }

  async getRanking(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/rankings`, lang);
    return transformRanking(raw);
  }

  async getUniqueTournaments(teamId: number, lang: string) {
    return this.provider.getLeagueData(`/team/${teamId}/unique-tournaments`, lang);
  }

  async getAllUniqueTournaments(teamId: number, lang: string) {
    return this.provider.getLeagueData(`/team/${teamId}/unique-tournaments/all`, lang);
  }

  async getTransfers(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/transfers`, lang);
    return transformTransfers(raw as any, teamId);
  }

  async getAchievements(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/achievements`, lang);
    return transformAchievements(raw);
  }

  // ─── Statistics & standings seasons ──────────────────────────────────────

  async getTeamStatisticsSeasons(teamId: number, lang: string) {
    return this.provider.getLeagueData(`/team/${teamId}/team-statistics/seasons`, lang);
  }

  async getPlayerStatisticsSeasons(teamId: number, lang: string) {
    return this.provider.getLeagueData(`/team/${teamId}/player-statistics/seasons`, lang);
  }

  async getStandingsSeasons(teamId: number, lang: string) {
    return this.provider.getLeagueData(`/team/${teamId}/standings/seasons`, lang);
  }

  async getSeasonStatistics(teamId: number, uniqueTournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(
      `/team/${teamId}/unique-tournament/${uniqueTournamentId}/season/${seasonId}/statistics/overall`,
      lang,
    );
  }

  // ─── Matches ──────────────────────────────────────────────────────────────

  async getNextEvents(teamId: number, page: number) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/events/next/${page}`);
    return transformTeamEvents(raw);
  }

  async getLastEvents(teamId: number, page: number) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/events/last/${page}`);
    return transformTeamEvents(raw);
  }

  async getFeaturedEvent(teamId: number, lang: string) {
    return this.provider.getLeagueData(`/team/${teamId}/featured-event`, lang);
  }

  // ─── Performance ──────────────────────────────────────────────────────────

  async getPerformance(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/performance`, lang);
    return transformPerformance(raw, teamId);
  }

  // ─── Media ────────────────────────────────────────────────────────────────

  async getMediaSummary(teamId: number, country: string, lang: string) {
    const raw = await this.provider.getLeagueData(
      `/team/${teamId}/media/summary/country/${country.toUpperCase()}`,
      lang,
    );
    return transformTeamMedia(raw);
  }

  async getVideos(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/media/videos`, lang);
    return transformTeamMedia(raw);
  }

  async getOfficialTweets(teamId: number, lang: string) {
    const raw = await this.provider.getLeagueData(`/team/${teamId}/official-tweets`, lang);
    return transformTeamTweets(raw);
  }

  async getNews(teamId: number, lang: string, page: number, perPage: number) {
    const cleanLang = lang.split(',')[0].split(';')[0].trim() || 'en';
    return this.provider.getLeagueData(
      `/sofascore-news/${cleanLang}/posts?page=${page}&per_page=${perPage}&team_ids=${teamId}`,
      lang,
    );
  }

  async getSeo(teamId: number, lang: string) {
    const cleanLang = lang.split(',')[0].split(';')[0].trim() || 'en';
    return this.provider.getLeagueData(`/seo/content/team/${teamId}/${cleanLang}`, lang);
  }
}

export const teamService = new TeamService();
