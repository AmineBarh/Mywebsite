import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';
import { scrollToId } from '@/lib/lenis';
import cutout from '../assets/profile-cutout-pink.webp';
import ParticleAura from '@/components/ParticleAura';
import BeardGame from '@/components/BeardGame';

const WORD = 'BARHOUMI'.split('');
// Resting weights: thin and bold letters alternate, like a type specimen
const BASE_WEIGHTS = [130, 800, 100, 560, 100, 820, 140, 640];
const MAX_WEIGHT = 900;

interface HeroSectionProps {
    onAbout: () => void;
}

const HeroSection = ({ onAbout }: HeroSectionProps) => {
    const rootRef = useRef<HTMLElement>(null);
    const wordRef = useRef<HTMLHeadingElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const letters = gsap.utils.toArray<HTMLElement>('[data-letter]');
            const mm = gsap.matchMedia();

            // Intro + scroll depth
            mm.add(MOTION_OK, () => {
                gsap.set(letters, { '--w': 100 });
                const tl = gsap.timeline({ defaults: { ease: EASE_OUT }, delay: 0.2 });
                tl.from(letters, { yPercent: 105, duration: 1.3, stagger: 0.07 })
                    .to(letters, { '--w': (i: number) => BASE_WEIGHTS[i], duration: 1.8, stagger: 0.07, ease: 'power3.inOut' }, 0.2)
                    .from(imgRef.current, { autoAlpha: 0, yPercent: 8, duration: 1.6 }, 0.5)
                    .from('[data-hero-in]', { autoAlpha: 0, y: 14, duration: 1, stagger: 0.08 }, 0.9);

                gsap.to(wordRef.current, {
                    yPercent: -14,
                    ease: 'none',
                    scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
                });
                gsap.to(imgRef.current, {
                    yPercent: -6,
                    ease: 'none',
                    scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
                });
            });

            // Mouse: letters near the cursor thicken. Letter centres are cached, weights snap to
            // steps and updates run at most once per frame, so the big variable font is only
            // re-rendered when a letter actually changes.
            mm.add(`${MOTION_OK} and (hover: hover)`, () => {
                const root = rootRef.current!;
                let centers: number[] = [];
                const measure = () => {
                    centers = letters.map((el) => {
                        const r = el.getBoundingClientRect();
                        return r.left + r.width / 2;
                    });
                };
                measure();
                window.addEventListener('resize', measure);
                const current = BASE_WEIGHTS.slice();
                let frame = 0;
                let mx = -9999;
                const apply = () => {
                    frame = 0;
                    letters.forEach((el, i) => {
                        const near = Math.exp(-Math.pow((mx - centers[i]) / 220, 2));
                        const target = Math.round((BASE_WEIGHTS[i] + (MAX_WEIGHT - BASE_WEIGHTS[i]) * near * 0.9) / 50) * 50;
                        if (target === current[i]) return;
                        current[i] = target;
                        gsap.to(el, { '--w': target, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
                    });
                };
                const onMove = (e: PointerEvent) => {
                    mx = e.clientX;
                    if (!frame) frame = requestAnimationFrame(apply);
                };
                const onLeave = () => {
                    mx = -9999;
                    if (!frame) frame = requestAnimationFrame(apply);
                };
                root.addEventListener('pointermove', onMove, { passive: true });
                root.addEventListener('pointerleave', onLeave);
                return () => {
                    window.removeEventListener('resize', measure);
                    root.removeEventListener('pointermove', onMove);
                    root.removeEventListener('pointerleave', onLeave);
                    cancelAnimationFrame(frame);
                };
            });

            // Touch: a slow ambient wave instead of hover, paused while the hero is off screen
            mm.add(`${MOTION_OK} and (hover: none)`, () => {
                const wave = gsap.to(letters, {
                    '--w': (i: number) => MAX_WEIGHT - BASE_WEIGHTS[i] * 0.8,
                    duration: 2.6,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    stagger: 0.25,
                    delay: 3,
                });
                ScrollTrigger.create({
                    trigger: rootRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    onToggle: (self) => wave.paused(!self.isActive),
                });
            });

            // Static resting weights when motion is reduced
            mm.add('(prefers-reduced-motion: reduce)', () => {
                letters.forEach((el, i) => el.style.setProperty('--w', String(BASE_WEIGHTS[i])));
            });

            return () => mm.revert();
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} id="hero" className="relative z-[1] h-[100dvh] min-h-[620px] overflow-hidden">
            <div data-hero-in className="absolute left-5 top-[74px] font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground md:left-6">
                <p>Mohamed Amine</p>
                <p className="mt-2 flex items-center gap-2 text-foreground md:hidden">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Seeking internship · Feb 2027
                </p>
            </div>

            {/* Wordmark */}
            <h1
                ref={wordRef}
                aria-label="Barhoumi"
                className="absolute left-5 top-[15dvh] flex origin-left scale-x-[0.5] select-none text-[min(62dvh,70vw)] md:left-6 md:scale-x-[0.44] md:text-[min(70dvh,34vw)]"
            >
                {WORD.map((letter, i) => (
                    <span key={i} aria-hidden="true" className="inline-block overflow-hidden py-[0.06em]">
                        <span data-letter className="type-cond block" style={{ ['--w' as string]: BASE_WEIGHTS[i] }}>
                            {letter}
                        </span>
                    </span>
                ))}
            </h1>

            {/* Cut-out portrait overlapping the wordmark */}
            <div
                ref={imgRef}
                style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 86%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%, black 86%, transparent 100%)' }}
                className="pointer-events-none absolute bottom-0 right-[-8%] h-[64dvh] select-none md:bottom-[-2dvh] md:left-[32%] md:right-auto md:h-[86dvh]"
            >
                <img
                    src={cutout}
                    alt="Mohamed Amine Barhoumi speaking into a microphone"
                    className="block h-full w-auto max-w-none"
                    draggable={false}
                />
            </div>

            {/* Glowing particle outline, halo and drifting dust over the portrait */}
            <ParticleAura portraitRef={imgRef} src={cutout} />

            {/* Water my beard: click the face and hair grows there */}
            <BeardGame portraitRef={imgRef} />

            {/* Availability, in the empty right column */}
            <div data-hero-in className="absolute right-5 top-[22dvh] hidden max-w-[260px] text-right md:right-6 md:block">
                <p className="flex items-center justify-end gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-primary" style={{ animation: 'status-pulse 2.4s ease-in-out infinite' }} />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    Seeking Final Year Internship · Feb 2027
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    AI, computer vision and embedded systems engineer. Crafting intelligent digital experiences through the convergence of AI, secure engineering, and pixel-perfect design.
                </p>
                <button
                    type="button"
                    onClick={onAbout}
                    className="press mt-5 font-mono text-[11px] uppercase tracking-[0.08em] underline underline-offset-4 hover:text-primary"
                >
                    About me
                </button>
            </div>

            <p data-hero-in className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground md:left-6">
                Embedded AI / Agriculture
            </p>
            <button
                data-hero-in
                type="button"
                onClick={() => scrollToId('about')}
                className="absolute bottom-5 right-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground md:right-6"
            >
                Scroll to work
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.25} />
            </button>
        </section>
    );
};

export default HeroSection;
