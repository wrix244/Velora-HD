import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // allows anonymous downloads for free items if user is not logged in
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

const Download = mongoose.model('Download', downloadSchema);
export default Download;
