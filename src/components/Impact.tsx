import { useEffect, useRef, useState } from 'react';
import { SylvaHero } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import { getLenis, scrollToId } from '@/lib/lenis';
import { useReveal } from '@/hooks/useReveal';
import { ScrollTrigger } from '@/lib/gsap';
import SectionLabel from '@/components/ui-kit/SectionLabel';
import ResearchModal from '@/components/ResearchModal';

const built = [
    {
        title: 'Backend and Docker',
        text: 'A containerised Node.js, Express, MongoDB and MQTT backend on a university VM, with JWT auth, per-apiary access control, a live Server-Sent Events stream and automated alerts.',
    },
    {
        title: 'The BeeSafe app',
        text: 'A React Native and Expo app with live sensor readings, apiary management with GPS, history charts and a voice-input inspection form that an LLM turns into structured fields.',
    },
    {
        title: 'Queen detector',
        text: 'YOLO11s exported to ONNX and run on the device, stabilised by a temporal 4-of-7 vote. No queen and drone confusion on the test set: precision 0.92, recall 0.79.',
    },
    {
        title: 'Frame analysis',
        text: 'A U-Net heatmap localises cells and a small CNN classifies six cell types. Recall of 0.80 to 0.93, against 0.35 for box detection.',
    },
    {
        title: 'Dataset audit',
        text: 'Found that the public FAIRHive annotations cover a median of only 5.1% of real cells, then built a hand-annotated reference set of 4,254 cells.',
    },
    {
        title: 'Hardware',
        text: 'Designed and 3D-printed the sensor housing, soldered the nodes, assembled the weighing platform and installed them on campus hives.',
    },
];

/**
 * The BeeSafe internship, on the ThreeUI "Living Green" hero. The hero's HTML
 * (public/landing-pages/inner-green-3d.html) carries BeeSafe's facts and
 * honeybees; its buttons talk to the page through window events:
 *   open-project  -> the BeeSafe project modal (ProjectsGallery listens)
 *   open-research -> the hive-audio research panel (below)
 *   scroll-to     -> smooth-scroll to a section id
 *   sylva:scroll  -> wheel / touch input, so the page keeps scrolling over the scene
 */
const Impact = () => {
    const rootRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [researchOpen, setResearchOpen] = useState(false);
    // The WebGL scene only runs while it is near the screen
    const [near, setNear] = useState(false);
    useReveal(rootRef);

    useEffect(() => {
        const onResearch = () => setResearchOpen(true);
        const onScrollTo = (e: Event) => scrollToId((e as CustomEvent<string>).detail);
        const onScroll = (e: Event) => {
            const { dx, dy, mode } = (e as CustomEvent<{ dx: number; dy: number; mode: number | 'touch' }>).detail;
            if (mode === 'touch') {
                window.scrollBy(dx, dy);
            } else if (getLenis()) {
                // Lenis listens for wheel on window, so replay the scene's wheel there
                window.dispatchEvent(new WheelEvent('wheel', { deltaX: dx, deltaY: dy, deltaMode: mode, bubbles: true, cancelable: true }));
            } else {
                window.scrollBy(dx, dy * (mode === 1 ? 16 : 1));
            }
        };
        window.addEventListener('open-research', onResearch);
        window.addEventListener('scroll-to', onScrollTo);
        window.addEventListener('sylva:scroll', onScroll);
        return () => {
            window.removeEventListener('open-research', onResearch);
            window.removeEventListener('scroll-to', onScrollTo);
            window.removeEventListener('sylva:scroll', onScroll);
        };
    }, []);

    // This section loads late, so recompute every scroll position once it is in place
    useEffect(() => {
        const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
        return () => window.clearTimeout(id);
    }, []);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '60% 0px 60% 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Give the scene's iframe a meaningful accessible name
    useEffect(() => {
        heroRef.current
            ?.querySelector('iframe')
            ?.setAttribute('title', 'BeeSafe: an interactive moss world with honeybees, the project facts, and links to the project and the hive audio research');
    }, [near]);

    return (
        <section ref={rootRef} id="impact" className="relative z-[1] text-[hsl(90_12%_94%)]">
            {/* ThreeUI Sylva hero, "Living Green", carrying BeeSafe */}
            <div ref={heroRef} className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-[#080808]">
                {near && (
                    <SylvaHero
                        headingFont="lexend"
                        bodyFont="lexend"
                        headingWeight="300"
                        bodyWeight="300"
                        primaryColor="#ffffff"
                        headingSize={63}
                        bodySize={16.5}
                        headingLetterSpacing={-0.006}
                    />
                )}
                {/* blend into the page above */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />
            </div>

            {/* What was built */}
            <div id="impact-results" className="band-forest pb-28 pt-20 md:pb-40 md:pt-28">
                <div className="page-shell">
                    <SectionLabel label="What I built" meta="BeeSafe, sensor to screen" />
                    <div className="grid md:grid-cols-3">
                        {built.map((item, i) => (
                            <div
                                key={item.title}
                                data-reveal
                                className="border-b border-border py-9 md:px-6 md:[&:nth-child(3n+1)]:pl-0 md:[&:not(:nth-child(3n+1))]:border-l"
                            >
                                <p className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</p>
                                <h3 className="mt-10 font-soft text-[clamp(1.5rem,2.2vw,2rem)] font-light leading-[1.05] tracking-[-0.03em]">{item.title}</h3>
                                <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-foreground/65">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ResearchModal open={researchOpen} onClose={() => setResearchOpen(false)} />
        </section>
    );
};

export default Impact;
