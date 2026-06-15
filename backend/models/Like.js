import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
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
likeSchema.index({ userId: 1, wallpaperId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
