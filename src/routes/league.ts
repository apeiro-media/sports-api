import { Hono } from 'hono';
import * as leagueController from '../controllers/league.controller';

const router = new Hono();

router.get('/:tournamentId', leagueController.getTournament);
router.get('/:tournamentId/season/:seasonId/rounds', leagueController.getRounds);
router.get('/:tournamentId/season/:seasonId/events/round/:round', leagueController.getTournamentRoundEvents);
router.get('/:tournamentId/season/:seasonId/standings/:type', leagueController.getStandings);
router.get('/:tournamentId/season/:seasonId/team-events/:type', leagueController.getTeamEvents);
router.get('/:tournamentId/season/:seasonId/team/:teamId/team-performance-graph-data', leagueController.getTeamPerformanceGraph);
router.get('/:tournamentId/media', leagueController.getMedia);
router.get('/:tournamentId/season/:seasonId/team-of-the-week/:periodId', leagueController.getTeamOfTheWeek);
router.get('/:tournamentId/season/:seasonId/team-of-the-week/periods', leagueController.getTeamOfTheWeekPeriods);
router.get('/:tournamentId/season/:seasonId/player-of-the-season-race', leagueController.getPlayerOfTheSeasonRace);
router.get('/:tournamentId/season/:seasonId/venues', leagueController.getVenues);
router.get('/:tournamentId/season/:seasonId/statistics/info', leagueController.getStatisticsInfo);
router.get('/:tournamentId/season/:seasonId/statistics', leagueController.getStatistics);
router.get('/:tournamentId/season/:seasonId/team-statistics/types', leagueController.getTeamStatisticsTypes);
router.get('/:tournamentId/season/:seasonId/top-teams/:type', leagueController.getTopTeams);
router.get('/translation/description/:id', leagueController.getTranslationDescription);

export { router as leagueRouter };
