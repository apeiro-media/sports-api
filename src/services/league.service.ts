import { registry } from '../providers/registry';

class LeagueService {
  private get provider() {
    return registry.getDefault();
  }

  async getTournament(tournamentId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}`, lang);
  }

  async getRounds(tournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/rounds`, lang);
  }

  async getStandings(tournamentId: number, seasonId: number, type: 'total' | 'home' | 'away', lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/standings/${type}`, lang);
  }

  async getTeamEvents(tournamentId: number, seasonId: number, type: string, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/team-events/${type}`, lang);
  }

  async getTeamPerformanceGraph(tournamentId: number, seasonId: number, teamId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/team/${teamId}/team-performance-graph-data`, lang);
  }

  async getMedia(tournamentId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/media`, lang);
  }

  async getTeamOfTheWeek(tournamentId: number, seasonId: number, periodId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/team-of-the-week/${periodId}`, lang);
  }

  async getTeamOfTheWeekPeriods(tournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/team-of-the-week/periods`, lang);
  }

  async getPlayerOfTheSeasonRace(tournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/player-of-the-season-race`, lang);
  }

  async getVenues(tournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/venues`, lang);
  }

  async getStatisticsInfo(tournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/statistics/info`, lang);
  }

  async getStatistics(tournamentId: number, seasonId: number, type: 'teams' | 'players', limit: number, offset: number, fields: string, accumulation: string, lang: string) {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (offset) queryParams.append('offset', offset.toString());
    if (fields) queryParams.append('fields', fields);
    if (accumulation) queryParams.append('accumulation', accumulation);

    const queryStr = queryParams.toString();
    const path = `/unique-tournament/${tournamentId}/season/${seasonId}/statistics?type=${type}${queryStr ? `&${queryStr}` : ''}`;
    return this.provider.getLeagueData(path, lang);
  }

  async getTeamStatisticsTypes(tournamentId: number, seasonId: number, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/team-statistics/types`, lang);
  }

  async getTopTeams(tournamentId: number, seasonId: number, type: string, lang: string) {
    return this.provider.getLeagueData(`/unique-tournament/${tournamentId}/season/${seasonId}/top-teams/${type}`, lang);
  }

  async getTranslationDescription(id: number, lang: string) {
    const cleanLang = lang.split(',')[0].split(';')[0].trim() || 'en';
    return this.provider.getLeagueData(`/translation/description/${id}/language/${cleanLang}`, lang);
  }
}

export const leagueService = new LeagueService();
