import type { Metadata } from "next";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse SSS Grow Tech portfolio - real projects across e-commerce, healthcare, fintech, AI and cloud solutions.",
};

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioGrid />
    </>
  );
}
