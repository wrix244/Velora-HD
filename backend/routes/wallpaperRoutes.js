import express from 'express';
import {
  getWallpapers,
  getWallpaperBySlug,
  getTrendingWallpapers,
  getLatestWallpapers,
  getRelatedWallpapers,
} from '../controllers/wallpaperController.js';

const router = express.Router();

router.get('/', getWallpapers);
router.get('/trending', getTrendingWallpapers);
router.get('/latest', getLatestWallpapers);
router.get('/slug/:slug', getWallpaperBySlug);
router.get('/:id/related', getRelatedWallpapers);

export default router;
