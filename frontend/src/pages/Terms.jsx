import React from 'react';
import { FileText, CreditCard, Download, ShieldAlert, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="pt-24 pb-20 min-h-screen relative overflow-hidden">
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
            Welcome to <strong>Dream Lens</strong>. These Terms of Service ("Terms") govern your access to and use of our website, services, and digital wallpaper downloads. By accessing or using Dream Lens, you agree to be bound by these Terms and our Privacy Policy.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Please read these Terms carefully before making any purchases. If you do not agree to all of these Terms, you are prohibited from using the site and must discontinue use immediately.
          </p>
        </motion.div>

        {/* Terms Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Section 1: Purchases & Billing */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              1. Purchases, Payments & Billing
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>Dream Lens offers premium static and live wallpapers for purchase. By initiating a purchase, you agree to the following billing terms:</p>
              <ul className="list-disc list-inside pl-2 space-y-1.5">
                <li><strong className="text-white">Payment Processing</strong>: All payments are processed securely through certified, industry-standard third-party payment gateways (e.g., Stripe, PayPal). Dream Lens does not collect or store your full credit card details on our servers.</li>
                <li><strong className="text-white">Billing Authorization</strong>: You authorize our payment processors to charge the designated payment method for the total amount of your purchase (including applicable taxes and transaction fees).</li>
                <li><strong className="text-white">Accuracy of Information</strong>: You agree to provide current, complete, and accurate purchase and account information for all transactions made at our store.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Refund Policy for Digital Goods */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              2. Refund Policy
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Due to the nature of digital goods, all sales of static and live wallpapers are <strong>final and non-refundable</strong> once a purchase is successfully processed and the download file link is generated or accessed. If you experience technical issues downloading your purchased wallpaper, please contact our support team at <a href="mailto:support@dreamlens.com" className="text-primary hover:underline">support@dreamlens.com</a> with your transaction ID, and we will assist in resolving the download delivery.
            </p>
          </div>

          {/* Section 3: Licensing & Intellectual Property */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-accent" />
              3. License for Downloaded Content
            </h2>
            <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <p>When you purchase or download a wallpaper from Dream Lens, we grant you a limited, non-exclusive, non-transferable, personal license to use the wallpaper under the following terms:</p>
              <div className="space-y-2 pl-2 border-l border-white/10">
                <p><span className="text-emerald-400 font-semibold">✔ Permitted:</span> Setting the asset as a personal background/lockscreen on your personal computers, smartphones, tablets, or home setups.</p>
                <p><span className="text-rose-400 font-semibold">✖ Prohibited:</span> Reselling, sub-licensing, redistributing, or sharing the original source file. You may not use the designs in commercial advertising, client projects, or merchandise without securing a separate commercial contract.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Limitation of Liability */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-secondary" />
              4. Disclaimer & Limitation of Liability
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Dream Lens provides all digital assets "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to compatibility with specific operating systems, monitors, or hardware setups. In no event shall Dream Lens, its directors, or its creators be liable for any indirect, incidental, or consequential damages resulting from your use or inability to use the site or downloaded content.
            </p>
          </div>
        </motion.div>

        {/* Contact info */}
        <div className="text-center text-xs text-gray-500 pt-4">
          <p>If you have any questions regarding these Terms, please contact us at <a href="mailto:legal@dreamlens.com" className="text-primary hover:underline">legal@dreamlens.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
