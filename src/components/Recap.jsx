import { useEffect, useState } from 'react'

export default function Recap() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [data, setData] = useState(null)

  useEffect(()=>{ if(month||year) run() }, [month, year])

  const run = async () => {
    const res = await fetch(`${baseUrl}/api/recap`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ month: month? Number(month): undefined, year: year? Number(year): undefined }) })
    const d = await res.json()
    setData(d)
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-2">
        <select value={month} onChange={e=>setMonth(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30">
          <option value="">Bulan</option>
          {[...Array(12)].map((_,i)=>(<option key={i+1} value={i+1}>{i+1}</option>))}
        </select>
        <input placeholder="Tahun" value={year} onChange={e=>setYear(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        <button onClick={run} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Proses</button>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
            <div className="text-blue-300 mb-2">Ringkasan Otomatis</div>
            <p className="text-blue-100">{data.summary}</p>
          </div>
          <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
            <div className="text-blue-300 mb-2">Kegiatan per Kategori</div>
            <div className="space-y-1 text-blue-100">
              {Object.entries(data.categories || {}).map(([k,v]) => (
                <div key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
            <div className="text-blue-300 mb-2">Keuangan</div>
            <div className="space-y-1 text-blue-100">
              <div className="flex justify-between"><span>Total Pemasukan</span><span>Rp {Number(data.income||0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Total Pengeluaran</span><span>Rp {Number(data.expense||0).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
