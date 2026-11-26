import SectionHeader from './SectionHeader';

const BADGES = [
  {
    label: 'Robustness',
    labelClass: 'text-secondary',
    text: 'Complementary channels can support each other when one is weak',
  },
  {
    label: 'Temporal Context',
    labelClass: 'text-primary',
    text: 'Signals are considered together rather than in isolation',
  },
  {
    label: 'Valence • Arousal',
    labelClass: 'text-tertiary',
    text: 'Emotion can be described on a continuous scale as well as by label',
  },
];

const SCENARIOS = [
  {
    title: 'Ambiguous social cues (e.g. sarcasm)',
    helpers: [
      { name: 'Face', cls: 'text-primary' },
      { name: 'Body', cls: 'text-secondary' },
      { name: 'Voice', cls: 'text-tertiary' },
    ],
  },
  {
    title: 'Low light or poor camera framing',
    helpers: [{ name: 'Voice', cls: 'text-tertiary' }],
  },
  {
    title: 'Noisy acoustic background',
    helpers: [
      { name: 'Face', cls: 'text-primary' },
      { name: 'Body', cls: 'text-secondary' },
    ],
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-low/40 relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <SectionHeader
          eyebrow="System Architecture & Philosophy"
          title="Why Multimodal Matters in Emotion AI"
        >
          Unimodal systems rely on a single channel, such as facial video or isolated voice acoustics.
          In real-world environments, single channels regularly degrade due to dynamic lighting, camera
          occlusion, masked emotions, or flat vocal tones. EmoSense combines three complementary
          sensory pipelines to build a more complete picture of how someone feels.
        </SectionHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          {/* Left card */}
          <div className="lg:col-span-7 bg-surface-container/70 rounded-3xl p-space-lg md:p-space-xl flex flex-col justify-between backdrop-blur-xl shadow-xl">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Cross-Validation Across Modalities
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                When a speaker expresses sarcasm, their vocal pitch may rise while their facial
                expression remains neutral, and their body language shifts defensively. Single-modality
                classifiers can struggle under that kind of affective dissonance.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                EmoSense looks at visual, acoustic, and postural signals together. If one channel
                becomes unreliable, for example because of partial occlusion or a noisy room, the
                remaining channels can still contribute to the final prediction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-lg">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className="p-space-sm rounded-xl bg-surface-container-high/80 flex flex-col gap-1"
                >
                  <span className={`font-label-sm font-bold uppercase ${b.labelClass}`}>{b.label}</span>
                  <span className="font-body-sm text-on-surface-variant">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right card */}
          <div className="lg:col-span-5 bg-surface-container-lowest/80 rounded-3xl p-space-lg md:p-space-xl backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex flex-col gap-space-md">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                How Fusion Helps
              </span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Single Channel vs. Multimodal Fusion
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                When one channel is degraded, the others can help carry the signal.
              </p>

              {SCENARIOS.map((s) => (
                <div key={s.title} className="flex flex-col gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{s.title}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-outline uppercase">Helped by</span>
                    {s.helpers.map((h) => (
                      <span
                        key={h.name}
                        className={`font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-container-highest ${h.cls}`}
                      >
                        {h.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}