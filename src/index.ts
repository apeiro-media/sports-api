import { Hono } from 'hono';
import type { Context } from 'hono';
import { cors } from 'hono/cors';

import { registry } from './providers/registry';
import { FootballProvider } from './providers/sofascore';

import eventsRouter from './routes/events';
import imagesRouter from './routes/images';
import matchesRouter from './routes/matches';
import discoverRouter from './routes/discover';
import { leagueRouter } from './routes/league';
import { teamRouter } from './routes/team';

// ─── Register providers ──────────────────────────────────────────────────────
// Add new providers here:
//   registry.register(new ApiFootballProvider());
//   registry.register(new SportRadarProvider());
registry.register(new FootballProvider(), true);

const app = new Hono();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Accept', 'Accept-Language', 'If-None-Match'],
  maxAge: 86400,
}));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (c: Context) => c.json({
  status: 'ok',
  service: 'jawla-api',
  version: '2.0.0',
  providers: registry.listNames(),
}));

// Mount sub-routers
app.route('/api/sports/football', eventsRouter);
app.route('/api/sports/football/matches', matchesRouter);
app.route('/api/sports/football/img', imagesRouter);
app.route('/api/sports/football/discover', discoverRouter);
app.route('/api/sports/football/league', leagueRouter);
app.route('/api/sports/football/team', teamRouter);

export default app;
