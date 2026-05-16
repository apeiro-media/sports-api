import { Hono } from 'hono';
import {
  liveController,
  todayController,
  scheduleController,
  tournamentRoundController,
} from '../controllers/events.controller';
import { graphController } from '../controllers/graph.controller';
import { tvGuideController } from '../controllers/tvguide.controller';

import {
  eventDetailController,
  incidentsController,
  bestPlayersController,
  aiInsightsController,
  h2hController,
  managersController,
  highlightsController,
  mediaSummaryController,
  tvChannelsController,
} from '../controllers/eventDetail.controller';

const events = new Hono();

events.get('/live', liveController);
events.get('/today', todayController);
events.get('/schedule/:date', scheduleController);
events.get('/tournament/:tournamentId/season/:seasonId/events/round/:round', tournamentRoundController);
events.get('/event/:eventId/graph', graphController);

events.get('/event/:eventId/detail',      eventDetailController);
events.get('/event/:eventId/incidents',    incidentsController);
events.get('/event/:eventId/best-players', bestPlayersController);
events.get('/event/:eventId/ai-insights/:lang', aiInsightsController);
events.get('/event/:eventId/h2h',          h2hController);
events.get('/event/:eventId/managers',     managersController);
events.get('/event/:eventId/highlights',   highlightsController);
events.get('/event/:eventId/media/:country', mediaSummaryController);
events.get('/tv/event/:eventId/channels',  tvChannelsController);
events.get('/tv/guide',                     tvGuideController);

export default events;
