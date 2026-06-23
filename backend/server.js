import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/auth.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import wallpaperRoutes from './routes/wallpaperRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import sitemapRoutes from './routes/sitemapRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Ensure uploads folder exists
const __dirname = path.resolve();
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sitemap Routes (mounted first to allow indexing)
app.use('/api/sitemap.xml', sitemapRoutes);
app.use('/sitemap.xml', sitemapRoutes);

// Global noindex middleware for other API routes
app.use('/api', (req, res, next) => {
  res.header('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallpapers', wallpaperRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/categories', categoryRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Velora HD Server is healthy and running' });
});

// Serve frontend build static files in production if needed, or let them run separately
// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
