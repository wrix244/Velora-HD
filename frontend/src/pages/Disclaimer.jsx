import React from 'react';
import { AlertTriangle, Send, ShieldCheck, HelpCircle, Layers, Cpu, Server, RefreshCw, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Disclaimer() {
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
            <AlertTriangle className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Disclaimer
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
            This Disclaimer governs the use of VeloraHD ("VeloraHD", "Website", "we", "our", or "us"), including all wallpapers, video wallpapers, live wallpapers, premium content, services, and related features available through the Website.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By accessing or using VeloraHD, you acknowledge and agree to this Disclaimer.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: General Information */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              General Information
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>All content provided through VeloraHD is offered for informational, entertainment, and personal-use purposes only.</p>
              <p className="text-gray-500">While we make reasonable efforts to provide high-quality content and services, we make no guarantees regarding the completeness, accuracy, reliability, or suitability of any content available on the Website.</p>
            </div>
          </div>

          {/* Section: AI-Generated Content Disclaimer */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-400" />
              AI-Generated Content Disclaimer
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Many wallpapers, video wallpapers, live wallpapers, and visual assets available on VeloraHD may be generated, enhanced, modified, or assisted by artificial intelligence technologies.</p>
              <p>AI-generated content may occasionally contain:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 border-l border-teal-500/20">
                <li>Visual inconsistencies</li>
                <li>Generation artifacts</li>
                <li>Rendering imperfections</li>
                <li>Similarities to existing styles or concepts</li>
                <li>Unintended errors</li>
              </ul>
              <p className="text-gray-500 font-semibold mt-2">VeloraHD does not guarantee that AI-generated content will be entirely free from such issues.</p>
            </div>
          </div>

          {/* Section: No Professional Advice */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              No Professional Advice
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Content available on VeloraHD does not constitute legal, financial, business, technical, medical, or professional advice.</p>
              <p className="text-gray-500 font-semibold">Users should seek qualified professional advice when making important decisions.</p>
            </div>
          </div>

          {/* Section: Downloads and Device Compatibility */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              Downloads and Device Compatibility
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD makes reasonable efforts to provide downloadable content in advertised formats and resolutions.</p>
              <p>However, we do not guarantee that all content will function perfectly on every:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Device</li>
                <li>Operating system</li>
                <li>Application</li>
                <li>Display</li>
                <li>Software environment</li>
              </ul>
              <p className="text-gray-500 font-semibold mt-2">Users are responsible for verifying compatibility with their own devices and software.</p>
            </div>
          </div>

          {/* Section: Third-Party Services */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Third-Party Services
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD may contain links to third-party websites, advertisements, payment providers, analytics services, or external platforms.</p>
              <p>We do not control and are not responsible for:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 text-zinc-500">
                <li>Third-party content</li>
                <li>Third-party privacy practices</li>
                <li>Third-party services</li>
                <li>Third-party products</li>
              </ul>
              <p className="text-rose-400 font-semibold mt-2">Users access third-party services at their own discretion and risk.</p>
            </div>
          </div>

          {/* Section: Website Availability */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-secondary" />
              Website Availability
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD does not guarantee uninterrupted access to the Website.</p>
              <p>The Website may experience:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Maintenance periods</li>
                <li>Technical issues</li>
                <li>Service interruptions</li>
                <li>Security incidents</li>
                <li>Unexpected downtime</li>
              </ul>
              <p className="text-gray-500 italic mt-2">We reserve the right to modify, suspend, or discontinue Website features at any time.</p>
            </div>
          </div>

          {/* Section: Limitation of Responsibility */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Limitation of Responsibility
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>To the fullest extent permitted by law, VeloraHD shall not be responsible for any loss, damage, expense, or inconvenience arising from:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 border-l border-rose-500/25 text-zinc-400">
                <li>Use of the Website</li>
                <li>Inability to access the Website</li>
                <li>Downloaded content</li>
                <li>Premium content</li>
                <li>AI-generated content</li>
                <li>Technical issues</li>
                <li>Third-party services</li>
                <li>Service interruptions</li>
              </ul>
              <p className="text-white font-bold mt-2">Users access and use VeloraHD at their own risk.</p>
            </div>
          </div>

          {/* Section: Policy Updates */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Policy Updates
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may update this Disclaimer from time to time. Updated versions will be published on this page together with the revised "Last Updated" date. Continued use of VeloraHD after updates become effective constitutes acceptance of the revised Disclaimer.</p>
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
            <p>If you have questions regarding this Disclaimer, please contact us:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</span>
                <a href="mailto:legal@velorahd.in" className="text-primary hover:underline font-semibold">legal@velorahd.in</a>
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
