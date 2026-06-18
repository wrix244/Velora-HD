import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Check, X } from 'lucide-react';
import { getCookie, setCookie, eraseCookie } from '../../utils/cookies';
import useThemeStore from '../../store/themeStore';
import useUIStore from '../../store/uiStore';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
  });

  const initTheme = useThemeStore((s) => s.initTheme);
  const clearRecentlyViewed = useUIStore((s) => s.clearRecentlyViewed);

  useEffect(() => {
    // Check if consent has already been given
    const consent = getCookie('dl_cookie_consent');
    if (!consent) {
      // Delay showing the banner for a premium entrance
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookie('dl_cookie_consent', 'all', 365);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    setCookie('dl_cookie_consent', 'necessary', 365);
    
    // Clear functional settings if they were set
    clearRecentlyViewed();
    
    // Reset theme to default
    eraseCookie('dl_theme');
    initTheme();

    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    if (preferences.functional) {
      setCookie('dl_cookie_consent', 'all', 365);
    } else {
      setCookie('dl_cookie_consent', 'necessary', 365);
      clearRecentlyViewed();
      eraseCookie('dl_theme');
      initTheme();
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md z-50"
      >
        <div className="card rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          {!showCustomize ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Cookie Preferences</h3>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Privacy & Custom Experience</p>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                We use cookies to secure your account authentication and personalize your experience. Custom themes and recommendation history require preference cookies. We value your privacy and data security.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleAcceptAll}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wide transition-all shadow-lg cursor-pointer"
                >
                  <span>Accept All Cookies</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptNecessary}
                    className="flex-1 py-2 rounded-xl bg-surface-2 hover:bg-surface-2/80 text-text-muted hover:text-white border border-border font-semibold text-xs transition cursor-pointer"
                  >
                    Necessary Only
                  </button>
                  <button
                    onClick={() => setShowCustomize(true)}
                    className="flex-1 py-2 rounded-xl bg-surface-2 hover:bg-surface-2/80 text-text-muted hover:text-white border border-border font-semibold text-xs transition cursor-pointer"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Customize Settings</h3>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Configure Cookies</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between p-3 rounded-2xl bg-surface-2 border border-border">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Essential
                      <span className="text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase">Required</span>
                    </h4>
                    <p className="text-[10px] text-gray-400">Used for user registration, login authentication, and checkouts.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.essential}
                    disabled
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-surface"
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between p-3 rounded-2xl bg-surface-2 border border-border">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Functional & Preferences
                    </h4>
                    <p className="text-[10px] text-gray-400">Enables dynamic UI themes, browsing history, and tailored recommendations.</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.functional ? 'bg-primary' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        preferences.functional ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-2/80 text-text-muted font-semibold text-xs border border-border transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs tracking-wide transition shadow-lg cursor-pointer"
                >
                  <span>Save Choices</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
