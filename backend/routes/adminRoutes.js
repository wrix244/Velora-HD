import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/auth.js';
import {
  getDashboardAnalytics,
  getUsersList,
  getPurchasesList,
  getDownloadsList,
} from '../controllers/analyticsController.js';
import {
  createWallpaper,
  updateWallpaper,
  deleteWallpaper,
  getAdminWallpapers,
  deleteUser,
  banUser,
} from '../controllers/adminController.js';

const router = express.Router();

// Configure Multer for memory uploads
const storage = multer.memoryStorage();

// File validation
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
  limits: { fileSize: 100 * 1024 * 1024 }, // limit to 100MB for video wallpaper support
});

const uploadFields = upload.fields([
  { name: 'previewImage', maxCount: 1 },
  { name: 'downloadFile', maxCount: 1 },
]);

// Apply protect & admin middlewares to all admin routes
router.use(protect);
router.use(admin);

// Analytics & Reports
router.get('/analytics', getDashboardAnalytics);
router.get('/users', getUsersList);
router.get('/purchases', getPurchasesList);
router.get('/downloads', getDownloadsList);

// Wallpaper CRUD
router.get('/wallpapers', getAdminWallpapers);
router.post('/wallpapers', uploadFields, createWallpaper);
router.put('/wallpapers/:id', uploadFields, updateWallpaper);
router.delete('/wallpapers/:id', deleteWallpaper);

// User Management
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', banUser);

export default router;
