import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, X, GraduationCap, Code2, Briefcase } from 'lucide-react';
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

    // Close modal on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (isProfileExpanded) {
                setIsProfileExpanded(false);
            }
        };

        if (isProfileExpanded) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
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
                    {/* Overline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }} // Reduced delay for faster appearance
                        className="mb-4 relative z-20"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium tracking-[0.2em] uppercase text-primary hover:text-primary-foreground hover:bg-primary/20 transition-colors">
                            Available for Internship
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

            {/* Profile Expansion Modal */}
            <AnimatePresence>
                {isProfileExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
                        onClick={() => setIsProfileExpanded(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative max-w-7xl w-full bg-background/50 glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsProfileExpanded(false)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col md:flex-row">
                                {/* Image Side */}
                                <div
                                    className="md:w-5/12 relative h-64 md:h-auto overflow-hidden cursor-crosshair group"
                                    ref={imageContainerRef}
                                    onMouseMove={handleMouseMove}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 md:hidden" />

                                    {/* Bottom Image (Robot) */}
                                    <img
                                        src={meRobot}
                                        alt="Robot Transformation"
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />

                                    {/* Top Image (Profile) with Mask */}
                                    <motion.img
                                        src={profilePic}
                                        alt="Mohamed Amine Barhoumi"
                                        className="relative w-full h-full object-cover object-top z-10"
                                        style={{
                                            maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 60%, black 100%)`,
                                            WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 60%, black 100%)`
                                        }}
                                    />
                                </div>

                                {/* Content Side */}
                                <div className="md:w-7/12 p-8 md:p-12 text-left overflow-y-auto max-h-[60vh] md:max-h-[80vh] custom-scrollbar">
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-widest uppercase mb-4">
                                        Engineering Student
                                    </span>

                                    <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                                        Mohamed Amine Barhoumi
                                    </h2>

                                    <div className="space-y-8">
                                        <div className="text-white/80 leading-relaxed text-sm md:text-base space-y-4">
                                            <p>
                                                Currently pursuing a double degree in <strong className="text-white">Artificial Intelligence</strong> at EPI International Multidisciplinary School and <strong className="text-white">ESIEA</strong>, with an expected graduation date in 2027.
                                                During my most recent internship at <strong className="text-white">C2i Group</strong>, I contributed to secure data communication projects using AES encryption and Base64 encoding, designed an MQTT publisher-subscriber system, and developed a responsive and user-friendly website to present the organization’s services and training programs.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-white border-b border-white/10 pb-2">
                                                <GraduationCap className="w-5 h-5 text-primary" />
                                                Academic Background
                                            </h3>
                                            <div className="space-y-4">
                                                {/* ESIEA */}
                                                <div className="group border-l-2 border-white/10 pl-4 hover:border-primary transition-colors">
                                                    <h4 className="font-bold text-white text-sm md:text-base">Engineering Degree - AI & Data Science</h4>
                                                    <p className="text-xs md:text-sm text-primary">ESIEA Paris | Double Degree EPI/ESIEA</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <p className="text-xs text-muted-foreground">2025 - 2027</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground/80 mt-1 italic">
                                                        ML, Stat. Analysis, Data Mining, Big Data, Python/R, PCA
                                                    </p>
                                                </div>

                                                {/* SIRT */}
                                                <div className="group border-l-2 border-white/10 pl-4 hover:border-accent transition-colors">
                                                    <h4 className="font-bold text-white text-sm md:text-base">Railway Communication & IT</h4>
                                                    <p className="text-xs md:text-sm text-accent">Shijiazhuang Institute (SIRT), China</p>
                                                    <p className="text-xs text-muted-foreground mt-1">2024 - 2027</p>
                                                </div>

                                                {/* EPI */}
                                                <div className="group border-l-2 border-white/10 pl-4 hover:border-purple-400 transition-colors">
                                                    <h4 className="font-bold text-white text-sm md:text-base">Integrated Preparatory & Engineering Cycle</h4>
                                                    <p className="text-xs md:text-sm text-purple-400">International Multidisciplinary School (EPI), Tunisia</p>
                                                    <p className="text-xs text-muted-foreground mt-1">2022 - 2025</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                            <Code2 className="w-4 h-4 text-primary" />
                                            <span>Data Science • Full Stack Development • UI/UX Design</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HeroSection;
