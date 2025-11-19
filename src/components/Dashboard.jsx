import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  useEffect(()=>{ fetchData() }, [month, year])

  const fetchData = async () => {
    const params = new URLSearchParams()
    if (month) params.append('month', month)
    if (year) params.append('year', year)
    const res = await fetch(`${baseUrl}/api/dashboard?${params.toString()}`)
    const data = await res.json()
    setStats(data)
  }

  const categories = stats?.per_category || {}

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-3">
        <input placeholder="Bulan" value={month} onChange={e=>setMonth(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        <input placeholder="Tahun" value={year} onChange={e=>setYear(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 text-sm">Kegiatan Bulan Ini</div>
          <div className="text-3xl font-bold text-white">{stats?.total_activities ?? '-'}</div>
        </div>
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 text-sm">Total Pemasukan</div>
          <div className="text-3xl font-bold text-white">Rp {Number(stats?.total_income||0).toLocaleString()}</div>
        </div>
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 text-sm">Total Pengeluaran</div>
          <div className="text-3xl font-bold text-white">Rp {Number(stats?.total_expense||0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 mb-2">Kegiatan per Kategori</div>
          <div className="space-y-2">
            {Object.keys(categories).length === 0 ? <div className="text-blue-200/60">Belum ada data</div> : (
              Object.entries(categories).map(([k,v]) => (
                <div key={k} className="flex items-center gap-3">
                  <div className="w-28 text-blue-100 text-sm">{k}</div>
                  <div className="flex-1 h-3 bg-slate-700 rounded">
                    <div className="h-3 bg-blue-600 rounded" style={{ width: `${Math.min(100, v*10)}%` }}></div>
                  </div>
                  <div className="w-10 text-right text-blue-100 text-sm">{v}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 mb-2">Ringkasan Keuangan</div>
          <div className="space-y-2">
            <div className="flex justify-between text-blue-100"><span>Pemasukan</span><span>Rp {Number(stats?.total_income||0).toLocaleString()}</span></div>
            <div className="flex justify-between text-blue-100"><span>Pengeluaran</span><span>Rp {Number(stats?.total_expense||0).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
