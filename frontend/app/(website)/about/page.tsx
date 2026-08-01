import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SSS Grow Tech - a premium IT services agency helping businesses grow through world-class software, AI and cloud solutions.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        badge="About Us"
        title={
          <>
            Building the future of <span className="text-gradient">technology</span>
          </>
        }
        description="SSS Grow Tech is a full-stack digital agency helping ambitious businesses design, build and scale products that matter."
      />
      <AboutContent />
    </>
  );
}
