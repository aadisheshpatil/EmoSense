import { useEffect, useState } from 'react';
import { siteConfig } from '../config/site';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'technology', label: 'Technology' },
  { id: 'about', label: 'About' },
];

// Must match the order sections appear on the page (top to bottom)
const SECTION_ORDER = ['home', 'about', 'features', 'how-it-works', 'technology'];

const ACTIVE_CLASSES =
  'text-primary font-semibold relative after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-secondary after:shadow-[0_0_8px_#7bd0ff]';
const IDLE_CLASSES = 'text-on-surface-variant hover:text-on-surface';

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll-spy: highlight the section currently under the navbar
  useEffect(() => {
    const onScroll = () => {
      let current = 'home';
      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="h-20 w-full px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        {/* Brand */}
        <a href="#home" className="flex items-center gap-space-sm" onClick={closeMenu}>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/40 shadow-[0_0_16px_rgba(160,120,255,0.35)]">
            <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              Emo<span className="text-primary shadow-[0_0_12px_rgba(160,120,255,0.5)]">Sense</span>
            </span>
            <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase hidden sm:block">
              Affective AI Engine
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-space-lg" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? 'page' : undefined}
                className={`font-label-lg text-label-lg transition-colors py-space-xs ${
                  isActive ? ACTIVE_CLASSES : IDLE_CLASSES
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-space-sm">
          <a
            href={siteConfig.loginHref}
            className="hidden sm:inline-flex items-center justify-center px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface rounded-xl border border-outline-variant/40 hover:border-outline-variant hover:bg-surface-container-high transition-all"
          >
            Login
          </a>
          <a
            href="#get-started"
            className="inline-flex items-center justify-center px-space-md py-space-xs font-label-md text-label-md text-on-primary-container font-semibold rounded-xl bg-gradient-to-r from-primary-container to-secondary-container shadow-[0_0_20px_rgba(160,120,255,0.4)] hover:shadow-[0_0_28px_rgba(123,208,255,0.6)] transition-all"
          >
            Get Started
          </a>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>

          {/* Mobile / tablet menu toggle */}
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="material-symbols-outlined text-[22px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="lg:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_12px_30px_rgba(0,0,0,0.6)] px-margin-mobile md:px-margin py-space-md flex flex-col gap-space-xs"
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={closeMenu}
                aria-current={isActive ? 'page' : undefined}
                className={`font-label-lg text-label-lg px-space-md py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'text-primary bg-surface-container'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={siteConfig.loginHref}
            onClick={closeMenu}
            className="sm:hidden font-label-lg text-label-lg px-space-md py-3 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Login
          </a>
        </nav>
      )}
    </header>
  );
}