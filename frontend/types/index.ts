export type Role = "admin" | "user";

export interface ImageRef {
  url: string;
  publicId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: ImageRef | null;
  phone: string;
  company: string;
  bio: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  savedProjects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

export interface Seo {
  title: string;
  description: string;
  keywords: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Technology {
  _id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  color: string;
  proficiency: number;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: ImageRef | null;
  icon: string;
  category: string | Category | null;
  features: string[];
  technologies: (string | Technology)[];
  seo: Seo;
  status: "active" | "inactive";
  featured: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  client: string;
  industry: string;
  location: string;
  year: number;
  duration: string;
  category: string | Category | null;
  technologies: (string | Technology)[];
  features: string[];
  gallery: ImageRef[];
  cover: ImageRef | null;
  liveUrl: string;
  githubUrl: string;
  seo: Seo;
  featured: boolean;
  status: "published" | "draft" | "archived";
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: ImageRef | null;
  banner: ImageRef | null;
  author: string;
  tags: string[];
  category: string | Category | null;
  seo: Seo;
  publishDate: string;
  status: "published" | "draft";
  featured: boolean;
  views: number;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: ImageRef | null;
  content: string;
  rating: number;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: string;
}

export interface Career {
  _id: string;
  title: string;
  slug: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationDeadline: string | null;
  status: "open" | "closed";
  featured: boolean;
  createdAt: string;
}

export interface Application {
  _id: string;
  user: string | User;
  career: string | Career;
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  coverLetter: string;
  resume: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  notes: string;
  createdAt: string;
}

export interface Contact {
  _id: string;
  user: string | User | null;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: "contact" | "quote";
  status: "pending" | "processing" | "resolved" | "closed";
  reply: string;
  repliedAt: string | null;
  adminNotes: string;
  createdAt: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  status: "active" | "inactive";
  sortOrder: number;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  [key: string]: string | number | boolean | Record<string, unknown> | undefined;
}

export interface AdminStats {
  counts: {
    users: number;
    services: number;
    projects: number;
    blogs: number;
    testimonials: number;
    careers: number;
    applications: number;
    contacts: number;
    faqs: number;
    technologies: number;
    categories: number;
  };
  recentContacts: Contact[];
  recentApplications: Application[];
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  status?: string;
  category?: string;
  featured?: boolean | string;
}
