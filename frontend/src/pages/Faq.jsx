import React from 'react';
import { ShieldCheck, HelpCircle, Download, Monitor, Smartphone, Key, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function Faq() {
  const safetyPoints = [
    {
      title: "100% Executable-Free Downloads",
      desc: "We never distribute software installations, ZIP archives, or `.exe` files. All assets download directly as raw `.webp`, `.jpg`, or `.mp4` files that cannot execute code on your device.",
      icon: ShieldCheck
    },
    {
      title: "Secure Cloudinary CDN Hosting",
      desc: "Our media files are hosted on Cloudinary, a premium, enterprise-grade Content Delivery Network. Every file is scanned for security integrity automatically upon upload.",
      icon: Award
    },
    {
      title: "Privacy & Data Sandboxing",
      desc: "We do not track device settings or inject script trackers. Your downloads are isolated, sandboxed media assets conforming to browser security protocols.",
      icon: Key
    }
  ];

  const installSteps = [
    {
      os: "Windows (Live Motion)",
      steps: [
        "Download your chosen loop-ready live wallpaper (.mp4).",
        "Download and install Lively Wallpaper (a free, open-source tool on the Microsoft Store) or Wallpaper Engine.",
        "Drag and drop the downloaded video file into the Lively app interface.",
        "Set it as your desktop background."
      ],
      icon: Monitor
    },
    {
      os: "macOS (Live Motion)",
      steps: [
        "Download the live wallpaper video file (.mp4).",
        "Use a macOS wallpaper manager (such as 'Plash' or 'Equinox') supporting video backdrops.",
        "Select your downloaded video file inside the application and apply it as the screen engine."
      ],
      icon: Monitor
    },
    {
      os: "Android & iOS (Mobile)",
      steps: [
        "Download the wallpaper file (static webp/jpg or live mp4).",
        "For static screens, set it directly from your gallery settings.",
        "For live screens on Android, use your device's native video wallpaper option or a free app like 'Video Live Wallpaper' from the Play Store.",
        "For iOS, apply standard Live Photo layouts if supported on your lockscreen version."
      ],
      icon: Smartphone
    }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-bg-dark text-white">
      <SEO
        title="Help & Safety Center — Safe Wallpaper Downloads"
        description="Learn about download security, licensing guarantees, and how to safely install live wallpapers on Windows, macOS, Android, and iOS."
        keywords={["velora hd safety", "safe wallpaper download", "live wallpaper setup", "lively wallpaper guide"]}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-white/5 border border-border rounded-2xl text-primary mb-2">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-none">
            Help & Safety
          </h1>
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            Discover how we guarantee 100% safe file downloads and learn to apply premium backgrounds to your desktop and mobile devices.
          </p>
        </div>

        {/* Safety Guarantees Section */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Download Security & Safety Guarantees
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="card p-5 rounded-2xl border border-border bg-surface relative space-y-3">
                  <div className="p-2 w-fit bg-white/5 border border-border rounded-xl text-emerald-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Installation Guides */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              How to Install Live & Static Wallpapers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {installSteps.map((group, index) => {
              const Icon = group.icon;
              return (
                <div key={index} className="card p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <h3 className="font-display font-bold text-sm text-white">{group.os}</h3>
                    </div>
                    <ol className="list-decimal list-inside text-[11px] text-text-muted space-y-2.5 leading-relaxed pl-1">
                      {group.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="align-top">
                          <span className="text-text-muted pl-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* General FAQ Accordion List */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="card p-5 rounded-xl border border-border bg-surface space-y-2">
              <h3 className="font-display font-bold text-xs sm:text-sm text-white">Is Velora HD a free website?</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Yes! We offer a vast selection of high-resolution desktop and mobile wallpapers absolutely free. We also host a "Premium Selection" featuring exclusive loop-ready motion designs and 4K sets which help support our digital artists.
              </p>
            </div>

            <div className="card p-5 rounded-xl border border-border bg-surface space-y-2">
              <h3 className="font-display font-bold text-xs sm:text-sm text-white">Are files virus-free? How do I know?</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Unlike older download portals, we do not require downloads through a custom downloader or installer wrapper. When you download a wallpaper, you receive a direct link to the image or video on our secure Cloudinary CDN asset server. Image and video formats cannot contain system malware or executable scripts, making downloads 100% safe.
              </p>
            </div>

            <div className="card p-5 rounded-xl border border-border bg-surface space-y-2">
              <h3 className="font-display font-bold text-xs sm:text-sm text-white">How do I request refunds for premium items?</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">
                If you encounter any loading issues or double charges on checkout, you can view our <Link to="/refunds" className="text-primary hover:underline font-semibold">Refund Policy</Link> or drop us a support ticket at <a href="mailto:support@velorahd.in" className="text-primary hover:underline font-semibold">support@velorahd.in</a>. We respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="card p-5 rounded-xl border border-border bg-surface space-y-2">
              <h3 className="font-display font-bold text-xs sm:text-sm text-white">Who owns the wallpaper copyrights?</h3>
              <p className="text-[11px] text-text-muted leading-relaxed">
                All wallpapers are licensed for personal setup backdrops. Creators retain intellectual copyrights. For details on sharing, re-uploading, or licensing, please read our <Link to="/copyright" className="text-primary hover:underline font-semibold">Copyright Framework</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <div className="card p-6 rounded-2xl border border-border bg-surface text-center space-y-4">
          <div className="flex justify-center text-primary">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm text-white">Have other questions?</h3>
            <p className="text-[11px] text-text-muted">
              We're here to help. Reach out to our customer support desk and we will get back to you immediately.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="mailto:support@velorahd.in"
              className="inline-flex px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs tracking-wider uppercase transition shadow"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
