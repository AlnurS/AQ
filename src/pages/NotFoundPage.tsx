import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-slate-100"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">404</p><h1 className="mt-3 text-3xl font-bold">Page not found</h1><p className="mt-2 text-slate-400">This route is not part of the drought monitoring dashboard.</p><Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100">Return to dashboard</Link></div></div>;
}
