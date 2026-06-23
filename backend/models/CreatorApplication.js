import mongoose from 'mongoose';

const creatorApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      lowercase: true,
      trim: true,
    },
    portfolioLink: {
      type: String,
      default: '',
      trim: true,
    },
    wallpapers: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length >= 3 && val.length <= 5,
        'Application must contain between 3 and 5 wallpapers',
      ],
    },
    answers: {
      areOwnWallpapers: {
        type: Boolean,
        required: true,
      },
      ownRights: {
        type: Boolean,
        required: true,
      },
      soldElsewhere: {
        type: Boolean,
        required: true,
      },
      copyrightConfirmed: {
        type: Boolean,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionNotes: {
      type: String,
      default: '',
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CreatorApplication = mongoose.model('CreatorApplication', creatorApplicationSchema);
export default CreatorApplication;
