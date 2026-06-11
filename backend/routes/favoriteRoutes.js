import express from 'express';
import { toggleFavorite, getFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // protect all favorite endpoints
router.route('/').get(getFavorites);
router.route('/toggle/:wallpaperId').post(toggleFavorite);

export default router;
