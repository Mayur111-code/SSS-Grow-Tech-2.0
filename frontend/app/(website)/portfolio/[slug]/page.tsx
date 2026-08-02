import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/portfolio/project-details";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, Project } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetch(`${API_URL}/projects/slug/${slug}`, { cache: "no-store" });
    if (!response.ok) return { title: "Project Not Found" };
    const json = (await response.json()) as ApiResponse<Project>;
    const project = json.data;
    return {
      title: project.seo?.title || project.title,
      description: project.seo?.description || project.description.slice(0, 160),
      openGraph: {
        title: project.title,
        description: project.description.slice(0, 160),
        images: project.cover?.url ? [project.cover.url] : [],
      },
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(`${API_URL}/projects/slug/${slug}`, { cache: "no-store" });
  if (!response.ok) notFound();

  return <ProjectDetails slug={slug} />;
}
