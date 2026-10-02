import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/ui-kit/SectionLabel';

// Correct Imports based on available assets
import robotsTemplate from '../assets/EPI Robots Day 4.0 - Post example template.webp';
import survivalBanner from '../assets/survival.webp';
import cyberPoster from '../assets/cyber.webp';
import robotsBanner from '../assets/csgo.webp'; // Matches "EPI Robots Day 4.0 Banner" (CS:GO theme)
import integrationPoster from '../assets/jpo.webp'; // Best guess for "Integration Day"
import book from '../assets/book csgo.webp';
import workshop from '../assets/workshop.webp';
import robotsDay5 from '../assets/Affcihe Finale Event (2).webp';

const designs = [
    {
        id: 1,
        title: 'EPI Robots Day 4.0 Banner',
        description: 'CS:GO inspired event poster',
        image: robotsBanner,
    },
    {
        id: 2,
        title: 'Cyberbenders AI Challenge 2.0 - Poster A0',
        description: 'AI Challenge 2.0 poster',
        image: cyberPoster,
    },
    {
        id: 3,
        title: 'EPI Robots Day 5.0 Banner',
        description: 'Robots Day 5.0 banner Themed Arc Reaiders',
        image: robotsDay5,
    },
    {
        id: 4,
        title: 'Integration Day poster 2024-2025',
        description: 'Integration Day poster',
        image: integrationPoster,
    },
    {
        id: 5,
        title: 'EPI Robots Day 4.0 - Post example template',
        description: 'EPI Robots Day 4.0 poster',
        image: robotsTemplate,
    },
    {
        id: 6,
        title: 'Book design themed CS:GO',
        description: 'Book design themed CS:GO poster',
        image: book,
    },
    {
        id: 7,
        title: 'EPI Workshop Banner',
        description: 'Workshop banner',
        image: workshop,
    },
    {
        id: 8,
        title: 'EPI Survival Challenge Banner',
        description: 'Survival Challenge banner themed Squid Game',
        image: survivalBanner,
    },
];

const DesignShowcase = () => {
    const [selectedDesign, setSelectedDesign] = useState<(typeof designs)[0] | null>(null);
    const rootRef = useRef<HTMLElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLUListElement>(null);

    useReveal(rootRef);

    // Desktop: pin the section and translate the poster track sideways while the page scrolls.
    // Mobile / reduced motion: the track is a plain scroll-snap strip (native horizontal scroll).
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
                const viewport = viewportRef.current!;
                const track = trackRef.current!;
                gsap.set(viewport, { overflow: 'hidden' });

                const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

                gsap.to(track, {
                    x: () => -distance(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: pinRef.current,
                        start: 'top top',
                        end: () => `+=${distance()}`,
                        pin: true,
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });

                // Posters change size once decoded, so positions must be recalculated
                const imgs = Array.from(track.querySelectorAll('img'));
                const onLoad = () => ScrollTrigger.refresh();
                imgs.forEach((img) => !img.complete && img.addEventListener('load', onLoad, { once: true }));
                return () => imgs.forEach((img) => img.removeEventListener('load', onLoad));
            });
            return () => mm.revert();
        },
        { scope: rootRef },
    );

    // Lightbox: Escape closes, body scroll locked
    useEffect(() => {
        if (!selectedDesign) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedDesign(null);
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = 'unset';
        };
    }, [selectedDesign]);

    return (
        <section ref={rootRef} id="designs" className="relative z-[1]">
            <div ref={pinRef} className="flex flex-col justify-center pb-24 pt-4 lg:min-h-[100dvh] lg:py-16">
                <div className="page-shell mb-8">
                    <SectionLabel label="Posters" meta={`${designs.length} designs, scroll to browse`} />
                    <h2 className="sr-only">Creative posters</h2>
                </div>

                <div ref={viewportRef} className="scrollbar-hide overflow-x-auto pl-5 md:pl-10 lg:overflow-visible">
                    <ul ref={trackRef} className="flex w-max snap-x snap-mandatory gap-5 pr-5 md:gap-8 md:pr-10">
                        {designs.map((design) => (
                            <li key={design.id} className="snap-start">
                                <button
                                    type="button"
                                    onClick={() => setSelectedDesign(design)}
                                    aria-label={`View ${design.title}`}
                                    className="group block text-left"
                                >
                                    <div className="relative overflow-hidden rounded-none border border-border bg-card">
                                        <img
                                            src={design.image}
                                            alt={design.title}
                                            loading="lazy"
                                            className="block h-[52dvh] w-auto max-w-none object-contain transition-transform duration-700 group-hover:scale-[1.03] md:h-[56dvh]"
                                        />
                                        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-border bg-background/80 px-3 py-1 font-mono text-xs opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                            <ZoomIn className="h-3 w-3" strokeWidth={1.5} />
                                            View
                                        </span>
                                    </div>
                                    <p className="mt-3 max-w-[32ch] text-sm font-medium">{design.title}</p>
                                    <p className="mt-0.5 max-w-[32ch] text-sm text-muted-foreground">{design.description}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Poster viewer, full screen, in the site's style. Rendered in document.body so the
                fixed header and the section's stacking level can never sit on top of it. */}
            {typeof document !== 'undefined' &&
                createPortal(
            <AnimatePresence>
                {selectedDesign && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedDesign.title}
                        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                        exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                        transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
                        className="fixed inset-0 z-[99999] flex flex-col bg-background text-foreground"
                        data-lenis-prevent="true"
                    >
                        <div aria-hidden="true" className="modal-guides pointer-events-none absolute inset-0" />
                        <div className="relative z-10 flex h-[50px] shrink-0 items-center justify-between gap-4 border-b border-border px-5 font-mono text-[11px] uppercase tracking-[0.08em] md:px-6">
                            <p className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                Poster
                            </p>
                            <p className="hidden text-muted-foreground md:block">
                                {String(designs.findIndex((d) => d.id === selectedDesign.id) + 1).padStart(2, '0')} / {String(designs.length).padStart(2, '0')}
                            </p>
                            <button type="button" onClick={() => setSelectedDesign(null)} aria-label="Close" className="press hover:opacity-60">
                                Close ×
                            </button>
                        </div>

                        <div className="relative z-10 grid min-h-0 flex-1 lg:grid-cols-12">
                            <div className="flex min-h-0 items-center justify-center p-5 md:p-8 lg:col-span-8 lg:border-r lg:border-border">
                                <img src={selectedDesign.image} alt={selectedDesign.title} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex flex-col justify-end gap-6 border-t border-border p-5 md:p-8 lg:col-span-4 lg:border-t-0">
                                <h3 className="type-heavy text-[clamp(2.25rem,4vw,4rem)]">{selectedDesign.title}</h3>
                                <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">{selectedDesign.description}</p>
                                <div className="flex items-stretch self-start border border-border font-mono text-[11px]">
                                    <button
                                        type="button"
                                        aria-label="Previous poster"
                                        onClick={() => {
                                            const i = designs.findIndex((d) => d.id === selectedDesign.id);
                                            setSelectedDesign(designs[(i - 1 + designs.length) % designs.length]);
                                        }}
                                        className="press px-4 py-2.5 hover:bg-foreground hover:text-background"
                                    >
                                        ←
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next poster"
                                        onClick={() => {
                                            const i = designs.findIndex((d) => d.id === selectedDesign.id);
                                            setSelectedDesign(designs[(i + 1) % designs.length]);
                                        }}
                                        className="press border-l border-border px-4 py-2.5 hover:bg-foreground hover:text-background"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>,
                    document.body,
                )}
        </section>
    );
};

export default DesignShowcase;
