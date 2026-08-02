"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageSquareText, Phone, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/hooks/use-animations";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["contact", "quote"]),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Mail, label: "Email", value: "sssgrowtech@gmail.com", href: "mailto:sssgrowtech@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 70285 07985", href: "tel:+917028507985" },
  { icon: Phone, label: "Alternate", value: "+91 98342 32411", href: "tel:+919834232411" },
  { icon: Clock, label: "Hours", value: "Mon - Sat, 9:00 - 18:00 (IST)" },
];

export function ContactForm() {
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [requestedService, setRequestedService] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRequestedService(params.get("service") || "");
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "contact",
      subject: requestedService ? `Project inquiry: ${requestedService}` : "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!isAuthenticated) {
      info("Login required", "Please login to send a message.");
      router.push(`/login?redirect=${encodeURIComponent("/contact")}`);
      return;
    }
    try {
      await api.post<ApiResponse<unknown>>("/contacts/send", data);
      setSubmitted(true);
      reset();
      success("Message sent", "We'll get back to you within 24 hours.");
    } catch (err) {
      error("Failed to send", getErrorMessage(err));
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Contact information</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Prefer to reach out directly? We&apos;d love to hear from you.
              </p>
            </Reveal>
            <StaggerContainer className="mt-8 space-y-4" stagger={0.08}>
              {contactInfo.map((info) => (
                <StaggerItem key={info.label}>
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0f101a]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="mt-0.5 block break-words font-medium text-slate-900 transition hover:text-brand-600 dark:text-white">
                          {info.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 break-words font-medium text-slate-900 dark:text-white">{info.value}</p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal delay={0.2} className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">What happens next?</h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    Our team reviews your inquiry within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    We schedule a free consultation call
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    You receive a tailored proposal and timeline
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-[#0f101a]">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Message sent!</h3>
                  <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Thanks for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <MessageSquareText className="h-5 w-5 text-brand-500" />
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Send us a message</h3>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Full name" placeholder="Jane Doe" className="h-11" error={errors.name?.message} {...register("name")} />
                      <Input label="Email" type="email" placeholder="jane@company.com" className="h-11" error={errors.email?.message} {...register("email")} />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Phone (optional)" placeholder="+91 70000 00000" className="h-11" {...register("phone")} />
                      <Select
                        label="Inquiry type"
                        error={errors.type?.message}
                        className="h-11"
                        {...register("type")}
                        options={[
                          { value: "contact", label: "General inquiry" },
                          { value: "quote", label: "Request a quote" },
                        ]}
                      />
                    </div>
                    <Input
                      label="Subject"
                      placeholder="What is this regarding?"
                      className="h-11"
                      error={errors.subject?.message}
                      {...register("subject")}
                    />
                    <Textarea
                      label="Message"
                      placeholder="Tell us about your project or question..."
                      rows={5}
                      error={errors.message?.message}
                      {...register("message")}
                    />
                    <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                      Send message
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-center text-xs text-slate-400">
                        You&apos;ll be asked to login first to send your message.
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
