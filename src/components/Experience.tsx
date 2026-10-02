import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/ui-kit/SectionLabel';
import { experience as items } from '@/data/experience';

const Experience = () => {
    const rootRef = useRef<HTMLElement>(null);
    const [open, setOpen] = useState(0);
    useReveal(rootRef);

    // Animate panel heights whenever the open row changes
    useGSAP(
        () => {
            gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel, i) => {
                gsap.to(panel, { height: i === open ? 'auto' : 0, duration: 0.7, ease: 'expo.inOut' });
            });
        },
        { scope: rootRef, dependencies: [open] },
    );

    return (
        <section ref={rootRef} id="experience" className="relative z-[1] pb-28 pt-28 md:pb-40 md:pt-40">
            <div className="page-shell">
                <SectionLabel label="The details" />
                <div className="mt-10 grid gap-6 md:grid-cols-12">
                    <h2 data-reveal className="text-[clamp(2.5rem,5.4vw,4.75rem)] font-light leading-[0.98] tracking-[-0.04em] md:col-span-7">
                        Experience and education, in short.
                    </h2>
                    <p data-reveal className="max-w-[34ch] self-end font-mono text-[10px] uppercase leading-relaxed tracking-[0.06em] text-muted-foreground md:col-span-3 md:col-start-10">
                        Three internships and a double degree, 2022 to 2027.
                    </p>
                </div>
            </div>

            <ul className="mt-16 border-t border-border">
                {items.map((item, i) => {
                    const isOpen = open === i;
                    return (
                        <li key={item.title} className={`border-b border-border transition-colors duration-500 ${isOpen ? 'bg-paper text-ink' : ''}`}>
                            <div className="page-shell">
                                <button
                                    type="button"
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                    aria-expanded={isOpen}
                                    className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[4.5rem_1fr_auto] md:py-8"
                                >
                                    <span className={`font-mono text-[11px] ${isOpen ? 'text-ink/50' : 'text-muted-foreground'}`}>{String(i + 1).padStart(2, '0')}</span>
                                    <span className="text-xl tracking-tight md:text-2xl">{item.title}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.25} />
                                </button>
                                <div data-panel className="overflow-hidden" style={{ height: i === 0 ? 'auto' : 0 }}>
                                    <div className="pb-9 md:pl-[4.5rem]">
                                        <p className={`font-mono text-[11px] uppercase tracking-[0.06em] ${isOpen ? 'text-ink/60' : 'text-muted-foreground'}`}>{item.meta}</p>
                                        {item.text && <p className="mt-4 max-w-[62ch] text-sm leading-relaxed md:text-base">{item.text}</p>}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default Experience;
