import { Hono } from 'hono';
import { matchesController } from '../controllers/matches.controller';

const matches = new Hono();

matches.get('/', matchesController);

export default matches;
