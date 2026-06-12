import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({ component: Profile });

const dietaryOpts = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free"];
const prefOpts = ["spicy", "smoked", "pasta", "pizza", "salads", "desserts", "cocktails"];

function Profile() {
  const { user, updateUser } = useApp();
  const [f, setF] = useState({
    fullName: user!.fullName, username: user!.username, email: user!.email,
    phone: user!.phone, dob: user!.dob ?? "", gender: user!.gender ?? "",
    avatar: user!.avatar ?? "",
    preferences: user!.preferences ?? [], dietary: user!.dietary ?? [],
  });

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader(); r.onload = () => setF({ ...f, avatar: r.result as string }); r.readAsDataURL(file);
  };

  const togglePref = (k: "preferences" | "dietary", v: string) =>
    setF((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => { e.preventDefault(); updateUser(f); toast.success("Profile updated."); }}
      className="max-w-3xl space-y-8"
    >
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Your profile</p>
        <h1 className="font-display text-5xl">Make it yours.</h1>
      </header>

      <section className="rounded-3xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="relative">
          {f.avatar
            ? <img src={f.avatar} className="h-24 w-24 rounded-full object-cover ring-2 ring-primary" alt="" />
            : <div className="h-24 w-24 rounded-full gradient-ember grid place-items-center text-background"><Camera className="h-7 w-7"/></div>}
          <input type="file" accept="image/*" onChange={onAvatar} className="absolute inset-0 opacity-0 cursor-pointer rounded-full" />
        </div>
        <div>
          <h3 className="font-display text-2xl">{f.fullName || "Your name"}</h3>
          <p className="text-sm text-muted-foreground">Tap your photo to update</p>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-4">
        <Field label="Full name" value={f.fullName} onChange={(v) => setF({...f, fullName: v})} />
        <Field label="Username" value={f.username} onChange={(v) => setF({...f, username: v})} />
        <Field label="Email" type="email" value={f.email} onChange={(v) => setF({...f, email: v})} />
        <Field label="Phone" value={f.phone} onChange={(v) => setF({...f, phone: v})} />
        <Field label="Date of birth" type="date" value={f.dob} onChange={(v) => setF({...f, dob: v})} />
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Gender</label>
          <select value={f.gender} onChange={(e) => setF({...f, gender: e.target.value})}
            className="mt-2 w-full rounded-xl border border-input bg-background/40 px-4 py-3 outline-none focus:border-primary">
            <option value="">—</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
          </select>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 space-y-5">
        <div>
          <h3 className="font-display text-xl mb-3">Dietary</h3>
          <Chips opts={dietaryOpts} selected={f.dietary} onToggle={(v) => togglePref("dietary", v)} />
        </div>
        <div>
          <h3 className="font-display text-xl mb-3">Food preferences</h3>
          <Chips opts={prefOpts} selected={f.preferences} onToggle={(v) => togglePref("preferences", v)} />
        </div>
      </section>

      <button className="inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3 text-background font-medium">
        <Save className="h-4 w-4"/> Save changes
      </button>
    </motion.form>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background/40 px-4 py-3 outline-none focus:border-primary" />
    </label>
  );
}

function Chips({ opts, selected, onToggle }: { opts: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map((o) => {
        const on = selected.includes(o);
        return (
          <button type="button" key={o} onClick={() => onToggle(o)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${on ? "gradient-ember text-background" : "border border-border hover:border-primary"}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}
