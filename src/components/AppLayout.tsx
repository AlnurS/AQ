import { Activity, Droplets, Map, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/monitoring", label: "Мониторинг", icon: Activity, end: false },
  { to: "/national-map", label: "Карта Казахстана", icon: Map, end: false },
];

function navClass(isActive: boolean): string {
  return `flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
    isActive ? "bg-cyan-300/10 text-cyan-100" : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationLinks = (
    <nav aria-label="Primary navigation" className="space-y-1">
      {navigation.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => navClass(isActive)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-slate-950 p-5 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200"><Droplets className="h-5 w-5" aria-hidden="true" /></span>
          <div><p className="font-semibold tracking-tight">Drought Monitor</p><p className="text-xs text-slate-400">Kazakhstan · educational MVP</p></div>
        </div>
        {navigationLinks}
      </aside>

      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 font-semibold"><Droplets className="h-5 w-5 text-cyan-200" aria-hidden="true" /> Drought Monitor</div>
        <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label="Toggle navigation" className="grid h-11 w-11 place-items-center rounded-lg text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobileOpen ? <div className="fixed inset-x-0 top-16 z-20 border-b border-slate-800 bg-slate-950 p-4 shadow-2xl lg:hidden">{navigationLinks}</div> : null}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:ml-64 lg:p-8"><Outlet /></main>
    </div>
  );
}
