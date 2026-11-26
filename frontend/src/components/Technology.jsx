import SectionHeader from './SectionHeader';

const TECH = [
  {
    icon: 'web',
    tag: 'Frontend',
    title: 'React + Vite',
    description: 'A component-based interface built with React and bundled by Vite.',
    accent: 'primary',
  },
  {
    icon: 'palette',
    tag: 'Styling',
    title: 'Tailwind CSS',
    description: 'Utility-first styling that carries the EmoSense design across screen sizes.',
    accent: 'secondary',
  },
  {
    icon: 'dns',
    tag: 'Backend',
    title: 'FastAPI',
    description: 'A Python API service that connects the web client to the emotion recognition models.',
    accent: 'tertiary',
  },
  {
    icon: 'visibility',
    tag: 'Face & Body',
    title: 'Computer Vision',
    description: 'Facial landmark and skeletal pose analysis for expression and posture cues.',
    accent: 'primary',
  },
  {
    icon: 'graphic_eq',
    tag: 'Voice',
    title: 'Audio Analysis',
    description: 'Acoustic feature extraction and prosodic modeling for vocal emotion cues.',
    accent: 'secondary',
  },
  {
    icon: 'hub',
    tag: 'Decision Level',
    title: 'Late Fusion',
    description: 'Per-modality outputs are combined into a single emotion prediction.',
    accent: 'tertiary',
  },
];

// Full class strings so Tailwind can detect them
const ACCENT = {
  primary: {
    iconBox: 'bg-primary-container/20 text-primary shadow-[0_0_16px_rgba(160,120,255,0.3)]',
    pill: 'text-primary bg-primary/10',
    hoverShadow: 'hover:shadow-[0_10px_35px_rgba(160,120,255,0.15)]',
    titleHover: 'group-hover:text-primary',
  },
  secondary: {
    iconBox: 'bg-secondary-container/20 text-secondary shadow-[0_0_16px_rgba(123,208,255,0.3)]',
    pill: 'text-secondary bg-secondary/10',
    hoverShadow: 'hover:shadow-[0_10px_35px_rgba(123,208,255,0.15)]',
    titleHover: 'group-hover:text-secondary',
  },
  tertiary: {
    iconBox: 'bg-tertiary-container/20 text-tertiary shadow-[0_0_16px_rgba(247,81,161,0.3)]',
    pill: 'text-tertiary bg-tertiary/10',
    hoverShadow: 'hover:shadow-[0_10px_35px_rgba(247,81,161,0.15)]',
    titleHover: 'group-hover:text-tertiary',
  },
};

export default function Technology() {
  return (
    <section id="technology" className="w-full px-margin-mobile md:px-margin py-space-xl lg:py-24 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <SectionHeader
          eyebrow="Technology Stack"
          eyebrowClass="text-secondary"
          title="The Technology Behind EmoSense"
        >
          The tools and techniques that connect the interface, the backend, and the three emotion
          recognition streams.
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {TECH.map((t) => {
            const a = ACCENT[t.accent];
            return (
              <div
                key={t.title}
                className={`group bg-surface-container/60 hover:bg-surface-container/90 rounded-3xl p-space-lg flex flex-col gap-space-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg ${a.hoverShadow}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${a.iconBox}`}>
                    <span className="material-symbols-outlined text-[28px]">{t.icon}</span>
                  </div>
                  <span
                    className={`font-mono text-label-sm tracking-widest uppercase px-2.5 py-1 rounded-full ${a.pill}`}
                  >
                    {t.tag}
                  </span>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <h3
                    className={`font-headline-sm text-headline-sm font-bold text-on-surface transition-colors ${a.titleHover}`}
                  >
                    {t.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}