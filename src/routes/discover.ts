import { Hono } from 'hono';
import {
  scheduledTournamentsController,
  trendingPlayersController,
  newsFeedController,
  featuredEventsController,
  topTournamentsController,
  countrySportPrioritiesController,
  tournamentSeasonsController,
} from '../controllers/discover.controller';

const discover = new Hono();

// GET /api/sports/discover/scheduled-tournaments/:sport/:date?page=1
discover.get('/scheduled-tournaments/:sport/:date', scheduledTournamentsController);

// GET /api/sports/discover/trending-players/:sport
discover.get('/trending-players/:sport', trendingPlayersController);

// GET /api/sports/discover/news?page=1&per_page=12
discover.get('/news', newsFeedController);

// GET /api/sports/discover/featured-events/:sport
discover.get('/featured-events/:sport', featuredEventsController);

// GET /api/sports/discover/top-tournaments/:country/:sport
discover.get('/top-tournaments/:country/:sport', topTournamentsController);

// GET /api/sports/discover/country-priorities/:country
discover.get('/country-priorities/:country', countrySportPrioritiesController);

// GET /api/sports/discover/tournament-seasons/:tournamentId
discover.get('/tournament-seasons/:tournamentId', tournamentSeasonsController);

export default discover;
