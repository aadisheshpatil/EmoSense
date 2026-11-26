import { siteConfig } from '../config/site';

// Full class strings are kept here so Tailwind can detect them.
const ACCENT = {
  secondary: {
    text: 'text-secondary',
    icon: 'text-secondary/70',
    dot: 'bg-secondary',
    hover: 'hover:border-secondary/40',
    bar: 'bg-secondary shadow-[0_0_6px_#7bd0ff]',
  },
  primary: {
    text: 'text-primary',
    icon: 'text-primary/70',
    dot: 'bg-primary',
    hover: 'hover:border-primary/40',
    bar: 'bg-primary shadow-[0_0_6px_#d0bcff]',
  },
  tertiary: {
    text: 'text-tertiary',
    icon: 'text-tertiary/70',
    dot: 'bg-tertiary',
    hover: 'hover:border-tertiary/40',
    bar: 'bg-tertiary shadow-[0_0_6px_#ffb0cd]',
  },
};

// Descriptive facts only (no performance numbers). Edit freely.
const METRICS = [
  {
    accent: 'secondary',
    tag: 'INPUTS',
    dotAnim: 'animate-pulse',
    icon: 'sensors',
    value: '3',
    label: 'Modalities',
    footLeft: 'Face · Body · Voice',
    footRight: 'Combined',
    segments: true,
  },
  {
    accent: 'primary',
    tag: 'FUSION',
    dotAnim: 'animate-ping',
    icon: 'hub',
    value: 'Late Fusion',
    label: 'Architecture',
    footLeft: 'Decision Level',
    footRight: 'Combined',
  },
  {
    accent: 'tertiary',
    tag: 'SERVICE',
    dotAnim: '',
    icon: 'dns',
    value: 'FastAPI',
    label: 'Backend API',
    footLeft: 'Python',
    footRight: 'Service',
  },
  {
    accent: 'secondary',
    tag: 'INTERFACE',
    dotAnim: '',
    icon: 'web',
    value: 'React',
    label: 'Web Client',
    footLeft: 'Vite',
    footRight: 'Frontend',
  },
  {
    accent: 'primary',
    tag: 'OUTPUT',
    dotAnim: 'animate-pulse',
    icon: 'psychology',
    value: 'Emotion',
    label: 'Prediction',
    footLeft: 'Multimodal',
    footRight: 'Result',
    wrapperClass: 'col-span-2 sm:col-span-1',
    gradientBar: true,
  },
];

const FACIAL_ROWS = [
  { label: 'Cheek / Lip', width: 'w-[70%]', active: true },
  { label: 'Brow Lowerer', width: 'w-[20%]', active: false },
  { label: 'Brow Raiser', width: 'w-[12%]', active: false },
];

function MetricCard({ m }) {
  const a = ACCENT[m.accent];
  return (
    <div
      className={`${m.wrapperClass ?? ''} p-space-sm rounded-xl bg-surface-container/60 border border-outline-variant/20 flex flex-col justify-between ${a.hover} transition-colors group`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className={`font-label-sm text-[10px] ${a.text} font-mono tracking-wider uppercase flex items-center gap-1`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${a.dot} ${m.dotAnim}`} /> {m.tag}
        </span>
        <span className={`material-symbols-outlined text-[14px] ${a.icon}`}>{m.icon}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className={`font-headline-sm text-headline-sm ${a.text} font-bold font-display tracking-tight`}
        >
          {m.value}
        </span>
        <span className="font-label-sm text-[11px] text-on-surface font-semibold">{m.label}</span>
      </div>
      <div className="mt-2 pt-1 border-t border-outline-variant/20 flex flex-col gap-1">
        <div className="flex justify-between items-center text-[9px] font-mono text-on-surface-variant">
          <span>{m.footLeft}</span>
          <span className={a.text}>{m.footRight}</span>
        </div>
        {m.segments ? (
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden flex gap-0.5">
            <div className="h-full bg-secondary w-1/3" />
            <div className="h-full bg-secondary w-1/3" />
            <div className="h-full bg-secondary w-1/3" />
          </div>
        ) : (
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={`h-full w-full ${
                m.gradientBar ? 'bg-gradient-to-r from-secondary to-primary shadow-[0_0_6px_#7bd0ff]' : a.bar
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="w-full px-margin-mobile md:px-margin py-space-xl lg:py-24 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-gutter items-center">
        {/* ---------------- Left column ---------------- */}
        <div className="lg:col-span-6 flex flex-col items-start gap-space-lg">
          {/* Status pill */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container/80 backdrop-blur-xl shadow-[0_0_20px_rgba(123,208,255,0.2)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary shadow-[0_0_8px_#7bd0ff]" />
            </span>
            <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase font-semibold">
              Multimodal Emotion Recognition
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-space-xs">
            <h1 className="font-display-mobile md:font-display text-display-mobile md:text-display font-bold tracking-tight text-on-surface leading-tight">
              Understand Emotions{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-secondary-container bg-clip-text text-transparent">
                Beyond Words.
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl pt-space-xs">
              Experience intelligent emotion recognition through facial expressions, body language,
              and voice using synchronized multimodal artificial intelligence.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto pt-space-xs">
            <a
              href={siteConfig.appHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl font-label-lg text-label-lg text-white font-semibold bg-gradient-to-r from-primary-container to-secondary-container shadow-[0_0_28px_rgba(160,120,255,0.5)] hover:shadow-[0_0_36px_rgba(123,208,255,0.7)] transition-all transform hover:-translate-y-0.5"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span>Explore EmoSense</span>
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-xl font-label-lg text-label-lg text-secondary bg-surface-container-high/60 backdrop-blur-xl hover:bg-surface-container-highest transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span>Discover How It Works</span>
            </a>
          </div>

          {/* Info tiles */}
          <div className="w-full pt-space-md mt-space-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm p-space-sm rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            {METRICS.map((m) => (
              <MetricCard key={m.tag} m={m} />
            ))}
          </div>
        </div>

        {/* ---------------- Right column: HUD preview ---------------- */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[520px] rounded-3xl p-3 bg-gradient-to-tr from-surface-container-highest/80 via-surface-container/60 to-surface-container-high/80 border border-outline-variant/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)]">
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-8 h-8 rounded-tl-xl border-t-2 border-l-2 border-secondary shadow-[0_0_12px_#7bd0ff]" />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-tr-xl border-t-2 border-r-2 border-secondary shadow-[0_0_12px_#7bd0ff]" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-bl-xl border-b-2 border-l-2 border-secondary shadow-[0_0_12px_#7bd0ff]" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-br-xl border-b-2 border-r-2 border-secondary shadow-[0_0_12px_#7bd0ff]" />

            {/* Top status bar */}
            <div className="absolute -top-6 left-4 right-4 hidden sm:flex items-center justify-between px-space-md py-1 bg-surface-container-lowest/90 border border-outline-variant/30 rounded-full backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary shadow-[0_0_8px_#7bd0ff]" />
                </span>
                <span className="font-label-sm text-[10px] text-white font-mono tracking-widest uppercase">
                  Interface Preview
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] text-on-surface-variant">
                <span className="text-secondary font-semibold">FACE</span>
                <span className="text-outline">|</span>
                <span className="text-primary font-semibold">BODY</span>
                <span className="text-outline">|</span>
                <span className="text-on-surface">VOICE</span>
              </div>
            </div>

            {/* Image + overlays */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-container-lowest flex items-center justify-center border border-outline-variant/30">
              <img
                className="w-full h-full object-cover mix-blend-luminosity brightness-110 contrast-125 hover:scale-105 transition-transform duration-700"
                alt="Futuristic cybernetic human head rendered with glowing neon purple and cyan wireframe mesh against a dark cosmic starfield, with holographic reticle brackets and digital HUD readouts."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRRsZgQgQqSQ4y2aZM9r2Jba1RJeAWgi7CXrWynmHmJL9VTFiGTKkqMJGbnX7w1qbfJgKRmay64M8MzshuvQ6En6ZuTH6_O2Sy4GsflcISknAgCbhZkKUD5vCme015ewfHaPzv8oqc1n58_SoUuhlUOewQaFhFloGm6KsP6dXIrVAnEEZL7t2mm-ibT2N9hSFZJkhkWtzJMVvlXpUhYv5mbvR_7z-8kJR0LpLtOPMT"
              />

              {/* Scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/15 to-transparent pointer-events-none animate-pulse" />

              {/* Reticle */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-32 h-32 rounded-full border border-dashed border-secondary" />
                <div className="absolute w-44 h-44 rounded-full border border-outline-variant/30" />
              </div>

              {/* Top-left: facial signals (illustrative) */}
              <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-[230px] bg-surface-container-lowest/85 border border-outline-variant/30 backdrop-blur-xl p-2.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col gap-1.5">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1">
                  <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" /> Facial Signals
                  </span>
                  <span className="font-mono text-[9px] text-secondary font-semibold">SAMPLE</span>
                </div>

                {FACIAL_ROWS.map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className={row.active ? 'text-on-surface' : 'text-on-surface-variant'}>
                        {row.label}
                      </span>
                      <span className={row.active ? 'text-secondary font-bold' : 'text-outline font-medium'}>
                        —
                      </span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className={`h-full ${row.width} ${
                          row.active
                            ? 'bg-gradient-to-r from-secondary-container to-secondary shadow-[0_0_6px_#7bd0ff]'
                            : 'bg-outline'
                        }`}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[9px] font-mono text-on-surface-variant">
                  <span>Status:</span>
                  <span className="text-secondary font-semibold">ILLUSTRATIVE</span>
                </div>
              </div>

              {/* Top-right: emotion output */}
              <div className="absolute top-3 right-3 hidden sm:flex flex-col gap-1.5 bg-surface-container-lowest/85 border border-outline-variant/30 backdrop-blur-xl p-2.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] max-w-[190px]">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">radar</span>
                    <span className="font-label-sm text-[10px] text-white font-mono uppercase font-semibold">
                      Emotion Output
                    </span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <div className="flex-1 flex flex-col">
                    <span className="text-on-surface-variant text-[9px]">Valence</span>
                    <span className="text-secondary font-bold">—</span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-on-surface-variant text-[9px]">Arousal</span>
                    <span className="text-tertiary font-bold">—</span>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded bg-surface-container-high/80 text-center font-mono text-[9px] text-primary-fixed-dim font-semibold border border-outline-variant/20">
                  AWAITING INPUT
                </div>
              </div>

              {/* Bottom-left: voice / gaze */}
              <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-xl p-2.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] hidden sm:flex flex-col gap-1 max-w-[210px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[14px]">visibility</span>
                    <span className="font-label-sm text-[10px] text-on-surface uppercase font-semibold">
                      Gaze Telemetry
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-secondary font-semibold">PREVIEW</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-on-surface-variant pt-0.5">
                  <span>Vector:</span>
                  <span className="text-primary font-medium">—</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-on-surface-variant">
                  <span>Fixation:</span>
                  <span className="text-secondary font-medium">—</span>
                </div>
              </div>

              {/* Bottom-right: head pose */}
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-xl p-2.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center gap-2 max-w-[220px]">
                <div className="w-8 h-8 rounded-lg bg-secondary-container/20 border border-secondary/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">3d_rotation</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-label-sm text-[10px] text-white font-semibold uppercase">
                      3D Head Pose
                    </span>
                    <span className="font-mono text-[9px] text-secondary font-bold">PREVIEW</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-on-surface-variant">
                    <span className="text-secondary">Y: —</span>
                    <span className="text-outline">|</span>
                    <span className="text-primary">P: —</span>
                    <span className="text-outline">|</span>
                    <span className="text-on-surface">R: —</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}