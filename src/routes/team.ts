import { Hono } from 'hono';
import * as teamController from '../controllers/team.controller';

const router = new Hono();

// ─── Core team info ───────────────────────────────────────────────────────────
router.get('/:teamId',                                                          teamController.getTeamInfo);
router.get('/:teamId/players',                                                  teamController.getSquad);
router.get('/:teamId/rankings',                                                 teamController.getRanking);
router.get('/:teamId/unique-tournaments',                                       teamController.getUniqueTournaments);
router.get('/:teamId/unique-tournaments/all',                                   teamController.getAllUniqueTournaments);
router.get('/:teamId/transfers',                                                teamController.getTransfers);
router.get('/:teamId/achievements',                                             teamController.getAchievements);

// ─── Statistics & standings seasons ──────────────────────────────────────────
router.get('/:teamId/team-statistics/seasons',                                  teamController.getTeamStatisticsSeasons);
router.get('/:teamId/player-statistics/seasons',                                teamController.getPlayerStatisticsSeasons);
router.get('/:teamId/standings/seasons',                                        teamController.getStandingsSeasons);
router.get('/:teamId/tournament/:uniqueTournamentId/season/:seasonId/statistics', teamController.getSeasonStatistics);

// ─── Matches ──────────────────────────────────────────────────────────────────
router.get('/:teamId/events/next/:page',                                        teamController.getNextEvents);
router.get('/:teamId/events/last/:page',                                        teamController.getLastEvents);
router.get('/:teamId/featured-event',                                           teamController.getFeaturedEvent);

// ─── Performance ──────────────────────────────────────────────────────────────
router.get('/:teamId/performance',                                              teamController.getPerformance);

// ─── Media & social ───────────────────────────────────────────────────────────
router.get('/:teamId/media/summary',                                            teamController.getMediaSummary);
router.get('/:teamId/media/videos',                                             teamController.getVideos);
router.get('/:teamId/official-tweets',                                          teamController.getOfficialTweets);
router.get('/:teamId/news',                                                     teamController.getNews);
router.get('/:teamId/seo',                                                      teamController.getSeo);

export { router as teamRouter };
