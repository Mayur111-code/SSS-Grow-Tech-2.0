import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { FaqList } from "@/components/faq/faq-list";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SSS Grow Tech services, pricing, process and support.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        badge="FAQ"
        title={
          <>
            Frequently asked <span className="text-gradient">questions</span>
          </>
        }
        description="Everything you need to know about working with SSS Grow Tech."
      />
      <FaqList />
    </>
  );
}
