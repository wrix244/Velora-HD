import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Sparkles, CheckCircle, Heart, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';

export default function About() {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: 'Premium Curation',
      desc: 'We do not flood our platform with bulk AI noise. Every wallpaper, layout, and live loop is hand-selected and adjusted for balanced compositions and contrast.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: 'Verified 4K/8K Resolution',
      desc: 'All assets are checked for crispness and resolution details. We verify that static wallpapers look sharp on high-DPI monitors and mobile OLED screens.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Security Verified',
      desc: 'We guarantee 100% clean and secure downloads. Every zip archive and high-resolution file is scanned for malware, conforming to strict security sandboxing rules.',
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: 'Direct Creator Support',
      desc: 'VeloraHD partners with digital creators. A percentage of all transactions on our premium store goes back to artists, supporting the global digital art ecosystem.',
    },
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <SEO
        title="About Us | Velora HD"
        description="Learn about Velora HD — the premium wallpaper marketplace. Discover our mission to provide high-resolution verified 4K/8K wallpapers and secure downloads."
        keywords={["about us", "velora hd", "wallpaper marketplace", "curated wallpapers"]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation back */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Hero header */}
        <div className="space-y-4 text-center lg:text-left">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            Our Story & Mission
          </span>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">
            Curating Digital Art <br />
            <span className="text-primary">
              For Premium Screens
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl">
            VeloraHD started with a simple problem: wallpaper search websites are often cluttered, slow, low-quality, and packed with ads. We set out to build a minimalist gallery that functions as an art gallery rather than a database. 
          </p>
        </div>



        {/* Trust pillars */}
        <div className="space-y-6 pt-4">
          <div className="text-center lg:text-left">
            <h2 className="font-display font-bold text-2xl text-white">Why Creators & Collectors Trust VeloraHD</h2>
            <p className="text-xs text-gray-400 mt-1">We maintain the highest standards of safety, quality, and support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="p-6 card rounded-2xl transition-all duration-300 space-y-3"
              >
                <div className="p-3 bg-white/5 w-fit rounded-xl">
                  {pillar.icon}
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="rounded-3xl card p-8 text-center space-y-4">
          <h2 className="font-display font-bold text-xl text-white">Ready to Explore?</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Browse our curated grids of premium vertical and horizontal static designs, plus high quality loopable motion live wallpapers.
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs tracking-wider uppercase inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Browse The Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
