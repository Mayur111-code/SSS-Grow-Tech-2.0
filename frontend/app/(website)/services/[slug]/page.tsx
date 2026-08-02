import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceDetails } from "@/components/services/service-details";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, Service } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetch(`${API_URL}/services/slug/${slug}`, { cache: "no-store" });
    if (!response.ok) return { title: "Service Not Found" };
    const json = (await response.json()) as ApiResponse<Service>;
    const service = json.data;
    return {
      title: service.seo?.title || service.title,
      description: service.seo?.description || service.shortDescription,
      openGraph: {
        title: service.title,
        description: service.shortDescription,
        images: service.image?.url ? [service.image.url] : [],
      },
    };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(`${API_URL}/services/slug/${slug}`, { cache: "no-store" });
  if (!response.ok) notFound();

  return <ServiceDetails slug={slug} />;
}
