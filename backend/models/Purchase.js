import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
