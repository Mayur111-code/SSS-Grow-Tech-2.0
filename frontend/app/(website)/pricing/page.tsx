import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PricingSection } from "@/components/pricing/pricing-section";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for SSS Grow Tech services - from fixed-price projects to monthly retainer partnerships.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        badge="Pricing"
        title={
          <>
            Simple, <span className="text-gradient">transparent pricing</span>
          </>
        }
        description="No hidden fees. Choose the engagement model that fits your project and budget."
      />
      <PricingSection />
    </>
  );
}
