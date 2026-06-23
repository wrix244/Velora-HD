import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.js';
import {
  applyToBecomeCreator,
  getApplicationStatus,
  cancelCreatorApplication,
  creatorUploadWallpaper,
  getCreatorWallpapers,
  updateCreatorWallpaper,
  deleteCreatorWallpaper,
} from '../controllers/creatorController.js';

const router = express.Router();

// Multer in-memory storage config
const storage = multer.memoryStorage();

// File check
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif|mp4|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images and Videos only!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // limit to 100MB
});

const uploadAppFiles = upload.array('wallpapers', 5);
const uploadWallpaperFields = upload.fields([
  { name: 'previewImage', maxCount: 1 },
  { name: 'downloadFile', maxCount: 1 },
]);

// Apply authentication middleware to all endpoints
router.use(protect);

// Application endpoints
router.post('/apply', uploadAppFiles, applyToBecomeCreator);
router.get('/application-status', getApplicationStatus);
router.delete('/apply', cancelCreatorApplication);

// Creator Dashboard endpoints
router.post('/upload', uploadWallpaperFields, creatorUploadWallpaper);
router.get('/wallpapers', getCreatorWallpapers);
router.put('/wallpapers/:id', uploadWallpaperFields, updateCreatorWallpaper);
router.delete('/wallpapers/:id', deleteCreatorWallpaper);

export default router;
