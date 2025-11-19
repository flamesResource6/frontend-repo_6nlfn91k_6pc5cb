import { useEffect, useMemo, useState } from 'react'

export default function ActivityTable({ refreshKey }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (month) params.append('month', month)
      if (year) params.append('year', year)
      if (search) params.append('search', search)
      const res = await fetch(`${baseUrl}/api/activities?${params.toString()}`)
      const d = await res.json()
      setData(d)
      setLoading(false)
    }
    fetchData()
  }, [refreshKey, month, year, search])

  const sorted = useMemo(() => {
    const s = [...data].sort((a,b) => {
      const va = a[sortKey] || ''
      const vb = b[sortKey] || ''
      if (sortKey === 'date') {
        return (new Date(va) - new Date(vb)) * (sortDir === 'asc' ? 1 : -1)
      }
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * (sortDir === 'asc' ? 1 : -1)
      }
      return String(va).localeCompare(String(vb)) * (sortDir === 'asc' ? 1 : -1)
    })
    return s
  }, [data, sortKey, sortDir])

  const setSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const remove = async (id) => {
    if (!confirm('Hapus data ini?')) return
    await fetch(`${baseUrl}/api/activities/${id}`, { method: 'DELETE' })
    setData(d => d.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-4 gap-2">
        <input placeholder="Cari..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
        <select value={month} onChange={e=>setMonth(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30">
          <option value="">Bulan</option>
          {[...Array(12)].map((_,i)=>(<option key={i+1} value={i+1}>{i+1}</option>))}
        </select>
        <input placeholder="Tahun" value={year} onChange={e=>setYear(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded border border-blue-500/30" />
      </div>

      <div className="overflow-auto rounded-lg border border-blue-500/20">
        <table className="min-w-full text-sm text-blue-100">
          <thead className="bg-slate-800/50">
            <tr>
              {['date','name','category','duration','income','expense','finance_category'].map(h => (
                <th key={h} onClick={()=>setSort(h)} className="px-3 py-2 text-left cursor-pointer select-none">
                  {h.toUpperCase()} {sortKey===h ? (sortDir==='asc'?'↑':'↓') : ''}
                </th>
              ))}
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-4" colSpan={8}>Memuat...</td></tr>
            ) : sorted.length === 0 ? (
              <tr><td className="px-3 py-4" colSpan={8}>Tidak ada data</td></tr>
            ) : (
              sorted.map(row => (
                <tr key={row.id} className="odd:bg-slate-800/30">
                  <td className="px-3 py-2 whitespace-nowrap">{row.date?.slice(0,10)}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2 text-right">{row.duration}</td>
                  <td className="px-3 py-2 text-right">{row.income || 0}</td>
                  <td className="px-3 py-2 text-right">{row.expense || 0}</td>
                  <td className="px-3 py-2">{row.finance_category}</td>
                  <td className="px-3 py-2">
                    <button onClick={()=>remove(row.id)} className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
