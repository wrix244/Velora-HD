import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wallpaperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallpaper',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per user-wallpaper pair
favoriteSchema.index({ userId: 1, wallpaperId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
