'use client';

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/resume', label: 'Resume' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="flex w-full max-w-5xl flex-col gap-3 rounded-2xl border border-border/60 bg-surface/80 px-5 py-3 shadow-subtle backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-6"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-foreground">
            Isiah Udofia
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  isActive
                    ? 'bg-foreground/10 text-accent'
                    : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/iudofia2026"
            aria-label="GitHub profile"
            className="rounded-full border border-border/60 bg-surface/40 p-2 transition hover:border-accent/60 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Github className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="https://www.linkedin.com/in/isiah-udofia/"
            aria-label="LinkedIn profile"
            className="rounded-full border border-border/60 bg-surface/40 p-2 transition hover:border-accent/60 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Linkedin className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}
