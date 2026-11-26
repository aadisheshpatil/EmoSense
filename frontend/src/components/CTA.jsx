import { siteConfig } from '../config/site';

export default function CTA() {
  return (
    <section id="get-started" className="w-full px-margin-mobile md:px-margin py-space-xl lg:py-24 relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full rounded-3xl p-space-lg md:p-space-xl overflow-hidden bg-gradient-to-r from-surface-container-high/90 via-surface-container/80 to-surface-container-high/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(160,120,255,0.15)] flex flex-col items-center text-center gap-space-lg">
          {/* Background accents */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />

          <div className="relative z-10 inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest/80 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#7bd0ff]" />
            <span className="font-label-sm text-label-sm text-on-surface tracking-widest uppercase font-semibold">
              Explore the Project
            </span>
          </div>

          <div className="flex flex-col gap-space-xs max-w-2xl relative z-10">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
              Discover the Power of Multimodal AI.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              See how facial expressions, body language, and voice come together to recognise emotion.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-md relative z-10 w-full sm:w-auto">
            <a
              href={siteConfig.appHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-xl font-label-lg text-label-lg text-white font-semibold bg-gradient-to-r from-primary-container to-secondary-container shadow-[0_0_30px_rgba(160,120,255,0.6)] hover:shadow-[0_0_40px_rgba(123,208,255,0.8)] transition-all transform hover:-translate-y-0.5"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                rocket_launch
              </span>
              <span>Start Exploring</span>
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-xl font-label-lg text-label-lg text-secondary bg-surface-container-lowest/80 hover:bg-surface-container-highest transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">route</span>
              <span>Learn How It Works</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}