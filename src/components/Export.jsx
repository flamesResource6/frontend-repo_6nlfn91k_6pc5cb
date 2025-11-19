const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Export() {
  const dl = (type) => {
    const m = new URLSearchParams(window.location.search).get('month') || ''
    const y = new URLSearchParams(window.location.search).get('year') || ''
    const params = new URLSearchParams()
    if (m) params.append('month', m)
    if (y) params.append('year', y)
    window.open(`${baseUrl}/api/export/${type}?${params.toString()}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 text-blue-100">
        Pilih format untuk mengunduh laporan bulan berjalan.
      </div>
      <div className="flex gap-3">
        <button onClick={()=>dl('csv')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Unduh Excel (CSV)</button>
        <button onClick={()=>dl('pdf')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Unduh PDF</button>
      </div>
    </div>
  )
}
