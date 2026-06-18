import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Sparkles, Heart, ArrowLeft, Users, Eye, HelpCircle } from 'lucide-react';
import SEO from '../components/common/SEO';

export default function About() {
  const values = [
    {
      title: "Who We Are",
      desc: "VeloraHD is an independent project created by two Indian developers who share a passion for technology, design, and digital art. Using our development experience and modern AI tools, we built VeloraHD from the ground up with a focus on performance, security, and user experience. While AI helps us accelerate development and content creation, every part of the platform is carefully reviewed and improved by our team. As VeloraHD grows, we plan to expand our team and welcome more creators, artists, and contributors who share our vision.",
      icon: Users
    },
    {
      title: "Our Vision",
      desc: "We want VeloraHD to become one of the best destinations for free 4K wallpapers and live wallpapers. Our long-term vision is to: offer premium-quality wallpapers without expensive subscriptions; build a creator-friendly platform where artists can share their work; support both desktop and mobile users with optimized content; and create a trusted community around wallpapers, digital art, and creative content. We believe great design and digital art should be accessible to everyone.",
      icon: Eye
    },
    {
      title: "Our Content",
      desc: "Most of the wallpapers available on VeloraHD are created using AI-assisted workflows and creative editing by our team. We focus on producing visually appealing, high-quality wallpapers optimized for modern devices. As the platform grows, we plan to introduce a Creator Program that allows artists and designers to upload their original work. Creators will have control over how their content is shared, including licensing and usage preferences where applicable. We are committed to respecting creators and providing clear information about content ownership and licensing.",
      icon: Sparkles
    }
  ];

  const trustPoints = [
    { title: "Secure HTTPS connections", desc: "Forced SSL routing at the edge ensures all data transfers are encrypted." },
    { title: "Fast loading speeds", desc: "Image width constraints and CDN caching ensure fast downloads across all screens." },
    { title: "Clean user experience", desc: "No fake download buttons, misleading redirection loops, or pop-up ads." },
    { title: "Original team-created content", desc: "Artworks generated and curated directly by our independent design studio." },
    { title: "Continuous improvements", desc: "Building, refining, and polishing platform features based directly on user reviews." }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-bg-dark text-white">
      <SEO
        title="About Our Mission & Story | Velora HD"
        description="Read the story of Velora HD — an independent wallpaper marketplace created by two Indian developers to bring clean, high-resolution 4K and live backdrops to everyone."
        keywords={["about velora hd", "independent wallpaper site", "digital art marketplace", "velorahd story"]}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Navigation back */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Hero story introduction */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Our Story</span>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight leading-tight">
            About Velora<span className="text-primary">HD</span>
          </h1>
          <div className="card p-6 sm:p-8 rounded-3xl border border-border bg-surface space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
            <p>
              VeloraHD was created for people who love high-quality wallpapers but don't want to pay expensive subscription fees or spend hours searching for properly licensed content.
            </p>
            <p>
              Many wallpaper platforms limit access to premium content behind paywalls, while others are filled with intrusive ads, misleading download buttons, or unclear licensing. We wanted to build a better alternative.
            </p>
            <p className="font-semibold text-white">
              Our goal is simple: provide beautiful, high-quality wallpapers that are easy to discover, easy to download, and accessible to everyone.
            </p>
          </div>
        </div>

        {/* Curation Pillars Grid */}
        <div className="grid grid-cols-1 gap-6 pt-4">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="card p-6 rounded-2xl border border-border bg-surface space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 w-fit bg-white/5 border border-border rounded-xl text-primary">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="font-display font-bold text-base text-white">{val.title}</h2>
                </div>
                <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line">{val.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Why Trust VeloraHD Section */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="font-display font-bold text-lg tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Why Trust VeloraHD?
            </h2>
          </div>

          <div className="card p-6 rounded-2xl border border-border bg-surface space-y-4">
            <p className="text-xs text-text-muted leading-relaxed">
              We believe trust is earned through transparency, quality, and consistency. That's why VeloraHD focuses on delivering clean visual assets without standard internet clutter:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-text-muted">
              {trustPoints.map((point, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">{point.title}</span>
                    <span className="text-[10px] text-text-muted">{point.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-[10px] text-text-muted leading-relaxed pt-2 border-t border-border/60">
              We encourage transparency and welcome users to independently verify our website through security and reputation services if they choose.
            </p>
          </div>
        </section>

        {/* Looking Ahead Call to Action */}
        <section className="card p-6 sm:p-8 rounded-3xl border border-border bg-surface text-center space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Looking Ahead</span>
            <h3 className="font-display font-bold text-xl text-white">This is only the beginning</h3>
            <p className="text-xs text-text-muted max-w-lg mx-auto leading-relaxed">
              In the future, we plan to expand our wallpaper collection, launch creator accounts/artist profiles, build a stronger community around digital art, and introduce new collections and premium live motion backdrops.
            </p>
          </div>
          
          <div className="pt-3 border-t border-border/40 max-w-md mx-auto space-y-1">
            <p className="text-[11px] text-text-muted">Questions, feedback, or business inquiries?</p>
            <p className="text-xs font-semibold text-white">
              Contact us at <a href="mailto:hello@velorahd.in" className="text-primary hover:underline">hello@velorahd.in</a>
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs tracking-wider uppercase transition shadow"
            >
              Explore Wallpapers
            </Link>
            <Link
              to="/faq"
              className="px-6 py-2.5 rounded-lg border border-border hover:border-gray-500 bg-surface-2 text-text-muted hover:text-white font-semibold text-xs tracking-wider uppercase transition"
            >
              Safety & Help
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
