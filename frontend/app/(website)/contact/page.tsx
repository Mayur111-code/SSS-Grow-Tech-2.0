import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with SSS Grow Tech. Request a quote, ask about our services or start a project.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        badge="Contact Us"
        title={
          <>
            Let&apos;s build something <span className="text-gradient">great together</span>
          </>
        }
        description="Tell us about your project and our team will get back to you within 24 hours."
      />
      <ContactForm />
    </>
  );
}
