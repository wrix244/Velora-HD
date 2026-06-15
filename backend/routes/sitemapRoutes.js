import express from 'express';
import { getSitemap } from '../controllers/sitemapController.js';

const router = express.Router();

// Apply CORS & Cache control headers for Edge caching (1 hour)
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'public, max-age=3600');
  next();
});

router.get('/', getSitemap);

export default router;
