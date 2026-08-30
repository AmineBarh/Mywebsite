import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, X, GraduationCap, Code2, Briefcase, MapPin, Calendar, Sparkles, Mail, ExternalLink, Cpu, Layers } from 'lucide-react';
import profilePic from '../assets/profile.jpg';
import meRobot from '../assets/me-robot.jpg';

const HeroSection = () => {
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isProfileExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isProfileExpanded]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isProfileExpanded) {
                setIsProfileExpanded(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isProfileExpanded]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const scrollToSkills = () => {
        const element = document.getElementById('skills');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToContact = () => {
        setIsProfileExpanded(false);
        const element = document.getElementById('contact');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background gradient animation */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />
            </div>

            <div className="container relative z-10 px-6 md:px-12 pt-24 md:pt-16">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Overline Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mb-4 relative z-20"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-primary/40 backdrop-blur-md text-xs font-semibold tracking-[0.15em] uppercase text-primary hover:bg-primary/10 transition-colors shadow-lg">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Seeking Final Year Internship · Feb 2027
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <div className="overflow-hidden mb-6 -mt-2 py-2">
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="font-display text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight pb-1"
                        >
                            <span className="block text-glow">Creative</span>
                        </motion.h1>
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="font-display text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight pb-1"
                        >
                            <span className="gradient-text-glow">Engineer</span>
                        </motion.h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
                    >
                        Crafting intelligent digital experiences through the convergence of AI, secure engineering, and pixel-perfect design.
                    </motion.p>

                    {/* Profile Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1.8 }}
                        className="relative w-40 h-40 mx-auto mb-12 group cursor-pointer"
                        onClick={() => setIsProfileExpanded(true)}
                    >
                        <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                            }}
                        />
                        <div className="relative w-full h-full rounded-full glass p-2 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-300 relative">
                                <img
                                    src={profilePic}
                                    alt="Mohamed Amine Barhoumi"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white text-xs font-medium uppercase tracking-widest">About Me</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.button
                        onClick={scrollToSkills}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2.2 }}
                        className="group flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mx-auto"
                        data-magnetic
                    >
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">Explore</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </motion.div>
                    </motion.button>
                </div>
            </div>

            {/* Profile Expansion Modal in Portal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isProfileExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl"
                            data-lenis-prevent="true"
                            data-lenis-prevent-wheel="true"
                            data-lenis-prevent-touch="true"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onClick={() => setIsProfileExpanded(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.92, opacity: 0, y: 30 }}
                                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                                className="relative max-w-5xl w-full h-[92vh] max-h-[92vh] bg-background/80 glass border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                                data-lenis-prevent="true"
                                data-lenis-prevent-wheel="true"
                                data-lenis-prevent-touch="true"
                                onWheel={(e) => e.stopPropagation()}
                                onTouchMove={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Top decorative glow beam */}
                                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-20" />

                                {/* Header Toolbar */}
                                <div className="relative z-20 shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
                                            Engineer Profile
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Available Feb 2027
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setIsProfileExpanded(false)}
                                        className="p-2 rounded-full glass hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
                                    {/* Image Side */}
                                    <div
                                        className="md:w-5/12 relative h-64 md:h-full shrink-0 overflow-hidden cursor-crosshair group bg-black/40 border-b md:border-b-0 md:border-r border-white/10"
                                        ref={imageContainerRef}
                                        onMouseMove={handleMouseMove}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 md:hidden" />

                                        {/* Bottom Image (Robot Transformation) */}
                                        <img
                                            src={meRobot}
                                            alt="Robot Transformation"
                                            className="absolute inset-0 w-full h-full object-cover object-top"
                                        />

                                        {/* Top Image (Profile) with Interactive Mask */}
                                        <motion.img
                                            src={profilePic}
                                            alt="Mohamed Amine Barhoumi"
                                            className="relative w-full h-full object-cover object-top z-10"
                                            style={{
                                                maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 60%, black 100%)`,
                                                WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 60%, black 100%)`
                                            }}
                                        />

                                        {/* Hover helper badge */}
                                        <div className="absolute bottom-4 left-4 z-20 hidden md:block">
                                            <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] text-white/70 border border-white/10">
                                                Move cursor to reveal
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div
                                        className="md:w-7/12 flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8"
                                        data-lenis-prevent="true"
                                        data-lenis-prevent-wheel="true"
                                        data-lenis-prevent-touch="true"
                                        onWheel={(e) => e.stopPropagation()}
                                        onTouchMove={(e) => e.stopPropagation()}
                                        style={{
                                            overscrollBehavior: 'contain',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        {/* Name & Title */}
                                        <div>
                                            <h2 className="font-display text-3xl md:text-5xl font-bold mb-2 text-white">
                                                Mohamed Amine Barhoumi
                                            </h2>
                                            <p className="text-primary text-base md:text-lg font-medium mb-4">
                                                AI, IoT & Full-Stack Software Engineer
                                            </p>

                                            {/* Key Info Pill Badges */}
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90">
                                                    <MapPin className="w-3.5 h-3.5 text-accent" />
                                                    Paris, France
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                    Final Year Internship (Feb 2027)
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90">
                                                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                                                    ESIEA Paris · Double Degree
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bio / Summary */}
                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                About Me
                                            </h3>
                                            <p className="text-white/85 leading-relaxed text-sm md:text-base">
                                                Currently pursuing a double degree in <strong className="text-white">Artificial Intelligence & Data Science</strong> at <strong className="text-white">ESIEA Paris</strong> and <strong className="text-white">EPI Tunisia</strong>, graduating in 2027. Based in <strong className="text-white">Paris, France</strong>, I am actively searching for a <strong className="text-primary">6-month Final Year Internship (PFE / Stage de Fin d'Études)</strong> starting in <strong className="text-white">February 2027</strong>.
                                            </p>
                                            <p className="text-white/85 leading-relaxed text-sm md:text-base">
                                                My work combines embedded AI, computer vision pipelines (YOLO11, U-Net, ONNX), end-to-end IoT sensor chains (ESP32, LoRa, MQTT), containerized backends (Node.js, Docker, MongoDB), and modern mobile interfaces (React Native / Expo).
                                            </p>
                                        </div>

                                        {/* Engineering Experience Highlights */}
                                        <div className="space-y-4">
                                            <h3 className="flex items-center gap-2 text-base font-bold text-white border-b border-white/10 pb-2">
                                                <Briefcase className="w-4 h-4 text-primary" />
                                                Internship Experience
                                            </h3>
                                            
                                            <div className="space-y-3">
                                                {/* BeeSafe */}
                                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-white text-sm">BeeSafe — IoT & Embedded AI Intern</h4>
                                                        <span className="text-xs text-primary font-medium">Apr – Aug 2026</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">Learning, Data & Robotics (LDR) Lab · ESIEA Paris</p>
                                                    <p className="text-xs text-white/75 leading-relaxed">
                                                        Built a complete sensor-to-screen smart beehive monitoring system: Node.js/MongoDB containerized backend, React Native mobile app with real-time SSE telemetry, on-device YOLO11s queen detection with temporal voting, and a two-stage U-Net heatmap frame analysis pipeline running fully offline.
                                                    </p>
                                                </div>

                                                {/* C2I Group */}
                                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-white text-sm">C2I Group — Full-Stack & Secure Communication Intern</h4>
                                                        <span className="text-xs text-accent font-medium">Internship</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">C2I Group</p>
                                                    <p className="text-xs text-white/75 leading-relaxed">
                                                        Developed AES-encrypted and Base64-encoded secure data communication pipelines, implemented an MQTT telemetry publisher-subscriber network, and engineered a responsive corporate platform with React and Node.js.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Background */}
                                        <div className="space-y-4">
                                            <h3 className="flex items-center gap-2 text-base font-bold text-white border-b border-white/10 pb-2">
                                                <GraduationCap className="w-4 h-4 text-primary" />
                                                Academic Background
                                            </h3>
                                            <div className="space-y-3">
                                                {/* ESIEA */}
                                                <div className="border-l-2 border-primary/60 pl-4 py-1">
                                                    <h4 className="font-bold text-white text-sm">Engineering Degree — AI & Data Science</h4>
                                                    <p className="text-xs text-primary">ESIEA Paris · Double Degree EPI / ESIEA</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">2025 – 2027 · Paris, France</p>
                                                </div>

                                                {/* SIRT */}
                                                <div className="border-l-2 border-accent/60 pl-4 py-1">
                                                    <h4 className="font-bold text-white text-sm">Railway Communication & IT</h4>
                                                    <p className="text-xs text-accent">Shijiazhuang Institute of Railway Technology (SIRT)</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">2024 – 2027 · China</p>
                                                </div>

                                                {/* EPI */}
                                                <div className="border-l-2 border-purple-400/60 pl-4 py-1">
                                                    <h4 className="font-bold text-white text-sm">Integrated Preparatory & Engineering Cycle</h4>
                                                    <p className="text-xs text-purple-400">International Multidisciplinary School (EPI)</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">2022 – 2025 · Tunisia</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Call to Action Footer */}
                                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                                            <button
                                                onClick={scrollToContact}
                                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Contact for Internship</span>
                                            </button>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                                <span>Open to Paris & Remote Opportunities</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default HeroSection;

