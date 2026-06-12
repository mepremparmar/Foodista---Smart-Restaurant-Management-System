import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/40 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full gradient-ember text-background font-display text-lg">F</span>
            <span className="font-display text-2xl">Foodista</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            A neighbourhood kitchen with global instincts. Open since 2014.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Visit</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> 22 Linden Lane, Bandra West, Mumbai 400050</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> +91 98765 43210</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> hello@foodista.app</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            {[["Menu","/menu"],["Reserve","/reserve"],["About","/about"],["Reviews","/reviews"],["FAQ","/faq"],["Feedback","/feedback"]].map(([l,h])=>(
              <li key={h}><Link to={h} className="text-muted-foreground hover:text-primary transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Hours</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex justify-between"><span>Mon — Thu</span><span>5pm — 11pm</span></li>
            <li className="flex justify-between"><span>Fri — Sat</span><span>5pm — 1am</span></li>
            <li className="flex justify-between"><span>Sunday</span><span>Brunch + Dinner</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Foodista. Crafted with fire and patience.
      </div>
    </footer>
  );
}
