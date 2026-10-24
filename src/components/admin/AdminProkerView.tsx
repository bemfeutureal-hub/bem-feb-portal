import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { ProgramKerja } from '../../types';

export const AdminProkerView: React.FC = () => {
  const { programKerja, addProgramKerja, updateProgramKerja, deleteProgramKerja } = useBEM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Advokesma');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<'Akan Datang' | 'Sedang Berjalan' | 'Terlaksana'>('Akan Datang');
  const [description, setDescription] = useState('');
  const [picName, setPicName] = useState('');
  const [location, setLocation] = useState('');
  const [indicator, setIndicator] = useState('');

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setDepartment('Advokesma');
    setTargetDate('');
    setStatus('Akan Datang');
    setDescription('');
    setPicName('');
    setLocation('Gedung Terpadu FEB Universitas Teuku Umar');
    setIndicator('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProgramKerja) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDepartment(p.department);
    setTargetDate(p.targetDate);
    setStatus(p.status);
    setDescription(p.description);
    setPicName(p.picName);
    setLocation(p.location);
    setIndicator(p.indicator);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Mohon isi judul dan deskripsi program kerja.');
      return;
    }

    if (editingId) {
      updateProgramKerja(editingId, {
        title: title.trim(),
        department,
        targetDate: targetDate.trim(),
        status,
        description: description.trim(),
        picName: picName.trim(),
        location: location.trim(),
        indicator: indicator.trim(),
      });
    } else {
      addProgramKerja({
        title: title.trim(),
        department,
        targetDate: targetDate.trim() || 'Desember 2026',
        status,
        description: description.trim(),
        picName: picName.trim(),
        location: location.trim() || 'Kampus FEB UI',
        indicator: indicator.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus program kerja "${name}"?`)) {
      deleteProgramKerja(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Program Kerja</div>
          <h1 className="text-xl font-semibold text-zinc-950 tracking-tight flex items-center gap-2">
            <span>Manajemen Program Kerja</span>
            <span className="text-xs font-mono text-zinc-400 font-normal">
              ({programKerja.length} Proker)
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Susun linimasa kegiatan mahasiswa FEB Universitas Teuku Umar, penanggung jawab departemen, dan capaian target.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-1.5 bg-[#800016] hover:bg-[#680012] text-white font-medium text-xs rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Program Kerja</span>
        </button>
      </div>

      <div className="bg-white rounded border border-zinc-200 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Nama Program Kerja</th>
              <th className="py-2.5 px-3">Departemen & PIC</th>
              <th className="py-2.5 px-3">Jadwal & Lokasi</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {programKerja.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                <td className="py-2.5 px-3 max-w-sm">
                  <div className="font-medium text-zinc-950 text-xs">{p.title}</div>
                  <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                    {p.description}
                  </div>
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-medium text-zinc-800">{p.department}</div>
                  <div className="text-[10px] text-zinc-400">{p.picName}</div>
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap font-mono text-zinc-500 text-[11px]">
                  <div>{p.targetDate}</div>
                  <div className="text-[10px] text-zinc-400">{p.location}</div>
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded border text-[10px] ${
                      p.status === 'Terlaksana'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : p.status === 'Sedang Berjalan'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap text-right space-x-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1 text-zinc-400 hover:text-zinc-800 rounded hover:bg-zinc-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded border border-zinc-200 shadow-xl w-full max-w-md my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-semibold text-zinc-900 text-xs">
                {editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Program Kerja *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama proker..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Departemen</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  >
                    <option value="Advokesma">Advokesma</option>
                    <option value="PSDM & Hubungan Alumni">PSDM</option>
                    <option value="Keilmuan & Riset">Keilmuan</option>
                    <option value="Kewirausahaan">Kewirausahaan</option>
                    <option value="Kastrat">Kastrat</option>
                    <option value="Kominfo">Kominfo</option>
                    <option value="BPH">BPH</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Status Proker</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Terlaksana">Terlaksana</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Jadwal</label>
                  <input
                    type="text"
                    placeholder="Contoh: 24 Oktober 2026"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Auditorium FEB"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Penanggung Jawab (PIC)</label>
                <input
                  type="text"
                  placeholder="Nama PIC"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Deskripsi Kegiatan *</label>
                <textarea
                  required
                  rows={2.5}
                  placeholder="Gambaran pelaksanaan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 font-normal"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-zinc-300 rounded text-zinc-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white font-medium rounded"
                >
                  Simpan Proker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
