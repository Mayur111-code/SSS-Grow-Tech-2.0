import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetails } from "@/components/blog/blog-details";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, Blog } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const response = await fetch(`${API_URL}/blogs/slug/${slug}`, { cache: "no-store" });
    if (!response.ok) return { title: "Article Not Found" };
    const json = (await response.json()) as ApiResponse<Blog>;
    const blog = json.data;
    return {
      title: blog.seo?.title || blog.title,
      description: blog.seo?.description || blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        images: blog.thumbnail ? [blog.thumbnail] : [],
        type: "article",
        publishedTime: blog.publishDate,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
        images: blog.thumbnail ? [blog.thumbnail] : [],
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(`${API_URL}/blogs/slug/${slug}`, { cache: "no-store" });
  if (!response.ok) notFound();

  return <BlogDetails slug={slug} />;
}
