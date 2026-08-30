import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    X,
    Github,
    Cpu,
    Activity,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    Briefcase,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Layers,
    Info,
    TrendingUp
} from 'lucide-react';

export interface ProjectImage {
    src: string;
    alt: string;
    caption?: string;
}

export interface Project {
    id: string | number;
    title: string;
    subtitle?: string;
    category: string;
    role?: string;
    period?: string;
    badge?: string;
    description: string;
    longDescription?: string;
    overview?: string;
    context?: string;
    contribution?: string[];
    outcome?: string;
    image: string;
    images?: ProjectImage[];
    color: string;
    url?: string;
    github?: string;
    tech: string[];
}

const projects: Project[] = [
    {
        id: 'beesafe',
        title: 'BeeSafe — Smart Connected Beehive Monitoring',
        subtitle: 'IoT, Mobile App & Embedded AI Internship',
        category: 'Internship · IoT · AI · Mobile · Computer Vision',
        role: 'IoT & AI Engineering Intern',
        period: 'Apr – Aug 2026 · 17 weeks',
        badge: 'Featured Internship',
        description:
            'Transformed a connected-beehive proof of concept into a complete sensor-to-screen system: containerised backend, React Native mobile app with real-time telemetry, on-device queen detection (YOLO11s + ONNX), and a two-stage frame-analysis pipeline — all running offline on a budget tablet.',
        longDescription: `During my 17-week internship at the LDR research lab (ESIEA, Ivry-sur-Seine), I took ownership of the BeeSafe project: an IoT monitoring system for connected beehives. The goal was to let a beekeeper assess colony health — queen presence, brood composition, reserves — without systematically opening the hive.

At the start, the project existed as a proof of concept: ESP32 sensor nodes, a LoRa link and Home Assistant supervision. Data flowed, but it never reached the end user in a field-usable form, and no image-analysis component was integrated. My mission was to turn that proof of concept into a complete, coherent chain from the sensor to the beekeeper's screen.

The most important methodological outcome was a diagnosis: the public FAIRHive dataset annotations cover only 5.1% of the cells actually present, invalidating classical metrics. Building a fully annotated reference set (16 patches, 4,254 cells) measured real performance and demonstrated the superiority of the density-based approach over box detection (F1 0.496 vs 0.384, recall 0.80–0.93 vs 0.35).

Beyond the deliverables, this internship was an opportunity to reason at the scale of a complete system and to make explicit trade-offs between accuracy, latency, field ergonomics and data quality.`,
        overview:
            'End-to-end smart beehive monitoring system: IoT sensor chain, containerised backend, React Native mobile app, and two embedded AI modules for queen detection and frame analysis.',
        context:
            'French beekeeping faces high colony mortality. Critical events — queen loss, swarming, brood chilling — happen between inspections. BeeSafe makes colonies continuously observable at ~€90 per hive, reducing unnecessary openings and detecting costly events earlier.',
        contribution: [
            'Backend & Docker Infrastructure: Built a containerised Node.js/Express backend with MongoDB and MQTT broker, deployed on a university VM — JWT auth, per-apiary access control, audit log, Server-Sent Events real-time stream, adaptive history aggregation, and automated alerting.',
            'BeeSafe App (React Native / Expo): Developed the mobile interface — live sensor readings, session persistence, apiary management with GPS auto-fill, historical charts with configurable time ranges, and a voice-input inspection form that converts free dictation into structured fields via an LLM.',
            'On-Device Queen Detector: Trained a two-class YOLO11s model (queen + drone as distractor), exported to ONNX and executed on-device via ONNX Runtime. Stabilised with a temporal k-of-N vote (4/7) — zero queen↔drone confusion on the test set (precision 0.92, recall 0.79).',
            'Frame Analysis Pipeline: Designed a two-stage pipeline — U-Net heatmap for cell localisation (~13 MB) followed by a lightweight CNN classifier (~1 MB) for six cell types. Achieved recall 0.80–0.93 vs 0.35 for box detection on the reference set.',
            'FAIRHive Dataset Audit: Diagnosed that the public dataset annotations cover a median of only 5.1% of actual cells. Built a hand-annotated reference set (4,254 cells) that raised measured precision from 0.23 to 0.57.',
            'Hardware Assembly & 3D Design: Designed and 3D-printed a sensor housing for the hive entrance, soldered sensor connections, assembled the weighing platform, and installed nodes on campus beehives.'
        ],
        outcome:
            'Delivered a fully functional sensor-to-screen system deployed on campus beehives. Presented the project at the ESIEA Green Campus inauguration. Produced versioned technical documentation for each component to ensure project continuity after departure.',
        image: '/images/projects/beesafe/inauguration.jpg',
        images: [
            {
                src: '/images/projects/beesafe/ruche-overview.jpg',
                alt: 'BeeSafe App — live supervision dashboard',
                caption: 'BeeSafe App: real-time hive supervision with sensor readings and alerts'
            },
            {
                src: '/images/projects/beesafe/ruche-donnee.jpg',
                alt: 'BeeSafe App — historical data and trends view',
                caption: 'Historical charts with adaptive aggregation (24h / 7d / 30d / all)'
            },
            {
                src: '/images/projects/beesafe/voice-to-form.jpg',
                alt: 'Voice-to-form inspection feature',
                caption: 'Voice-input inspection form: free dictation converted to structured fields'
            },
            {
                src: '/images/projects/beesafe/result-to-pdf2.jpg',
                alt: 'Queen detection running on device',
                caption: 'On-device queen detection: YOLO11s via ONNX Runtime with temporal vote'
            },
            {
                src: '/images/projects/beesafe/cadre-brut.jpg',
                alt: 'Beehive frame photograph before analysis',
                caption: 'Frame photograph captured for cell composition analysis'
            },
            {
                src: '/images/projects/beesafe/cadre-overlay.jpg',
                alt: 'Frame analysis overlay — cells colour-coded by type',
                caption: 'Pipeline output: ~3,330 cells localised and classified by type'
            },
            {
                src: '/images/projects/beesafe/pipeline-visuel.png',
                alt: 'Two-stage frame analysis pipeline diagram',
                caption: 'Two-stage pipeline: U-Net heatmap localisation → CNN patch classification'
            },
            {
                src: '/images/projects/beesafe/boitier-fusion-annote.jpg',
                alt: 'CAD model of the 3D-printed sensor housing',
                caption: '3D-printed sensor housing designed in Autodesk Fusion'
            },
            {
                src: '/images/projects/beesafe/piece-3d.jpg',
                alt: 'Sensor piece installed in the hive entrance reducer',
                caption: 'Sensor housing installed in the hive entrance — no destructive modification'
            },
            {
                src: '/images/projects/beesafe/all.jpg',
                alt: 'Complete hardware setup under the hive',
                caption: 'Full hardware: weighing platform, weatherproof enclosure and wiring'
            },
            {
                src: '/images/projects/beesafe/passerelle.jpg',
                alt: 'LoRa gateway ESP32 module',
                caption: 'LoRa gateway: ESP32 + RA-02 radio module for the apiary'
            },
            {
                src: '/images/projects/beesafe/moi-soudage.jpg',
                alt: 'Soldering sensor connections during assembly',
                caption: 'Soldering sensor wiring for the embedded node'
            },
            {
                src: '/images/projects/beesafe/inauguration.jpg',
                alt: 'BeeSafe demo stand at the ESIEA Green Campus inauguration',
                caption: 'Project presentation at the ESIEA Green Campus inauguration'
            }
        ],
        color: 'from-amber-500/25 via-orange-500/20 to-purple-600/25',
        tech: [
            'React Native',
            'Expo',
            'Node.js',
            'MongoDB',
            'Docker',
            'MQTT',
            'YOLO11',
            'ONNX Runtime',
            'PyTorch',
            'ESP32',
            'LoRa',
            'U-Net',
            'Python',
            'Computer Vision'
        ]
    },
    {
        id: 1,
        title: 'Travel Agency',
        category: 'Web Application',
        description: 'Immersive travel experience platform with hotel booking and destination discovery.',
        longDescription:
            'A modern, high-performance web platform designed to streamline travel discovery, custom itinerary creation, and instant hotel booking with fluid animations and responsive design.',
        overview: 'Full-featured travel discovery and booking platform built with modern React paradigms.',
        context: 'Providing modern travelers with an intuitive, aesthetic interface to discover curated travel destinations.',
        contribution: [
            'Engineered dynamic interactive filtering and animated destination showcases.',
            'Designed a sleek mobile-first booking interface with smooth micro-interactions.'
        ],
        outcome: 'Delivered an engaging travel web application with fast load times and intuitive user flow.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
        color: 'from-purple-500/20 to-blue-500/20',
        url: 'https://travel-mu-five.vercel.app/',
        tech: ['React', 'Tailwind CSS', 'Framer Motion']
    },
    {
        id: 2,
        title: "BadUI Nuit d'info 2024",
        category: 'Hackathon Project',
        description: "BadUI Nuit d'info 2024 — an intentionally chaotic, humorous creative coding challenge.",
        longDescription:
            "Created during the nationwide Nuit de l'Info hackathon, this project showcases creative coding, humorous UX anti-patterns, and out-of-the-box interactive animations.",
        overview: 'Hackathon project demonstrating creative frontend experimentation and physics-based interactions.',
        image: 'https://picsum.photos/400/400?grayscale',
        color: 'from-pink-500/20 to-orange-500/20',
        url: 'https://bad-ui-nuit.vercel.app/',
        tech: ['React', 'Tailwind CSS', 'Creative Coding']
    },
    {
        id: 3,
        title: 'C2I Group Portfolio',
        category: 'Portfolio · Full Stack',
        description: 'Official responsive portfolio and services platform designed for C2I Group.',
        longDescription:
            'A comprehensive full-stack corporate showcase built for C2I Group to present their enterprise services, training certifications, and secure communication offerings.',
        overview: 'Corporate web application with service management and responsive client portal.',
        context: 'Created during my internship at C2I Group to modernize their online brand presence and showcase training programs.',
        contribution: [
            'Built responsive frontend components with Tailwind CSS and React.',
            'Structured backend API endpoints and database models using Node.js, Express, and MongoDB.'
        ],
        outcome: 'Successfully deployed a modern corporate platform presenting organizational training and engineering services.',
        image: 'https://picsum.photos/500/500?grayscale',
        color: 'from-green-500/20 to-cyan-500/20',
        url: 'https://c2i-eight.vercel.app/',
        tech: ['React', 'JSX', 'Tailwind', 'MongoDB', 'Node.js', 'Express.js']
    },
    {
        id: 4,
        title: 'GoodJobs',
        category: 'Web Application · PHP',
        description: 'A LinkedIn clone focused on professional networking and job searching, built with PHP.',
        longDescription:
            'A database-driven professional networking portal enabling candidates to discover employment opportunities, connect with recruiters, and manage dynamic profiles.',
        overview: 'Robust full-stack career and professional networking platform.',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
        color: 'from-blue-600/20 to-indigo-500/20',
        url: 'https://github.com/AmineBarh/Projet-php-GOODJOBS',
        github: 'https://github.com/AmineBarh/Projet-php-GOODJOBS',
        tech: ['PHP', 'MySQL', 'Bootstrap', 'PDO', 'HTML', 'CSS', 'JS']
    },
    {
        id: 5,
        title: 'Restaurant Booking',
        category: 'Full Stack App',
        description: 'A comprehensive booking system featuring database integration and a responsive frontend interface.',
        longDescription:
            'An end-to-end table reservation platform featuring real-time availability checking, guest booking management, and an administrative control panel.',
        overview: 'End-to-end dining reservation platform with secure database storage.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
        color: 'from-orange-500/20 to-red-500/20',
        url: 'https://github.com/AmineBarh/Restaurant-booking',
        github: 'https://github.com/AmineBarh/Restaurant-booking',
        tech: ['ReactJS', 'Tailwind CSS', 'MongoDB', 'Node.js', 'Express.js']
    }
];

const ProjectCard = ({
    project,
    index,
    onSelect
}: {
    project: Project;
    index: number;
    onSelect: () => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isFeatured = !!project.badge;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.08 }}
            className={`flex-shrink-0 ${isFeatured ? 'w-[380px] md:w-[480px]' : 'w-[350px] md:w-[450px]'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative h-[480px] md:h-[560px] rounded-3xl overflow-hidden cursor-pointer group glass border border-white/10"
                animate={{
                    scale: isHovered ? 1.02 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={onSelect}
                data-magnetic
            >
                {/* Background ambient gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Top scrim gradient for top badge legibility */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

                {/* Badge if present */}
                {project.badge && (
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/90 border border-primary/60 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-wider shadow-2xl ring-1 ring-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" />
                        <span className="text-white font-bold tracking-wide drop-shadow-md">{project.badge}</span>
                    </div>
                )}

                {/* Image */}
                <motion.div
                    className="absolute inset-0 h-3/5 overflow-hidden"
                    animate={{
                        scale: isHovered ? 1.08 : 1
                    }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </motion.div>

                {/* Glass overlay/Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                    <motion.div
                        animate={{ y: isHovered ? -8 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-block px-3 py-1 rounded-full glass text-[11px] font-medium tracking-[0.1em] uppercase text-primary/90">
                                {project.category}
                            </span>
                            {project.period && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {project.period}
                                </span>
                            )}
                        </div>

                        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2.5 leading-tight group-hover:text-primary transition-colors duration-300">
                            {project.title}
                        </h3>

                        <p className="text-muted-foreground text-sm line-clamp-3 mb-5 leading-relaxed">
                            {project.description}
                        </p>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {project.tech.slice(0, 5).map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium text-white/80 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                            {project.tech.length > 5 && (
                                <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-medium text-primary bg-primary/10 rounded-md">
                                    +{project.tech.length - 5}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* View button */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 15 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3 pt-2 border-t border-white/10"
                    >
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                            <span>Explore Details</span>
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>

                {/* Border glow on hover */}
                <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-primary/50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
};

const ProjectsGallery = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollXProgress } = useScroll({
        container: containerRef
    });

    // Reset active image index when selected project changes
    useEffect(() => {
        setActiveImageIndex(0);
    }, [selectedProject]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProject) {
                setSelectedProject(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedProject]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProject]);

    const galleryImages = selectedProject?.images && selectedProject.images.length > 0
        ? selectedProject.images
        : selectedProject
            ? [{ src: selectedProject.image, alt: selectedProject.title, caption: selectedProject.title }]
            : [];

    const handleNextImage = () => {
        if (galleryImages.length > 1) {
            setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
        }
    };

    const handlePrevImage = () => {
        if (galleryImages.length > 1) {
            setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
        }
    };

    return (
        <section id="projects" className="relative py-24 md:py-32 overflow-hidden">
            {/* Background atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

            {/* Section Header */}
            <div className="container px-6 md:px-12 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-[0.2em] uppercase text-primary mb-6">
                        Selected Work & Internships
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                                The <span className="gradient-text-glow">Gallery</span>
                            </h2>
                            <p className="text-muted-foreground max-w-xl text-base md:text-lg leading-relaxed">
                                A curated showcase of industrial engineering internships, full-stack systems, and innovative software solutions.
                            </p>
                        </div>

                        {/* Scroll indicator */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Scroll</span>
                            <div className="w-28 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                    style={{ scaleX: scrollXProgress, transformOrigin: 'left' }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Horizontal Scroll Gallery */}
            <div
                ref={containerRef}
                className="flex gap-6 md:gap-8 overflow-x-auto pb-10 px-6 md:px-12 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onSelect={() => setSelectedProject(project)}
                    />
                ))}
            </div>

            {/* Theatre-style Pop-up Modal rendered in document.body Portal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedProject && (
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
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.92, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.92, opacity: 0, y: 30 }}
                                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                                className="relative w-full max-w-5xl h-[92vh] max-h-[92vh] glass rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col pointer-events-auto"
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
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20">
                                            {selectedProject.category}
                                        </span>
                                        {selectedProject.role && (
                                            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-muted-foreground text-xs font-medium border border-white/10">
                                                <Briefcase className="w-3.5 h-3.5 text-accent" />
                                                {selectedProject.role}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="p-2 rounded-full glass hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Scrollable Body */}
                                <div
                                    className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8"
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
                                {/* Title & Subtitle Banner */}
                                <div>
                                    <h3 className="font-display text-3xl md:text-5xl font-bold mb-3 text-white leading-tight">
                                        {selectedProject.title}
                                    </h3>
                                    {selectedProject.subtitle && (
                                        <p className="text-primary text-base md:text-lg font-medium">
                                            {selectedProject.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Photo Gallery Carousel / Preview Area */}
                                {galleryImages.length > 0 && (
                                    <div className="space-y-4">
                                        {/* Main Active Image Display */}
                                        <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden glass border border-white/10 group">
                                            <AnimatePresence mode="wait">
                                                <motion.img
                                                    key={galleryImages[activeImageIndex].src}
                                                    src={galleryImages[activeImageIndex].src}
                                                    alt={galleryImages[activeImageIndex].alt}
                                                    initial={{ opacity: 0, scale: 1.05 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </AnimatePresence>

                                            {/* Gradient shading */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                                            {/* Caption overlay */}
                                            {galleryImages[activeImageIndex].caption && (
                                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                                    <span className="inline-block px-3.5 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-xs md:text-sm text-white/90 border border-white/10 font-medium">
                                                        {galleryImages[activeImageIndex].caption}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Navigation Arrows for Multiple Images */}
                                            {galleryImages.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={handlePrevImage}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={handleNextImage}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Gallery Thumbnails */}
                                        {galleryImages.length > 1 && (
                                            <div className="grid grid-cols-3 gap-3">
                                                {galleryImages.map((img, idx) => (
                                                    <button
                                                        key={img.src}
                                                        onClick={() => setActiveImageIndex(idx)}
                                                        className={`relative h-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx
                                                            ? 'border-primary ring-2 ring-primary/40 scale-[1.02]'
                                                            : 'border-white/10 opacity-60 hover:opacity-100'
                                                            }`}
                                                    >
                                                        <img
                                                            src={img.src}
                                                            alt={img.alt}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Main Narrative Story */}
                                {selectedProject.longDescription && (
                                    <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                                            <Info className="w-4 h-4" />
                                            <span>Project Narrative</span>
                                        </div>
                                        <div className="text-white/80 leading-relaxed text-sm md:text-base space-y-4">
                                            {selectedProject.longDescription.split('\n\n').map((paragraph, i) => (
                                                <p key={i}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Structured Project Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Overview & Context */}
                                    {selectedProject.overview && (
                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-start">
                                            <h4 className="flex items-center gap-2 text-base font-bold text-white mb-3">
                                                <Layers className="w-4 h-4 text-primary" />
                                                Overview
                                            </h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {selectedProject.overview}
                                            </p>

                                            {selectedProject.context && (
                                                <div className="mt-5 pt-4 border-t border-white/5">
                                                    <h5 className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                                                        Context
                                                    </h5>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                        {selectedProject.context}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Outcome */}
                                    {selectedProject.outcome && (
                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-start">
                                            <h4 className="flex items-center gap-2 text-base font-bold text-white mb-3">
                                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                Key Outcome & Impact
                                            </h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {selectedProject.outcome}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Contributions Breakdown */}
                                {selectedProject.contribution && selectedProject.contribution.length > 0 && (
                                    <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/10">
                                        <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
                                            <Cpu className="w-5 h-5 text-primary" />
                                            Key Engineering Contributions
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedProject.contribution.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <span className="text-sm text-white/80 leading-relaxed">
                                                        {item}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Technologies & Tools */}
                                <div>
                                    <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">
                                        Technologies & Frameworks
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tech.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3.5 py-1.5 text-xs font-medium text-white/90 bg-white/5 border border-white/10 rounded-lg hover:border-primary/50 transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* External Links & Actions */}
                                {(selectedProject.url || selectedProject.github) && (
                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                                        {selectedProject.url && (
                                            <a
                                                href={selectedProject.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                            >
                                                <span>Visit Live Project</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        {selectedProject.github && (
                                            <a
                                                href={selectedProject.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                                            >
                                                <Github className="w-4 h-4" />
                                                <span>View Repository</span>
                                            </a>
                                        )}
                                    </div>
                                )}
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

export default ProjectsGallery;

