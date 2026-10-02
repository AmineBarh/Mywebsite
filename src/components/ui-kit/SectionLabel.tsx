interface SectionLabelProps {
    label: string;
    meta?: string;
    tone?: 'dark' | 'light' | 'scene';
    className?: string;
}

/** "● LABEL ........ META" with a hairline underneath, the page's section marker. */
const SectionLabel = ({ label, meta, tone = 'dark', className = '' }: SectionLabelProps) => (
    <div
        data-reveal
        className={`flex items-start justify-between gap-6 border-b pb-3 font-mono text-[11px] uppercase tracking-[0.08em] ${tone === 'light' ? 'border-ink/20 text-ink/60' : tone === 'scene' ? 'border-white/25 text-white/75' : 'border-border text-muted-foreground'
            } ${className}`}
    >
        <span className="flex shrink-0 items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${tone === 'light' ? 'bg-ink' : 'bg-foreground'}`} />
            {label}
        </span>
        {meta && <span className="text-right">{meta}</span>}
    </div>
);

export default SectionLabel;
