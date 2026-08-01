import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CareersList } from "@/components/careers/careers-list";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the SSS Grow Tech team. We're hiring engineers, designers and growth experts to build world-class products.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        badge="Careers"
        title={
          <>
            Build your career at <span className="text-gradient">SSS Grow Tech</span>
          </>
        }
        description="We're looking for passionate people who love building great products and solving hard problems."
      />
      <CareersList />
    </>
  );
}
