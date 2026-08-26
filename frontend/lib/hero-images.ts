/**
 * Hero background images for each public page.
 *
 * Local images (preferred): place files in frontend/public/images/ with these names:
 *   hero-home.jpg, hero-about.jpg, hero-services.jpg, hero-portfolio.jpg,
 *   hero-blog.jpg, hero-careers.jpg, hero-contact.jpg
 *
 * To switch to local: change the paths below from URLs to "/images/hero-*.jpg"
 */

const USE_LOCAL = false;

const LOCAL: Record<string, string> = {
  home: "/images/hero-home.jpg",
  about: "/images/hero-about.jpg",
  services: "/images/hero-services.jpg",
  portfolio: "/images/hero-portfolio.jpg",
  blog: "/images/hero-blog.jpg",
  careers: "/images/hero-careers.jpg",
  contact: "/images/hero-contact.jpg",
};

const REMOTE: Record<string, string> = {
  home: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format",
  about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80&auto=format",
  services: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format",
  portfolio: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1600&q=80&auto=format",
  blog: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80&auto=format",
  careers: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80&auto=format",
  contact: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80&auto=format",
};

const source = USE_LOCAL ? LOCAL : REMOTE;

export const HERO_IMAGES = {
  home: source.home,
  about: source.about,
  services: source.services,
  portfolio: source.portfolio,
  blog: source.blog,
  careers: source.careers,
  contact: source.contact,
} as const;

export type HeroImageKey = keyof typeof HERO_IMAGES;
