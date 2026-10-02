import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BoxButton from '@/components/ui-kit/BoxButton';

interface ResearchModalProps {
    open: boolean;
    onClose: () => void;
}

const states = ['Pre-swarm', 'Swarm', 'Queen loss', 'Queen present', 'Queen hatching'];

const findings = [
    {
        title: 'Datasets',
        text: 'I assessed five public sources: NU-Hive, Smart Bee Colony Monitor, BeeTogether, UrBAN and we4bee. None of them covers all five states, which is a known fragmentation problem in this field.',
    },
    {
        title: 'The hive dominates the signal',
        text: 'On the Smart Bee Colony Monitor data (7,100 audio segments from a requeening experiment on four hives), which hive is recording explains far more of the sound than the queen does: about 29% of the variance in dominant frequency, against about 1% for queen status. A model has to be tested on hives it has never heard.',
    },
    {
        title: 'Queen hatching',
        text: 'The piping calls of a young queen, called quacking and tooting, arrive as bouts spread over hours. They look best treated as event detection on long recordings rather than as short clips.',
    },
    {
        title: 'Labelled swarm data',
        text: 'A labelled pre-swarm and swarm subset exists in the we4bee citizen-science project at the University of Würzburg. Access is by request, so that is the route I am following.',
    },
];

const monoLabel = 'font-mono text-[11px] uppercase tracking-[0.08em]';

/** A decorative recording: layered sine waves with a slow envelope. Not live data. */
const Waveform = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        const draw = (time: number) => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (canvas.width !== Math.round(w * dpr)) {
                canvas.width = Math.round(w * dpr);
                canvas.height = Math.round(h * dpr);
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            const t = time * 0.001;
            const bars = Math.floor(w / 5);
            for (let i = 0; i < bars; i++) {
                const x = i * 5 + 2;
                const p = i / bars;
                const env = 0.35 + 0.65 * Math.abs(Math.sin(p * 5.2 + t * 0.35)) * (0.6 + 0.4 * Math.sin(p * 17 + t * 0.9));
                const hum = Math.sin(p * 90 + t * 3.2) * 0.5 + Math.sin(p * 41 - t * 2.1) * 0.5;
                const amp = Math.max(0.04, Math.abs(hum) * env) * (h * 0.46);
                ctx.fillStyle = `hsla(142, 46%, 62%, ${0.35 + 0.5 * env})`;
                ctx.fillRect(x, h / 2 - amp, 2, amp * 2);
            }
            if (!reduce) raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, []);
    return <canvas ref={ref} className="h-28 w-full md:h-36" aria-hidden="true" />;
};

/** The hive-audio research, shown as a full-screen page in the site's style. */
const ResearchModal = ({ open, onClose }: ResearchModalProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!mounted) return null;

    const openProject = () => {
        onClose();
        window.setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: 'beesafe' })), 400);
    };

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Hive audio research"
                    initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                    animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                    exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                    transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
                    className="fixed inset-0 z-[99999] flex flex-col bg-background text-foreground"
                    data-lenis-prevent="true"
                    data-lenis-prevent-wheel="true"
                    data-lenis-prevent-touch="true"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div aria-hidden="true" className="modal-guides pointer-events-none absolute inset-0" />

                    <div className="relative z-10 flex h-[50px] shrink-0 items-center justify-between border-b border-border px-5 md:px-6">
                        <p className={`${monoLabel} flex items-center gap-2`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                            Research
                        </p>
                        <p className={`${monoLabel} hidden items-center gap-2 text-muted-foreground md:flex`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            In progress
                        </p>
                        <button type="button" onClick={onClose} aria-label="Close" className={`${monoLabel} press hover:opacity-60`}>
                            Close ×
                        </button>
                    </div>

                    <div
                        className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-20 pt-12 md:px-6 md:pt-16"
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                    >
                        <div className="mx-auto max-w-[1400px]">
                            <h2 className="type-heavy text-[clamp(3.5rem,11vw,12rem)]">listening to the hive.</h2>
                            <p className="mt-8 max-w-[28ch] text-[clamp(1.5rem,3vw,2.75rem)] font-light leading-[1.1] tracking-[-0.03em]">
                                Can the sound of a hive tell me what is happening inside, without opening it?
                            </p>

                            <div className="mt-14 border-y border-border py-6">
                                <Waveform />
                                <p className={`${monoLabel} mt-3 text-muted-foreground`}>Illustration of a hive recording. Not live data.</p>
                            </div>

                            <div className="mt-16 grid gap-12 lg:grid-cols-12">
                                <div className="lg:col-span-5">
                                    <p className={`${monoLabel} flex items-center gap-2 border-b border-border pb-3 text-muted-foreground`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                        The question
                                    </p>
                                    <p className="mt-6 max-w-[48ch] text-lg font-light leading-snug md:text-xl">
                                        A colony in trouble sounds different. I am building a classifier that listens to a hive and predicts which of five states it is in, so the beekeeper does not have to open it to find out.
                                    </p>
                                    <ul className="mt-6 flex flex-wrap gap-2">
                                        {states.map((state) => (
                                            <li key={state} className="border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-foreground/85">
                                                {state}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-8 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                                        Opening a hive stresses the colony. A microphone can listen all day without touching it, the same idea as BeeSafe's remote monitoring.
                                    </p>
                                </div>

                                <div className="lg:col-span-7">
                                    <p className={`${monoLabel} flex items-center gap-2 border-b border-border pb-3 text-muted-foreground`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                        Where it stands
                                    </p>
                                    <ul>
                                        {findings.map((item, i) => (
                                            <li key={item.title} className="grid gap-x-8 gap-y-2 border-b border-border py-7 md:grid-cols-[3rem_1fr]">
                                                <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                                                <div>
                                                    <h3 className="text-xl font-light tracking-[-0.03em] md:text-2xl">{item.title}</h3>
                                                    <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-foreground/70">{item.text}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                                        This is still the data and exploration phase. I will add results here when they are solid.
                                    </p>
                                </div>
                            </div>

                            <div className="band-paper mt-20 flex flex-col justify-between gap-8 p-6 md:flex-row md:items-end md:p-8">
                                <p className="type-heavy text-[clamp(2.5rem,5vw,4.5rem)] text-ink">less opening, more listening.</p>
                                <div className="flex flex-wrap gap-3">
                                    <BoxButton tone="light" onClick={openProject}>
                                        See the BeeSafe project
                                    </BoxButton>
                                    <BoxButton tone="light" onClick={onClose}>
                                        Back to the page
                                    </BoxButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
};

export default ResearchModal;
