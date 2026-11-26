const NAV_COLUMN = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
];

// These pages don't exist in the project yet: they keep the original layout
// and link to "#" until you point them at real destinations.
const RESOURCES_COLUMN = [
  { label: 'Documentation', href: '#' },
  { label: 'Research Whitepaper', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Python SDK', href: '#' },
];

const LEGAL_COLUMN = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Biometric Data Security', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Ethics Compliance', href: '#' },
  { label: 'Contact', href: '#' },
];

const SOCIAL = ['terminal', 'share', 'hub'];

function LinkColumn({ title, links }) {
  return (
    <div className="flex flex-col gap-space-sm">
      <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
        {title}
      </span>
      <nav className="flex flex-col gap-space-xs" aria-label={title}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface-variant">
      <div className="w-full px-margin-mobile md:px-margin pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg mb-space-xl">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-space-md pr-0 lg:pr-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/40 shadow-[0_0_12px_rgba(160,120,255,0.3)]">
                <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface">EmoSense</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
              Pioneering multimodal affective computing through facial expressions, body telemetry, and
              acoustic voice analysis.
            </p>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container border border-secondary/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#7bd0ff] animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface">
                Multimodal Emotion Recognition
              </span>
            </div>
          </div>

          <LinkColumn title="Navigation" links={NAV_COLUMN} />
          <LinkColumn title="Resources" links={RESOURCES_COLUMN} />
          <LinkColumn title="Legal & Trust" links={LEGAL_COLUMN} />
        </div>

        <div className="pt-space-md border-t border-outline-variant/20 flex flex-col sm:flex-row items-center gap-space-md justify-center">
          <div className="flex items-center gap-space-sm">
            {SOCIAL.map((icon) => (
              <a
                key={icon}
                href="#"
                aria-label={icon}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}