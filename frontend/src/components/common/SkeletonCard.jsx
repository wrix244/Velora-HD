import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-surface border border-border aspect-[4/5] p-4 flex flex-col justify-end animate-pulse">
      {/* Top badges placeholder */}
      <div className="absolute top-3 inset-x-3 flex justify-between">
        <div className="w-16 h-5 bg-surface-2 rounded-full" />
        <div className="w-8 h-8 bg-surface-2 rounded-full" />
      </div>

      {/* Info placeholders */}
      <div className="space-y-2 relative z-10">
        <div className="w-3/4 h-5 bg-surface-2 rounded" />
        <div className="w-1/2 h-3.5 bg-surface-2 rounded" />
        <div className="pt-3 border-t border-border flex justify-between items-center">
          <div className="w-12 h-4 bg-surface-2 rounded" />
          <div className="w-16 h-7 bg-surface-2 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
