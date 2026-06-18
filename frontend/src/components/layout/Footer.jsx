import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles } from 'lucide-react';
import useUIStore from '../../store/uiStore';

export default function Footer() {
  const addToast = useUIStore((state) => state.addToast);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-surface border-t border-border relative z-10 pt-16 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/favicon.png" 
                alt="VeloraHD Logo" 
                className="w-7 h-7 rounded object-contain bg-black border border-border" 
              />
              <span className="font-display font-black text-base tracking-tight text-white">
                Velora<span className="text-primary">HD</span>
              </span>
            </Link>
            <p className="text-text-muted leading-relaxed max-w-sm">
              Premium content-first digital art and wallpaper marketplace. Transform every screen into art with high-fidelity curated collections.
            </p>
          </div>

          {/* Column 2: Curated Collections */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-[10px] text-white tracking-widest uppercase">
              Curated
            </h4>
            <ul className="space-y-2 text-text-muted">
              <li><Link to="/explore?category=Minimal" className="hover:text-white transition-colors">Minimal Art</Link></li>
              <li><Link to="/explore?category=Space" className="hover:text-white transition-colors">Cosmic Scenery</Link></li>
              <li><Link to="/explore?category=Nature" className="hover:text-white transition-colors">Nature Film</Link></li>
              <li><Link to="/explore?category=Cyberpunk" className="hover:text-white transition-colors">Cyberpunk Neon</Link></li>
            </ul>
          </div>

          {/* Column 3: Formats & Info */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-[10px] text-white tracking-widest uppercase">
              Formats
            </h4>
            <ul className="space-y-2 text-text-muted">
              <li><Link to="/explore?deviceType=desktop" className="hover:text-white transition-colors">PC Wallpapers</Link></li>
              <li><Link to="/explore?deviceType=mobile" className="hover:text-white transition-colors">Mobile Screens</Link></li>
              <li><Link to="/explore?type=live" className="hover:text-white transition-colors">Live Video loops</Link></li>
              <li><Link to="/explore?isPremium=true" className="hover:text-white transition-colors">Premium Collection</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-[10px] text-white tracking-widest uppercase">
              Stay Informed
            </h4>
            <p className="text-text-muted leading-relaxed">
              Subscribe to receive new artwork alerts and curated collection highlight updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Enter your email to subscribe"
                  className="w-full pl-9 pr-3 py-1.5 text-xs clean-input"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-xs transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright & link compliance bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-text-muted">
          <p>
            © {new Date().getFullYear()} Velora HD. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link to="/about" className="hover:text-white transition-colors font-semibold">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors font-semibold">Contact</Link>
            <Link to="/faq" className="hover:text-white transition-colors font-semibold">FAQ & Safety</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/refunds" className="hover:text-white transition-colors">Refunds</Link>
            <Link to="/ai-policy" className="hover:text-white transition-colors">AI Policy</Link>
            <Link to="/copyright" className="hover:text-white transition-colors">Copyright</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
