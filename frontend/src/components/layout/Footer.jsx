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
    <footer className="bg-[#0D0D0D] border-t border-white/5 relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                <span className="font-display font-black text-white text-xs">DL</span>
              </div>
              <span className="font-display font-black text-lg tracking-tight text-white">
                Dream<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Lens</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Transform every screen into art. Discover, download, and purchase premium cinematically styled wallpapers and interactive live motion files.
            </p>
            <div className="flex gap-3 text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-4 tracking-wide uppercase">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/explore?category=Nature" className="hover:text-white transition-colors">Nature Film</Link></li>
              <li><Link to="/explore?category=Space" className="hover:text-white transition-colors">Cosmos & Space</Link></li>
              <li><Link to="/explore?category=Cyberpunk" className="hover:text-white transition-colors">Cyberpunk Neon</Link></li>
              <li><Link to="/explore?category=Anime" className="hover:text-white transition-colors">Anime Scenery</Link></li>
              <li><Link to="/explore?category=Minimal" className="hover:text-white transition-colors">Minimal Art</Link></li>
            </ul>
          </div>

          {/* Column 3: Devices */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-4 tracking-wide uppercase">
              Formats
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/explore?deviceType=mobile" className="hover:text-white transition-colors">Mobile Wallpapers</Link></li>
              <li><Link to="/explore?deviceType=desktop" className="hover:text-white transition-colors">PC Wallpapers</Link></li>
              <li><Link to="/explore?type=live" className="hover:text-white transition-colors">Live Wallpapers</Link></li>
              <li><Link to="/explore?isPremium=true" className="hover:text-white transition-colors">Premium Collection</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-sm text-white tracking-wide uppercase">
              Stay Inspired
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Get the latest uploads and artist highlights straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs glass-input focus:bg-slate-900/80"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-primary/10 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500">
            © {new Date().getFullYear()} Dream Lens. All rights reserved.
          </p>
          <div className="flex gap-4 text-[10px] text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
