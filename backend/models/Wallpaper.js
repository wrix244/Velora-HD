import mongoose from 'mongoose';

const wallpaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    type: {
      type: String,
      enum: ['static', 'live'],
      default: 'static',
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile'],
      default: 'desktop',
    },
    resolution: {
      type: String,
      required: [true, 'Please specify the resolution'],
    },
    previewImage: {
      type: String,
      required: [true, 'Please provide a preview image URL or path'],
    },
    downloadFile: {
      type: String,
      required: [true, 'Please provide the high-resolution file URL or path'],
    },
    price: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Default is approved for backwards-compatibility
    },
    rejectionNotes: {
      type: String,
      default: '',
    },
    creatorAcceptedCopyright: {
      type: Boolean,
      default: false,
    },
    copyrightAcceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique slug before save
wallpaperSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    let baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const suffix = Math.random().toString(36).substring(2, 7);
    this.slug = `${baseSlug}-${suffix}`;
  }
  next();
});

const Wallpaper = mongoose.model('Wallpaper', wallpaperSchema);
export default Wallpaper;
