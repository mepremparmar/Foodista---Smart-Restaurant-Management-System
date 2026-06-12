import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Foodista" },
      { name: "description", content: "Visit, call or write. We answer every message." },
    ],
  }),
});

function Contact() {
  const { submitContactNote } = useApp();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await submitContactNote(form.name, form.email, form.message);
      if (success) {
        toast.success("Message sent — we'll reply within a day.");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Get in touch</p>
        <h1 className="font-display text-6xl md:text-7xl">Say hello.</h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          {[
            { Icon: MapPin, title: "Visit", body: "22 Linden Lane, Bandra West, Mumbai 400050" },
            { Icon: Phone, title: "Call", body: "+91 98765 43210" },
            { Icon: Mail, title: "Write", body: "hello@foodista.app" },
            { Icon: Clock, title: "Hours", body: "Mon–Thu 5–11pm · Fri–Sat 5pm–1am · Sun Brunch + Dinner" },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-2xl border border-border/50 bg-card p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-ember text-background">
                <c.Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-xl">{c.title}</div>
                <div className="text-sm text-muted-foreground">{c.body}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-8 space-y-5"
        >
          <h3 className="font-display text-3xl mb-2">Drop us a note</h3>
          <Field label="Your name" value={form.name} onChange={(v) => setForm({...form, name: v})} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({...form, email: v})} />
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea
              required rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 w-full rounded-xl border border-input bg-background/40 p-4 outline-none focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full gradient-ember px-6 py-3 text-background font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send message"} <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background/40 px-4 py-3 outline-none focus:border-primary transition"
      />
    </div>
  );
}
