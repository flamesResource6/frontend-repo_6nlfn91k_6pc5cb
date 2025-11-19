import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const navItem = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-blue-600/20'
    }`

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-blue-500/20 bg-slate-900/70">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">LB</div>
          <span className="font-semibold">Laporan Bulanan</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navItem} end>Dashboard</NavLink>
          <NavLink to="/kegiatan" className={navItem}>Kegiatan</NavLink>
          <NavLink to="/rekap" className={navItem}>Rekap</NavLink>
          <NavLink to="/ekspor" className={navItem}>Ekspor</NavLink>
        </nav>
      </div>
    </header>
  )
}
