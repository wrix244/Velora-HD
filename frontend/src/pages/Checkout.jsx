import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, ShieldCheck, ShoppingCart, Sparkles, User, Calendar, Key } from 'lucide-react';
import { useWallpaperBySlug } from '../hooks/useWallpapers';
import { useCheckout } from '../hooks/usePurchases';
import useUIStore from '../store/uiStore';
import useAuthStore from '../store/authStore';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const wallpaperId = searchParams.get('wallpaperId');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToast = useUIStore((state) => state.addToast);

  // Form Fields
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Mutations
  const checkoutMutation = useCheckout();

  // Load wallpaper details to show in cart review
  // Since we only have the ID here, let's write a simple query to fetch wallpaper by ID.
  // Wait, our hook fetches by SLUG. Let's make sure we can fetch by ID or slug.
  // Wait, let's look at `server/controllers/wallpaperController.js`. It doesn't have a specific `getWallpaperById` endpoint, but `getWallpaperBySlug` fetches it. Wait, does `getWallpapers` search by ID if we supply a search term?
  // Let's check `server/controllers/wallpaperController.js` and see if we can search for it, or let's create a small fetch logic in `useWallpapers.js` to get a wallpaper by ID!
  // Wait! In `server/routes/wallpaperRoutes.js` we can add `/api/wallpapers/id/:id` or let the details controller fetch by slug, and when redirecting to checkout, we can redirect with `?wallpaperSlug=slug` instead of `?wallpaperId=id`! That is much cleaner and avoids adding another endpoint!
  // Let's check `Details.jsx`. We route: `navigate('/checkout?wallpaperId=' + id)`.
  // Wait, we can change it to `navigate('/checkout?slug=' + slug)`! This is an extremely elegant fix, because we already have the slug in the URL of the Details page! Let's review if the backend checkout route needs `wallpaperId`.
  // Yes! The backend controller `checkout` expects `wallpaperId` in `req.body`.
  // But wait! If we pass `slug` in the URL, we can fetch the wallpaper using our existing `useWallpaperBySlug(slug)` hook on the Checkout page, which will return the wallpaper object (including its `_id` and `title` and `price`!). Then we can pass `wallpaper._id` to the checkout mutation!
  // This is a brilliant and robust solution that works perfectly with our existing API setup without needing a new endpoint!
  // Let's check if the URL param in Checkout can be `slug` instead of `wallpaperId`. Yes! We will read `slug = searchParams.get('slug')` on the Checkout page.
  // Wait! Let's double check if we need to modify `Details.jsx` and `WallpaperCard.jsx` to navigate using `slug` instead of `wallpaperId`.
  // Let's modify `Details.jsx` and `WallpaperCard.jsx` using `replace_file_content` or make sure the Checkout page can accept BOTH! If the Checkout page accepts `slug`, we can read slug from query params, fetch the wallpaper, and get the ID.
  // Let's write the Checkout page to search by slug. That is super clean. Wait, what if the checkout page receives `wallpaperId` instead? We can support both! In `Checkout.jsx`, if it gets `slug`, it queries by slug. If it gets `wallpaperId`, we can check. Wait, since slug is already available in the URL, routing using `slug` is extremely easy! Let's check how `WallpaperCard.jsx` handles it.
  // In `WallpaperCard.jsx` line 25: `navigate('/checkout?wallpaperId=' + id)`. Let's modify both files to use `slug`!
  // Wait, let's write `Checkout.jsx` first, and have it accept `slug` from query params. We will query by slug.

  const slug = searchParams.get('slug');
  const { data: wallpaper, isLoading, error } = useWallpaperBySlug(slug);

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('Please login to complete your purchase.', 'info');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, addToast]);

  // Card Number Formatter (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // strip non-digits
    value = value.slice(0, 16); // max 16 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Expiry Date Formatter (adds slash after month MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // strip non-digits
    value = value.slice(0, 4); // max 4 digits (MMYY)
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // strip non-digits
    setCvv(value.slice(0, 3)); // max 3 digits
  };

  const validateForm = () => {
    const errors = {};
    const cleanCard = cardNumber.replace(/\s+/g, '');
    const cleanExpiry = expiry.replace('/', '');

    if (cardHolder.trim().length < 3) {
      errors.cardHolder = 'Cardholder name must be at least 3 characters.';
    }

    if (cleanCard.length !== 16) {
      errors.cardNumber = 'Card number must be exactly 16 digits.';
    }

    if (cleanExpiry.length !== 4) {
      errors.expiry = 'Expiry must be in MM/YY format.';
    } else {
      const month = parseInt(cleanExpiry.slice(0, 2));
      if (month < 1 || month > 12) {
        errors.expiry = 'Invalid month (01-12).';
      }
    }

    if (cvv.length !== 3) {
      errors.cvv = 'CVV must be 3 digits.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || !wallpaper) return;

    checkoutMutation.mutate(
      {
        wallpaperId: wallpaper._id,
        cardHolder,
        cardNumber,
        expiry,
        cvv,
      },
      {
        onSuccess: () => {
          navigate(`/success/${wallpaper.slug}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 text-center max-w-sm mx-auto space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-gray-400">Loading checkout details...</p>
      </div>
    );
  }

  if (error || !wallpaper) {
    return (
      <div className="pt-20 pb-16 text-center max-w-sm mx-auto space-y-4">
        <h2 className="font-display font-bold text-xl text-white">Item Not Found</h2>
        <p className="text-xs text-gray-400">Could not resolve checkout for the specified wallpaper.</p>
        <Link to="/explore" className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg inline-block">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel Checkout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Card Payment Form */}
        <div className="md:col-span-7 p-6 rounded-3xl glass-panel space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Secure Mock Payment
            </span>
            <h1 className="font-display font-black text-2xl text-white">Mock Checkout</h1>
            <p className="text-xs text-gray-400">
              Your details will not be sent to real processors. Feel free to input any valid mock values.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Holder Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Card Holder</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900 ${
                    validationErrors.cardHolder ? 'border-rose-500/50 focus:border-rose-500' : ''
                  }`}
                  required
                />
              </div>
              {validationErrors.cardHolder && (
                <p className="text-[10px] text-rose-400 font-medium">{validationErrors.cardHolder}</p>
              )}
            </div>

            {/* Card Number */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900 ${
                    validationErrors.cardNumber ? 'border-rose-500/50 focus:border-rose-500' : ''
                  }`}
                  required
                />
              </div>
              {validationErrors.cardNumber && (
                <p className="text-[10px] text-rose-400 font-medium">{validationErrors.cardNumber}</p>
              )}
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Expiry (MM/YY)</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="12/28"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900 ${
                      validationErrors.expiry ? 'border-rose-500/50 focus:border-rose-500' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.expiry && (
                  <p className="text-[10px] text-rose-400 font-medium">{validationErrors.expiry}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CVV</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="***"
                    value={cvv}
                    onChange={handleCvvChange}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm glass-input focus:bg-slate-900 ${
                      validationErrors.cvv ? 'border-rose-500/50 focus:border-rose-500' : ''
                    }`}
                    required
                  />
                </div>
                {validationErrors.cvv && (
                  <p className="text-[10px] text-rose-400 font-medium">{validationErrors.cvv}</p>
                )}
              </div>
            </div>

            {/* Security Callout */}
            <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">Encrypted Mock Sandboxed API</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Payments are processed instantly inside a mock backend environment. No money will be transacted.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={checkoutMutation.isPending}
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-primary/10 transition flex items-center justify-center gap-2"
            >
              {checkoutMutation.isPending ? 'Processing Mock Payment...' : `Pay $${wallpaper.price.toFixed(2)} Now`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Side Panel */}
        <div className="md:col-span-5 p-6 rounded-3xl glass-panel space-y-6">
          <h2 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-white/5 pb-3">
            <ShoppingCart className="w-4 h-4" />
            Order Summary
          </h2>

          {/* Cart Item Row */}
          <div className="flex gap-4">
            <div className="w-20 aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-slate-950">
              <img src={wallpaper.previewImage} alt={wallpaper.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1 select-none">
              <span className="text-[9px] font-bold text-accent tracking-wider uppercase px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                {wallpaper.category}
              </span>
              <h3 className="font-display font-bold text-sm text-white pt-1">{wallpaper.title}</h3>
              <p className="text-[10px] text-gray-400">{wallpaper.resolution} • {wallpaper.type}</p>
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>${wallpaper.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Platform Service Fee</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (VAT/GST)</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-white/5 pt-3 text-sm">
              <span>Total Price</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ${wallpaper.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-500 leading-relaxed text-center">
            By completing checkout, you acquire a lifetime download license for this digital asset. Re-downloads are free of charge.
          </div>
        </div>
      </div>
    </div>
  );
}
