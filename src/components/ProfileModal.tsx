import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToId } from '@/lib/lenis';
import { experience } from '@/data/experience';
import BoxButton from '@/components/ui-kit/BoxButton';

interface ProfileModalProps {
    open: boolean;
    onClose: () => void;
}

const facts = ['Paris, France', 'Final Year Internship (Feb 2027)', 'ESIEA Paris · Double Degree'];

const monoLabel = 'font-mono text-[11px] uppercase tracking-[0.08em]';
const sectionMark = `${monoLabel} flex items-center gap-2 border-b border-border pb-3 text-muted-foreground`;

/** Full-screen "About me" page, set like the rest of the site. */
const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Lock body scroll when open, close on Escape
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

    const goContact = () => {
        onClose();
        window.setTimeout(() => scrollToId('contact'), 400);
    };

    if (!mounted) return null;

    const internships = experience.filter((item) => item.kind === 'internship');
    const education = experience.filter((item) => item.kind === 'education');

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="About Mohamed Amine Barhoumi"
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

                    {/* top bar */}
                    <div className="relative z-10 flex h-[50px] shrink-0 items-center justify-between border-b border-border px-5 md:px-6">
                        <p className={`${monoLabel} flex items-center gap-2`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                            About
                        </p>
                        <p className={`${monoLabel} hidden items-center gap-2 text-muted-foreground md:flex`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            Available Feb 2027
                        </p>
                        <button type="button" onClick={onClose} aria-label="Close" className={`${monoLabel} press hover:opacity-60`}>
                            Close ×
                        </button>
                    </div>

                    <div
                        className="custom-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-20 pt-10 md:px-6 md:pt-14"
                        data-lenis-prevent="true"
                        data-lenis-prevent-wheel="true"
                        data-lenis-prevent-touch="true"
                        style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                    >
                        <div className="mx-auto max-w-[1400px]">
                            {/* name */}
                            <ul className={`${monoLabel} flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground`}>
                                {facts.map((fact) => (
                                    <li key={fact} className="flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                        {fact}
                                    </li>
                                ))}
                            </ul>
                            <h2 className="type-heavy mt-6 text-[clamp(3.5rem,11vw,12rem)]">
                                mohamed amine
                                <br />
                                barhoumi.
                            </h2>
                            <p className="mt-6 border-b border-border pb-12 text-[clamp(1.4rem,2.6vw,2.4rem)] font-light leading-[1.1] tracking-[-0.03em] text-primary">
                                AI, IoT & Full-Stack Software Engineer
                            </p>

                            {/* bio + internships */}
                            <div className="mt-16 grid gap-12 lg:grid-cols-12">
                                <div className="lg:col-span-5">
                                    <p className={sectionMark}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                        About me
                                    </p>
                                    <div className="mt-6 max-w-[54ch] space-y-5 text-lg font-light leading-snug tracking-tight md:text-xl">
                                        <p>
                                            Currently pursuing a double degree in <strong className="font-medium">Artificial Intelligence & Data Science</strong> at <strong className="font-medium">ESIEA Paris</strong> and <strong className="font-medium">EPI Tunisia</strong>, graduating in 2027. Based in <strong className="font-medium">Paris, France</strong>, I am actively searching for a <strong className="font-medium text-primary">6-month Final Year Internship (PFE / Stage de Fin d'Études)</strong> starting in <strong className="font-medium">February 2027</strong>.
                                        </p>
                                        <p className="text-base text-muted-foreground md:text-lg">
                                            My work combines embedded AI, computer vision pipelines (YOLO11, U-Net, ONNX), end-to-end IoT sensor chains (ESP32, LoRa, MQTT), containerized backends (Node.js, Docker, MongoDB), and modern mobile interfaces (React Native / Expo).
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:col-span-7">
                                    <p className={sectionMark}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                        Internships
                                    </p>
                                    <ul>
                                        {internships.map((item, i) => (
                                            <li key={item.title} className="grid gap-x-8 gap-y-2 border-b border-border py-7 md:grid-cols-[3rem_1fr]">
                                                <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                                                <div>
                                                    <h3 className="text-xl font-light tracking-[-0.03em] md:text-2xl">{item.title}</h3>
                                                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">{item.meta}</p>
                                                    {item.text && <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-foreground/75">{item.text}</p>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* education */}
                            <div className="mt-20">
                                <p className={sectionMark}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                    Education
                                </p>
                                <ul className="grid md:grid-cols-3">
                                    {education.map((item) => (
                                        <li key={item.title} className="border-b border-border py-7 md:px-6 md:[&:first-child]:pl-0 md:[&:not(:first-child)]:border-l">
                                            <span className="font-mono text-[11px] text-muted-foreground">{item.period}</span>
                                            <h3 className="mt-6 text-xl font-light tracking-[-0.03em] md:text-2xl">{item.title}</h3>
                                            <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-muted-foreground">{item.meta}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* closing band */}
                            <div className="band-paper mt-20 flex flex-col justify-between gap-8 p-6 md:flex-row md:items-end md:p-10">
                                <div>
                                    <p className="type-heavy text-[clamp(2.5rem,6vw,5.5rem)] text-ink">available feb 2027.</p>
                                    <p className="mt-3 text-sm text-ink/70">Open to Paris and remote opportunities.</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <BoxButton tone="light" onClick={goContact}>
                                        Contact
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

export default ProfileModal;
