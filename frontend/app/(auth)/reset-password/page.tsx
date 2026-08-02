"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import api, { getErrorMessage } from "@/lib/api";
import type { ApiResponse } from "@/types";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const { error } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      error("Invalid link", "This reset link is missing a token. Please request a new one.");
      return;
    }
    try {
      await api.post<ApiResponse<unknown>>("/auth/reset-password", {
        token,
        password: data.password,
      });
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      error("Reset failed", getErrorMessage(err));
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">Password reset!</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Set a new password</h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Choose a strong, unique password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="New password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            className="h-11 pr-[3.25rem]"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-6 flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <Input
          label="Confirm new password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          className="h-11"
          {...register("confirmPassword")}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          <KeyRound className="h-4 w-4" /> Reset password
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 block text-center text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
      >
        Back to login
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
