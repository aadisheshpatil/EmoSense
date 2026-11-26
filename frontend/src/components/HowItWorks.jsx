import SectionHeader from './SectionHeader';

const STAGES = [
  {
    num: '01',
    pill: 'Stream Capture',
    title: 'Synchronized Capture',
    description:
      'Video from the webcam and audio from the microphone are captured together, so every modality can be analysed against the same moment in time.',
    numBox: 'bg-secondary/15 text-secondary',
    dot: 'bg-secondary',
    valueClass: 'text-secondary',
    rows: [
      ['Video Input:', 'Webcam'],
      ['Audio Input:', 'Microphone'],
    ],
  },
  {
    num: '02',
    pill: 'Parallel Analysis',
    title: 'Multimodal Deep Learning',
    description:
      'Dedicated models extract features from facial expressions, body pose, and voice acoustics independently, each focused on its own modality.',
    numBox: 'bg-primary/15 text-primary',
    dot: 'bg-primary',
    valueClass: 'text-primary',
    rows: [
      ['Visual Features:', 'Face + Body'],
      ['Audio Features:', 'Voice'],
    ],
  },
  {
    num: '03',
    pill: 'Late Fusion',
    title: 'Decision-Level Fusion',
    description:
      'The outputs of each channel are combined at the decision stage to produce a single emotion prediction from all available signals.',
    numBox: 'bg-tertiary/15 text-tertiary',
    dot: 'bg-tertiary',
    valueClass: 'text-tertiary',
    rows: [
      ['Fusion Output:', 'Emotion Prediction'],
      ['Delivery:', 'FastAPI Backend'],
    ],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full px-margin-mobile md:px-margin py-space-xl bg-surface-container-low/50 relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <SectionHeader eyebrow="Processing Pipeline" title="Pipeline: From Sensor Stream to Insight">
          From raw sensor input to a combined emotion prediction in three stages.
        </SectionHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg relative">
          {STAGES.map((s) => (
            <div
              key={s.num}
              className="relative bg-surface-container/70 rounded-3xl p-space-lg backdrop-blur-xl flex flex-col gap-space-md shadow-xl"
            >
              <div className="flex items-center justify-between gap-space-sm">
                <div
                  className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-headline-sm font-bold ${s.numBox}`}
                >
                  {s.num}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="font-label-sm text-on-surface font-mono">{s.pill}</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{s.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="bg-surface-container-lowest/60 rounded-xl p-space-sm flex flex-col gap-1 font-mono text-label-sm text-on-surface-variant">
                {s.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-space-sm">
                    <span>{k}</span>
                    <span className={s.valueClass}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}