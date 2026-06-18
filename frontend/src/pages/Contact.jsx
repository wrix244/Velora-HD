import React, { useState } from 'react';
import { Mail, Send, HelpCircle, ShieldCheck, Scale, Globe, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
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
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What types of wallpapers are available on VeloraHD?",
      a: "We offer both static 4K/8K wallpapers (ideal for high-resolution PC and mobile screens) and looping live motion wallpapers (MP4/WebM files designed for animated desktop and lock screen setups)."
    },
    {
      q: "How do I apply a live wallpaper to my desktop or phone?",
      a: "For Windows PCs, you can use popular utilities like Lively Wallpaper or Wallpaper Engine. For mobile devices, native Android supports video lock screens directly, while iOS users can set live photos (depending on iOS version compatibility)."
    },
    {
      q: "Are downloads safe and secure?",
      a: "Absolutely. Security is our top priority. Every single wallpaper file uploaded to VeloraHD undergoes automated security scanning for malware. We guarantee all downloads are 100% secure and sandbox-friendly."
    },
    {
      q: "What is your refund policy for premium downloads?",
      a: "Since digital downloads are active instantly upon purchase, we typically do not offer refunds once a file is downloaded. However, if you experience a technical error or corrupt file, contact support@velorahd.in and we will gladly issue a replacement or refund."
    },
    {
      q: "Can I use VeloraHD wallpapers for commercial projects?",
      a: "Our standard downloads are licensed for personal use only (e.g. desktop/mobile backgrounds, home screen setup showcases). For commercial licensing or distribution inquiries, please email business@velorahd.in."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
    
    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data && response.data.success) {
        addToast(response.data.message || 'Your message has been sent successfully!', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        addToast(response.data.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error occurred while sending the message. Please try again later.';
      addToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen policy-container">
      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-2"
          >
            <Mail className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
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

        {/* Email Us Top Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-8 rounded-3xl border border-border text-center space-y-3 bg-surface-2/30"
        >
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Email Us</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            <a href="mailto:hello@velorahd.in" className="hover:text-primary transition-colors">hello@velorahd.in</a>
          </h2>
          <p className="text-xs text-text-muted">
            We typically respond within 24–48 hours.
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 rounded-3xl space-y-4"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* General Support */}
            <div className="card p-5 rounded-3xl space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-primary" />
                General Support
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For general questions, technical assistance, account issues, premium content inquiries, or website-related support.
              </p>
              <a href="mailto:support@velorahd.in" className="text-xs text-primary font-semibold hover:underline block pt-1">
                support@velorahd.in
              </a>
            </div>

            {/* Refund Requests */}
            <div className="card p-5 rounded-3xl space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                Refund Requests
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For refund requests related to premium content, subscriptions, or purchases.
              </p>
              <a href="mailto:refunds@velorahd.in" className="text-xs text-primary font-semibold hover:underline block pt-1">
                refunds@velorahd.in
              </a>
            </div>

            {/* Copyright & DMCA */}
            <div className="card p-5 rounded-3xl space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Scale className="w-4.5 h-4.5 text-accent" />
                Copyright & DMCA
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                To report copyright infringement, intellectual property concerns, or content ownership disputes.
              </p>
              <a href="mailto:copyright@velorahd.in" className="text-xs text-primary font-semibold hover:underline block pt-1">
                copyright@velorahd.in
              </a>
            </div>

            {/* Legal Inquiries */}
            <div className="card p-5 rounded-3xl space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4.5 h-4.5 text-secondary" />
                Legal Inquiries
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For legal matters, policy questions, or compliance-related requests.
              </p>
              <a href="mailto:legal@velorahd.in" className="text-xs text-primary font-semibold hover:underline block pt-1">
                legal@velorahd.in
              </a>
            </div>

            {/* Business Inquiries */}
            <div className="card p-5 rounded-3xl space-y-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-indigo-400" />
                Business Inquiries
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                For partnerships, collaborations, sponsorships, advertising opportunities, or business proposals.
              </p>
              <a href="mailto:business@velorahd.in" className="text-xs text-primary font-semibold hover:underline block pt-1">
                business@velorahd.in
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 rounded-3xl space-y-6"
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
                  className="w-full text-xs clean-input focus:bg-surface-2 p-2"
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
                  className="w-full text-xs clean-input focus:bg-surface-2 p-2"
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
                  className="w-full text-xs clean-input focus:bg-surface-2 p-2"
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
                  className="w-full text-xs clean-input focus:bg-surface-2 resize-none p-2"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Response Times & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="card p-5 rounded-3xl space-y-2">
            <h3 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Response Times
            </h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Response times may vary depending on inquiry volume and complexity. While we strive to respond promptly, VeloraHD does not guarantee response times.
            </p>
          </div>

          <div className="card p-5 rounded-3xl space-y-2 flex flex-col justify-center">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Website Link</span>
            <a href="https://velorahd.in" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-semibold tracking-tight">
              https://velorahd.in
            </a>
            <span className="text-[10px] text-gray-500 mt-2 block">
              Thank you for being part of the VeloraHD community.
            </span>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 pt-8 border-t border-border">
          <div className="text-center">
            <h2 className="font-display font-bold text-2xl text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400 mt-1">Quick answers to common questions about downloads, pricing, and setups.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="card rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left font-display font-bold text-xs md:text-sm text-white flex justify-between items-center hover:bg-white/2 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-primary text-lg font-bold">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-border pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
