export default function SectionHeader({ eyebrow, eyebrowClass = 'text-primary', title, children }) {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-space-xs">
      <span
        className={`font-label-md text-label-md tracking-widest uppercase font-semibold ${eyebrowClass}`}
      >
        {eyebrow}
      </span>
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
        {title}
      </h2>
      {children && (
        <p className="font-body-md text-body-md text-on-surface-variant">{children}</p>
      )}
    </div>
  );
}