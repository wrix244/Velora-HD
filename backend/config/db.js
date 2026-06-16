import mongoose from 'mongoose';
import Category from '../models/Category.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/velorahd');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed initial categories if empty
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        'Nature', 'Space', 'Cyberpunk', 'Anime', 'Cars',
        'Gaming', 'Minimal', 'Abstract', 'Fantasy',
        'Technology', 'Architecture'
      ];
      await Category.insertMany(defaultCategories.map(name => ({ name })));
      console.log('Default categories seeded successfully.');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
