import React from 'react';
import { Shield, Database, Eye, User, Mail, Tv, BarChart, CreditCard, Layers, Calendar, Lock, Heart, Globe, Scale, RefreshCw, Send } from 'lucide-react';
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
            Welcome to <strong>VeloraHD</strong> ("VeloraHD", "Website", "we", "our", or "us").
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            VeloraHD respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, store, and protect information when you visit our Website, create an account, purchase premium content, subscribe to newsletters, contact us, or otherwise use our services.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By accessing or using VeloraHD, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: Information We Collect */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Information We Collect
            </h2>
            <div className="text-xs text-gray-400 space-y-4 leading-relaxed">
              <div className="space-y-2">
                <span className="font-bold text-white block text-xs">Information You Provide</span>
                <p>We may collect information that you voluntarily provide, including:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Name and Username</li>
                  <li>Email address and Contact information</li>
                  <li>Account credentials</li>
                  <li>Newsletter subscription information</li>
                  <li>Support requests and communications</li>
                  <li>Payment-related information processed through third-party payment providers</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="font-bold text-white block text-xs">Automatically Collected Information</span>
                <p>When you access VeloraHD, certain information may be collected automatically, including:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information and Operating system</li>
                  <li>Language preferences</li>
                  <li>Referring websites and Pages viewed</li>
                  <li>Download activity and Time spent on pages</li>
                  <li>Date and time of access</li>
                  <li>General location information derived from IP addresses</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="font-bold text-white block text-xs">Cookies and Similar Technologies</span>
                <p>We use cookies and similar technologies to remember user preferences, maintain login sessions, improve website functionality, analyze website traffic, measure website performance, deliver relevant advertisements, and measure advertising effectiveness.</p>
                <p className="text-gray-500">Users may disable cookies through browser settings; however, some features may not function properly.</p>
              </div>
            </div>
          </div>

          {/* Section: How We Use Information */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              How We Use Information
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>We may use collected information to:</p>
              <ul className="list-disc list-inside pl-1 space-y-1">
                <li>Provide and maintain Website services</li>
                <li>Create and manage user accounts</li>
                <li>Process premium purchases and Deliver content</li>
                <li>Provide customer support and Respond to inquiries</li>
                <li>Send newsletters and updates</li>
                <li>Improve Website performance and Analyze behavior</li>
                <li>Detect fraud and protect Website security</li>
                <li>Enforce our policies and Comply with legal obligations</li>
              </ul>
            </div>
          </div>

          {/* Section: User Accounts */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              User Accounts
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Users may create accounts to access certain Website features. Account information may be used to authenticate users, maintain account security, provide personalized experiences, manage premium access, and deliver purchased content.</p>
              <p className="text-gray-500">Users are responsible for maintaining the confidentiality of their account credentials.</p>
            </div>
          </div>

          {/* Section: Newsletter & Email Communications */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Newsletter and Email Communications
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Users may voluntarily subscribe to newsletters and promotional communications. Emails may include new wallpaper releases, product updates, premium announcements, and offers.</p>
              <p className="text-gray-500">Users may unsubscribe at any time using the unsubscribe link included in emails.</p>
            </div>
          </div>

          {/* Section: Advertising Services */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-indigo-400" />
              Advertising Services
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may display advertisements provided by Google AdSense and other advertising partners. Advertising providers may use cookies, web beacons, and similar technologies to personalize advertisements, measure performance, improve relevance, and prevent advertising fraud.</p>
              <p className="text-gray-500">Third-party advertising partners may collect information according to their own privacy policies.</p>
            </div>
          </div>

          {/* Section: Analytics Services */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <BarChart className="w-5 h-5 text-cyan-400" />
              Analytics Services
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>We may use analytics providers such as Google Analytics to understand visitor behavior, measure engagement, analyze Website performance, improve user experience, and monitor Website functionality. Analytics providers may collect information through cookies and similar technologies.</p>
            </div>
          </div>

          {/* Section: Payment Processing */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Payment Processing
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Premium purchases may be processed through third-party payment providers. VeloraHD does not store complete payment card information on its servers. Payment providers process transactions according to their own privacy policies and security standards.</p>
            </div>
          </div>

          {/* Section: Third-Party Services */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-400" />
              Third-Party Services
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may use third-party services for analytics, advertising, payment processing, email delivery, content delivery, and security/fraud prevention. These third-party providers operate under their own privacy policies.</p>
            </div>
          </div>

          {/* Section: Data Retention */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Data Retention
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>We retain information only for as long as reasonably necessary to provide services, maintain user accounts, process transactions, resolve disputes, enforce agreements, comply with legal obligations, and protect our legitimate business interests.</p>
              <p className="text-gray-500">Information may be deleted, anonymized, or aggregated when no longer required.</p>
            </div>
          </div>

          {/* Section: Data Security */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-500" />
              Data Security
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>We implement reasonable technical, administrative, and organizational safeguards designed to protect user information. However, no method of electronic transmission, storage, or security system can be guaranteed to be completely secure.</p>
              <p className="text-rose-400/90 font-semibold">Users acknowledge that use of internet-based services involves inherent risks.</p>
            </div>
          </div>

          {/* Section: Children's Privacy */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Children's Privacy
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD is intended for users aged 13 years and older. We do not knowingly collect personal information from children under the age of 13. If we become aware that personal information from a child under 13 has been collected, we will take reasonable steps to remove such information.</p>
            </div>
          </div>

          {/* Section: International Users */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" />
              International Users
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may be accessed from countries around the world. By using the Website, users acknowledge that information may be processed, transferred, and stored in accordance with this Privacy Policy and applicable laws.</p>
            </div>
          </div>

          {/* Section: User Rights */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              User Rights
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Depending on applicable laws, users may have the right to access personal information, correct inaccurate information, request deletion of personal information, withdraw consent where applicable, object to certain forms of processing, and request information regarding data usage.</p>
              <p className="text-gray-500">Requests may be submitted through our contact channels.</p>
            </div>
          </div>

          {/* Section: Changes to This Privacy Policy */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400 animate-spin-slow" />
              Changes to This Privacy Policy
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>We may update this Privacy Policy periodically to reflect changes in services, legal requirements, or business practices. Updated versions will be published on this page together with a revised "Last Updated" date.</p>
              <p className="text-white font-semibold">Continued use of VeloraHD after changes become effective constitutes acceptance of the updated Privacy Policy.</p>
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
            <p>For privacy-related questions, requests, or concerns, please contact us:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Privacy Queries</span>
                <a href="mailto:privacy@velorahd.com" className="text-primary hover:underline font-semibold">privacy@velorahd.com</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Support Requests</span>
                <a href="mailto:support@velorahd.com" className="text-primary hover:underline font-semibold">support@velorahd.com</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Copyright & Legal</span>
                <a href="mailto:copyright@velorahd.com" className="text-accent hover:underline font-semibold block">copyright@velorahd.com</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Contact Form</span>
                <a href="https://velorahd.com/contact" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold block">https://velorahd.com/contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
