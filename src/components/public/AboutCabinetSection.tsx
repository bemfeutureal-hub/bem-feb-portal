import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { UserCheck, Building2, Quote, Users } from 'lucide-react';
import { formatLeaderDisplay } from '../../utils/leaderUtils';

export const AboutCabinetSection: React.FC = () => {
  const { siteConfig, departments, cabinetMembers } = useBEM();

  const [activeDeptId, setActiveDeptId] = useState<string>(departments[0]?.id || '');

  const activeDept = departments.find((d) => d.id === activeDeptId) || departments[0];

  const activeDeptMembers = cabinetMembers.filter(
    (m) => m.departmentId === activeDept?.id && !m.isKadep
  );

  return (
    <section
      id="tentang-kabinet"
      style={{ backgroundColor: siteConfig.visuals?.aboutSectionBackground || '#ffffff' }}
      className="py-14 sm:py-20 border-b border-zinc-200/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sambutan Presidium Ketua & Wakil */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16 pb-16 border-b border-zinc-200/80">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded overflow-hidden border border-zinc-200/80 bg-zinc-100 shadow-xs">
              <img
                src={siteConfig.sambutan.leadersImage}
                alt="Presidium BEM FEB Universitas Teuku Umar"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-auto aspect-4/3 object-cover"
              />
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
                  <div className="p-3.5 bg-gradient-to-r from-[#800016] to-[#5a000f] text-white border-t border-rose-900/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border-b sm:border-b-0 sm:border-r border-rose-800/60 pb-2 sm:pb-0 sm:pr-3">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-300">
                          {ketua.role}
                        </span>
                        <p className="font-bold text-white text-sm leading-snug">
                          {ketua.name}
                        </p>
                        {ketua.nim && (
                          <p className="text-rose-200 text-[10px] font-mono mt-0.5">
                            NIM {ketua.nim}
                          </p>
                        )}
                      </div>
                      <div className="sm:pl-1 sm:text-right">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-300">
                          {wakil.role}
                        </span>
                        <p className="font-bold text-white text-sm leading-snug">
                          {wakil.name}
                        </p>
                        {wakil.nim && (
                          <p className="text-rose-200 text-[10px] font-mono mt-0.5">
                            NIM {wakil.nim}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="text-xs text-[#800016] font-semibold mb-2 tracking-tight">
              Sambutan Presidium Mahasiswa FEB UTU
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 tracking-tight mb-4 [text-wrap:balance]">
              Menghubungkan Aspirasi, Menghadirkan Solusi Nyata
            </h2>

            <blockquote className="py-1 pl-4 border-l-2 border-[#800016] text-zinc-800 text-xs sm:text-sm italic mb-4 leading-relaxed font-normal">
              {siteConfig.sambutan.quote}
            </blockquote>

            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              {siteConfig.sambutan.fullMessage}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-mono">
              <div>
                <span className="text-zinc-400 mr-1.5">Universitas:</span>
                <span className="text-zinc-900 font-medium">{siteConfig.universityName}</span>
              </div>
              <span aria-hidden="true" className="text-zinc-300 hidden sm:inline">/</span>
              <div>
                <span className="text-zinc-400 mr-1.5">Kabinet:</span>
                <span className="text-zinc-900 font-medium">{siteConfig.cabinetName}</span>
              </div>
              <span aria-hidden="true" className="text-zinc-300 hidden sm:inline">/</span>
              <div>
                <span className="text-zinc-400 mr-1.5">Masa Bakti:</span>
                <span className="text-zinc-900 font-medium">{siteConfig.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 pb-16 border-b border-zinc-200/80">
          <div className="md:col-span-5">
            <div className="text-xs text-[#800016] font-medium mb-1.5">
              Arah Gerak Organisasi
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-950 tracking-tight mb-3">
              Visi Kabinet
            </h3>
            <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed bg-rose-50/50 p-4 rounded border border-rose-100 font-normal">
              &ldquo;{siteConfig.visi}&rdquo;
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="text-xs text-[#800016] font-medium mb-1.5">
              Rencana Strategis
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-zinc-950 tracking-tight mb-3">
              Misi BEM FEB UTU
            </h3>
            <div className="space-y-2.5">
              {siteConfig.misi.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded border border-zinc-200/80 bg-white">
                  <span className="font-mono text-xs text-[#800016] font-bold shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Departemen & Pengurus Showcase (bemfebui inspired) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs text-[#800016] font-semibold mb-1">
                Struktur Organisasi
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-950 tracking-tight">
                Departemen & Biro BEM FEB UTU
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pilih satuan departemen untuk melihat fokus kerja, Ketua Departemen, dan jajaran fungsionaris.
              </p>
            </div>
          </div>

          {/* Department Filter Tabs — horizontally scrollable on mobile */}
          <div className="relative">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 border-b border-zinc-200 scrollbar-hide">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveDeptId(dept.id)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeDept?.id === dept.id
                      ? 'bg-[#800016] text-white font-medium shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <span className="font-mono text-[10px]">{dept.code}</span>
                  <span>{dept.name.split('(')[0].trim()}</span>
                </button>
              ))}
            </div>
            {/* Right fade hint for horizontal scroll */}
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
          </div>

          {/* Active Department Spotlight */}
          {activeDept && (
            <div className="space-y-6">
              {/* Header Card of the Department */}
              <div className="p-5 rounded border border-zinc-200/90 bg-zinc-50/70">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {activeDept.code}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {activeDept.category}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-semibold text-zinc-950 mb-1">
                      {activeDept.name}
                    </h4>

                    <p className="text-xs text-zinc-600 leading-relaxed mb-3 font-normal max-w-2xl">
                      {activeDept.description}
                    </p>

                    <div className="text-[11px] text-zinc-500 font-mono">
                      <strong className="text-zinc-800 font-sans">Arah Fokus: </strong>
                      <span>{activeDept.focus}</span>
                    </div>
                  </div>

                  {/* Ketua Departemen Spotlight Card */}
                  <div className="lg:col-span-4 bg-white p-4 rounded border border-rose-100 shadow-xs">
                    <div className="text-[10px] text-[#800016] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                      <UserCheck className="w-3.5 h-3.5 text-[#800016]" />
                      <span>Ketua Departemen (Kadep)</span>
                    </div>

                    <div className="flex items-start gap-3">
                      {activeDept.kadepPhoto ? (
                        <img
                          src={activeDept.kadepPhoto}
                          alt={activeDept.kadepName}
                          className="w-11 h-11 rounded-full object-cover border border-[#800016]/20 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#800016] text-white font-semibold flex items-center justify-center text-xs shrink-0 font-mono">
                          {activeDept.kadepName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h5 className="font-semibold text-xs text-zinc-950 truncate">
                          {activeDept.kadepName}
                        </h5>
                        <p className="text-[11px] text-zinc-600 font-normal">
                          {activeDept.kadepProdi}
                        </p>
                        {activeDept.kadepNim && (
                          <p className="text-[10px] text-zinc-400 font-mono">
                            NIM {activeDept.kadepNim}
                          </p>
                        )}
                      </div>
                    </div>

                    {activeDept.kadepQuote && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-100 text-[10px] text-zinc-600 italic leading-relaxed">
                        &ldquo;{activeDept.kadepQuote}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Staff Roster Grid */}
              <div>
                <h5 className="text-xs font-semibold text-zinc-900 mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#800016]" />
                  <span>Jajaran Fungsionaris & Staf {activeDept.name.split('(')[0].trim()} ({activeDeptMembers.length})</span>
                </h5>

                {activeDeptMembers.length === 0 ? (
                  <div className="p-6 bg-zinc-50 rounded border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
                    Belum ada anggota staf tambahan yang didaftarkan pada departemen ini.
                  </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                    {activeDeptMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-3 sm:p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-rose-200 hover:shadow-xs transition-all flex flex-col items-center sm:items-start text-center sm:text-left group"
                      >
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full sm:rounded-xl object-cover border-2 border-rose-100 mb-2 shadow-2xs group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full sm:rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 text-[#800016] border border-rose-200 font-bold flex items-center justify-center text-xs mb-2 font-mono group-hover:scale-105 transition-transform">
                            {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                        )}
                        <h6 className="font-bold text-xs text-zinc-950 truncate w-full">{member.name}</h6>
                        <span className="inline-block text-[10px] text-[#800016] font-semibold mt-0.5">
                          {member.role}
                        </span>
                        <div className="mt-2 pt-2 border-t border-zinc-100 text-[10px] text-zinc-400 font-mono w-full">
                          {member.prodi} · &apos;{member.generation.slice(-2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
