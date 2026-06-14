import React from 'react';
import { Scale, Send, FileText, ShieldAlert, ShieldCheck, Mail, Link as LinkIcon, RefreshCw, AlertTriangle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Copyright() {
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
            <Scale className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Copyright & DMCA Policy
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
            VeloraHD respects the intellectual property rights of creators, artists, copyright owners, trademark owners, and other rights holders.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            This Copyright & DMCA Policy explains how copyright complaints may be submitted and how VeloraHD responds to reports of alleged infringement.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By using VeloraHD, you acknowledge and agree to the terms described in this policy.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: Reporting Copyright Infringement */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Reporting Copyright Infringement
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>If you believe that content available on VeloraHD infringes your copyright or other intellectual property rights, you may submit a complaint requesting review of the content.</p>
              <p>A complaint should include:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 border-l border-rose-500/20">
                <li>Your full legal name.</li>
                <li>Your email address.</li>
                <li>Your contact information.</li>
                <li>Identification of the copyrighted work allegedly infringed.</li>
                <li>Identification of the content being reported.</li>
                <li>The URL or location of the reported content.</li>
                <li>A description of the alleged infringement.</li>
                <li>Any supporting evidence available.</li>
                <li>A statement that the information provided is accurate and submitted in good faith.</li>
              </ul>
              <p className="text-gray-500 italic mt-2">Incomplete reports may require additional information before review can begin.</p>
            </div>
          </div>

          {/* Section: How to Submit a Complaint */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              How to Submit a Complaint
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Copyright complaints may be submitted through:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</span>
                  <a href="mailto:copyright@velorahd.com" className="text-primary hover:underline font-semibold">copyright@velorahd.com</a>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Contact Page</span>
                  <a href="https://velorahd.com/contact" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold block">https://velorahd.com/contact</a>
                </div>
              </div>
              <p className="text-gray-500">Users are encouraged to provide as much information as possible to assist in the review process.</p>
            </div>
          </div>

          {/* Section: Review Process */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Review Process
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Upon receiving a copyright complaint, VeloraHD may:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Review the reported content.</li>
                <li>Request additional information.</li>
                <li>Conduct an internal investigation.</li>
                <li>Temporarily restrict access to the content.</li>
                <li>Permanently remove the content.</li>
                <li>Take any other action deemed appropriate.</li>
              </ul>
              <p>Submission of a complaint does not guarantee content removal.</p>
              <p className="text-gray-500 italic">Each report is reviewed individually.</p>
            </div>
          </div>

          {/* Section: AI-Generated Content */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              AI-Generated Content
            </h2>
            <div className="text-xs text-gray-400 space-y-2.5 leading-relaxed">
              <p>VeloraHD primarily distributes AI-generated and AI-assisted content.</p>
              <p>While we strive to create original content, we acknowledge that AI-generated works may occasionally contain similarities to existing works, styles, concepts, or visual elements.</p>
              <p>VeloraHD does not knowingly reproduce or distribute copyrighted material belonging to third parties.</p>
              <p className="text-gray-500">If a copyright owner believes content available on VeloraHD infringes their rights, they are encouraged to submit a complaint through the process described in this policy.</p>
            </div>
          </div>

          {/* Section: False or Misleading Claims */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              False or Misleading Claims
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Submitting false, misleading, fraudulent, or abusive copyright complaints is prohibited.</p>
              <p>VeloraHD reserves the right to reject complaints that:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 border-l border-rose-500/25">
                <li>Lack sufficient evidence.</li>
                <li>Appear fraudulent.</li>
                <li>Contain inaccurate information.</li>
                <li>Are submitted in bad faith.</li>
              </ul>
              <p className="text-rose-400 font-semibold mt-2">VeloraHD may refuse further communication regarding abusive or repetitive complaints.</p>
            </div>
          </div>

          {/* Section: Content Removal */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              Content Removal
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD reserves the right to remove, modify, restrict, or disable access to content at any time if:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Copyright concerns arise.</li>
                <li>Legal obligations require removal.</li>
                <li>Ownership cannot be reasonably verified.</li>
                <li>Technical or policy issues are identified.</li>
              </ul>
              <p className="text-gray-500 font-semibold mt-2">Content may be removed without prior notice where necessary.</p>
            </div>
          </div>

          {/* Section: Repeat Infringement */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Repeat Infringement
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD reserves the right to suspend, restrict, or terminate access to users who repeatedly violate intellectual property rights or engage in unlawful distribution of content.</p>
            </div>
          </div>

          {/* Section: Limitation of Liability */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-zinc-400" />
              Limitation of Liability
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD acts in good faith when reviewing and responding to copyright complaints.</p>
              <p className="text-gray-500">To the fullest extent permitted by law, VeloraHD shall not be liable for actions taken in response to copyright reports, investigations, content removals, or restrictions implemented under this policy.</p>
            </div>
          </div>

          {/* Section: Policy Updates */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Policy Updates
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may update this Copyright & DMCA Policy from time to time. Updated versions will be published on this page together with a revised "Last Updated" date. Continued use of VeloraHD following publication of updated versions constitutes acceptance of the revised policy.</p>
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
            <p>For copyright-related inquiries, reports, or questions regarding this policy, please contact:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Copyright Email</span>
                <a href="mailto:copyright@velorahd.com" className="text-primary hover:underline font-semibold">copyright@velorahd.com</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Legal Inquiries</span>
                <a href="mailto:legal@velorahd.com" className="text-primary hover:underline font-semibold">legal@velorahd.com</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 md:col-span-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Contact Page</span>
                <a href="https://velorahd.com/contact" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold block">https://velorahd.com/contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
