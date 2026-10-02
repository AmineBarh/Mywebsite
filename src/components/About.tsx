import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';

const lines = ['from sens', 'to screen,', 'end to end.'];

/** Intro paragraph + the heavy statement, with a project photo standing in for one letter. */
const About = () => {
    const rootRef = useRef<HTMLElement>(null);
    useReveal(rootRef);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from('[data-line]', {
                    yPercent: 108,
                    duration: 1.3,
                    stagger: 0.12,
                    ease: EASE_OUT,
                    scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', once: true },
                });
                // The inline photo turns with the page: motion tied to scroll position
                gsap.to('[data-media]', {
                    rotate: 360,
                    ease: 'none',
                    scrollTrigger: { trigger: '[data-statement]', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
                });
            });
            return () => mm.revert();
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} id="about" className="relative z-[1] pb-28 pt-28 md:pb-40 md:pt-48">
            <div className="page-shell">
                <div className="grid gap-8 md:grid-cols-12">
                    <p data-reveal className="text-[clamp(1.25rem,1.9vw,1.75rem)] font-light leading-[1.18] tracking-tight md:col-span-5">
                        AI, computer vision and IoT engineer finishing a double degree at ESIEA Paris and EPI Tunisia. I build systems end to end, and I'm looking for a 6-month final year internship starting February 2027.
                    </p>
                    <p data-reveal className="max-w-[30ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.06em] text-muted-foreground md:col-span-3 md:col-start-10">
                        Embedded AI for agriculture, computer vision pipelines, connected hardware, mobile and backend. Paris, France.
                    </p>
                </div>

                <h2 data-statement aria-label="from sensor to screen, end to end." className="type-heavy mt-24 text-[clamp(4.5rem,13.4vw,15rem)] md:mt-40">
                    {lines.map((line, i) => (
                        <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.06em] pt-[0.04em]">
                            <span data-line className="block whitespace-nowrap">
                                {line}
                                {i === 0 && (
                                    <>
                                        <span
                                            data-media
                                            className="relative mx-[0.03em] inline-block h-[0.66em] w-[0.86em] overflow-hidden align-[-0.04em]"
                                        >
                                            <img src="/images/projects/beesafe/inauguration.jpg" alt="" className="h-full w-full object-cover" />
                                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                                                <circle cx="50" cy="50" r="38" stroke="white" strokeOpacity="0.8" strokeWidth="1.2" />
                                                <path d="M43 36v28M57 36v28" stroke="white" strokeWidth="3" strokeLinecap="square" />
                                            </svg>
                                        </span>
                                        r
                                    </>
                                )}
                            </span>
                        </span>
                    ))}
                </h2>
            </div>
        </section>
    );
};

export default About;
