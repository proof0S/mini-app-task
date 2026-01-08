'use client';

export function SkeletonTask() {
  return (
    <div className="rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full skeleton" />
        <div className="w-8 h-8 rounded-lg skeleton" />
        <div className="flex-1">
          <div className="h-4 w-32 rounded skeleton mb-2" />
          <div className="h-3 w-20 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProgress() {
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30">
      <div className="w-24 h-24 rounded-full skeleton" />
      <div className="text-right">
        <div className="h-4 w-24 rounded skeleton mb-2" />
        <div className="h-10 w-16 rounded skeleton mb-2" />
        <div className="h-3 w-20 rounded skeleton" />
      </div>
    </div>
  );
}

export function SkeletonLeaderboardItem() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
      <div className="w-8 h-6 rounded skeleton" />
      <div className="w-10 h-10 rounded-full skeleton" />
      <div className="flex-1">
        <div className="h-4 w-24 rounded skeleton mb-1" />
        <div className="h-3 w-16 rounded skeleton" />
      </div>
      <div className="text-right">
        <div className="h-5 w-12 rounded skeleton mb-1" />
        <div className="h-3 w-10 rounded skeleton" />
      </div>
    </div>
  );
}
