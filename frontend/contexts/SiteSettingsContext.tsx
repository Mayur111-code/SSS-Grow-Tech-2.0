"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePublicSettings } from "@/services/queries";
import { DEFAULT_LOGO, SITE_NAME, resolveImageUrl } from "@/lib/utils";
import type { SiteSettings as SiteSettingsData } from "@/types";

export interface SiteSettingsValue {
  settings: SiteSettingsData;
  logo: string;
  favicon: string;
  siteName: string;
  tagline: string;
  supportEmail: string;
  contactEmail: string;
  hrEmail: string;
  phone: string;
  phoneSecondary: string;
  address: string;
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    github: string;
  };
  isLoading: boolean;
  refresh: () => void;
}

const siteSettingsContext = createContext<SiteSettingsValue | null>(null);

const DEFAULT_SOCIAL = {
  facebook: "https://facebook.com/sssgrowtech",
  twitter: "https://twitter.com/sssgrowtech",
  linkedin: "https://linkedin.com/company/sssgrowtech",
  instagram: "https://instagram.com/sssgrowtech",
  github: "https://github.com/sssgrowtech",
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = usePublicSettings();

  const value = useMemo<SiteSettingsValue>(() => {
    const settings: SiteSettingsData = data ?? {};
    const logo = resolveImageUrl(settings.logo as never, DEFAULT_LOGO);

    return {
      settings,
      logo,
      favicon: resolveImageUrl(settings.favicon as never, DEFAULT_LOGO),
      siteName: (settings.siteName as string) || SITE_NAME,
      tagline: (settings.tagline as string) || "",
      supportEmail: (settings.supportEmail as string) || "sssgrowtech@gmail.com",
      contactEmail: (settings.contactEmail as string) || "sssgrowtech@gmail.com",
      hrEmail: (settings.hrEmail as string) || "info.hr2200@gmail.com",
      phone: (settings.phone as string) || "+91 70285 07985",
      phoneSecondary: (settings.phoneSecondary as string) || "+91 98342 32411",
      address: (settings.address as string) || "India · Serving clients worldwide",
      social: {
        facebook: (settings.facebook as string) || DEFAULT_SOCIAL.facebook,
        twitter: (settings.twitter as string) || DEFAULT_SOCIAL.twitter,
        linkedin: (settings.linkedin as string) || DEFAULT_SOCIAL.linkedin,
        instagram: (settings.instagram as string) || DEFAULT_SOCIAL.instagram,
        github: (settings.github as string) || DEFAULT_SOCIAL.github,
      },
      isLoading,
      refresh: () => {
        refetch();
      },
    };
  }, [data, isLoading, refetch]);

  return <siteSettingsContext.Provider value={value}>{children}</siteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsValue {
  const ctx = useContext(siteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return ctx;
}
