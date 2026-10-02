import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';

interface BeardGameProps {
    /** Positioned element holding the cut-out portrait (its box matches the image) */
    portraitRef: RefObject<HTMLElement>;
}

/* ---- where the beard can grow, from the source photo (1333 x 2000) into the
        cut-out's normalised 0..1 space (crop 320,330 then scaled to 900 x 1270) ---- */
const SRC = { ox: 320, oy: 330, s: 0.8884, W: 900, H: 1270 };
const toUV = ([x, y]: number[]) => [((x - SRC.ox) * SRC.s) / SRC.W, ((y - SRC.oy) * SRC.s) / SRC.H];

interface Zone {
    poly: number[][];
    /** direction hairs grow in, radians (down = PI / 2) */
    ang: number;
    spread: number;
    len: [number, number];
    /** how much the tip droops, as a fraction of the length */
    droop: number;
}

const ZONES: Zone[] = [
    {
        // cheeks, upper lip, chin and jaw
        poly: [
            [612, 770], [640, 745], [700, 748], [770, 745], [830, 745], [862, 780],
            [850, 830], [805, 880], [745, 905], [690, 895], [640, 865], [615, 815],
        ].map(toUV),
        ang: Math.PI / 2,
        spread: 0.75,
        len: [8, 20],
        droop: 0.18,
    },
    {
        // the hairline: forehead just under the hair
        poly: [
            [605, 520], [618, 480], [665, 452], [740, 442], [812, 462], [842, 515],
            [800, 545], [720, 542], [650, 552],
        ].map(toUV),
        ang: -Math.PI / 2,
        spread: 0.7,
        len: [5, 12],
        droop: 0.1,
    },
];
const MOUTH = { c: toUV([700, 802]), rx: (48 * SRC.s) / SRC.W, ry: (24 * SRC.s) / SRC.H };

const inPoly = (poly: number[][], u: number, v: number) => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
};
const inMouth = (u: number, v: number) => Math.pow((u - MOUTH.c[0]) / MOUTH.rx, 2) + Math.pow((v - MOUTH.c[1]) / MOUTH.ry, 2) < 1;
const growable = (u: number, v: number) => ZONES.some((z, i) => inPoly(z.poly, u, v) && !(i === 0 && inMouth(u, v)));

// follicle cells on a grid covering each zone's bounding box
const CELLS: { u: number; v: number; zone: number }[] = [];
ZONES.forEach((z, zi) => {
    const us = z.poly.map((p) => p[0]);
    const vs = z.poly.map((p) => p[1]);
    const du = (13 * SRC.s) / SRC.W;
    const dv = (13 * SRC.s) / SRC.H;
    for (let v = Math.min(...vs); v <= Math.max(...vs); v += dv) {
        for (let u = Math.min(...us); u <= Math.max(...us); u += du) {
            if (inPoly(z.poly, u, v) && !(zi === 0 && inMouth(u, v))) CELLS.push({ u, v, zone: zi });
        }
    }
});

const KEY = 'beard-growth-v1';
const WATER_R = 62; // reach of one watering, in cut-out pixels (900 wide)

type Strand = { u: number; v: number; ang: number; len: number; curl: number; w: number; shade: number; droop: number; t0: number; dur: number };
type Drop = { x: number; y: number; ty: number; t0: number; hit: boolean };

const CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17h14l-1.5 13a2 2 0 0 1-2 1.8H12.5a2 2 0 0 1-2-1.8z" fill="rgba(0,0,0,.55)"/><path d="M23 20h5l5-6"/><path d="M9 17c0-3 2-5 5-5h4c3 0 5 2 5 5"/><path d="M33 14l-1-3M35 17l-2-1.5M36 21l-3-.5" stroke="#8fd3ff"/></svg>',
)}") 8 30, pointer`;

const BeardGame = ({ portraitRef }: BeardGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [percent, setPercent] = useState(0);
    const api = useRef<{ water: (u: number, v: number) => void; reset: () => void; random: () => void } | null>(null);

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
        let raf = 0;
        let onScreen = true;
        let lastKey = '';
        let dirty = true;
        let alive = true;
        // a pulsing marker on the chin invites the first click
        let hint = true;
        const counts = new Array<number>(CELLS.length).fill(0);
        let strands: Strand[] = [];
        let drops: Drop[] = [];

        const rnd = (a: number, b: number) => a + Math.random() * (b - a);
        const grownPct = () => Math.round((counts.filter((c) => c > 0).length / CELLS.length) * 100);
        const save = () => {
            try {
                localStorage.setItem(KEY, JSON.stringify(counts));
            } catch {
                /* storage can be blocked */
            }
        };

        const spawn = (cell: number, n: number, now: number, instant: boolean) => {
            const { u, v, zone } = CELLS[cell];
            const Z = ZONES[zone];
            for (let i = 0; i < n; i++) {
                strands.push({
                    u: u + rnd(-0.008, 0.008),
                    v: v + rnd(-0.006, 0.006),
                    ang: Z.ang + rnd(-Z.spread, Z.spread),
                    len: rnd(Z.len[0], Z.len[1]),
                    droop: Z.droop,
                    curl: rnd(-1, 1),
                    w: rnd(0.9, 1.7),
                    shade: Math.random(),
                    t0: instant ? -1e9 : now + 350 + rnd(0, 1100),
                    dur: rnd(1400, 2800),
                });
            }
        };

        // restore saved progress
        try {
            const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as number[] | null;
            if (Array.isArray(saved) && saved.length === CELLS.length) {
                saved.forEach((c, i) => {
                    counts[i] = c;
                    if (c > 0) spawn(i, Math.min(5 + (c - 1) * 3, 14), 0, true);
                });
            }
        } catch {
            /* ignore */
        }
        hint = counts.every((c) => c === 0);
        setPercent(grownPct());

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = hero.clientWidth;
            h = hero.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            dirty = true;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(hero);

        const rectOf = () => {
            const hr = hero.getBoundingClientRect();
            const pr = portrait.getBoundingClientRect();
            return { x0: pr.left - hr.left, y0: pr.top - hr.top, pw: pr.width, ph: pr.height, hr };
        };

        const water = (u: number, v: number) => {
            const now = performance.now();
            const { x0, y0, pw, ph } = rectOf();
            const cx = x0 + u * pw;
            const cy = y0 + v * ph;
            // drops fall onto the spot
            for (let i = 0; i < 7; i++) drops.push({ x: cx + rnd(-14, 14) * (pw / 900), y: cy - rnd(90, 150), ty: cy + rnd(-8, 8), t0: now + i * 45, hit: false });
            hint = false;
            // hair on every follicle cell within reach
            CELLS.forEach((c, i) => {
                const d = Math.hypot((c.u - u) * SRC.W, (c.v - v) * SRC.H);
                if (d > WATER_R) return;
                counts[i] += 1;
                if (counts[i] === 1) spawn(i, 5, now, reduce);
                else if (counts[i] <= 4) spawn(i, 3, now, reduce);
            });
            setPercent(grownPct());
            save();
            dirty = true;
            sync();
        };

        const random = () => {
            const open = CELLS.map((_, i) => i).filter((i) => counts[i] === 0);
            const pool = open.length ? open : CELLS.map((_, i) => i);
            const c = CELLS[pool[Math.floor(Math.random() * pool.length)]];
            water(c.u, c.v);
        };

        const reset = () => {
            counts.fill(0);
            hint = true;
            strands = [];
            drops = [];
            setPercent(0);
            save();
            dirty = true;
            sync();
        };
        api.current = { water, reset, random };

        const hit = (e: MouseEvent | PointerEvent) => {
            const { x0, y0, pw, ph, hr } = rectOf();
            const u = (e.clientX - hr.left - x0) / pw;
            const v = (e.clientY - hr.top - y0) / ph;
            return growable(u, v) ? { u, v } : null;
        };

        const onMove = (e: PointerEvent) => {
            if ((e.target as HTMLElement).closest('button, a')) {
                hero.style.cursor = '';
                return;
            }
            hero.style.cursor = hit(e) ? CURSOR : '';
        };
        const onClick = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('button, a')) return;
            const p = hit(e);
            if (p) water(p.u, p.v);
        };
        hero.addEventListener('pointermove', onMove, { passive: true });
        hero.addEventListener('click', onClick);

        const draw = (now: number) => {
            raf = 0;
            if (!alive) return;
            const { x0, y0, pw, ph } = rectOf();
            const key = `${Math.round(x0)}|${Math.round(y0)}|${Math.round(pw)}`;
            const k = pw / 900;
            const growing = strands.some((s) => now - s.t0 < s.dur);
            const animating = growing || drops.length > 0 || hint;
            if (key === lastKey && !dirty && !animating) {
                sync();
                return;
            }
            lastKey = key;
            dirty = false;
            ctx.clearRect(0, 0, w, h);
            const appear = Number(gsap.getProperty(portrait, 'opacity')) || 0;
            if (pw > 0 && appear > 0.05) {
                ctx.lineCap = 'round';
                for (const s of strands) {
                    const p = Math.min(1, Math.max(0, (now - s.t0) / s.dur));
                    if (p <= 0) continue;
                    const e = 1 - Math.pow(1 - p, 2.4);
                    const L = s.len * k;
                    const bx = x0 + s.u * pw;
                    const by = y0 + s.v * ph;
                    const dx = Math.cos(s.ang);
                    const dy = Math.sin(s.ang);
                    const cx = bx + dx * L * 0.55 - dy * s.curl * L * 0.3;
                    const cy = by + dy * L * 0.55 + dx * s.curl * L * 0.3;
                    const ex = bx + dx * L;
                    const ey = by + dy * L + L * s.droop;
                    ctx.beginPath();
                    ctx.moveTo(bx, by);
                    const steps = 5;
                    for (let i = 1; i <= steps; i++) {
                        const t = (i / steps) * e;
                        const a = (1 - t) * (1 - t);
                        const b = 2 * (1 - t) * t;
                        const c = t * t;
                        ctx.lineTo(a * bx + b * cx + c * ex, a * by + b * cy + c * ey);
                    }
                    const tone = 18 + Math.round(s.shade * 22);
                    ctx.strokeStyle = `rgba(${tone}, ${tone - 4}, ${tone - 8}, ${0.85 * appear})`;
                    ctx.lineWidth = Math.max(0.8, s.w * k * 1.4);
                    ctx.stroke();
                }

                // water
                drops = drops.filter((d) => now - d.t0 < 900);
                for (const d of drops) {
                    const t = now - d.t0;
                    if (t < 0) continue;
                    const fall = Math.min(1, t / 330);
                    if (fall < 1) {
                        const y = d.y + (d.ty - d.y) * fall * fall;
                        ctx.fillStyle = 'rgba(150, 210, 255, 0.9)';
                        ctx.beginPath();
                        ctx.ellipse(d.x, y, 1.5, 3, 0, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        const r = ((t - 330) / 570) * 16 * k + 2;
                        ctx.strokeStyle = `rgba(170, 220, 255, ${0.7 * (1 - (t - 330) / 570)})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.ellipse(d.x, d.ty, r, r * 0.45, 0, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
            }
            if (hint && pw > 0 && appear > 0.3) {
                const bp = ZONES[0].poly;
                const [hu, hv] = [bp.reduce((a, p) => a + p[0], 0) / bp.length, bp.reduce((a, p) => a + p[1], 0) / bp.length + 0.03];
                const cx = x0 + hu * pw;
                const cy = y0 + hv * ph;
                const pulse = 0.5 + 0.5 * Math.sin(now / 380);
                ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.5 * pulse})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(cx, cy, (14 + 12 * pulse) * Math.max(0.7, k), 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.beginPath();
                ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = '600 12px "Geist Mono Variable", ui-monospace, monospace';
                ctx.shadowColor = 'rgba(0,0,0,0.7)';
                ctx.shadowBlur = 6;
                ctx.fillStyle = 'rgba(255,255,255,0.95)';
                ctx.fillText('WATER ME', cx + 30 * Math.max(0.7, k), cy + 4);
                ctx.shadowBlur = 0;
            }
            sync();
        };

        function sync() {
            const run = alive && onScreen && !document.hidden;
            if (run && !raf) raf = requestAnimationFrame(draw);
            if (!run && raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        }
        const io = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            dirty = true;
            sync();
        });
        io.observe(hero);
        document.addEventListener('visibilitychange', sync);
        sync();

        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', sync);
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('click', onClick);
            hero.style.cursor = '';
            api.current = null;
        };
    }, [portraitRef]);

    const water = useCallback(() => api.current?.random(), []);
    const reset = useCallback(() => api.current?.reset(), []);
    const done = percent >= 100;

    return (
        <>
            <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
            <div
                data-hero-in
                className="absolute bottom-14 left-5 z-[5] w-[min(260px,calc(100%-2.5rem))] border border-border bg-background/80 p-4 backdrop-blur-sm md:bottom-[88px] md:left-auto md:right-6"
            >
                <p className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em]">
                    <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Task: grow my beard and hairline
                    </span>
                    <span className="tabular-nums">{percent}%</span>
                </p>
                <div className="mt-3 h-px w-full bg-border" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Beard growth">
                    <div className="h-px bg-primary transition-[width] duration-700" style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {done ? 'Fully grown. Thank you for watering it.' : 'Click my chin, cheeks or forehead to water them and watch the hair grow.'}
                </p>
                <div className="mt-3 flex gap-2">
                    <button type="button" onClick={water} className="press border border-foreground/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] hover:bg-foreground hover:text-background">
                        Water it
                    </button>
                    {percent > 0 && (
                        <button type="button" onClick={reset} className="press px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground">
                            Reset
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default BeardGame;
