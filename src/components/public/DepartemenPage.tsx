import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Department, CabinetMember } from '../../types';
import {
  ArrowLeft,
  ChevronRight,
  Users,
  UserCheck,
  Mail,
  Phone,
  Instagram,
  Target,
  Lightbulb,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

import { formatLeaderDisplay } from '../../utils/leaderUtils';

interface DepartemenPageProps {
  department: Department;
  onClose: () => void;
}

export const DepartemenPage: React.FC<DepartemenPageProps> = ({ department, onClose }) => {
  const { cabinetMembers, siteConfig } = useBEM();

  const isBph = department.id === 'dept-bph' || department.category === 'Badan Pengurus Harian';

  const members = cabinetMembers.filter(
    (m) => m.departmentId === department.id && !m.isKadep
  );

  const visual = department.visual || {};
  const heroBg = `linear-gradient(135deg, ${visual.heroBg || '#800016'}, ${visual.heroBgEnd || '#4a000d'})`;
  const accent = visual.accentColor || visual.heroBg || '#800016';

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── STICKY BACK BAR ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between gap-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <span>BEM FEB UTU</span>
            <ChevronRight className="w-3 h-3" />
            <span>{department.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-700 font-semibold">{department.code}</span>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div style={{ background: heroBg }} className="relative overflow-hidden text-white">
        {visual.bannerImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
            style={{ backgroundImage: `url(${visual.bannerImage})` }}
          />
        )}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <span className="inline-block text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/15 border border-white/25 mb-4">
            {department.category} · {department.code}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 max-w-3xl">
            {department.name}
          </h1>
          {visual.moto && (
            <p className="text-white/80 text-base italic font-light max-w-2xl mb-4">
              &ldquo;{visual.moto}&rdquo;
            </p>
          )}
          <p className="text-white/75 text-sm max-w-2xl leading-relaxed">
            {department.description}
          </p>

          {/* Contact chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {visual.contactWhatsapp && (
              <a
                href={`https://wa.me/${visual.contactWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white/15 border border-white/25 rounded-full hover:bg-white/25 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{visual.contactWhatsapp}</span>
              </a>
            )}
            {visual.contactEmail && (
              <a
                href={`mailto:${visual.contactEmail}`}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white/15 border border-white/25 rounded-full hover:bg-white/25 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{visual.contactEmail}</span>
              </a>
            )}
            {visual.instagramUrl && (
              <a
                href={visual.instagramUrl}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white/15 border border-white/25 rounded-full hover:bg-white/25 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── INFO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center gap-2 mb-3" style={{ color: accent }}>
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Fokus Kerja</span>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed">{department.focus}</p>
          </div>

          {visual.visi && (
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
              <div className="flex items-center gap-2 mb-3" style={{ color: accent }}>
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Visi</span>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed italic">&ldquo;{visual.visi}&rdquo;</p>
            </div>
          )}

          {visual.programUnggulan && (
            <div className="bg-white rounded-xl border border-zinc-200 p-5">
              <div className="flex items-center gap-2 mb-3" style={{ color: accent }}>
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Program Unggulan</span>
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed">{visual.programUnggulan}</p>
            </div>
          )}
        </div>

        {/* ── MISI ── */}
        {visual.misi && visual.misi.length > 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h2 className="text-base font-semibold text-zinc-950 mb-4">Misi {department.name.split('(')[0].trim()}</h2>
            <div className="space-y-2.5">
              {visual.misi.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-zinc-100 bg-zinc-50/60">
                  <span className="font-mono text-xs font-bold shrink-0 mt-0.5" style={{ color: accent }}>
                    0{i + 1}
                  </span>
                  <p className="text-sm text-zinc-700 leading-relaxed">{m}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PIMPINAN / KEPALA ── */}
        {isBph ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5" style={{ color: accent }} />
                Presidium Mahasiswa (Ketua & Wakil Ketua)
              </h2>
              {(() => {
                const ketua = formatLeaderDisplay(
                  siteConfig.sambutan.ketuaName,
                  siteConfig.sambutan.ketuaRole,
                  siteConfig.sambutan.ketuaNim,
                  'Ketua BEM FEB UTU'
                );
                const wakil = formatLeaderDisplay(
                  siteConfig.sambutan.wakilName,
                  siteConfig.sambutan.wakilRole,
                  siteConfig.sambutan.wakilNim,
                  'Wakil Ketua BEM FEB UTU'
                );
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-xl text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: accent }}
                      >
                        {ketua.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mb-1">
                          {ketua.role}
                        </span>
                        <h3 className="font-bold text-zinc-950 text-base">{ketua.name}</h3>
                        {ketua.nim && <p className="text-xs text-zinc-400 font-mono mt-0.5">NIM {ketua.nim}</p>}
                        <p className="text-xs text-zinc-500 mt-1">Presidium Utama BEM FEB UTU</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-xl text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: accent }}
                      >
                        {wakil.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mb-1">
                          {wakil.role}
                        </span>
                        <h3 className="font-bold text-zinc-950 text-base">{wakil.name}</h3>
                        {wakil.nim && <p className="text-xs text-zinc-400 font-mono mt-0.5">NIM {wakil.nim}</p>}
                        <p className="text-xs text-zinc-500 mt-1">Presidium Pendamping BEM FEB UTU</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-950 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: accent }} />
                Kesekretariatan & Kebendaharaan Umum BPH
              </h2>
              {(() => {
                const bphPositions = [
                  { role: 'Sekretaris Umum', sub: 'Pimpinan Kesekretariatan', defName: 'Sekretaris Umum', prodi: 'S1 Akuntansi' },
                  { role: 'Wakil Sekretaris Umum', sub: 'Administrasi & Persuratan', defName: 'Wakil Sekretaris Umum', prodi: 'S1 Manajemen' },
                  { role: 'Bendahara Umum', sub: 'Pimpinan Kebendaharaan', defName: 'Bendahara Umum', prodi: 'S1 Akuntansi' },
                  { role: 'Wakil Bendahara Umum', sub: 'Anggaran & Finansial', defName: 'Wakil Bendahara Umum', prodi: 'S1 Ekonomi Pembangunan' },
                ];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bphPositions.map((pos) => {
                      const matchedMember = members.find(m =>
                        m.role.toLowerCase().includes(pos.role.toLowerCase())
                      );
                      const displayName = matchedMember ? matchedMember.name : pos.defName;
                      const displayNim = matchedMember?.nim;
                      const displayProdi = matchedMember?.prodi || pos.prodi;
                      const displayPhoto = matchedMember?.photoUrl;

                      return (
                        <div key={pos.role} className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col items-center text-center hover:border-zinc-300 transition-all">
                          {displayPhoto ? (
                            <img src={displayPhoto} alt={displayName} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-100 mb-3 shadow-xs" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#800016] border border-rose-200 flex items-center justify-center font-bold text-base mb-3 shadow-xs">
                              {displayName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#800016] mb-0.5">
                            {pos.role}
                          </span>
                          <p className="text-[10px] text-zinc-400 font-mono mb-2">{pos.sub}</p>
                          <h4 className="font-bold text-xs text-zinc-950 leading-tight mb-1">{displayName}</h4>
                          {displayNim && <p className="text-[10px] text-zinc-500 font-mono">{displayNim}</p>}
                          <p className="text-[10px] text-zinc-400 mt-0.5">{displayProdi}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-semibold text-zinc-950 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5" style={{ color: accent }} />
                Ketua Departemen
              </h2>
              <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col sm:flex-row items-start gap-5 max-w-lg">
                {department.kadepPhoto ? (
                  <img
                    src={department.kadepPhoto}
                    alt={department.kadepName}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-zinc-100 shadow-sm shrink-0"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-xl text-white font-bold text-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accent }}
                  >
                    {department.kadepName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div>
                  <p className="font-bold text-zinc-950 text-lg">{department.kadepName}</p>
                  <p className="text-sm text-zinc-500 mb-1">Ketua {department.code}</p>
                  {department.kadepProdi && (
                    <p className="text-xs text-zinc-400 font-mono">{department.kadepProdi}{department.kadepNim && ` · NIM ${department.kadepNim}`}</p>
                  )}
                  {department.kadepQuote && (
                    <blockquote className="mt-3 text-sm italic text-zinc-600 border-l-2 pl-3" style={{ borderColor: accent }}>
                      &ldquo;{department.kadepQuote}&rdquo;
                    </blockquote>
                  )}
                </div>
              </div>
            </div>

            {/* ── JAJARAN PENGURUS ── */}
            {members.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: accent }} />
                  Jajaran Pengurus & Staf
                  <span className="text-xs font-mono text-zinc-400 font-normal">({members.length} orang)</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {members.map((m) => (
                    <MemberCard key={m.id} member={m} accent={accent} />
                  ))}
                </div>
              </div>
            )}

            {members.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-zinc-200 py-10 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                <p className="text-zinc-400 text-sm">Belum ada staf terdaftar di departemen ini.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const MemberCard: React.FC<{ member: CabinetMember; accent: string }> = ({ member, accent }) => (
  <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col items-center text-center hover:border-zinc-300 hover:shadow-sm transition-all">
    {member.photoUrl ? (
      <img
        src={member.photoUrl}
        alt={member.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-zinc-100 mb-3 shadow-sm"
      />
    ) : (
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-base mb-3 shadow-sm"
        style={{ backgroundColor: accent }}
      >
        {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
      </div>
    )}
    <p className="font-semibold text-xs text-zinc-900 leading-tight mb-1">{member.name}</p>
    <p className="text-[10px] text-zinc-500 leading-tight mb-1">{member.role}</p>
    <p className="text-[10px] text-zinc-400 font-mono">{member.prodi}</p>
    {member.nim && <p className="text-[10px] text-zinc-300 font-mono mt-0.5">{member.nim}</p>}
  </div>
);
