import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse SSS Grow Tech portfolio - real projects across e-commerce, healthcare, fintech, AI and cloud solutions.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        badge="Our Portfolio"
        title={
          <>
            Work that speaks for <span className="text-gradient">itself</span>
          </>
        }
        description="A selection of projects we're proud of — from enterprise platforms to award-winning mobile apps."
      />
      <PortfolioGrid />
    </>
  );
}
