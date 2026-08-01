import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerDetails } from "@/components/careers/career-details";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, Career } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetch(`${API_URL}/careers/slug/${slug}`, { cache: "no-store" });
    if (!response.ok) return { title: "Position Not Found" };
    const json = (await response.json()) as ApiResponse<Career>;
    return { title: json.data.title, description: json.data.description.slice(0, 160) };
  } catch {
    return { title: "Career" };
  }
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(`${API_URL}/careers/slug/${slug}`, { cache: "no-store" });
  if (!response.ok) notFound();

  return <CareerDetails slug={slug} />;
}
