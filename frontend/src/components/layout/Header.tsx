import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ShoppingBag,
  User as UserIcon,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];
const memberLinks = [
  { to: "/menu", label: "Menu" },
  { to: "/reserve", label: "Reserve" },
];

export function Header() {
  const { user, cart, theme, setTheme } = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const links = user
    ? [
        ...memberLinks,
        ...publicLinks.filter((l) => l.to !== "/" && l.to !== "/about"),
      ]
    : publicLinks;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 glass border-b border-border/40"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            whileHover={{ rotate: -8 }}
            className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-background font-display text-lg"
          >
            F
          </motion.span>
          <span className="font-display text-2xl tracking-tight">Foodista</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "relative text-sm uppercase tracking-widest transition-colors hover:text-primary",
                path === l.to ? "text-primary" : "text-foreground/70",
              )}
            >
              {l.label}
              {path === l.to && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-foreground cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          {user ? (
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm hover:border-primary"
            >
              <UserIcon className="h-4 w-4" /> {user.fullName.split(" ")[0]}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex rounded-full gradient-ember px-5 py-2 text-sm font-medium text-background hover:opacity-90 transition"
            >
              Sign in
            </Link>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-border"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/40"
          >
            <div className="flex flex-col p-6 gap-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-lg font-display"
                >
                  {l.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full gradient-ember px-5 py-3 text-center text-background"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
