import React from 'react';
import { Cpu, ShieldCheck, HelpCircle, User, CreditCard, Scale, AlertOctagon, Sparkles, RefreshCw, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiPolicy() {
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
            <Cpu className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            AI Content Policy
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
            Welcome to <strong>VeloraHD</strong>.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            This AI Content Policy explains how artificial intelligence technologies may be used in the creation, enhancement, modification, and distribution of content available through VeloraHD.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By accessing or using VeloraHD, you acknowledge and agree to the terms described in this policy.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: AI-Generated Content */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Generated Content
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD provides wallpapers, video wallpapers, live wallpapers, illustrations, and related digital content that may be generated, enhanced, modified, edited, or assisted by artificial intelligence technologies.</p>
              <p>Content available on VeloraHD may be produced using a combination of:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Artificial intelligence systems</li>
                <li>Human review and selection</li>
                <li>Manual editing and enhancement</li>
                <li>Quality control processes</li>
              </ul>
            </div>
          </div>

          {/* Section: Originality of Content */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Originality of Content
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD strives to provide original and unique AI-generated content. We do not intentionally reproduce, copy, or distribute copyrighted works belonging to third parties.</p>
              <p>However, users acknowledge that AI-generated content may occasionally contain similarities to: existing artworks, visual styles, concepts, themes, design elements, or publicly available imagery. Such similarities may occur without intentional copying.</p>
            </div>
          </div>

          {/* Section: No Guarantee of Uniqueness */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent" />
              No Guarantee of Uniqueness
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Due to the nature of artificial intelligence systems, VeloraHD cannot guarantee that any generated content will be completely unique or entirely free from similarities to existing works.</p>
              <p className="text-gray-500">Users acknowledge that visual similarities alone do not necessarily indicate copyright infringement.</p>
            </div>
          </div>

          {/* Section: User Responsibility */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              User Responsibility
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Users are responsible for determining whether downloaded content is suitable for their intended use. Users are solely responsible for ensuring compliance with copyright laws, trademark laws, intellectual property laws, local regulations, and commercial usage requirements within their jurisdiction.</p>
            </div>
          </div>

          {/* Section: Commercial Use */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Commercial Use
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Unless expressly stated otherwise, wallpapers and content available through VeloraHD are licensed for personal, non-commercial use only.</p>
              <p className="text-rose-400 font-semibold">Commercial use, redistribution, resale, sublicensing, or republishing of content is prohibited without prior written permission from VeloraHD.</p>
            </div>
          </div>

          {/* Section: Copyright Concerns */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Copyright Concerns
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>If a copyright owner believes that content available on VeloraHD infringes their intellectual property rights, they may submit a complaint through our Copyright & DMCA Policy process.</p>
              <p>VeloraHD will review reported content and may:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Investigate the claim</li>
                <li>Request additional information</li>
                <li>Restrict access to content</li>
                <li>Remove content</li>
                <li>Take other appropriate actions</li>
              </ul>
              <p className="mt-2">where deemed necessary.</p>
            </div>
          </div>

          {/* Section: Content Removal */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              Content Removal
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD reserves the right to modify, restrict, replace, or remove content at any time without prior notice.</p>
              <p className="text-gray-500">Content may be removed for reasons including:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 text-gray-500">
                <li>Copyright concerns</li>
                <li>Technical issues</li>
                <li>Quality concerns</li>
                <li>Policy violations</li>
                <li>Legal requirements</li>
              </ul>
            </div>
          </div>

          {/* Section: AI Limitations */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-400" />
              AI Limitations
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Users acknowledge that AI-generated content may contain:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Visual inconsistencies</li>
                <li>Generation artifacts</li>
                <li>Minor imperfections</li>
                <li>Rendering errors</li>
                <li>Unintended similarities</li>
              </ul>
              <p className="text-gray-500 font-semibold mt-2">VeloraHD makes reasonable efforts to review content before publication but does not guarantee that all content will be entirely free from such issues.</p>
            </div>
          </div>

          {/* Section: Policy Updates */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Policy Updates
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may update this AI Content Policy from time to time. Updated versions will be published on this page together with a revised "Last Updated" date. Continued use of VeloraHD following publication of updated versions constitutes acceptance of the revised policy.</p>
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
            <p>For questions regarding AI-generated content, copyright concerns, or this policy, please contact:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Legal Enquiries</span>
                <a href="mailto:legal@velorahd.in" className="text-primary hover:underline font-semibold">legal@velorahd.in</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Copyright Matters</span>
                <a href="mailto:copyright@velorahd.in" className="text-primary hover:underline font-semibold">copyright@velorahd.in</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Contact Page</span>
                <a href="https://velorahd.in/contact" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold block">https://velorahd.in/contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
