import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '@/lib/gsap';

interface ShaveGameProps {
    /** The portrait box (it matches the 900 x 1270 cut-out). The canvas is drawn inside it. */
    portraitRef: RefObject<HTMLElement>;
    /** Cut-out with hair, and the same cut-out bald, both in the same 900 x 1270 frame */
    hairSrc: string;
    baldSrc: string;
}

const W = 900;
const H = 1270;
const MS = 0.5; // the shave mask is kept at half resolution

// where the hair is (cut-out pixels). Generous on purpose: it is feathered at its edge.
const POLY: [number, number][] = [
    [220, 215], [220, 120], [265, 70], [350, 40], [435, 55], [490, 100], [522, 170],
    [522, 276], [466, 276], [432, 215], [412, 170], [365, 148], [315, 150], [275, 175], [250, 240],
];
const BRUSH = 48;
const KEY = 'shave-progress-v1';

const inPoly = (x: number, y: number) => {
    let inside = false;
    for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
        const [xi, yi] = POLY[i];
        const [xj, yj] = POLY[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
};

// progress is counted on a coarse grid of the hair area
const CELLS: { x: number; y: number }[] = [];
{
    const xs = POLY.map((p) => p[0]);
    const ys = POLY.map((p) => p[1]);
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += 12) {
        for (let x = Math.min(...xs); x <= Math.max(...xs); x += 12) {
            if (inPoly(x, y)) CELLS.push({ x, y });
        }
    }
}

const CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="9" width="24" height="12" rx="3" fill="rgba(0,0,0,.6)"/><path d="M12 21v6M17 21v6M22 21v6M27 21v6"/><path d="M8 15h24" stroke="#8fe39b"/></svg>',
)}") 20 30, pointer`;

type Fleck = { x: number; y: number; vx: number; vy: number; t0: number };

const ShaveGame = ({ portraitRef, hairSrc, baldSrc }: ShaveGameProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [percent, setPercent] = useState(0);
    const [hero, setHero] = useState<HTMLElement | null>(null);
    const api = useRef<{ auto: () => void; reset: () => void } | null>(null);

    useEffect(() => setHero(portraitRef.current?.parentElement ?? null), [portraitRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const portrait = portraitRef.current;
        const heroEl = portrait?.parentElement;
        if (!canvas || !portrait || !heroEl) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const photo = portrait.querySelector('img');

        const mk = (w: number, h: number) => {
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            return c;
        };
        // strokes (accumulated), the feathered hair area, and their intersection
        const strokes = mk(W * MS, H * MS);
        const sctx = strokes.getContext('2d')!;
        const area = mk(W * MS, H * MS);
        const polyPath = (c: CanvasRenderingContext2D) => {
            c.beginPath();
            POLY.forEach(([x, y], i) => (i ? c.lineTo(x * MS, y * MS) : c.moveTo(x * MS, y * MS)));
            c.closePath();
        };
        {
            // the two pictures are stacked over the whole portrait
            const a = area.getContext('2d')!;
            a.fillStyle = '#fff';
            a.fillRect(0, 0, area.width, area.height);
        }
        const eff = mk(W * MS, H * MS);
        const ectx = eff.getContext('2d')!;
        const layer = mk(2, 2); // resized with the canvas
        const top = mk(2, 2);

        const hair = new Image();
        const bald = new Image();
        let loaded = 0;
        let alive = true;
        let dirty = true;
        let raf = 0;
        let onScreen = true;
        let last: { x: number; y: number } | null = null;
        let flecks: Fleck[] = [];
        let hint = true;
        const shaved = new Set<number>();

        const save = () => {
            try {
                localStorage.setItem(KEY, JSON.stringify([...shaved]));
            } catch {
                /* storage can be blocked */
            }
        };
        const mark = (x: number, y: number) => {
            CELLS.forEach((c, i) => {
                if (!shaved.has(i) && Math.hypot(c.x - x, c.y - y) < BRUSH * 0.85) shaved.add(i);
            });
        };
        const stamp = (x: number, y: number, r = BRUSH) => {
            sctx.fillStyle = '#fff';
            sctx.beginPath();
            sctx.arc(x * MS, y * MS, r * MS, 0, Math.PI * 2);
            sctx.fill();
        };
        const stroke = (x: number, y: number) => {
            hint = false;
            const from = last ?? { x, y };
            const d = Math.hypot(x - from.x, y - from.y);
            const n = Math.max(1, Math.ceil(d / 10));
            for (let i = 1; i <= n; i++) {
                const px = from.x + ((x - from.x) * i) / n;
                const py = from.y + ((y - from.y) * i) / n;
                if (px < 0 || py < 0 || px > W || py > H) continue;
                stamp(px, py);
                if (inPoly(px, py)) {
                    mark(px, py);
                    if (!reduce && Math.random() < 0.5) flecks.push({ x: px, y: py, vx: (Math.random() - 0.5) * 2.2, vy: -Math.random() * 1.5, t0: performance.now() });
                }
            }
            last = { x, y };
            const pct = Math.round((shaved.size / CELLS.length) * 100);
            if (pct >= 96) {
                // finished: take every last strand with it
                sctx.fillStyle = '#fff';
                sctx.strokeStyle = '#fff';
                sctx.lineWidth = 8 * MS;
                polyPath(sctx);
                sctx.fill();
                sctx.stroke();
            }
            setPercent(Math.min(100, pct >= 96 ? 100 : pct));
            dirty = true;
            sync();
        };

        const fit = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const w = Math.max(2, Math.round(portrait.clientWidth * dpr));
            const h = Math.max(2, Math.round(portrait.clientHeight * dpr));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                layer.width = w;
                layer.height = h;
                dirty = true;
            }
        };

        const draw = (now: number) => {
            raf = 0;
            if (!alive || loaded < 2) return;
            fit();
            const cw = canvas.width;
            const ch = canvas.height;
            const lctx = layer.getContext('2d')!;
            const animating = flecks.length > 0 || hint;
            if (!dirty && !animating) return;
            dirty = false;

            // effective shave = strokes inside the feathered hair area
            ectx.globalCompositeOperation = 'source-over';
            ectx.clearRect(0, 0, eff.width, eff.height);
            ectx.drawImage(strokes, 0, 0);
            ectx.globalCompositeOperation = 'destination-in';
            ectx.drawImage(area, 0, 0);

            // bottom: the bald photo, fully opaque across the whole hair area. Underneath the hair
            // photo there is never a gap, so the edge of a shaved patch can't show the page behind.
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, cw, ch);
            lctx.globalCompositeOperation = 'source-over';
            lctx.clearRect(0, 0, cw, ch);
            lctx.drawImage(bald, 0, 0, cw, ch);
            lctx.globalCompositeOperation = 'destination-in';
            lctx.drawImage(area, 0, 0, cw, ch);
            ctx.drawImage(layer, 0, 0);

            // top: the hair photo, with the shaved places wiped out of it
            top.width = cw;
            top.height = ch;
            const tctx = top.getContext('2d')!;
            tctx.drawImage(hair, 0, 0, cw, ch);
            tctx.globalCompositeOperation = 'destination-out';
            tctx.drawImage(eff, 0, 0, cw, ch);
            tctx.drawImage(eff, 0, 0, cw, ch);
            ctx.drawImage(top, 0, 0);

            const k = cw / W;
            // clippings
            flecks = flecks.filter((f) => now - f.t0 < 900);
            for (const f of flecks) {
                const t = (now - f.t0) / 1000;
                const x = (f.x + f.vx * t * 60) * k;
                const y = (f.y + f.vy * t * 60 + 520 * t * t) * k;
                ctx.fillStyle = `rgba(20,16,12,${1 - t / 0.9})`;
                ctx.fillRect(x, y, 2.2 * k * 1.4, 2.2 * k * 1.4);
            }
            // invitation
            if (hint) {
                const pulse = 0.5 + 0.5 * Math.sin(now / 380);
                const cx = 360 * k;
                const cy = 95 * k;
                ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.5 * pulse})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(cx, cy, (22 + 16 * pulse) * k, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.beginPath();
                ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = '600 12px "Geist Mono Variable", ui-monospace, monospace';
                ctx.shadowColor = 'rgba(0,0,0,0.7)';
                ctx.shadowBlur = 6;
                ctx.fillStyle = 'rgba(255,255,255,0.95)';
                ctx.fillText('SHAVE ME', cx + 38 * k, cy + 4);
                ctx.shadowBlur = 0;
            }
            sync();
        };

        function sync() {
            const run = alive && onScreen && !document.hidden && loaded >= 2;
            if (run && !raf) raf = requestAnimationFrame(draw);
            if (!run && raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        }

        const onLoad = () => {
            loaded += 1;
            if (loaded < 2 || !alive) return;
            // restore saved progress
            try {
                const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as number[] | null;
                if (Array.isArray(saved) && saved.length) {
                    saved.forEach((i) => {
                        const c = CELLS[i];
                        if (!c) return;
                        shaved.add(i);
                        stamp(c.x, c.y, 26);
                    });
                    hint = false;
                    setPercent(Math.min(100, Math.round((shaved.size / CELLS.length) * 100)));
                }
            } catch {
                /* ignore */
            }
            // the canvas now draws the whole portrait, so the plain picture can step aside
            if (photo) photo.style.visibility = 'hidden';
            dirty = true;
            sync();
        };
        hair.onload = onLoad;
        bald.onload = onLoad;
        hair.src = hairSrc;
        bald.src = baldSrc;

        const toImage = (e: PointerEvent | MouseEvent) => {
            const r = portrait.getBoundingClientRect();
            return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
        };
        const overHead = (e: PointerEvent | MouseEvent) => {
            const p = toImage(e);
            return inPoly(p.x, p.y);
        };
        const overPortrait = (e: PointerEvent | MouseEvent) => {
            const p = toImage(e);
            return p.x >= 0 && p.y >= 0 && p.x <= W && p.y <= H;
        };
        const isUi = (t: EventTarget | null) => t instanceof Element && !!t.closest('button, a');

        let saveTimer = 0;
        const saveSoon = () => {
            window.clearTimeout(saveTimer);
            saveTimer = window.setTimeout(save, 500);
        };
        const onMove = (e: PointerEvent) => {
            if (isUi(e.target)) {
                heroEl.style.cursor = '';
                last = null;
                return;
            }
            // hovering is enough: the hair photo lies on top, the bald one under it, and the
            // cursor wipes the top one away
            if (overPortrait(e)) {
                heroEl.style.cursor = overHead(e) ? CURSOR : '';
                const p = toImage(e);
                stroke(p.x, p.y);
                saveSoon();
            } else {
                heroEl.style.cursor = '';
                last = null;
            }
        };
        // a tap (touch screens have no hover) shaves a patch too
        const onDown = (e: PointerEvent) => {
            if (isUi(e.target) || !overPortrait(e)) return;
            last = null;
            const p = toImage(e);
            stroke(p.x, p.y);
            last = null;
            saveSoon();
        };
        heroEl.addEventListener('pointermove', onMove, { passive: true });
        heroEl.addEventListener('pointerdown', onDown);

        const io = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            dirty = true;
            sync();
        });
        io.observe(heroEl);
        document.addEventListener('visibilitychange', sync);
        const ro = new ResizeObserver(() => {
            dirty = true;
            sync();
        });
        ro.observe(portrait);

        // "Shave it": sweep the clippers over the head in rows
        const auto = () => {
            const xs = POLY.map((p) => p[0]);
            const ys = POLY.map((p) => p[1]);
            const rows: { x: number; y: number }[] = [];
            let dir = 1;
            for (let y = Math.min(...ys) + 10; y <= Math.max(...ys); y += 34) {
                const a = dir > 0 ? Math.min(...xs) : Math.max(...xs);
                const b = dir > 0 ? Math.max(...xs) : Math.min(...xs);
                for (let i = 0; i <= 14; i++) rows.push({ x: a + ((b - a) * i) / 14, y });
                dir = -dir;
            }
            let i = 0;
            const tick = () => {
                if (!alive) return;
                for (let n = 0; n < 4 && i < rows.length; n++, i++) {
                    last = i ? rows[i - 1] : null;
                    stroke(rows[i].x, rows[i].y);
                }
                last = null;
                if (i < rows.length) requestAnimationFrame(tick);
                else save();
            };
            tick();
        };
        const reset = () => {
            sctx.clearRect(0, 0, strokes.width, strokes.height);
            shaved.clear();
            flecks = [];
            hint = true;
            setPercent(0);
            save();
            dirty = true;
            sync();
        };
        api.current = { auto, reset };

        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', sync);
            heroEl.removeEventListener('pointermove', onMove);
            heroEl.removeEventListener('pointerdown', onDown);
            window.clearTimeout(saveTimer);
            heroEl.style.cursor = '';
            if (photo) photo.style.visibility = '';
            api.current = null;
        };
    }, [portraitRef, hairSrc, baldSrc]);

    const auto = useCallback(() => api.current?.auto(), []);
    const reset = useCallback(() => api.current?.reset(), []);
    const done = percent >= 100;

    const hud = (
        <div
            data-hero-in
            className="absolute bottom-14 left-5 z-[5] w-[min(260px,calc(100%-2.5rem))] border border-border bg-background/80 p-4 backdrop-blur-sm md:bottom-[88px] md:left-auto md:right-6"
        >
            <p className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em]">
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Task: make me bald
                </span>
                <span className="tabular-nums">{percent}%</span>
            </p>
            <div className="mt-3 h-px w-full bg-border" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Hair shaved">
                <div className="h-px bg-primary transition-[width] duration-500" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {done ? 'Smooth. Nicely done.' : 'Move your cursor over my hair, or tap it, and watch it disappear.'}
            </p>
            <div className="mt-3 flex gap-2">
                <button type="button" onClick={auto} className="press border border-foreground/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] hover:bg-foreground hover:text-background">
                    Shave it
                </button>
                {percent > 0 && (
                    <button type="button" onClick={reset} className="press px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground">
                        Grow it back
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
            {hero && createPortal(hud, hero)}
        </>
    );
};

export default ShaveGame;
