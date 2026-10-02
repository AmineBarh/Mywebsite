import { RefObject } from 'react';
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';

/**
 * Scroll reveals for a section.
 *  - [data-reveal]      fades/rises into place, batched so siblings entering together stagger
 *  - [data-reveal-lines] headline split into masked lines that slide up
 * Both are no-ops under prefers-reduced-motion (content simply stays visible).
 */
export const useReveal = (scope: RefObject<HTMLElement>) => {
    useGSAP(
        (_context, contextSafe) => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
                if (items.length) {
                    gsap.set(items, { autoAlpha: 0, y: 28 });
                    ScrollTrigger.batch(items, {
                        start: 'top 88%',
                        once: true,
                        onEnter: (batch) =>
                            gsap.to(batch, {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.9,
                                ease: EASE_OUT,
                                stagger: 0.08,
                                overwrite: true,
                            }),
                    });
                }

                const heads = gsap.utils.toArray<HTMLElement>('[data-reveal-lines]');
                heads.forEach((el) => {
                    document.fonts.ready.then(contextSafe!(() => {
                        SplitText.create(el, {
                            type: 'lines',
                            mask: 'lines',
                            autoSplit: true,
                            onSplit: (self) =>
                                gsap.from(self.lines, {
                                    yPercent: 110,
                                    duration: 1,
                                    ease: EASE_OUT,
                                    stagger: 0.08,
                                    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                                }),
                        });
                    }));
                });
            });
            return () => mm.revert();
        },
        { scope },
    );
};
