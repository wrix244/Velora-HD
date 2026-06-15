import express from 'express';
import { recordDownload, getDownloadHistory } from '../controllers/downloadController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:wallpaperId', protect, recordDownload);
router.get('/history', protect, getDownloadHistory);

export default router;
