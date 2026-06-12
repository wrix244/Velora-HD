import React from 'react';
import { Shield, Eye, Cookie, Lock, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="pt-24 pb-20 min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-10 w-80 h-80 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-2 animate-pulse"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-gray-500 uppercase tracking-widest font-semibold"
          >
            Last Updated: June 13, 2026
          </motion.p>
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4"
        >
          <p className="text-sm text-gray-300 leading-relaxed">
            At <strong>Dream Lens</strong>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy describes how we collect, use, store, and share information when you access or make purchases from our premium wallpaper marketplace.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            By using our platform, you agree to the collection and use of information in accordance with this policy. We do not sell your data, and we aim to be fully transparent about our processing practices.
          </p>
        </motion.div>

        {/* Details Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section 1: Information We Collect */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              1. Information We Collect
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>We collect information you provide directly to us when creating an account, editing your profile, or making transactions:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li><strong className="text-white">Account Information</strong>: Email address, usernames, passwords, and avatar files.</li>
                <li><strong className="text-white">Transaction Logs</strong>: History of bought wallpapers and payment status. We do NOT store actual card details on our database (mock numbers are verified in-memory/on-the-fly).</li>
                <li><strong className="text-white">Usage & Interaction</strong>: Active download logs and user favorites list which are stored securely in our MongoDB cluster.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Cookies & Preference Storage */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Cookie className="w-5 h-5 text-accent" />
              2. How We Use Cookies & Storage
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>We use cookies to enhance functionality, security, and performance. You can manage your choices via our Cookie Consent settings:</p>
              <div className="space-y-2">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="font-bold text-white block mb-0.5 text-xs">Strictly Necessary Cookies</span>
                  <span>Required to secure user sessions. This stores your JSON Web Token (JWT) and user profile information so you stay signed in across views. These cannot be disabled.</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="font-bold text-white block mb-0.5 text-xs">Functional & Preference Cookies</span>
                  <span>Remembers your selection of UI themes (Graffiti vs. Space), PWA prompt dismissals, and your browsing history (recently viewed wallpapers) which enables personalized wallpaper recommendations.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Personalized Recommendations */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary" />
              3. Personalized Recommendations
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              To deliver tailored suggestions on our homepage, we track up to 10 of your recently viewed wallpapers. This history is stored on your device in the <code>recentlyViewed</code> cookie as a list of wallpaper IDs. Our backend recommendations engine parses these IDs to query relevant categories and tags from our database, ensuring suggestions match your tastes. No history is stored on our database for anonymous users; you can clear your history at any time on the Explore page.
            </p>
          </div>

          {/* Section 4: Data Security */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              4. Data Protection & Security
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              The security of your personal data is critical to us. We store auth tokens in <code>HttpOnly, Secure, SameSite=Lax</code> cookies which prevents client-side malicious scripts from harvesting session tokens. We also implement password hashing using Bcrypt on our servers and enforce SSL encryption across all API request channels.
            </p>
          </div>
        </motion.div>

        {/* Contact info */}
        <div className="text-center text-xs text-gray-500 pt-4">
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@dreamlens.com" className="text-primary hover:underline">support@dreamlens.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
