import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SSS Grow Tech privacy policy - how we collect, use and protect your data.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly, including your name, email address, phone number, company details and any information you submit through our contact forms, job applications or account registration. We also automatically collect certain information about your device and how you interact with our website.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to provide and improve our services, respond to your inquiries, process job applications, send you relevant communications, personalize your experience and comply with legal obligations.",
  },
  {
    title: "3. Data Security",
    content:
      "We implement industry-standard security measures including encryption, secure data storage and access controls to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "4. Data Sharing",
    content:
      "We do not sell your personal information to third parties. We may share data with trusted service providers who assist us in operating our website and delivering our services, subject to appropriate confidentiality obligations.",
  },
  {
    title: "5. Cookies and Tracking",
    content:
      "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic and understand how users interact with our website. You can control cookies through your browser settings.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access, correct, update or delete your personal information. You can also request a copy of the data we hold about you. To exercise these rights, contact us at sssgrowtech@gmail.com.",
  },
  {
    title: "7. Contact Us",
    content:
      "If you have any questions about this privacy policy or our data practices, please contact us at sssgrowtech@gmail.com or through our contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        badge="Legal"
        title={
          <>
            Privacy <span className="text-gradient">Policy</span>
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
