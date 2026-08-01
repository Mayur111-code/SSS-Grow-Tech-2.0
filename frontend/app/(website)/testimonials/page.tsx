import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TestimonialsGrid } from "@/components/testimonials/testimonials-grid";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "See what our clients say about working with SSS Grow Tech - real reviews from real businesses.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        badge="Testimonials"
        title={
          <>
            What our clients <span className="text-gradient">say about us</span>
          </>
        }
        description="Don't just take our word for it. Here's what our clients think about working with SSS Grow Tech."
      />
      <TestimonialsGrid />
    </>
  );
}
