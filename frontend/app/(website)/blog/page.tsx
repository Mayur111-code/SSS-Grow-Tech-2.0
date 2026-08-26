import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { HERO_IMAGES } from "@/lib/hero-images";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights and articles from SSS Grow Tech on web development, AI, cloud, design and digital growth.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        badge="Our Blog"
        title={
          <>
            Insights for <span className="text-gradient">digital growth</span>
          </>
        }
        description="Expert articles, guides and thought leadership from our engineering and design teams."
        image={HERO_IMAGES.blog}
      />
      <BlogGrid />
    </>
  );
}
