import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ActivityForm from './components/ActivityForm'
import ActivityTable from './components/ActivityTable'
import Recap from './components/Recap'
import Export from './components/Export'
import { useState } from 'react'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kegiatan" element={
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-4">Input Kegiatan</h2>
                <ActivityForm onSaved={()=>setRefreshKey(k=>k+1)} />
              </div>
              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-4">Daftar Kegiatan</h2>
                <ActivityTable refreshKey={refreshKey} />
              </div>
            </div>
          } />
          <Route path="/rekap" element={<Recap />} />
          <Route path="/ekspor" element={<Export />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
