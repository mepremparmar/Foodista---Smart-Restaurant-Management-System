import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import heroImg from "@/assets/hero.jpg";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Sign in — Foodista" }] }),
});

function Login() {
  const { login } = useApp();
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-transparent" />
        <div className="relative h-full p-12 flex flex-col justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm hover:text-primary"><ArrowLeft className="h-4 w-4"/> Back home</Link>
          <div>
            <h2 className="font-display text-5xl mb-3">Welcome back.</h2>
            <p className="text-muted-foreground max-w-sm">Pick up your collections, see your reservations, and order your usual.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={async (e) => {
            e.preventDefault();
            const success = await login(id, pwd);
            if (success) { toast.success("Welcome back."); nav({ to: "/" }); }
            else toast.error("Wrong credentials.");
          }}
          className="w-full max-w-sm space-y-5"
        >
          <div className="md:hidden mb-6"><Link to="/" className="text-sm text-muted-foreground">← Home</Link></div>
          <h1 className="font-display text-4xl">Sign in</h1>

          <Input label="Username, phone or email" value={id} onChange={setId} />
          <Input label="Password" type="password" value={pwd} onChange={setPwd} />
          <button className="w-full rounded-full gradient-ember py-3 text-background font-medium hover:scale-[1.01] transition">
            Sign in
          </button>
          <p className="text-sm text-center text-muted-foreground">
            New here? <Link to="/signup" className="text-primary">Create an account</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background/40 px-4 py-3 outline-none focus:border-primary transition"
      />
    </label>
  );
}
