import SectionHeader from './SectionHeader';

// Skeleton figure for the body-language card (converted from the original inline SVG)
const BONES = [
  [170, 48, 170, 74], [126, 80, 214, 80], [170, 74, 126, 80], [170, 74, 214, 80],
  [170, 74, 170, 122], [170, 122, 170, 166], [138, 166, 202, 166], [170, 166, 138, 166],
  [170, 166, 202, 166], [126, 80, 100, 120], [100, 120, 86, 162], [214, 80, 240, 120],
  [240, 120, 254, 162], [138, 166, 132, 198], [202, 166, 208, 198],
];
const GUIDES = [
  [100, 120, 170, 122], [240, 120, 170, 122], [126, 80, 138, 166], [214, 80, 202, 166],
];
const P = '#d0bcff';
const JOINTS = [
  { cx: 170, cy: 74, r: 3 },
  { cx: 126, cy: 80, r: 3.5, fill: P },
  { cx: 214, cy: 80, r: 3.5, fill: P },
  { cx: 100, cy: 120, r: 2.8 },
  { cx: 240, cy: 120, r: 2.8 },
  { cx: 86, cy: 162, r: 3, fill: P },
  { cx: 254, cy: 162, r: 3, fill: P },
  { cx: 170, cy: 122, r: 2.5 },
  { cx: 170, cy: 166, r: 3, fill: P },
  { cx: 138, cy: 166, r: 3 },
  { cx: 202, cy: 166, r: 3 },
  { cx: 132, cy: 198, r: 2.5 },
  { cx: 208, cy: 198, r: 2.5 },
];

function SkeletonPreview() {
  return (
    <div className="w-full h-56 rounded-2xl overflow-hidden relative bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#00a6e0_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/40 pointer-events-none z-10" />

      <svg
        className="w-full h-full p-2 relative z-0 transition-transform duration-700 group-hover:scale-105"
        viewBox="0 0 340 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="boneGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7bd0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.6" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="75" y="20" width="190" height="172" rx="10" stroke="#7bd0ff" strokeOpacity="0.18" strokeDasharray="3 3" />
        <path d="M 75 32 L 75 20 L 87 20" stroke="#7bd0ff" strokeWidth="1.5" />
        <path d="M 265 32 L 265 20 L 253 20" stroke="#7bd0ff" strokeWidth="1.5" />
        <path d="M 75 180 L 75 192 L 87 192" stroke="#7bd0ff" strokeWidth="1.5" />
        <path d="M 265 180 L 265 192 L 253 192" stroke="#7bd0ff" strokeWidth="1.5" />

        <circle cx="170" cy="44" r="16" stroke="#7bd0ff" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="170" cy="44" r="4" fill="#7bd0ff" filter="url(#neonGlow)" />

        <g stroke="url(#boneGlow)" strokeWidth="1.8" strokeLinecap="round" filter="url(#neonGlow)">
          {BONES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>

        <g stroke="#d0bcff" strokeOpacity="0.35" strokeDasharray="2 2" strokeWidth="1">
          {GUIDES.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>

        <g fill="#7bd0ff" filter="url(#neonGlow)">
          {JOINTS.map((j, i) => (
            <circle key={i} cx={j.cx} cy={j.cy} r={j.r} fill={j.fill} />
          ))}
        </g>
      </svg>

      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 border border-secondary/30 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="font-mono text-[9px] text-secondary font-bold tracking-wider">SKELETAL POSE</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-md">
          <span className="font-mono text-[9px] text-primary font-semibold">STREAM:</span>
          <span className="font-mono text-[9px] text-secondary font-bold">BODY</span>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/90 border border-outline-variant/30 backdrop-blur-md">
          <span className="material-symbols-outlined text-[12px] text-secondary">accessibility_new</span>
          <span className="font-mono text-[9px] text-on-surface font-medium">POSTURE · GESTURE</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-surface-container-lowest/90 border border-secondary/30 backdrop-blur-md font-mono text-[9px] text-secondary font-bold">
          ILLUSTRATIVE
        </div>
      </div>
    </div>
  );
}

function ImagePreview({ src, alt, leftChip, rightChip, rightChipClass }) {
  return (
    <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-surface-container-lowest">
      <img
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        src={src}
        alt={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
        <span className="font-label-sm text-white font-mono text-[11px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
          {leftChip}
        </span>
        <span
          className={`font-label-sm font-mono text-[11px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded ${rightChipClass}`}
        >
          {rightChip}
        </span>
      </div>
    </div>
  );
}

// Full class strings per card so Tailwind can detect them
const CARDS = [
  {
    key: 'face',
    icon: 'face',
    stream: 'Stream 01',
    title: 'Facial Emotion Recognition',
    description:
      'Analyse facial expressions using computer vision and facial landmark tracking to pick up subtle emotional cues and shifts.',
    footer: 'Facial Landmarks • Expressions',
    hoverShadow: 'hover:shadow-[0_10px_35px_rgba(160,120,255,0.15)]',
    iconBox: 'bg-primary-container/20 text-primary shadow-[0_0_16px_rgba(160,120,255,0.3)]',
    pill: 'text-primary bg-primary/10',
    titleHover: 'group-hover:text-primary',
    arrow: 'text-primary',
    preview: {
      type: 'image',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjj0VbPfaN4tW_HHABV5t0zTx-Mk0DbxKcfaR1ZqFByD5SZh5BIgWnMevPjuX6EIY3a5VzAmen11jnwP2r22PO05Coz9oxFAfajLa5H7G1MZCOIE13FAtyy7XIHyxWbF1j2EYpQKiSec9XBGFhlgRRlinePoRHCqrxv61gcYS-SC972CoVtBGmXA2rBxwpNDuoXKf47Rng9WkHzp2HqfbGx0G1G4c0GFeVR_OqWl4_',
      alt: 'Close-up of a human face lit by purple ultraviolet light with cyan facial tracking grid dots and telemetry lines.',
      leftChip: 'FACIAL STREAM',
      rightChip: 'VISION',
      rightChipClass: 'text-secondary',
    },
  },
  {
    key: 'body',
    icon: 'accessibility_new',
    stream: 'Stream 02',
    title: 'Body Language Analysis',
    description:
      'Analyse posture, gestures and body movements using skeletal keypoint tracking. Interprets tension, shoulder orientation, head tilt, and physical engagement.',
    footer: 'Skeletal Keypoints • Posture',
    hoverShadow: 'hover:shadow-[0_10px_35px_rgba(123,208,255,0.15)]',
    iconBox: 'bg-secondary-container/20 text-secondary shadow-[0_0_16px_rgba(123,208,255,0.3)]',
    pill: 'text-secondary bg-secondary/10',
    titleHover: 'group-hover:text-secondary',
    arrow: 'text-secondary',
    preview: { type: 'skeleton' },
  },
  {
    key: 'voice',
    icon: 'graphic_eq',
    stream: 'Stream 03',
    title: 'Voice Emotion Recognition',
    description:
      'Analyse vocal characteristics and speech patterns through acoustic features and prosodic modeling, considering pitch, cadence, energy, and tone.',
    footer: 'Acoustic Features • Prosody',
    hoverShadow: 'hover:shadow-[0_10px_35px_rgba(247,81,161,0.15)]',
    iconBox: 'bg-tertiary-container/20 text-tertiary shadow-[0_0_16px_rgba(247,81,161,0.3)]',
    pill: 'text-tertiary bg-tertiary/10',
    titleHover: 'group-hover:text-tertiary',
    arrow: 'text-tertiary',
    preview: {
      type: 'image',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEG7fG47VajanxzkqbTsSz6MhyjIWMETCFOdMzt14rAN9GrEnAVuJgMlv5eQ4SqWezh0mOvpbtg6B2fgCkoTVKw7m5OkRH3MsWQY2xHM6JJB_q9eYgAmb1_DMCjMZXiBZaEQz8L2Vx9IC7qun4wq-uMELhtxKZEGtIvrZxTI5cPSBq3P4E0BDzOwj4A78D9kN6KdmMq4KWHdqRuke-cQKzhT53uR5vTTS5mJAV4ppD',
      alt: 'Acoustic frequency spectrogram with magenta and violet spectral curves over a dark oscilloscope grid.',
      leftChip: 'ACOUSTIC STREAM',
      rightChip: 'AUDIO',
      rightChipClass: 'text-tertiary',
    },
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full px-margin-mobile md:px-margin py-space-xl lg:py-24 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <SectionHeader
          eyebrow="Comprehensive Multimodal Sensing"
          eyebrowClass="text-secondary"
          title="Three Modalities. One Unified Emotional Truth."
        >
          Independent sensor streams continuously feed specialized sub-networks before they are combined.
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {CARDS.map((c) => (
            <div
              key={c.key}
              className={`group bg-surface-container/60 hover:bg-surface-container/90 rounded-3xl p-space-lg flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg ${c.hoverShadow}`}
            >
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.iconBox}`}>
                    <span className="material-symbols-outlined text-[28px]">{c.icon}</span>
                  </div>
                  <span
                    className={`font-mono text-label-sm tracking-widest uppercase px-2.5 py-1 rounded-full ${c.pill}`}
                  >
                    {c.stream}
                  </span>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <h3
                    className={`font-headline-sm text-headline-sm font-bold text-on-surface transition-colors ${c.titleHover}`}
                  >
                    {c.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {c.preview.type === 'skeleton' ? <SkeletonPreview /> : <ImagePreview {...c.preview} />}
              </div>

              <div className="pt-space-md mt-space-md flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">{c.footer}</span>
                <span
                  className={`material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform ${c.arrow}`}
                >
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}