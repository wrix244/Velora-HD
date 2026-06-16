import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getCategories, createCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);

export default router;
