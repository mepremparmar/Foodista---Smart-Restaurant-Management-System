import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, Smartphone, Wallet, Lock, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: () => (<RequireAuth><Checkout /></RequireAuth>),
  head: () => ({ meta: [{ title: "Checkout — Foodista" }] }),
});

const formatScheduledDate = (val: string) => {
  if (!val) return "Choose date & time";
  try {
    const date = new Date(val);
    if (isNaN(date.getTime())) return val;
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return val;
  }
};

const methods = [
  { id: "upi", label: "UPI", desc: "Pay via any UPI app", Icon: Smartphone },
  { id: "card", label: "Credit / Debit card", desc: "Visa, Mastercard, RuPay", Icon: CreditCard },
  { id: "cod", label: "Cash on delivery", desc: "Pay when it arrives", Icon: Wallet },
] as const;

function Checkout() {
  const { cart, placeOrder } = useApp();
  const nav = useNavigate();
  const [method, setMethod] = useState<string>("upi");
  const [scheduled, setScheduled] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal * 1.05;

  if (!cart.length) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-6 py-32 text-center space-y-4">
          <h1 className="font-display text-4xl">Your cart is empty.</h1>
          <Link to="/menu" className="inline-flex rounded-full gradient-ember px-6 py-3 text-background">Browse menu</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Almost there</p>
        <h1 className="font-display text-6xl">Payment.</h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-xl mb-4">Schedule</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => setScheduled("")}
                className={`rounded-2xl border p-4 text-left transition ${!scheduled ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="font-display text-lg">Now</div>
                <div className="text-xs text-muted-foreground">Cooking starts immediately</div>
              </button>
              <label className={`relative rounded-2xl border p-4 cursor-pointer transition flex items-center justify-between ${scheduled ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="space-y-0.5 text-left">
                  <div className="font-display text-lg">Schedule</div>
                  <div className="text-xs text-muted-foreground">
                    {formatScheduledDate(scheduled)}
                  </div>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground mr-1" />
                <input
                  type="datetime-local"
                  value={scheduled}
                  onChange={(e) => setScheduled(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer datetime-indicator-cover"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-display text-xl mb-2">Payment method</h3>
            {methods.map((m) => (
              <motion.label
                key={m.id} whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition ${method === m.id ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                <span className="grid h-11 w-11 place-items-center rounded-xl gradient-ember text-background"><m.Icon className="h-5 w-5"/></span>
                <div className="flex-1">
                  <div className="font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                <span className={`h-4 w-4 rounded-full border-2 ${method === m.id ? "border-primary bg-primary" : "border-border"}`} />
              </motion.label>
            ))}
            {method === "card" && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="grid sm:grid-cols-2 gap-3 pt-3">
                <input placeholder="Card number" value={cardNo} onChange={(e) => setCardNo(e.target.value)} className="rounded-xl border border-input bg-background/40 px-3 py-2.5 outline-none focus:border-primary"/>
                <input placeholder="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} className="rounded-xl border border-input bg-background/40 px-3 py-2.5 outline-none focus:border-primary"/>
                <input placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="rounded-xl border border-input bg-background/40 px-3 py-2.5 outline-none focus:border-primary"/>
                <input placeholder="CVV" type="password" maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} className="rounded-xl border border-input bg-background/40 px-3 py-2.5 outline-none focus:border-primary"/>
              </motion.div>
            )}
            {method === "upi" && (
              <motion.input initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="rounded-xl border border-input bg-background/40 px-3 py-2.5 outline-none focus:border-primary mt-3"/>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6 h-fit sticky top-24 space-y-4">
          <h3 className="font-display text-2xl">Order summary</h3>
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="truncate">{i.name} <span className="text-muted-foreground">× {i.qty}</span></span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between font-display text-2xl">
            <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={async () => {
              try {
                if (method === "card") {
                  if (!cardNo.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
                    toast.error("Please enter all card details first.");
                    return;
                  }
                } else if (method === "upi") {
                  if (!upiId.trim()) {
                    toast.error("Please enter your UPI ID first.");
                    return;
                  }
                }
                const o = await placeOrder(method, scheduled || undefined);
                toast.success("Order placed successfully");
                nav({ to: "/confirmation", search: { type: "order" as const, id: o.id } });
              } catch (err: any) {
                toast.error(err.message || "Failed to place order. Please try again.");
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-ember py-3 text-background font-medium"
          >
            <Lock className="h-4 w-4" /> Pay ${total.toFixed(2)}
          </button>
        </aside>
      </section>
    </SiteLayout>
  );
}
