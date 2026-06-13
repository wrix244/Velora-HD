import React from 'react';
import { FileText, UserCheck, ShieldAlert, Download, Sparkles, Ban, UserX, AlertTriangle, RefreshCw, Scale, Layers, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="pt-24 pb-20 min-h-screen relative overflow-hidden policy-container">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 w-80 h-80 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-2 animate-pulse"
          >
            <FileText className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Terms of Service
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
            These Terms of Service ("Terms") govern your access to and use of the VeloraHD website, applications, wallpapers, video wallpapers, live wallpapers, premium content, services, and related features.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By accessing or using VeloraHD, you agree to be bound by these Terms. If you do not agree to these Terms, you must discontinue use of the Website immediately.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: Eligibility */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Eligibility
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>You must be at least 13 years old to use VeloraHD.</p>
              <p>If you are under the age of majority in your jurisdiction, you represent that you have permission from a parent or legal guardian to use the Website.</p>
            </div>
          </div>

          {/* Section: User Accounts */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              User Accounts
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Certain features of VeloraHD may require account registration. Users agree to:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Provide accurate and current information.</li>
                <li>Maintain the security of their account credentials.</li>
                <li>Keep login information confidential.</li>
                <li>Accept responsibility for all activities conducted through their account.</li>
              </ul>
              <p className="mt-2 text-gray-500">
                Users are responsible for maintaining the confidentiality of their account credentials. VeloraHD is not responsible for unauthorized account access resulting from a user's failure to protect their login information.
              </p>
            </div>
          </div>

          {/* Section: License to Use Content */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-accent" />
              License to Use Content
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Subject to compliance with these Terms, VeloraHD grants users a limited, non-exclusive, non-transferable, revocable license to download and use wallpapers solely for personal and non-commercial purposes.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <span className="font-bold text-emerald-400 block mb-1">✔ Users MAY:</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Download wallpapers for personal use.</li>
                    <li>Use wallpapers on personal devices.</li>
                    <li>Store downloaded wallpapers for personal viewing.</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                  <span className="font-bold text-rose-400 block mb-1">✖ Users MAY NOT:</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Resell wallpapers.</li>
                    <li>Redistribute wallpapers.</li>
                    <li>Upload wallpapers to other wallpaper websites.</li>
                    <li>Package wallpapers into applications, software, or products.</li>
                    <li>Claim ownership of wallpapers.</li>
                    <li>Use wallpapers for commercial purposes without written permission from VeloraHD.</li>
                  </ul>
                </div>
              </div>
              
              <p className="mt-3 text-[10px] text-gray-500 italic">
                Any unauthorized use immediately terminates the license granted under these Terms.
              </p>
            </div>
          </div>

          {/* Section: Premium Content */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              Premium Content
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD may offer premium content including but not limited to: high-resolution wallpapers, exclusive wallpaper collections, live wallpapers, video wallpapers, and early-access releases.</p>
              <p>Premium content may be unlocked through: direct purchases, advertising-supported access, promotional campaigns, or subscription plans.</p>
              <p>Access to premium content does not transfer ownership rights to the user. Refunds and purchase-related matters are governed by our Refund Policy.</p>
            </div>
          </div>

          {/* Section: Prohibited Activities */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-500" />
              Prohibited Activities
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Users agree not to:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li>Violate any applicable laws or regulations.</li>
                <li>Attempt to gain unauthorized access to Website systems.</li>
                <li>Circumvent, disable, or interfere with security features.</li>
                <li>Bypass premium access restrictions.</li>
                <li>Use bots, scrapers, crawlers, or automated tools without permission.</li>
                <li>Copy, reproduce, redistribute, sell, or commercially exploit Website content.</li>
                <li>Upload or distribute malicious software.</li>
                <li>Interfere with the normal operation of the Website.</li>
                <li>Create multiple accounts for abusive purposes.</li>
                <li>Share, resell, or transfer premium content.</li>
              </ul>
              <p className="text-gray-500 mt-2">
                VeloraHD reserves the right to investigate suspected violations and take appropriate action.
              </p>
            </div>
          </div>

          {/* Section: Account Suspension and Termination */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <UserX className="w-5 h-5 text-secondary" />
              Account Suspension and Termination
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD reserves the right to suspend, restrict, disable, or permanently terminate any account that violates these Terms.</p>
              <span className="font-bold text-white block text-xs mt-2">Upon Account Termination:</span>
              <ul className="list-disc list-inside pl-1 space-y-1">
                <li>Access to premium content may be revoked.</li>
                <li>Access to account-related features may be disabled.</li>
                <li>Previously paid fees may not be refundable except where required by law.</li>
              </ul>
            </div>
          </div>

          {/* Section: Disclaimer and Limitation of Liability */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              Disclaimer and Limitation of Liability
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>VeloraHD provides its Website, wallpapers, video wallpapers, live wallpapers, premium content, services, and features on an "as is" and "as available" basis.</p>
              <p>To the maximum extent permitted by law, VeloraHD makes no warranties regarding Website availability, Website accuracy, continuous service operation, freedom from errors/interruptions, or compatibility with all devices and software.</p>
              <p className="text-white font-semibold">Users access and use VeloraHD at their own risk.</p>
              <p className="text-rose-400 font-bold border-l border-rose-500/20 pl-2 mt-2">
                VeloraHD shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of the Website or its services.
              </p>
            </div>
          </div>

          {/* Section: Changes to Services and Terms */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Changes to Services and Terms
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD reserves the right to modify, update, suspend, discontinue, or remove any part of the Website, services, content, premium offerings, pricing, subscription plans, advertising methods, or functionality at any time.</p>
              <p>We may periodically update these Terms of Service. Updated versions will be published on the Website together with the revised "Last Updated" date. Continued use of VeloraHD after such updates constitutes acceptance of the revised Terms.</p>
            </div>
          </div>

          {/* Section: Governing Law and Dispute Resolution */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Governing Law and Dispute Resolution
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>These Terms shall be governed by and interpreted in accordance with the laws of <strong>India</strong>.</p>
              <p>Any dispute arising from or relating to these Terms or the use of VeloraHD shall be subject to the exclusive jurisdiction of the courts located in <strong>India</strong>.</p>
            </div>
          </div>

          {/* Section: Related Policies */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              Related Policies
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Use of VeloraHD is also governed by the following policies which are incorporated into these Terms by reference:</p>
              <ul className="list-disc list-inside pl-1 space-y-1">
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
                <li>AI Content Policy</li>
                <li>Copyright & DMCA Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact info */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Contact Information
          </h2>
          <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
            <p>If you have questions regarding these Terms of Service, please contact us through our Contact Page or by email at:</p>
            <p className="font-bold text-white"><a href="mailto:support@velorahd.com" className="text-primary hover:underline">support@velorahd.com</a></p>
            <p>Official URL: <a href="https://velorahd.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://velorahd.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
