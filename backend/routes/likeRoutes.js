import express from 'express';
import { toggleLike, getLikes } from '../controllers/likeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // protect all like endpoints
router.route('/').get(getLikes);
router.route('/toggle/:wallpaperId').post(toggleLike);

export default router;
