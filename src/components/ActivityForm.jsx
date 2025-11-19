import { useState } from 'react'

const categories = ['administrasi', 'akademik', 'keuangan', 'sosial', 'P2M', 'dokumentasi']

export default function ActivityForm({ onSaved }) {
  const [form, setForm] = useState({
    date: '',
    name: '',
    category: categories[0],
    duration: '',
    result: '',
    notes: '',
    income: '',
    expense: '',
    finance_category: ''
  })
  const [uploading, setUploading] = useState(false)
  const [attachments, setAttachments] = useState([])

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${baseUrl}/api/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      setAttachments(prev => [...prev, data])
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      date: form.date,
      duration: parseFloat(form.duration || 0),
      income: form.income === '' ? 0 : parseFloat(form.income),
      expense: form.expense === '' ? 0 : parseFloat(form.expense),
      attachments
    }
    const res = await fetch(`${baseUrl}/api/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      setForm({ date: '', name: '', category: categories[0], duration: '', result: '', notes: '', income: '', expense: '', finance_category: '' })
      setAttachments([])
      onSaved && onSaved()
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Tanggal</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Nama Kegiatan</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Kategori</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Durasi (jam)</label>
          <input type="number" step="0.1" name="duration" value={form.duration} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-blue-100 mb-1">Hasil Kegiatan</label>
          <textarea name="result" value={form.result} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-blue-100 mb-1">Catatan</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-blue-100 mb-1">Pemasukan (opsional)</label>
          <input type="number" step="0.01" name="income" value={form.income} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Pengeluaran (opsional)</label>
          <input type="number" step="0.01" name="expense" value={form.expense} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
        <div>
          <label className="block text-sm text-blue-100 mb-1">Kategori Keuangan</label>
          <input name="finance_category" value={form.finance_category} onChange={handleChange} className="w-full bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-blue-100 mb-1">Upload Bukti</label>
        <input type="file" onChange={handleFile} className="text-blue-100" />
        {uploading && <p className="text-xs text-blue-300 mt-1">Mengunggah...</p>}
        {attachments.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {attachments.map((a,i) => (
              <a key={i} href={a.url} target="_blank" className="px-2 py-1 text-xs rounded bg-blue-600/20 text-blue-100 border border-blue-500/30">{a.filename}</a>
            ))}
          </div>
        )}
      </div>

      <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold">Simpan</button>
    </form>
  )
}
