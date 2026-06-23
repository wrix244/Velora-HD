import express from 'express';
import {
  getWallpapers,
  getWallpaperBySlug,
  getTrendingWallpapers,
  getLatestWallpapers,
  getRelatedWallpapers,
  getRecentWallpapers,
  getRecommendedWallpapers,
} from '../controllers/wallpaperController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalProtect, getWallpapers);
router.get('/trending', getTrendingWallpapers);
router.get('/latest', getLatestWallpapers);
router.get('/recent', getRecentWallpapers);
router.get('/recommendations', getRecommendedWallpapers);
router.get('/slug/:slug', optionalProtect, getWallpaperBySlug);
router.get('/:id/related', getRelatedWallpapers);

export default router;
