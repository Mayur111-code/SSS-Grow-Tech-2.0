"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { User, KeyRound, Trash2, Save } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import api, { getErrorMessage, tokenStore } from "@/lib/api";
import { resolveImageUrl } from "@/lib/utils";
import type { ApiResponse, ImageRef, User as UserType } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(1000).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function DashboardPage() {
  const { user, setUser, refreshProfile, logout } = useAuth();
  const { success, error } = useToast();
  const [avatar, setAvatar] = useState<ImageRef | null>(user?.avatar ?? null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      company: user?.company || "",
      bio: user?.bio || "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const saveProfile = async (data: ProfileForm) => {
    try {
      const response = await api.patch<ApiResponse<UserType>>("/auth/profile", {
        ...data,
        avatar,
      });
      setUser(response.data.data);
      success("Profile updated");
    } catch (err) {
      error("Update failed", getErrorMessage(err));
    }
  };

  const changePassword = async (data: PasswordForm) => {
    try {
      await api.post<ApiResponse<unknown>>("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      success("Password changed");
    } catch (err) {
      error("Password change failed", getErrorMessage(err));
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete<ApiResponse<unknown>>("/auth/account");
      tokenStore.clear();
      await logout();
      window.location.href = "/";
    } catch (err) {
      setDeleting(false);
      error("Delete failed", getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account details and security</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <User className="h-5 w-5 text-brand-500" /> Avatar
            </h3>
            <div className="mt-5 flex flex-col items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-brand-500/30">
                {user?.avatar?.url ? (
                  <Image src={resolveImageUrl(user.avatar)} alt={user.name} fill className="object-cover" sizes="96px" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-accent-600 font-display text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <ImageUpload
                value={avatar}
                onChange={setAvatar}
                aspect="aspect-[4/3]"
                className="w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Account</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Role</dt>
                <dd className="font-medium capitalize text-brand-600 dark:text-brand-400">{user?.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Member since</dt>
                <dd className="font-medium text-slate-900 dark:text-white">
                  {new Date(user?.createdAt || "").toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-500/20 dark:bg-red-500/5">
            <h3 className="font-display text-lg font-semibold text-red-600 dark:text-red-400">Danger zone</h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Deleting your account removes all your data permanently.
            </p>
            <Button variant="danger" className="mt-4 w-full" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" /> Delete account
            </Button>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <form
            onSubmit={profileForm.handleSubmit(saveProfile)}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]"
          >
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Edit profile</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register("name")}
              />
              <Input
                label="Phone"
                placeholder="+1 555 000 0000"
                {...profileForm.register("phone")}
              />
              <Input
                label="Company"
                placeholder="Your company"
                {...profileForm.register("company")}
              />
            </div>
            <div className="mt-5">
              <Textarea
                label="Bio"
                rows={4}
                placeholder="Tell us about yourself..."
                error={profileForm.formState.errors.bio?.message}
                {...profileForm.register("bio")}
              />
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" loading={profileForm.formState.isSubmitting}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </div>
          </form>

          <form
            onSubmit={passwordForm.handleSubmit(changePassword)}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f101a]"
          >
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
              <KeyRound className="h-5 w-5 text-brand-500" /> Change password
            </h3>
            <div className="mt-5 space-y-5">
              <Input
                label="Current password"
                type="password"
                error={passwordForm.formState.errors.currentPassword?.message}
                {...passwordForm.register("currentPassword")}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="New password"
                  type="password"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register("newPassword")}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register("confirmPassword")}
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" loading={passwordForm.formState.isSubmitting}>
                <KeyRound className="h-4 w-4" /> Update password
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteAccount}
        loading={deleting}
        title="Delete your account?"
        message="This will permanently remove your account and all associated data. This action cannot be undone."
        confirmLabel="Delete account"
      />
    </div>
  );
}
