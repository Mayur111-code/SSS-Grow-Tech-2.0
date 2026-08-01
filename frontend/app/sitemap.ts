import type { MetadataRoute } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/utils";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/careers",
  "/contact",
  "/pricing",
  "/testimonials",
  "/faq",
  "/privacy-policy",
  "/terms",
];

async function getDynamicRoutes(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  try {
    const [services, projects, blogs, careers] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/public?limit=100`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/public?limit=100`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/public?limit=100`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/public?limit=100`).then((r) => (r.ok ? r.json() : null)),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const push = (items: { slug?: string; updatedAt?: string }[] | undefined, path: string) => {
      (items || []).forEach((item) => {
        if (item?.slug) {
          routes.push({
            url: `${SITE_URL}/${path}/${item.slug}`,
            lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        }
      });
    };

    push(services?.data?.items, "services");
    push(projects?.data?.items, "portfolio");
    push(blogs?.data?.items, "blog");
    push(careers?.data?.items, "careers");
  } catch {
    // API unavailable during build; static routes still returned
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamic = await getDynamicRoutes();

  const statics: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/services" || route === "/portfolio" || route === "/blog" ? 0.9 : 0.6,
  }));

  return [...statics, ...dynamic];
}
