"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { error } = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await api.post<ApiResponse<unknown>>("/auth/forgot-password", data);
      setSent(true);
    } catch (err) {
      error("Something went wrong", getErrorMessage(err));
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Check your email</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          If an account exists with that email, we&apos;ve sent you a password reset link. Check your
          inbox (and spam folder).
        </p>
        <Link href="/login" className="mt-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Forgot password?</h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          <Mail className="h-4 w-4" /> Send reset link
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
    </div>
  );
}
