import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { User, History, Heart, Calendar, Utensils, Palette, LogOut, ChevronRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  head: () => ({ meta: [{ title: "Dashboard — Foodista" }] }),
});

const items = [
  { to: "/dashboard", label: "Profile", Icon: User, exact: true },
  { to: "/dashboard/orders", label: "Your orders", Icon: History },
  { to: "/dashboard/collections", label: "Collections", Icon: Heart },
  { to: "/dashboard/dining", label: "Dining history", Icon: Utensils },
  { to: "/dashboard/bookings", label: "Bookings", Icon: Calendar },
  { to: "/dashboard/appearance", label: "Appearance", Icon: Palette },
];

function DashboardLayout() {
  const { user, logout } = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();

  useEffect(() => { if (!user) nav({ to: "/login" }); }, [user, nav]);
  if (!user) return null;

  return (
    <div className="min-h-screen grid md:grid-cols-[280px_1fr]">
      <aside className="bg-sidebar text-sidebar-foreground p-6 md:sticky md:top-0 md:h-screen flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-2 mb-4">
          <span className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-background font-display">F</span>
          <span className="font-display text-xl">Foodista</span>
        </Link>
        <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent p-3">
          {user.avatar
            ? <img src={user.avatar} className="h-12 w-12 rounded-full object-cover" alt="" />
            : <div className="h-12 w-12 rounded-full gradient-ember grid place-items-center text-background font-display">{user.fullName[0]}</div>}
          <div className="min-w-0">
            <div className="font-medium truncate">{user.fullName}</div>
            <div className="text-xs opacity-70 truncate">@{user.username}</div>
          </div>
        </div>
        <nav className="space-y-1">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to) && it.to !== "/dashboard";
            return (
              <Link key={it.to} to={it.to}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}>
                <it.Icon className="h-4 w-4" />
                <span className="flex-1">{it.label}</span>
                {active && <motion.span layoutId="dash-pill" className="absolute inset-0 rounded-xl bg-sidebar-primary -z-10" />}
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </Link>
            );
          })}
        </nav>
        <button onClick={() => { logout(); nav({ to: "/" }); }}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-destructive/20 hover:text-destructive transition">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </aside>
      <main className="p-6 md:p-12">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
