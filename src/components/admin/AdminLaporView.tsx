import React, { useState } from 'react';
import { useBEM } from '../../context/BEMContext';
import {
  Search,
  Eye,
  EyeOff,
  Trash2,
  Send,
  X,
} from 'lucide-react';
import { LaporTicket, LaporStatus, LaporUrgency, LaporCategory } from '../../types';

export const AdminLaporView: React.FC = () => {
  const {
    laporTickets,
    updateLaporStatus,
    addLaporResponse,
    toggleLaporVisibility,
    deleteLaporTicket,
  } = useBEM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Currently opened ticket in inspector drawer
  const [activeTicket, setActiveTicket] = useState<LaporTicket | null>(null);

  // Form states for updating active ticket
  const [newStatus, setNewStatus] = useState<LaporStatus>('Menunggu Verifikasi');
  const [resolutionNote, setResolutionNote] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [responderName] = useState('Biro Advokesma BEM FEB UTU');
  const [responderRole] = useState('Divisi Advokasi Kesejahteraan Mahasiswa');

  const handleSelectTicket = (ticket: LaporTicket) => {
    setActiveTicket(ticket);
    setNewStatus(ticket.status);
    setResolutionNote(ticket.officialResolutionNote || '');
    setReplyMessage('');
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    updateLaporStatus(activeTicket.id, newStatus, resolutionNote);
    setActiveTicket((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            officialResolutionNote: resolutionNote,
          }
        : null
    );
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;
    addLaporResponse(activeTicket.id, replyMessage.trim(), responderName, responderRole);
    setReplyMessage('');
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setActiveTicket((prev) =>
      prev
        ? {
            ...prev,
            updatedAt: nowStr,
            responses: [
              ...prev.responses,
              {
                id: `resp-${Date.now()}`,
                sender: responderName,
                role: responderRole,
                message: replyMessage.trim(),
                date: nowStr,
              },
            ],
          }
        : null
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Hapus tiket ${id}?`)) {
      deleteLaporTicket(id);
      if (activeTicket?.id === id) {
        setActiveTicket(null);
      }
    }
  };

  const filteredTickets = laporTickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    const matchQuery =
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.reporterName.toLowerCase().includes(query) ||
      (ticket.reporterNim && ticket.reporterNim.includes(query));

    const matchStatus = selectedStatus === 'Semua' || ticket.status === selectedStatus;
    const matchCategory = selectedCategory === 'Semua' || ticket.category === selectedCategory;

    return matchQuery && matchStatus && matchCategory;
  });

  const getMinimalStatusBadge = (status: LaporStatus) => {
    switch (status) {
      case 'Selesai Ditindaklanjuti':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Audiensi Dekanat':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Diproses Advokesma':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Ditolak':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      case 'Menunggu Verifikasi':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="text-[11px] text-zinc-400 font-mono">BEM FEB UTU / Advokasi</div>
          <h1 className="text-xl font-semibold text-zinc-950 tracking-tight flex items-center gap-2">
            <span>Manajemen Lapor BEM FEB UTU</span>
            <span className="text-xs font-mono text-zinc-400 font-normal">
              ({laporTickets.length} Laporan)
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Verifikasi aduan mahasiswa, perbarui status audiensi Dekanat, dan kirimkan tanggapan resmi.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded border border-zinc-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID Tiket, Judul, Isi, Nama Mahasiswa, atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded text-zinc-800 focus:bg-white focus:outline-none focus:border-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diproses Advokesma">Diproses Advokesma</option>
            <option value="Audiensi Dekanat">Audiensi Dekanat</option>
            <option value="Selesai Ditindaklanjuti">Selesai Ditindaklanjuti</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-800 focus:outline-none max-w-[150px] truncate"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Fasilitas & Sarpras Kampus">Fasilitas & Sarpras</option>
            <option value="Akademik & Perkuliahan">Akademik & Perkuliahan</option>
            <option value="Finansial & Banding UKT">Finansial & Banding UKT</option>
            <option value="Advokasi Kasus & Kekerasan/Perundungan">Advokasi Kasus</option>
            <option value="Kemahasiswaan & Ormawa">Kemahasiswaan</option>
          </select>
        </div>
      </div>

      {/* Main Table / Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${activeTicket ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded border border-zinc-200 overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Kode Tiket</th>
                  <th className="py-2.5 px-3">Pokok Aduan</th>
                  <th className="py-2.5 px-3">Pelapor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-center">Publik</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      Tidak ada aduan yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`hover:bg-zinc-50 transition-colors cursor-pointer ${
                        activeTicket?.id === ticket.id ? 'bg-zinc-100/60 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-mono text-zinc-900 font-medium">{ticket.id}</div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                          {ticket.category}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <p className="font-medium text-zinc-950 line-clamp-1 max-w-xs text-xs">
                          {ticket.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {ticket.createdAt}
                        </p>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="text-zinc-800 truncate max-w-[110px] font-normal">
                          {ticket.reporterName}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-[110px]">
                          {ticket.reporterProdi}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-normal ${getMinimalStatusBadge(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLaporVisibility(ticket.id);
                          }}
                          className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors"
                          title={ticket.isPublic ? 'Publik' : 'Privat'}
                        >
                          {ticket.isPublic ? (
                            <Eye className="w-3.5 h-3.5 text-zinc-800" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-zinc-300" />
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(ticket.id);
                          }}
                          className="p-1 text-zinc-300 hover:text-rose-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspector & Action Drawer */}
        {activeTicket && (
          <div className="lg:col-span-5 bg-white rounded border border-zinc-200 p-4 space-y-4 text-xs animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200">
              <div>
                <span className="font-mono font-medium text-xs text-zinc-950">
                  {activeTicket.id}
                </span>
                <span
                  className={`ml-2 px-1.5 py-0.2 rounded border text-[10px] ${getMinimalStatusBadge(
                    activeTicket.status
                  )}`}
                >
                  {activeTicket.status}
                </span>
              </div>

              <button
                onClick={() => setActiveTicket(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reporter Profile */}
            <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200/80 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nama:</span>
                <span className="font-medium text-zinc-800">{activeTicket.reporterName}</span>
              </div>
              {activeTicket.reporterNim && (
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-400">NIM:</span>
                  <span className="text-zinc-800">{activeTicket.reporterNim}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Prodi:</span>
                <span className="text-zinc-800">{activeTicket.reporterProdi}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-zinc-400">Email:</span>
                <span className="text-zinc-800">{activeTicket.reporterEmail}</span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h4 className="font-medium text-xs text-zinc-950 mb-1">{activeTicket.title}</h4>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line bg-zinc-50/60 p-2 rounded border border-zinc-150 text-[11px] font-normal">
                {activeTicket.description}
              </p>
              {activeTicket.proposedSolution && (
                <p className="text-[10px] text-zinc-500 mt-1">
                  <strong>Usulan: </strong>
                  {activeTicket.proposedSolution}
                </p>
              )}
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleSaveStatusUpdate} className="pt-3 border-t border-zinc-200 space-y-2.5">
              <div>
                <label className="block text-zinc-600 mb-1 font-medium">Ubah Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as LaporStatus)}
                  className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:border-zinc-500 text-xs"
                >
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Diproses Advokesma">Diproses Advokesma</option>
                  <option value="Audiensi Dekanat">Audiensi Dekanat</option>
                  <option value="Selesai Ditindaklanjuti">Selesai Ditindaklanjuti</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 font-medium">
                  Catatan Tindak Lanjut Resmi (Hasil Audiensi Dekanat):
                </label>
                <textarea
                  rows={2}
                  placeholder="Hasil penanganan oleh BEM / Dekanat..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:border-zinc-500 text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded transition-colors cursor-pointer text-xs"
              >
                Simpan Perubahan
              </button>
            </form>

            {/* Responses */}
            <div className="pt-2 border-t border-zinc-200">
              <span className="font-medium text-zinc-800 block mb-1 text-[11px]">
                Riwayat Pesan ({activeTicket.responses.length})
              </span>
              <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
                {activeTicket.responses.map((r) => (
                  <div key={r.id} className="p-2 bg-zinc-50 rounded border border-zinc-200 text-[10px]">
                    <div className="flex justify-between text-zinc-400 mb-0.5">
                      <strong className="text-zinc-700">{r.sender}</strong>
                      <span className="font-mono">{r.date.split(' ')[0]}</span>
                    </div>
                    <p className="text-zinc-600 leading-snug">{r.message}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendResponse} className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Tulis tanggapan resmi..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-zinc-800 focus:bg-white text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
