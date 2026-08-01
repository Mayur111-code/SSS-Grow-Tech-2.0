"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-list";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { PageLoader } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types";

interface SettingItem {
  key: string;
  label: string;
  group: string;
  value: unknown;
  type: string;
}

const groupLabels: Record<string, string> = {
  general: "General",
  branding: "Branding",
  seo: "SEO",
  contact: "Contact",
  social: "Social",
  hero: "Hero",
  home: "Home",
  footer: "Footer",
};

const groupOrder = ["general", "branding", "hero", "seo", "contact", "social", "home", "footer"];

export default function AdminSettingsPage() {
  const { success, error } = useToast();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ settings: Record<string, unknown>; items: SettingItem[] }>>("/settings");
      setValues(res.data.data.settings);
      setLoaded(true);
      return res.data.data;
    },
  });

  const setValue = (key: string, value: unknown) => setValues((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const settings = Object.entries({ ...values, ...imageOverrides }).map(([key, value]) => ({ key, value }));
      await api.patch("/settings", { settings });
      setImageOverrides({});
      success("Settings saved");
    } catch (err) {
      error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !loaded) return <PageLoader label="Loading settings..." />;

  const items = Object.entries(values).map(([key, value]) => ({ key, value }));
  const grouped = groupOrder
    .map((g) => ({ group: g, items: items.filter((item) => {
      const lookup: Record<string, string> = {
        siteName: "general", tagline: "general", announcementBar: "general",
        logo: "branding", favicon: "branding",
        heroTitle: "hero", heroSubtitle: "hero", heroImage: "hero",
        description: "seo", keywords: "seo",
        supportEmail: "contact", contactEmail: "contact", phone: "contact", phoneSecondary: "contact", address: "contact",
        facebook: "social", twitter: "social", linkedin: "social", instagram: "social", github: "social",
        stats: "home",
        footerText: "footer", copyright: "footer",
      };
      return lookup[item.key] === g;
    })}))
    .filter((g) => g.items.length > 0);

  const labelFor = (key: string): string => {
    const map: Record<string, string> = {
      siteName: "Site Name", tagline: "Tagline", announcementBar: "Announcement Bar",
      logo: "Logo", favicon: "Favicon",
      heroTitle: "Hero Title", heroSubtitle: "Hero Subtitle", heroImage: "Hero Image",
      description: "SEO Description", keywords: "SEO Keywords",
      supportEmail: "Support Email", contactEmail: "Contact Email", phone: "Phone", phoneSecondary: "Alternate Phone", address: "Address",
      facebook: "Facebook URL", twitter: "Twitter URL", linkedin: "LinkedIn URL", instagram: "Instagram URL", github: "GitHub URL",
      stats: "Home Stats (JSON)", footerText: "Footer Text", copyright: "Copyright",
    };
    return map[key] || key;
  };

  const isImage = (key: string) => ["logo", "favicon", "heroImage"].includes(key);
  const isTextarea = (key: string) => ["tagline", "heroSubtitle", "description", "footerText", "announcementBar"].includes(key);
  const isJson = (key: string) => key === "stats";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Settings"
        description="Configure site-wide settings"
        actions={
          <Button onClick={save} loading={saving}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <div className="space-y-6">
        {grouped.map(({ group, items: groupItems }) => (
          <div key={group} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {groupLabels[group] || group}
            </h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {groupItems.map(({ key }) => (
                <div key={key}>
                  {isImage(key) ? (
                    <ImageUpload
                      value={imageOverrides[key] || (values[key] as string) || ""}
                      onChange={(url) => setImageOverrides((prev) => ({ ...prev, [key]: url }))}
                      label={labelFor(key)}
                      aspect="aspect-[4/3]"
                    />
                  ) : isJson(key) ? (
                    <Textarea
                      label={labelFor(key)}
                      rows={3}
                      value={JSON.stringify(values[key], null, 2)}
                      onChange={(e) => {
                        try {
                          setValue(key, JSON.parse(e.target.value));
                        } catch {
                          /* ignore invalid JSON while typing */
                        }
                      }}
                      hint="Valid JSON object"
                    />
                  ) : isTextarea(key) ? (
                    <Textarea
                      label={labelFor(key)}
                      rows={3}
                      value={(values[key] as string) || ""}
                      onChange={(e) => setValue(key, e.target.value)}
                    />
                  ) : (
                    <Input
                      label={labelFor(key)}
                      value={(values[key] as string) || ""}
                      onChange={(e) => setValue(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </div>
    </div>
  );
}
