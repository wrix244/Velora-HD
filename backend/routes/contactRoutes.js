import express from 'express';
import { sendContactEmail, sendDmcaEmail } from '../controllers/contactController.js';

const router = express.Router();

// Route: POST /api/contact
router.post('/', sendContactEmail);

// Route: POST /api/contact/dmca
router.post('/dmca', sendDmcaEmail);

export default router;
