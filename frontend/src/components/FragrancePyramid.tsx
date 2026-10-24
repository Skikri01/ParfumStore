import React from 'react';
import { Sparkles, Heart, Anchor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FragrancePyramidProps {
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
}

export const FragrancePyramid: React.FC<FragrancePyramidProps> = ({
  topNotes,
  heartNotes,
  baseNotes,
}) => {
  const { t } = useLanguage();

  return (
    <div className="rounded-lg p-5 border border-neutral-200 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-neutral-900" />
        <h3 className="text-xs tracking-wider text-neutral-900 font-bold uppercase">
          {t('pyramidTitle')}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Top Notes */}
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start gap-3">
          <div className="p-1.5 rounded bg-white text-neutral-800 border border-neutral-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-neutral-900 font-semibold">
                {t('topNotes')}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">0 - 30 min</span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              {topNotes || 'Sparkling Bergamot, Fresh Zest'}
            </p>
          </div>
        </div>

        {/* Heart Notes */}
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start gap-3">
          <div className="p-1.5 rounded bg-white text-neutral-800 border border-neutral-200 shrink-0">
            <Heart className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-neutral-900 font-semibold">
                {t('heartNotes')}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">2 - 5 hrs</span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              {heartNotes || 'Rose Absolu, Rare Iris'}
            </p>
          </div>
        </div>

        {/* Base Notes */}
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start gap-3">
          <div className="p-1.5 rounded bg-white text-neutral-800 border border-neutral-200 shrink-0">
            <Anchor className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-neutral-900 font-semibold">
                {t('baseNotes')}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">6 - 24+ hrs</span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              {baseNotes || 'Precious Cambodian Oud, White Sandalwood, Ambergris'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
