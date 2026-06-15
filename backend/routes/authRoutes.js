import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  googleLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.route('/me').get(protect, getUserProfile);
router.route('/profile')
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

export default router;
