"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, BadgeDollarSign, Briefcase, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLoader } from "@/components/ui/skeleton";
import { Reveal } from "@/hooks/use-animations";
import { useCareerBySlug } from "@/services/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ResumeUpload } from "@/components/ui/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types";

const applySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  portfolioUrl: z.string().url("Valid URL required").optional().or(z.literal("")),
  coverLetter: z.string().min(20, "Cover letter must be at least 20 characters").max(3000),
  resumeUrl: z.string().min(1, "Resume is required"),
});

type ApplyForm = z.infer<typeof applySchema>;

export function CareerDetails({ slug }: { slug: string }) {
  const { data: job, isLoading } = useCareerBySlug(slug);
  const { isAuthenticated, user } = useAuth();
  const { success, error, info } = useToast();
  const router = useRouter();
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumePublicId, setResumePublicId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ApplyForm>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: ApplyForm) => {
    if (!isAuthenticated) {
      info("Login required", "Please login to apply for this position.");
      router.push(`/login?redirect=${encodeURIComponent(`/careers/${slug}`)}`);
      return;
    }
    if (!job) return;
    try {
      const response = await api.post<ApiResponse<unknown>>("/applications/apply", {
        careerId: job._id,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        portfolioUrl: data.portfolioUrl || "",
        coverLetter: data.coverLetter,
        resumeUrl,
        resumePublicId: resumePublicId || "",
      });
      success("Application submitted", "Our team will review your application and get back to you soon.");
      router.push("/dashboard/applications");
    } catch (err) {
      error("Submission failed", getErrorMessage(err));
    }
  };

  if (isLoading) return <PageLoader label="Loading position..." />;
  if (!job) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Position not found</h1>
        <Link href="/careers">
          <span className="text-brand-600">Back to careers</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-mesh pb-12 pt-28 sm:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" /> All positions
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="success">{job.status === "open" ? "Open" : "Closed"}</Badge>
              <Badge variant="neutral">{job.type}</Badge>
              <Badge variant="neutral">{job.department}</Badge>
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              {job.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-500" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-500" /> {job.experience || "Any experience"}
              </span>
              {job.salary && (
                <span className="inline-flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4 text-brand-500" /> {job.salary}
                </span>
              )}
              {job.applicationDeadline && (
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-500" />
                  Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-4xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">About the role</h2>
              <div
                className="prose prose-slate mt-4 max-w-none break-words leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </Reveal>

            {job.responsibilities?.length > 0 && (
              <Reveal className="mt-8">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">What you&apos;ll do</h2>
                <ul className="mt-4 space-y-3">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {job.requirements?.length > 0 && (
              <Reveal className="mt-8">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">What we&apos;re looking for</h2>
                <ul className="mt-4 space-y-3">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {job.benefits?.length > 0 && (
              <Reveal className="mt-8">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Benefits</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full bg-brand-500/10 px-3 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-400"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <div>
            <Reveal delay={0.1}>
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Apply for this position
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {isAuthenticated
                    ? "Fill out the form below to submit your application."
                    : "Login to apply. After login you'll be redirected back automatically."}
                </p>
                {!isAuthenticated && (
                  <Link href={`/login?redirect=${encodeURIComponent(`/careers/${slug}`)}`}>
                    <Button className="mt-4 w-full">Login to apply</Button>
                  </Link>
                )}
                {isAuthenticated && (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                    <Input label="Full name" placeholder="Jane Doe" className="h-11" error={errors.name?.message} {...register("name")} />
                    <Input label="Email" type="email" placeholder="jane@company.com" className="h-11" error={errors.email?.message} {...register("email")} />
                    <Input label="Phone (optional)" placeholder="+1 555 000 0000" className="h-11" {...register("phone")} />
                    <Input
                      label="Portfolio / LinkedIn (optional)"
                      placeholder="https://..."
                      className="h-11"
                      error={errors.portfolioUrl?.message}
                      {...register("portfolioUrl")}
                    />
                    <Textarea
                      label="Cover letter"
                      placeholder="Tell us why you're a great fit..."
                      rows={4}
                      error={errors.coverLetter?.message}
                      {...register("coverLetter")}
                    />
                    <ResumeUpload
                      label="Resume (PDF, DOC, DOCX)"
                      className="w-full"
                      value={resumeUrl}
                      onChange={(url, publicId) => {
                        setResumeUrl(url);
                        setResumePublicId(publicId || "");
                        setValue("resumeUrl", url);
                      }}
                    />
                    {errors.resumeUrl && <p className="text-xs text-red-500">{errors.resumeUrl.message}</p>}
                    <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                      Submit application
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
