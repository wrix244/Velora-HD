import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border relative z-10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: Logo + nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="font-display font-black text-white text-[9px]">VH</span>
            </div>
            <span className="font-display font-bold text-base tracking-tight text-white">
              Velora<span className="text-primary">HD</span>
            </span>
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted">
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <Link to="/explore?isPremium=true" className="hover:text-white transition-colors">Premium</Link>
            <Link to="/explore?type=live" className="hover:text-white transition-colors">Live</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

        {/* Bottom row: Legal + Copyright */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-text-muted">
            © {new Date().getFullYear()} Velora HD. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] text-text-muted">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/refunds" className="hover:text-white transition-colors">Refunds</Link>
            <Link to="/copyright" className="hover:text-white transition-colors">DMCA</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
