import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SSS Grow Tech terms of service - the rules and guidelines for using our services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the SSS Grow Tech website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "2. Services",
    content:
      "SSS Grow Tech provides IT consulting, software development, web development, mobile app development, AI solutions, UI/UX design, cloud solutions and digital marketing services. The scope, timeline and deliverables of each project are defined in a separate agreement.",
  },
  {
    title: "3. User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "4. Intellectual Property",
    content:
      "All content on our website, including text, graphics, logos and software, is the property of SSS Grow Tech or its licensors. Client projects are owned by the respective clients upon full payment, as outlined in project agreements.",
  },
  {
    title: "5. Acceptable Use",
    content:
      "You agree not to misuse our services, including attempting to access restricted areas, transmitting malicious code, or engaging in any activity that could harm our systems or other users.",
  },
  {
    title: "6. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, SSS Grow Tech shall not be liable for any indirect, incidental, special, consequential or punitive damages arising from your use of our services.",
  },
  {
    title: "7. Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        badge="Legal"
        title={
          <>
            Terms of <span className="text-gradient">Service</span>
          </>
        }
        description="Last updated: January 2026"
      />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-[#0f101a]">
                <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
