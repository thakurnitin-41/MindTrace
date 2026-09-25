import React from 'react';
import { Award, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { AchievementBadge } from '../types';

interface AchievementToastProps {
  badge: AchievementBadge | null;
  onDismiss: () => void;
  onViewAchievements: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  badge,
  onDismiss,
  onViewAchievements
}) => {
  if (!badge) return null;

  const getRarityBadge = (rarity: AchievementBadge['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-amber-400 text-amber-950 border-amber-300 shadow-amber-500/20';
      case 'epic':
        return 'bg-purple-500 text-white border-purple-400 shadow-purple-500/20';
      case 'rare':
        return 'bg-blue-500 text-white border-blue-400 shadow-blue-500/20';
      default:
        return 'bg-emerald-500 text-white border-emerald-400';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-indigo-500/50 relative overflow-hidden backdrop-blur-md">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3.5">
          {/* Badge Icon Shield */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300/40 animate-bounce">
            <Award className="w-6 h-6 fill-current" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Milestone Unlocked!
              </span>
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
              {badge.title}
              <span
                className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded border ${getRarityBadge(
                  badge.rarity
                )}`}
              >
                {badge.rarity}
              </span>
            </h4>

            <p className="text-xs text-slate-300 line-clamp-2 leading-snug">
              {badge.description}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">
                +{badge.rewardXP} XP Earned
              </span>

              <button
                onClick={() => {
                  onDismiss();
                  onViewAchievements();
                }}
                className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Badges</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
