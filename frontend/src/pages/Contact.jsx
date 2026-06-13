import React, { useState } from 'react';
import { Mail, Send, HelpCircle, ShieldCheck, Scale, Globe, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useUIStore from '../store/uiStore';

export default function Contact() {
  const addToast = useUIStore((state) => state.addToast);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addToast('Your message has been sent successfully. We will respond promptly!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1500);
  };

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
            <Mail className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-none"
          >
            Contact Us
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
            Thank you for visiting <strong>VeloraHD</strong>.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you have questions, feedback, business inquiries, technical issues, copyright concerns, refund requests, or require assistance with any aspect of our services, please contact us using the information below.
          </p>
          <p className="text-sm text-gray-400 italic">
            We will make reasonable efforts to respond as quickly as possible.
          </p>
        </motion.div>

        {/* Form and Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* General Support */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-primary" />
                General Support
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For general questions, technical assistance, account issues, premium content inquiries, or website-related support.
              </p>
              <a href="mailto:support@velorahd.com" className="text-xs text-primary font-semibold hover:underline block pt-1">
                support@velorahd.com
              </a>
            </div>

            {/* Refund Requests */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                Refund Requests
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For refund requests related to premium content, subscriptions, or purchases.
              </p>
              <a href="mailto:refunds@velorahd.com" className="text-xs text-primary font-semibold hover:underline block pt-1">
                refunds@velorahd.com
              </a>
            </div>

            {/* Copyright & DMCA */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Scale className="w-4.5 h-4.5 text-accent" />
                Copyright & DMCA
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                To report copyright infringement, intellectual property concerns, or content ownership disputes.
              </p>
              <a href="mailto:copyright@velorahd.com" className="text-xs text-primary font-semibold hover:underline block pt-1">
                copyright@velorahd.com
              </a>
            </div>

            {/* Legal Inquiries */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-secondary" />
                Legal Inquiries
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For legal matters, policy questions, or compliance-related requests.
              </p>
              <a href="mailto:legal@velorahd.com" className="text-xs text-primary font-semibold hover:underline block pt-1">
                legal@velorahd.com
              </a>
            </div>

            {/* Business Inquiries */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-indigo-400" />
                Business Inquiries
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For partnerships, collaborations, sponsorships, advertising opportunities, or business proposals.
              </p>
              <a href="mailto:business@velorahd.com" className="text-xs text-primary font-semibold hover:underline block pt-1">
                business@velorahd.com
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6"
          >
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-white">Contact Form</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Send us a message directly. Providing accurate details helps us respond more efficiently.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full text-xs glass-input focus:bg-slate-900/80"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@example.com"
                  className="w-full text-xs glass-input focus:bg-slate-900/80"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry Subject"
                  className="w-full text-xs glass-input focus:bg-slate-900/80"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your request in detail..."
                  rows="4"
                  className="w-full text-xs glass-input focus:bg-slate-900/80 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
              >
                <Send className={`w-3.5 h-3.5 ${submitting ? 'animate-bounce' : ''}`} />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Response Times & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2">
            <h3 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Response Times
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Response times may vary depending on inquiry volume and complexity. While we strive to respond promptly, VeloraHD does not guarantee response times.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Website Link</span>
            <a href="https://velorahd.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-semibold tracking-tight">
              https://velorahd.com
            </a>
            <span className="text-[10px] text-gray-500 mt-2 block">
              Thank you for being part of the VeloraHD community.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
