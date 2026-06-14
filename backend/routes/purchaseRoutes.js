import express from 'express';
import { checkout, getPurchaseHistory, adUnlock } from '../controllers/purchaseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // protect all purchase endpoints
router.post('/checkout', checkout);
router.post('/ad-unlock', adUnlock);
router.get('/history', getPurchaseHistory);

export default router;
