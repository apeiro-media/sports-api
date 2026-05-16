import { Hono } from 'hono';
import { imageProxyController } from '../controllers/images.controller';

const images = new Hono();

images.get('/:type/:id', imageProxyController);

export default images;
