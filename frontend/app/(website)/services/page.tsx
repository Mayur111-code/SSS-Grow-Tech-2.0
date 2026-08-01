import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ServicesGrid } from "@/components/services/services-grid";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SSS Grow Tech services - web development, mobile apps, AI solutions, UI/UX design, cloud solutions, digital marketing and IT consulting.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        badge="Our Services"
        title={
          <>
            Solutions that <span className="text-gradient">scale your business</span>
          </>
        }
        description="End-to-end technology services designed to build, launch and grow world-class digital products."
      />
      <ServicesGrid />
    </>
  );
}
