import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1A1A1A]/40 border border-white/5 aspect-[4/5] p-4 flex flex-col justify-end">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] z-0" />
      
      {/* Top badges placeholder */}
      <div className="absolute top-3 inset-x-3 flex justify-between">
        <div className="w-16 h-5 bg-[#2A2A2A]/80 rounded-full" />
        <div className="w-8 h-8 bg-[#2A2A2A]/80 rounded-full" />
      </div>

      {/* Info placeholders */}
      <div className="space-y-2 relative z-10">
        <div className="w-3/4 h-5 bg-[#2A2A2A]/80 rounded" />
        <div className="w-1/2 h-3.5 bg-[#2A2A2A]/60 rounded" />
        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
          <div className="w-12 h-4 bg-slate-850 rounded" />
          <div className="w-16 h-7 bg-slate-850 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
