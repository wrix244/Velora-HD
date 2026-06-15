import React from 'react';
import { CreditCard, CheckCircle, AlertOctagon, HelpCircle, Clock, RefreshCw, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Refunds() {
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
            <CreditCard className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Refund Policy
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
            This Refund Policy explains the conditions under which refunds may be requested for premium content, subscriptions, purchases, and other paid services offered through VeloraHD.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-semibold text-white">
            By purchasing premium content or services from VeloraHD, you agree to this Refund Policy.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section: Refund Eligibility */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Refund Eligibility
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Users may request a refund within <strong>seven (7) calendar days</strong> from the original purchase date. Refund requests may be considered when purchased content:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 border-l border-emerald-500/20">
                <li>Cannot be downloaded or accessed.</li>
                <li>Is corrupted or damaged.</li>
                <li>Is delivered in significantly lower quality than advertised.</li>
                <li>Contains major technical defects.</li>
                <li>Fails to function as described.</li>
                <li>Is advertised as seamless looping content but does not loop properly.</li>
                <li>Is delivered in an incorrect format or resolution.</li>
                <li>Suffers from other significant issues that materially affect normal usage.</li>
              </ul>
              <p className="text-gray-500 italic mt-2">Refund requests must include sufficient evidence supporting the reported issue.</p>
            </div>
          </div>

          {/* Section: Acceptable Evidence */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Acceptable Evidence
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>To assist in the review process, users may be asked to provide:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Screenshots</li>
                <li>Screen recordings</li>
                <li>Error messages</li>
                <li>Download logs</li>
                <li>Device information</li>
                <li>Technical details demonstrating the reported issue</li>
              </ul>
              <p className="text-rose-400 font-semibold mt-2">Failure to provide reasonable supporting evidence may result in denial of the refund request.</p>
            </div>
          </div>

          {/* Section: Non-Refundable Situations */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              Non-Refundable Situations
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>Refunds will generally not be granted for:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 border-l border-rose-500/25">
                <li>Change of mind.</li>
                <li>Personal preference.</li>
                <li>Accidental purchases.</li>
                <li>Failure to read product descriptions.</li>
                <li>Device incompatibility not listed as supported.</li>
                <li>Minor visual differences caused by display settings.</li>
                <li>Requests submitted after the seven (7) day refund period.</li>
                <li>Content already downloaded and functioning as advertised.</li>
                <li>Dissatisfaction with artistic style, color choices, or design preferences.</li>
              </ul>
            </div>
          </div>

          {/* Section: Premium Access Purchases */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Premium Access Purchases
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Premium wallpapers, video wallpapers, live wallpapers, subscriptions, and other premium content may be accessed through:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>One-time purchases</li>
                <li>Subscription plans</li>
                <li>Promotional campaigns</li>
                <li>Advertising-supported unlock methods</li>
              </ul>
              <p className="text-gray-500 mt-2">Purchasing premium access grants a limited license to use the content and does not transfer ownership rights.</p>
            </div>
          </div>

          {/* Section: Refund Review Process */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-secondary" />
              Refund Review Process
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>All refund requests are reviewed individually.</p>
              <p>VeloraHD reserves the right to:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Approve a refund.</li>
                <li>Deny a refund.</li>
                <li>Request additional information.</li>
                <li>Investigate reported issues before making a decision.</li>
              </ul>
              <p className="text-gray-500 italic mt-2">Refund decisions are made at VeloraHD's reasonable discretion based on the information available.</p>
            </div>
          </div>

          {/* Section: Processing Time */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Processing Time
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Approved refunds are generally processed within a reasonable period of time.</p>
              <p>Actual processing times may vary depending on:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li>Payment provider</li>
                <li>Financial institution</li>
                <li>Payment method</li>
                <li>Geographic location</li>
              </ul>
              <p className="text-gray-500 font-semibold mt-2">VeloraHD is not responsible for delays caused by third-party payment processors.</p>
            </div>
          </div>

          {/* Section: Subscriptions */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Subscriptions
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>If subscription plans are offered, users may cancel future renewals at any time through their account settings or designated cancellation method.</p>
              <p className="text-gray-500">Cancellation prevents future charges but does not automatically entitle users to refunds for prior billing periods.</p>
            </div>
          </div>

          {/* Section: Abuse of the Refund Policy */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              Abuse of the Refund Policy
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD reserves the right to deny refund requests and restrict account access if users are found to be abusing the refund system. Examples of abuse include:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Repeated refund requests without legitimate grounds.</li>
                <li>Fraudulent claims.</li>
                <li>Manipulation of payment systems.</li>
                <li>Attempts to obtain premium content without payment.</li>
              </ul>
            </div>
          </div>

          {/* Section: Changes to This Policy */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              Changes to This Policy
            </h2>
            <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
              <p>VeloraHD may update this Refund Policy from time to time. Updated versions will be published on this page together with a revised "Last Updated" date. Continued use of VeloraHD following such changes constitutes acceptance of the revised policy.</p>
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
            <p>For refund-related questions or requests, please contact us:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Refund Queries</span>
                <a href="mailto:refunds@velorahd.in" className="text-primary hover:underline font-semibold">refunds@velorahd.in</a>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Support Requests</span>
                <a href="mailto:support@velorahd.in" className="text-primary hover:underline font-semibold">support@velorahd.in</a>
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
