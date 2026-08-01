"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  Career,
  Category,
  Contact,
  PaginatedData,
  Project,
  QueryParams,
  Service,
  Technology,
  Testimonial,
  Blog,
  FAQ,
  SiteSettings,
  AdminStats,
  User,
  Notification,
  Application,
} from "@/types";

const buildQuery = (params?: QueryParams): string => {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

const unwrap = <T,>(response: { data: ApiResponse<T> }): T => response.data.data;

export function usePublicSettings() {
  return useQuery({
    queryKey: ["settings", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SiteSettings>>("/settings/public");
      return unwrap(response);
    },
  });
}

export function useServicesPublic() {
  return useQuery({
    queryKey: ["services", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Service>>>("/services/public");
      return unwrap(response);
    },
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Service>>(`/services/slug/${slug}`);
      return unwrap(response);
    },
    enabled: Boolean(slug),
  });
}

export function useProjectsPublic(params?: QueryParams) {
  return useQuery({
    queryKey: ["projects", "public", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Project>>>(`/projects/public${buildQuery(params)}`);
      return unwrap(response);
    },
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Project>>(`/projects/slug/${slug}`);
      return unwrap(response);
    },
    enabled: Boolean(slug),
  });
}

export function useBlogsPublic(params?: QueryParams) {
  return useQuery({
    queryKey: ["blogs", "public", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Blog>>>(`/blogs/public${buildQuery(params)}`);
      return unwrap(response);
    },
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Blog>>(`/blogs/slug/${slug}`);
      return unwrap(response);
    },
    enabled: Boolean(slug),
  });
}

export function useRelatedBlogs(id?: string) {
  return useQuery({
    queryKey: ["blogs", "related", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ items: Blog[] }>>(`/blogs/related/${id}`);
      return unwrap(response);
    },
    enabled: Boolean(id),
  });
}

export function useCareersPublic() {
  return useQuery({
    queryKey: ["careers", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Career>>>("/careers/public");
      return unwrap(response);
    },
  });
}

export function useCareerBySlug(slug: string) {
  return useQuery({
    queryKey: ["career", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Career>>(`/careers/slug/${slug}`);
      return unwrap(response);
    },
    enabled: Boolean(slug),
  });
}

export function useTestimonialsPublic() {
  return useQuery({
    queryKey: ["testimonials", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Testimonial>>>("/testimonials/public");
      return unwrap(response);
    },
  });
}

export function useFaqsPublic() {
  return useQuery({
    queryKey: ["faqs", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<FAQ>>>("/faqs/public");
      return unwrap(response);
    },
  });
}

export function useCategoriesPublic() {
  return useQuery({
    queryKey: ["categories", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Category>>>("/categories/public");
      return unwrap(response);
    },
  });
}

export function useTechnologiesPublic() {
  return useQuery({
    queryKey: ["technologies", "public"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Technology>>>("/technologies/public");
      return unwrap(response);
    },
  });
}

// ---- Admin / dashboard hooks ----

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AdminStats>>("/users/stats");
      return unwrap(response);
    },
  });
}

export function useAdminList<T>(resource: string, params?: QueryParams) {
  return useQuery({
    queryKey: ["admin", resource, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<T>>>(`/${resource}${buildQuery(params)}`);
      return unwrap(response);
    },
  });
}

export function useAdminItem<T>(resource: string, id?: string) {
  return useQuery({
    queryKey: ["admin", resource, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<T>>(`/${resource}/${id}`);
      return unwrap(response);
    },
    enabled: Boolean(id),
  });
}

export function useAdminStatsQuery() {
  return useAdminStats();
}

export function useAdminUsers(params?: QueryParams) {
  return useAdminList<User>("users", params);
}

export function useAdminNotifications(params?: QueryParams) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedData<Notification> & { unread: number }>>(`/notifications${buildQuery(params)}`);
      return unwrap(response);
    },
  });
}

export function useMyContacts() {
  return useQuery({
    queryKey: ["contacts", "my"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ items: Contact[] }>>("/contacts/my");
      return unwrap(response);
    },
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["applications", "my"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ items: Application[] }>>("/applications/my");
      return unwrap(response);
    },
  });
}

// ---- Generic admin mutations ----

export function useAdminMutation<TData = unknown>(resource: string, action: "create" | "update" | "delete" | "toggle" | "bulk") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      let response: ApiResponse<TData>;
      if (action === "create") {
        response = await apiRequest("post", `/${resource}`, payload);
      } else if (action === "update") {
        const { id, ...data } = payload as { id: string };
        response = await apiRequest("patch", `/${resource}/${id}`, data);
      } else if (action === "delete") {
        response = await apiRequest("delete", `/${resource}/${payload as string}`);
      } else if (action === "toggle") {
        response = await apiRequest("patch", `/${resource}/${payload as string}/toggle-status`);
      } else {
        response = await apiRequest("delete", `/${resource}/bulk-delete`, payload);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", resource] });
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
}

export default unwrap;
