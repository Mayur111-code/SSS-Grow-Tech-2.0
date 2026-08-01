"use client";

import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { WhyUsSection } from "@/components/home/why-us-section";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { TechMarquee } from "@/components/home/tech-marquee";
import { ProcessSection } from "@/components/home/process-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BlogSection } from "@/components/home/blog-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <hr className="section-divider mx-auto max-w-5xl" />
      <ServicesSection />
      <WhyUsSection />
      <PortfolioSection />
      <TechMarquee />
      <ProcessSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
    </>
  );
}
