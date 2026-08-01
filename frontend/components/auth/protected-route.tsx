"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/skeleton";

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
      return;
    }
    if (adminOnly && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, router, pathname, adminOnly]);

  if (isLoading || !isAuthenticated) {
    return <PageLoader label="Checking session..." />;
  }
  if (adminOnly && user?.role !== "admin") {
    return <PageLoader label="Checking permissions..." />;
  }
  return <>{children}</>;
}
