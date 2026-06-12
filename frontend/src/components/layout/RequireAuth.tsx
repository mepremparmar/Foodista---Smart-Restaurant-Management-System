import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      toast.message("Please sign in to continue", { description: "Members get access to ordering and reservations." });
      nav({ to: "/login" });
    }
  }, [user, nav]);
  if (!user) return null;
  return <>{children}</>;
}
