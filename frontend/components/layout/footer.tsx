"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ArrowUp,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const services = [
  { href: "/services/web-development", label: "Web Development" },
  { href: "/services/mobile-app-development", label: "Mobile Apps" },
  { href: "/services/ai-solutions", label: "AI Solutions" },
  { href: "/services/ui-ux-design", label: "UI/UX Design" },
  { href: "/services/cloud-solutions", label: "Cloud Solutions" },
  { href: "/services/digital-marketing", label: "Digital Marketing" },
];

const company = [
  { href: "/about", label: "About Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
];

const contactItems = [
  { icon: Mail, label: "Email", value: "sssgrowtech@gmail.com", href: "mailto:sssgrowtech@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 70285 07985", href: "tel:+917028507985" },
  { icon: Phone, label: "Alternate", value: "+91 98342 32411", href: "tel:+919834232411" },
  { icon: MapPin, label: "Office", value: "India · Serving clients worldwide" },
];

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0a0a12]">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-accent-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Link href="/">
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Premium IT services agency delivering world-class software, web, mobile, AI and cloud
              solutions that help businesses grow and scale.
            </p>

            <div className="mt-7">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Stay in the loop</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Product insights, tech tips and industry news. No spam.
              </p>
              <form onSubmit={handleSubscribe} className="mt-3 flex max-w-sm items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-[0_8px_30px_-8px_rgba(139,92,246,0.6)] transition hover:opacity-90"
                >
                  {subscribed ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </motion.button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs font-medium text-emerald-500">Thanks for subscribing!</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Services</h4>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="group inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {service.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Company</h4>
            <ul className="mt-5 space-y-3">
              {company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Get in touch</h4>
            <ul className="mt-5 space-y-3.5 text-sm text-slate-500 dark:text-slate-400">
              {contactItems.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="font-medium text-slate-700 transition hover:text-brand-500 dark:text-slate-200 dark:hover:text-brand-400">
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-medium text-slate-700 dark:text-slate-200">{item.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2.5">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-brand-300"
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} SSS Grow Tech. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500">
            <Link href="/privacy-policy" className="transition hover:text-brand-500">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-brand-500">Terms of Service</Link>
            <Link href="/faq" className="transition hover:text-brand-500">FAQ</Link>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-brand-300"
          >
            <ArrowUp className="h-4 w-4 transition group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
