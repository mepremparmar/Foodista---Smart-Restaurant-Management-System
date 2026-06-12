import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "Sign up — Foodista" }] }),
});

function Signup() {
  const { signup } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ fullName: "", username: "", email: "", phone: "", password: "", avatar: "" });

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setF({ ...f, avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-16">
      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!f.username && !f.fullName) return toast.error("Please provide your name.");
          try {
            await signup(f);
            toast.success("Welcome to Foodista.");
            nav({ to: "/" });
          } catch (err: any) {
            toast.error(err.message || "Failed to sign up");
          }
        }}
        className="w-full max-w-lg space-y-5 rounded-3xl border border-border bg-card p-8"
      >
        <Link to="/" className="text-sm text-muted-foreground">← Home</Link>
        <h1 className="font-display text-4xl">Create your account</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            {f.avatar
              ? <img src={f.avatar} className="h-20 w-20 rounded-full object-cover ring-2 ring-primary" />
              : <div className="h-20 w-20 rounded-full gradient-ember grid place-items-center text-background"><Camera className="h-6 w-6" /></div>}
            <input type="file" accept="image/*" onChange={onAvatar} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <div className="text-sm text-muted-foreground">Tap to upload<br/>your profile photo</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name" value={f.fullName} onChange={(v) => setF({...f, fullName: v})} />
          <Field label="Username" value={f.username} onChange={(v) => setF({...f, username: v})} />
          <Field label="Email" type="email" value={f.email} onChange={(v) => setF({...f, email: v})} />
          <Field label="Phone" value={f.phone} onChange={(v) => setF({...f, phone: v})} />
        </div>
        <Field label="Password" type="password" value={f.password} onChange={(v) => setF({...f, password: v})} />

        <button className="w-full rounded-full gradient-ember py-3 text-background font-medium">Create account</button>
        <p className="text-sm text-center text-muted-foreground">
          Already with us? <Link to="/login" className="text-primary">Sign in</Link>
        </p>
      </motion.form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
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
