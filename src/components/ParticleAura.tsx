import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';

interface ParticleAuraProps {
    /** The positioned element that holds the cut-out portrait */
    portraitRef: RefObject<HTMLElement>;
    /** The cut-out image (transparent PNG/WebP) whose outline the particles trace */
    src: string;
}

const HUE = 195; // cool cyan, as in the reference
const rim = (a: number) => `hsla(${HUE}, 90%, 82%, ${a})`;

/**
 * A faint dotted texture inside the portrait's silhouette and a field of drifting dust that the cursor pushes aside. Canvas 2D, no dependencies.
 * The outline is read from the portrait's own alpha channel, so it follows your silhouette.
 */
const ParticleAura = ({ portraitRef, src }: ParticleAuraProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const portrait = portraitRef.current;
        const hero = canvas?.parentElement;
        if (!canvas || !portrait || !hero) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w = 0;
        let h = 0;
        let dpr = 1;
        let raf = 0;
        let alive = true;

        let ready = false;

        // ---- dust ----
        type Mote = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; ph: number };
        let motes: Mote[] = [];
        const seedMotes = () => {
            const n = Math.round(Math.min(650, (w * h) / 2600));
            motes = Array.from({ length: n }, () => {
                // denser around the figure, like a halo of dust
                const near = Math.random() < 0.55;
                const hx = near ? w * (0.55 + (Math.random() - 0.5) * 0.7) : Math.random() * w;
                const hy = Math.random() * h;
                return { hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: 0.4 + Math.random() * Math.random() * 1.5, ph: Math.random() * 6.28 };
            });
        };

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = hero.clientWidth;
            h = hero.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            seedMotes();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(hero);

        // ---- pointer ----
        const mouse = { x: -9999, y: -9999 };
        const onMove = (e: PointerEvent) => {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        };
        const onLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };
        if (!reduce) {
            hero.addEventListener('pointermove', onMove);
            hero.addEventListener('pointerleave', onLeave);
        }

        // ---- frame ----
        const draw = (time: number) => {
            if (!alive) return;
            const t = time * 0.001;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';

            // follow the portrait, including its intro and scroll movement
            const hr = hero.getBoundingClientRect();
            const pr = portrait.getBoundingClientRect();
            const x0 = pr.left - hr.left;
            const y0 = pr.top - hr.top;
            const pw = pr.width;
            const ph = pr.height;
            const appear = Number(gsap.getProperty(portrait, 'opacity')) || 0;

            // dust
            for (const m of motes) {
                if (!reduce) {
                    m.vx += (m.hx - m.x) * 0.0016 + Math.sin(t * 0.4 + m.ph) * 0.004;
                    m.vy += (m.hy - m.y) * 0.0016 + Math.cos(t * 0.35 + m.ph) * 0.004;
                    const dx = m.x - mouse.x;
                    const dy = m.y - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 22500) {
                        const d = Math.sqrt(d2) || 1;
                        const f = (1 - d / 150) * 2.2;
                        m.vx += (dx / d) * f;
                        m.vy += (dy / d) * f;
                    }
                    m.vx *= 0.9;
                    m.vy *= 0.9;
                    m.x += m.vx;
                    m.y += m.vy;
                }
                const a = (0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.3 + m.ph))) * appear;
                ctx.fillStyle = `hsla(${HUE + 10}, 70%, 88%, ${a})`;
                ctx.fillRect(m.x, m.y, m.r, m.r);
            }

            ctx.globalCompositeOperation = 'source-over';
            raf = reduce || !alive ? 0 : requestAnimationFrame(draw);
        };

        // only animate while the hero is on screen and the tab is visible
        let onScreen = true;
        const sync = () => {
            const run = ready && onScreen && !document.hidden && !reduce;
            if (run && !raf) raf = requestAnimationFrame(draw);
            if (!run && raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        };
        const io = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        });
        io.observe(hero);
        document.addEventListener('visibilitychange', sync);

        const img = new Image();
        img.onload = () => {
            if (!alive) return;
            ready = true;
            if (reduce) requestAnimationFrame(draw);
            sync();
        };
        img.src = src;

        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', sync);
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
        };
    }, [portraitRef, src]);

    return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
};

export default ParticleAura;
