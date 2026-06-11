import Purchase from '../models/Purchase.js';
import Wallpaper from '../models/Wallpaper.js';

// @desc    Mock checkout purchase
// @route   POST /api/purchases/checkout
// @access  Private
export const checkout = async (req, res) => {
  try {
    const { wallpaperId, cardHolder, cardNumber, expiry, cvv } = req.body;
    const userId = req.user._id;

    // Validate request
    if (!wallpaperId || !cardHolder || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Find wallpaper
    const wallpaper = await Wallpaper.findById(wallpaperId);
    if (!wallpaper) {
      return res.status(404).json({ success: false, message: 'Wallpaper not found' });
    }

    if (!wallpaper.isPremium) {
      return res.status(400).json({ success: false, message: 'This is a free wallpaper, no purchase needed' });
    }

    // Check if already purchased
    const alreadyPurchased = await Purchase.findOne({ userId, wallpaperId });
    if (alreadyPurchased) {
      return res.status(400).json({ success: false, message: 'You have already purchased this wallpaper' });
    }

    // Mock Validation logic
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanCardNumber)) {
      return res.status(400).json({ success: false, message: 'Card number must be 16 digits' });
    }

    if (cardHolder.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Please enter a valid cardholder name' });
    }

    if (!/^\d{3}$/.test(cvv)) {
      return res.status(400).json({ success: false, message: 'CVV must be 3 digits' });
    }

    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      return res.status(400).json({ success: false, message: 'Expiry must be in MM/YY format' });
    }

    // Successful payment mock -> Create Purchase Record
    const purchase = await Purchase.create({
      userId,
      wallpaperId,
      amount: wallpaper.price || 4.99,
    });

    res.status(201).json({
      success: true,
      message: 'Payment mock successful! Wallpaper purchased.',
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user purchase history
// @route   GET /api/purchases/history
// @access  Private
export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const purchases = await Purchase.find({ userId })
      .populate('wallpaperId')
      .sort({ createdAt: -1 });

    // Filter out deleted wallpapers
    const filteredPurchases = purchases.filter((p) => p.wallpaperId !== null);

    res.json({ success: true, data: filteredPurchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
