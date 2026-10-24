import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import { Plus, Edit2, Trash2, X, Users, Building2, UserCheck, Quote, BookOpen } from 'lucide-react';
import { Department, CabinetMember } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';

export const AdminCabinetView: React.FC = () => {
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    cabinetMembers,
    addCabinetMember,
    updateCabinetMember,
    deleteCabinetMember,
  } = useBEM();

  // Active sub-tab: 'departments' or 'members'
  const [activeTab, setActiveTab] = useState<'departments' | 'members'>('departments');

  // --- Department Modal State ---
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptCategory, setDeptCategory] = useState<'Departemen' | 'Biro' | 'Badan Pengurus Harian'>('Departemen');
  const [deptDescription, setDeptDescription] = useState('');
  const [deptFocus, setDeptFocus] = useState('');
  const [kadepName, setKadepName] = useState('');
  const [kadepNim, setKadepNim] = useState('');
  const [kadepProdi, setKadepProdi] = useState('S1 Manajemen');
  const [kadepQuote, setKadepQuote] = useState('');
  const [kadepPhoto, setKadepPhoto] = useState('');

  // --- Member Modal State ---
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('Staf Ahli');
  const [memberDeptId, setMemberDeptId] = useState(departments[0]?.id || '');
  const [memberProdi, setMemberProdi] = useState('S1 Manajemen');
  const [memberNim, setMemberNim] = useState('');
  const [memberGeneration, setMemberGeneration] = useState('2023');
  const [memberPhoto, setMemberPhoto] = useState('');

  // Filter for members tab
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('Semua');

  // Open Add Department
  const handleOpenAddDept = () => {
    setEditingDeptId(null);
    setDeptName('');
    setDeptCode('');
    setDeptCategory('Departemen');
    setDeptDescription('');
    setDeptFocus('');
    setKadepName('');
    setKadepNim('');
    setKadepProdi('S1 Manajemen');
    setKadepQuote('');
    setKadepPhoto('');
    setIsDeptModalOpen(true);
  };

  // Open Edit Department
  const handleOpenEditDept = (dept: Department) => {
    setEditingDeptId(dept.id);
    setDeptName(dept.name);
    setDeptCode(dept.code);
    setDeptCategory(dept.category);
    setDeptDescription(dept.description);
    setDeptFocus(dept.focus);
    setKadepName(dept.kadepName);
    setKadepNim(dept.kadepNim || '');
    setKadepProdi(dept.kadepProdi || 'S1 Manajemen');
    setKadepQuote(dept.kadepQuote || '');
    setKadepPhoto(dept.kadepPhoto || '');
    setIsDeptModalOpen(true);
  };

  // Submit Department
  const handleSubmitDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || !deptCode.trim() || !kadepName.trim()) {
      alert('Mohon isi nama departemen, kode singkatan, dan nama Ketua Departemen.');
      return;
    }

    if (editingDeptId) {
      updateDepartment(editingDeptId, {
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        category: deptCategory,
        description: deptDescription.trim(),
        focus: deptFocus.trim(),
        kadepName: kadepName.trim(),
        kadepNim: kadepNim.trim(),
        kadepProdi,
        kadepQuote: kadepQuote.trim(),
        kadepPhoto: kadepPhoto.trim(),
      });
    } else {
      addDepartment({
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        category: deptCategory,
        description: deptDescription.trim(),
        focus: deptFocus.trim(),
        kadepName: kadepName.trim(),
        kadepNim: kadepNim.trim(),
        kadepProdi,
        kadepQuote: kadepQuote.trim(),
        kadepPhoto: kadepPhoto.trim(),
      });
    }

    setIsDeptModalOpen(false);
  };

  // Delete Department
  const handleDeleteDept = (id: string, name: string) => {
    if (window.confirm(`Hapus departemen "${name}" beserta seluruh pengurusnya?`)) {
      deleteDepartment(id);
    }
  };

  // Open Add Member
  const handleOpenAddMember = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberRole('Staf Ahli');
    setMemberDeptId(departments[0]?.id || '');
    setMemberProdi('S1 Manajemen');
    setMemberNim('');
    setMemberGeneration('2023');
    setMemberPhoto('');
    setIsMemberModalOpen(true);
  };

  // Open Edit Member
  const handleOpenEditMember = (m: CabinetMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name);
    setMemberRole(m.role);
    setMemberDeptId(m.departmentId);
    setMemberProdi(m.prodi);
    setMemberNim(m.nim || '');
    setMemberGeneration(m.generation);
    setMemberPhoto(m.photoUrl || '');
    setIsMemberModalOpen(true);
  };

  // Submit Member
  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) {
      alert('Mohon isi nama pengurus dan jabatan.');
      return;
    }

    const deptObj = departments.find((d) => d.id === memberDeptId) || departments[0];

    if (editingMemberId) {
      updateCabinetMember(editingMemberId, {
        name: memberName.trim(),
        role: memberRole.trim(),
        departmentId: deptObj?.id || '',
        departmentName: deptObj?.name || 'Departemen FEB',
        prodi: memberProdi,
        nim: memberNim.trim(),
        generation: memberGeneration.trim(),
        photoUrl: memberPhoto.trim(),
      });
    } else {
      addCabinetMember({
        name: memberName.trim(),
        role: memberRole.trim(),
        departmentId: deptObj?.id || '',
        departmentName: deptObj?.name || 'Departemen FEB',
        prodi: memberProdi,
        nim: memberNim.trim(),
        generation: memberGeneration.trim(),
        photoUrl: memberPhoto.trim(),
      });
    }

    setIsMemberModalOpen(false);
  };

  // Delete Member
  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Hapus pengurus "${name}"?`)) {
      deleteCabinetMember(id);
    }
  };

  const filteredMembers = cabinetMembers.filter(
    (m) => selectedDeptFilter === 'Semua' || m.departmentId === selectedDeptFilter
  );

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Struktur Organisasi</div>
          <h1 className="text-xl font-semibold text-zinc-950 tracking-tight flex items-center gap-2">
            <span>Manajemen Departemen, Ketua & Pengurus</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Kelola daftar departemen/biro, tunjuk Ketua Departemen (Kadep), serta susun daftar anggota staf kabinet.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'departments' ? (
            <button
              onClick={handleOpenAddDept}
              className="px-3.5 py-1.5 bg-[#800016] hover:bg-[#680012] text-white font-medium text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Departemen Baru</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddMember}
              className="px-3.5 py-1.5 bg-[#800016] hover:bg-[#680012] text-white font-medium text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Pengurus</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 text-xs">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 font-medium transition-colors cursor-pointer flex items-center gap-2 border-b-2 -mb-[2px] ${
            activeTab === 'departments'
              ? 'border-[#800016] text-[#800016] font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Daftar Departemen & Ketua (Kadep) ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 font-medium transition-colors cursor-pointer flex items-center gap-2 border-b-2 -mb-[2px] ${
            activeTab === 'members'
              ? 'border-[#800016] text-[#800016] font-semibold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Daftar Pengurus & Staf ({cabinetMembers.length})</span>
        </button>
      </div>

      {/* --- TAB 1: DEPARTMENTS & KETUA DEPARTEMEN --- */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const staffCount = cabinetMembers.filter((m) => m.departmentId === dept.id).length;

              return (
                <div
                  key={dept.id}
                  className="p-4 bg-white rounded border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Code */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] font-bold text-[#800016] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {dept.code}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {dept.category} · {staffCount} Pengurus
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-950 mb-1 leading-snug">
                      {dept.name}
                    </h3>

                    <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed mb-3 font-normal">
                      {dept.description}
                    </p>

                    {/* Spotlight: Ketua Departemen */}
                    <div className="p-3 bg-zinc-50 rounded border border-zinc-200/70 mb-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                        <UserCheck className="w-3 h-3 text-[#800016]" />
                        <span>Ketua Departemen (Kadep):</span>
                      </div>
                      <div className="font-medium text-xs text-zinc-900">{dept.kadepName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {dept.kadepProdi} {dept.kadepNim && `· NIM ${dept.kadepNim}`}
                      </div>
                      {dept.kadepQuote && (
                        <div className="text-[10px] text-zinc-600 italic pt-1 border-t border-zinc-200/60 line-clamp-1">
                          &ldquo;{dept.kadepQuote}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEditDept(dept)}
                      className="px-2.5 py-1 text-xs text-zinc-700 hover:text-black hover:bg-zinc-100 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-zinc-500" />
                      <span>Edit Kadep & Dept</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDept(dept.id, dept.name)}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                      title="Hapus Departemen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 2: MEMBERS & STAFF --- */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {/* Department Filter for members */}
          <div className="bg-white p-3 rounded border border-zinc-200 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Filter Departemen:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1 text-zinc-800 text-xs"
              >
                <option value="Semua">Semua Departemen ({cabinetMembers.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Menampilkan {filteredMembers.length} Personel
            </div>
          </div>

          <div className="bg-white rounded border border-zinc-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Nama Pengurus</th>
                  <th className="py-2.5 px-3">Jabatan</th>
                  <th className="py-2.5 px-3">Departemen</th>
                  <th className="py-2.5 px-3">Program Studi</th>
                  <th className="py-2.5 px-3 text-center">Angkatan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-zinc-950">
                      <span>{m.name}</span>
                      {m.isKadep && (
                        <span className="ml-2 text-[9px] font-mono text-[#800016] bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded font-semibold">
                          Ketua
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-800 font-normal">{m.role}</td>
                    <td className="py-2.5 px-3 text-zinc-500">{m.departmentName}</td>
                    <td className="py-2.5 px-3 text-zinc-500">{m.prodi}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-zinc-400 text-[11px]">{m.generation}</td>
                    <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditMember(m)}
                        className="p-1 text-zinc-400 hover:text-zinc-800 rounded hover:bg-zinc-100"
                        title="Edit Pengurus"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100"
                        title="Hapus Pengurus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT DEPARTMENT & KETUA DEPARTEMEN --- */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded border border-zinc-200 shadow-xl w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-semibold text-zinc-900 text-xs">
                {editingDeptId ? 'Edit Departemen & Ketua Departemen' : 'Tambah Departemen & Ketua Baru'}
              </h3>
              <button
                onClick={() => setIsDeptModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDept} className="p-5 space-y-3.5 text-xs max-h-[82vh] overflow-y-auto">
              <div className="font-semibold text-zinc-900 border-b border-zinc-100 pb-1">
                Data Entitas Departemen / Biro
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Lengkap Departemen *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Departemen Advokasi & Kesejahteraan Mahasiswa (Adkesma)"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Kode / Singkatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ADKESMA"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Kategori Satuan</label>
                  <select
                    value={deptCategory}
                    onChange={(e) => setDeptCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  >
                    <option value="Departemen">Departemen</option>
                    <option value="Biro">Biro</option>
                    <option value="Badan Pengurus Harian">Badan Pengurus Harian (BPH)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Fokus & Arah Gerak</label>
                <input
                  type="text"
                  placeholder="Contoh: Pelayanan Advokasi, Penyesuaian UKT & Beasiswa"
                  value={deptFocus}
                  onChange={(e) => setDeptFocus(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Deskripsi Singkat Departemen</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan peran departemen dalam kabinet..."
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-normal leading-relaxed"
                ></textarea>
              </div>

              {/* Ketua Departemen Assignment */}
              <div className="font-semibold text-zinc-900 border-b border-zinc-100 pt-2 pb-1">
                Ketua Departemen (Kadep / Kepala Biro)
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Ketua Departemen *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Kadep..."
                  value={kadepName}
                  onChange={(e) => setKadepName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Program Studi Kadep</label>
                  <select
                    value={kadepProdi}
                    onChange={(e) => setKadepProdi(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  >
                    <option value="S1 Manajemen">S1 Manajemen</option>
                    <option value="S1 Ekonomi Pembangunan">S1 Ekonomi Pembangunan</option>
                    <option value="S1 Akuntansi">S1 Akuntansi</option>
                    <option value="S1 Bisnis Digital">S1 Bisnis Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">NIM Kadep (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 220590403011"
                    value={kadepNim}
                    onChange={(e) => setKadepNim(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Pesan / Kutipan Kadep</label>
                <input
                  type="text"
                  placeholder="Kutipan prinsip kepemimpinan dari Kadep..."
                  value={kadepQuote}
                  onChange={(e) => setKadepQuote(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 italic font-normal"
                />
              </div>

              {/* Kadep Photo Upload */}
              <div className="pt-2 border-t border-zinc-200">
                <ImageUploadField
                  label="Foto Resmi Ketua Departemen (Kadep)"
                  description="Foto profil portrait / square untuk profil Kadep"
                  recommendedSize="Rasio 1:1 Square atau Pasfoto (JPG/PNG, maks 5MB)"
                  aspectRatio="square"
                  value={kadepPhoto}
                  onChange={setKadepPhoto}
                  allowGallery={true}
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-3.5 py-1.5 border border-zinc-300 rounded text-zinc-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#800016] hover:bg-[#680012] text-white font-medium rounded cursor-pointer"
                >
                  {editingDeptId ? 'Simpan Perubahan' : 'Tambah Departemen & Kadep'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT MEMBER & STAFF --- */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded border border-zinc-200 shadow-xl w-full max-w-sm my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="font-semibold text-zinc-900 text-xs">
                {editingMemberId ? 'Edit Data Pengurus' : 'Tambah Pengurus / Staf'}
              </h3>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitMember} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Nama Pengurus *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap..."
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Departemen / Satuan *</label>
                <select
                  value={memberDeptId}
                  onChange={(e) => setMemberDeptId(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Jabatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Wakil Kadep, Sekretaris, Staf Ahli, Staf Muda"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Program Studi</label>
                  <select
                    value={memberProdi}
                    onChange={(e) => setMemberProdi(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800"
                  >
                    <option value="S1 Manajemen">S1 Manajemen</option>
                    <option value="S1 Ekonomi Pembangunan">S1 Ekonomi Pembangunan</option>
                    <option value="S1 Akuntansi">S1 Akuntansi</option>
                    <option value="S1 Bisnis Digital">S1 Bisnis Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Angkatan</label>
                  <input
                    type="text"
                    placeholder="2023"
                    value={memberGeneration}
                    onChange={(e) => setMemberGeneration(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">NIM Mahasiswa</label>
                <input
                  type="text"
                  placeholder="Contoh: 230590401015"
                  value={memberNim}
                  onChange={(e) => setMemberNim(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded text-zinc-800 font-mono"
                />
              </div>

              {/* Member Photo Upload */}
              <div className="pt-2 border-t border-zinc-200">
                <ImageUploadField
                  label="Foto Profil Pengurus / Staf"
                  description="Foto formal staf untuk tampilan jajaran departemen"
                  recommendedSize="Rasio 1:1 Square atau Pasfoto (JPG/PNG)"
                  aspectRatio="square"
                  value={memberPhoto}
                  onChange={setMemberPhoto}
                  allowGallery={true}
                />
              </div>

              <div className="pt-2 border-t border-zinc-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-3 py-1.5 border border-zinc-300 rounded text-zinc-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#800016] hover:bg-[#680012] text-white font-medium rounded"
                >
                  Simpan Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
