import express from 'express';
import { recordDownload, getDownloadHistory } from '../controllers/downloadController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:wallpaperId', optionalProtect, recordDownload);
router.get('/history', protect, getDownloadHistory);

export default router;
