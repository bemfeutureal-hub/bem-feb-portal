import { SiteThemeColor } from '../types';

export const getThemeClasses = (color: SiteThemeColor = 'maroon') => {
  switch (color) {
    case 'navy':
      return {
        name: 'Navy Deep',
        primaryBg: 'bg-slate-900',
        primaryHover: 'hover:bg-slate-800',
        primaryText: 'text-slate-900',
        primaryBorder: 'border-slate-900',
        primaryLightBg: 'bg-slate-100',
        primaryLightText: 'text-slate-800',
        badgeBorder: 'border-slate-200',
        accentRing: 'focus:ring-slate-400',
        subtleAccent: 'bg-slate-900',
        headerBrandBg: 'bg-slate-900',
        headerBrandText: 'text-white',
        borderAccent: 'border-slate-800',
      };
    case 'emerald':
      return {
        name: 'Emerald Lestari',
        primaryBg: 'bg-emerald-900',
        primaryHover: 'hover:bg-emerald-800',
        primaryText: 'text-emerald-900',
        primaryBorder: 'border-emerald-900',
        primaryLightBg: 'bg-emerald-50',
        primaryLightText: 'text-emerald-800',
        badgeBorder: 'border-emerald-200',
        accentRing: 'focus:ring-emerald-400',
        subtleAccent: 'bg-emerald-800',
        headerBrandBg: 'bg-emerald-900',
        headerBrandText: 'text-white',
        borderAccent: 'border-emerald-800',
      };
    case 'amber':
      return {
        name: 'Gold Mandiri',
        primaryBg: 'bg-amber-900',
        primaryHover: 'hover:bg-amber-800',
        primaryText: 'text-amber-900',
        primaryBorder: 'border-amber-900',
        primaryLightBg: 'bg-amber-50',
        primaryLightText: 'text-amber-800',
        badgeBorder: 'border-amber-200',
        accentRing: 'focus:ring-amber-400',
        subtleAccent: 'bg-amber-700',
        headerBrandBg: 'bg-amber-900',
        headerBrandText: 'text-white',
        borderAccent: 'border-amber-800',
      };
    case 'slate':
      return {
        name: 'Pure Monochrome',
        primaryBg: 'bg-zinc-950',
        primaryHover: 'hover:bg-zinc-800',
        primaryText: 'text-zinc-950',
        primaryBorder: 'border-zinc-950',
        primaryLightBg: 'bg-zinc-100',
        primaryLightText: 'text-zinc-900',
        badgeBorder: 'border-zinc-200',
        accentRing: 'focus:ring-zinc-400',
        subtleAccent: 'bg-zinc-900',
        headerBrandBg: 'bg-zinc-950',
        headerBrandText: 'text-white',
        borderAccent: 'border-zinc-800',
      };
    case 'maroon':
    default:
      return {
        name: 'Maroon UTU FEB (Resmi)',
        primaryBg: 'bg-[#800016]',
        primaryHover: 'hover:bg-[#680012]',
        primaryText: 'text-[#800016]',
        primaryBorder: 'border-[#800016]',
        primaryLightBg: 'bg-rose-50/70',
        primaryLightText: 'text-[#800016]',
        badgeBorder: 'border-rose-200',
        accentRing: 'focus:ring-rose-400',
        subtleAccent: 'bg-[#800016]',
        headerBrandBg: 'bg-[#800016]',
        headerBrandText: 'text-white',
        borderAccent: 'border-[#800016]',
      };
  }
};
