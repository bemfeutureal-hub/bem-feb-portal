import React, { useState, useEffect } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Department, DepartmentVisual } from '../../types';
import { Palette, Save, Eye, ChevronDown, Plus, Trash2, X } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';

interface DepartemenCustomizerViewProps {
  onPreview: (dept: Department) => void;
}

const DEFAULT_COLORS = [
  '#800016', '#1e3a5f', '#064e3b', '#7c2d12', '#1e1b4b',
  '#4a1942', '#14532d', '#7f1d1d', '#1c3144', '#3d1a78',
];

export const DepartemenCustomizerView: React.FC<DepartemenCustomizerViewProps> = ({ onPreview }) => {
  const { departments, updateDepartment, showToast } = useBEM();
  const [selectedId, setSelectedId] = useState<string>(departments[0]?.id || '');

  const dept = departments.find((d) => d.id === selectedId) || departments[0];
  const v: DepartmentVisual = dept?.visual || {};

  // Local form state
  const [heroBg, setHeroBg] = useState(v.heroBg || '#800016');
  const [heroBgEnd, setHeroBgEnd] = useState(v.heroBgEnd || '#4a000d');
  const [accentColor, setAccentColor] = useState(v.accentColor || '#800016');
  const [bannerImage, setBannerImage] = useState(v.bannerImage || '');
  const [moto, setMoto] = useState(v.moto || '');
  const [visi, setVisi] = useState(v.visi || '');
  const [misiList, setMisiList] = useState<string[]>(v.misi || ['']);
  const [programUnggulan, setProgramUnggulan] = useState(v.programUnggulan || '');
  const [contactEmail, setContactEmail] = useState(v.contactEmail || '');
  const [contactWhatsapp, setContactWhatsapp] = useState(v.contactWhatsapp || '');
  const [instagramUrl, setInstagramUrl] = useState(v.instagramUrl || '');

  // Sync form when department selection changes
  useEffect(() => {
    if (!dept) return;
    const nv: DepartmentVisual = dept.visual || {};
    setHeroBg(nv.heroBg || '#800016');
    setHeroBgEnd(nv.heroBgEnd || '#4a000d');
    setAccentColor(nv.accentColor || '#800016');
    setBannerImage(nv.bannerImage || '');
    setMoto(nv.moto || '');
    setVisi(nv.visi || '');
    setMisiList(nv.misi || ['']);
    setProgramUnggulan(nv.programUnggulan || '');
    setContactEmail(nv.contactEmail || '');
    setContactWhatsapp(nv.contactWhatsapp || '');
    setInstagramUrl(nv.instagramUrl || '');
  }, [selectedId]);

  const handleSave = () => {
    const visual: DepartmentVisual = {
      heroBg, heroBgEnd, accentColor,
      bannerImage: bannerImage || undefined,
      moto: moto || undefined,
      visi: visi || undefined,
      misi: misiList.filter(Boolean).length > 0 ? misiList.filter(Boolean) : undefined,
      programUnggulan: programUnggulan || undefined,
      contactEmail: contactEmail || undefined,
      contactWhatsapp: contactWhatsapp || undefined,
      instagramUrl: instagramUrl || undefined,
    };
    updateDepartment(selectedId, { visual });
    showToast(`Tampilan halaman ${dept?.code} berhasil disimpan.`);
  };

  const addMisi = () => setMisiList((p) => [...p, '']);
  const removeMisi = (i: number) => setMisiList((p) => p.filter((_, idx) => idx !== i));
  const updateMisi = (i: number, val: string) =>
    setMisiList((p) => p.map((m, idx) => (idx === i ? val : m)));

  const previewBg = `linear-gradient(135deg, ${heroBg}, ${heroBgEnd})`;

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen overflow-hidden">
      {/* ── LEFT: form ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 border-r border-zinc-200">
        {/* Department selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
          <div>
            <p className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Kustomisasi Halaman Departemen</p>
            <h1 className="text-lg font-semibold text-zinc-950">Atur Tampilan Halaman Departemen</h1>
            <p className="text-xs text-zinc-500">Setiap departemen dapat memiliki warna, banner, visi-misi, dan kontak tersendiri.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => dept && onPreview(dept)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          </div>
        </div>

        {/* Select department */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Pilih Departemen / Biro</label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none px-3 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-800 focus:outline-none focus:border-zinc-500 pr-8 cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.code}] {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* Colors */}
          <section className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
            <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Warna Tema
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Warna Hero (Atas)', val: heroBg, set: setHeroBg },
                { label: 'Warna Hero (Bawah)', val: heroBgEnd, set: setHeroBgEnd },
                { label: 'Warna Aksen', val: accentColor, set: setAccentColor },
              ].map((c) => (
                <div key={c.label}>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">{c.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={c.val}
                      onChange={(e) => c.set(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={c.val}
                      onChange={(e) => c.set(e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700 focus:outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {DEFAULT_COLORS.map((dc) => (
                      <button
                        key={dc}
                        type="button"
                        onClick={() => c.set(dc)}
                        className="w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform"
                        style={{ backgroundColor: dc, borderColor: c.val === dc ? '#000' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Banner & Identity */}
          <section className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Banner & Identitas</h3>

            <ImageUploadField
              label="Foto Banner Header Departemen"
              description="Foto kegiatan atau dokumentasi departemen sebagai latar halaman"
              recommendedSize="Rasio 16:9 landscape (min. 1200×600 px)"
              aspectRatio="cover"
              value={bannerImage}
              onChange={setBannerImage}
              allowGallery
            />

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Moto / Tagline Departemen</label>
              <input
                type="text"
                value={moto}
                onChange={(e) => setMoto(e.target.value)}
                placeholder="Contoh: Suara Mahasiswa adalah Prioritas Kami"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
              />
            </div>
          </section>

          {/* Visi Misi */}
          <section className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Visi & Misi</h3>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Visi Departemen</label>
              <textarea
                rows={2}
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                placeholder="Tulis visi departemen..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm resize-none focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Misi (masing-masing poin)</label>
              <div className="space-y-2">
                {misiList.map((m, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs font-mono font-bold text-zinc-400 w-5 mt-2.5 shrink-0">0{i + 1}</span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => updateMisi(i, e.target.value)}
                      placeholder={`Misi ${i + 1}...`}
                      className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeMisi(i)}
                      className="mt-1.5 p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMisi}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 mt-1 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin Misi</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Program Unggulan</label>
              <textarea
                rows={2}
                value={programUnggulan}
                onChange={(e) => setProgramUnggulan(e.target.value)}
                placeholder="Deskripsi program andalan departemen ini..."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm resize-none focus:outline-none focus:border-zinc-400"
              />
            </div>
          </section>

          {/* Kontak */}
          <section className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Kontak Departemen</h3>
            {[
              { label: 'Email', val: contactEmail, set: setContactEmail, placeholder: 'adkesma@bemfeb.utu.ac.id' },
              { label: 'WhatsApp / HP', val: contactWhatsapp, set: setContactWhatsapp, placeholder: '+62 822-xxxx-xxxx' },
              { label: 'Instagram URL', val: instagramUrl, set: setInstagramUrl, placeholder: 'https://instagram.com/adkesma.bemfeb' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-zinc-700 mb-1">{f.label}</label>
                <input
                  type="text"
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-400"
                />
              </div>
            ))}
          </section>
        </div>

        {/* Save button bottom */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2 text-sm font-semibold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Tampilan Halaman</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT: live preview ── */}
      <div className="hidden xl:flex xl:w-72 shrink-0 flex-col border-l border-zinc-200 bg-zinc-50 overflow-y-auto">
        <div className="p-4 border-b border-zinc-200">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Pratinjau Hero</p>
        </div>
        <div style={{ background: previewBg }} className="relative p-6 text-white min-h-40 flex flex-col justify-end">
          {bannerImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${bannerImage})` }}
            />
          )}
          <div className="relative">
            <span className="text-[10px] font-mono bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
              {dept?.code}
            </span>
            <p className="font-bold text-base mt-2 leading-snug">{dept?.name}</p>
            {moto && <p className="text-white/70 text-xs italic mt-1">&ldquo;{moto}&rdquo;</p>}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-[10px] font-mono text-zinc-400 mb-1">AKSEN</p>
            <div className="w-full h-4 rounded" style={{ backgroundColor: accentColor }} />
          </div>
          {visi && (
            <div>
              <p className="text-[10px] font-mono text-zinc-400 mb-1">VISI</p>
              <p className="text-xs text-zinc-700 italic line-clamp-3">&ldquo;{visi}&rdquo;</p>
            </div>
          )}
          {misiList.filter(Boolean).length > 0 && (
            <div>
              <p className="text-[10px] font-mono text-zinc-400 mb-1">MISI ({misiList.filter(Boolean).length} poin)</p>
              <div className="space-y-1">
                {misiList.filter(Boolean).slice(0, 3).map((m, i) => (
                  <div key={i} className="flex gap-1.5 text-xs text-zinc-600">
                    <span className="font-mono font-bold shrink-0" style={{ color: accentColor }}>0{i + 1}.</span>
                    <span className="line-clamp-1">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
