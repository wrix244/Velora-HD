import React from 'react';
import { Cookie, Send, ShieldCheck, HelpCircle, Layers, Settings, Globe, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CookiePolicy() {
  return (
    <div className="pt-24 pb-20 min-h-screen relative overflow-hidden policy-container">
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
            <Cookie className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Cookie Policy
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
            This Cookie Policy explains how VeloraHD ("VeloraHD", "Website", "we", "our", or "us") uses cookies and similar technologies when you visit or use our Website.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By continuing to use VeloraHD, you consent to the use of cookies as described in this Cookie Policy.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: What Are Cookies? */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              What Are Cookies?
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Cookies are small text files stored on your device when you visit a website.</p>
              <p>Cookies help websites remember information about your visit, preferences, login sessions, and other settings to improve user experience and functionality.</p>
            </div>
          </div>

          {/* Section: How We Use Cookies */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              How We Use Cookies
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD uses cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 border-l border-emerald-500/20">
                <li>Maintain Website functionality.</li>
                <li>Keep users logged into their accounts.</li>
                <li>Remember user preferences.</li>
                <li>Improve Website performance.</li>
                <li>Analyze visitor behavior.</li>
                <li>Measure advertising effectiveness.</li>
                <li>Personalize content and user experiences.</li>
                <li>Protect Website security.</li>
              </ul>
            </div>
          </div>

          {/* Section: Types of Cookies We Use */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              Types of Cookies We Use
            </h2>
            <div className="text-xs text-gray-400 space-y-4 leading-relaxed">
              {/* Essential Cookies */}
              <div className="space-y-2">
                <span className="font-bold text-white block text-xs uppercase tracking-wider text-primary">Essential Cookies</span>
                <p>These cookies are necessary for the Website to function properly.</p>
                <p>Examples include:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>User authentication</li>
                  <li>Login sessions</li>
                  <li>Security features</li>
                  <li>Account access</li>
                </ul>
                <p className="text-gray-500 italic mt-1">Without these cookies, certain Website features may not function correctly.</p>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <span className="font-bold text-white block text-xs uppercase tracking-wider text-secondary">Analytics Cookies</span>
                <p>Analytics cookies help us understand how visitors interact with VeloraHD.</p>
                <p>These cookies may collect information such as:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Pages visited</li>
                  <li>Time spent on pages</li>
                  <li>Device information</li>
                  <li>Traffic sources</li>
                  <li>User engagement metrics</li>
                </ul>
                <p className="text-gray-500">We may use services such as Google Analytics for these purposes.</p>
              </div>

              {/* Advertising Cookies */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <span className="font-bold text-white block text-xs uppercase tracking-wider text-indigo-400">Advertising Cookies</span>
                <p>Advertising cookies help deliver relevant advertisements and measure advertising performance.</p>
                <p>These cookies may be used by:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Google AdSense</li>
                  <li>Advertising partners</li>
                  <li>Third-party advertising networks</li>
                </ul>
                <p>Advertising cookies may be used to:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-500">
                  <li>Display personalized advertisements.</li>
                  <li>Measure advertisement performance.</li>
                  <li>Prevent advertising fraud.</li>
                  <li>Improve advertising relevance.</li>
                </ul>
              </div>

              {/* Preference Cookies */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <span className="font-bold text-white block text-xs uppercase tracking-wider text-teal-400">Preference Cookies</span>
                <p>Preference cookies remember user settings and preferences.</p>
                <p>Examples include:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Language preferences</li>
                  <li>Theme preferences</li>
                  <li>Display settings</li>
                  <li>User customization options</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Third-Party Cookies */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-400" />
              Third-Party Cookies
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Some cookies may be placed by third-party service providers.</p>
              <p>These providers may include:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 border-l border-teal-500/20">
                <li>Analytics services</li>
                <li>Advertising networks</li>
                <li>Payment providers</li>
                <li>Content delivery services</li>
              </ul>
              <p className="text-gray-500">Third-party providers operate under their own privacy and cookie policies.</p>
            </div>
          </div>

          {/* Section: Managing Cookies */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Managing Cookies
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Most web browsers allow users to:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>View cookies.</li>
                <li>Delete cookies.</li>
                <li>Block cookies.</li>
                <li>Control cookie preferences.</li>
              </ul>
              <p>Users may manage cookie settings through their browser preferences.</p>
              <p className="text-rose-400 font-semibold">Disabling cookies may affect Website functionality and user experience.</p>
            </div>
          </div>

          {/* Section: Policy Updates */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Policy Updates
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may update this Cookie Policy from time to time. Updated versions will be published on this page together with the revised "Last Updated" date. Continued use of VeloraHD after such updates constitutes acceptance of the revised policy.</p>
            </div>
          </div>
        </motion.div>

        {/* Contact info */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Contact Information
          </h2>
          <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
            <p>If you have questions regarding this Cookie Policy, please contact us:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</span>
                <a href="mailto:privacy@velorahd.in" className="text-primary hover:underline font-semibold">privacy@velorahd.in</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Contact Page</span>
                <a href="https://velorahd.in/contact" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold block">https://velorahd.in/contact</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Website Link</span>
                <a href="https://velorahd.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold block">https://velorahd.in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
