import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/ui-kit/SectionLabel';
import BoxButton from '@/components/ui-kit/BoxButton';

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
                src: '/images/projects/beesafe/pipeline-visuel.webp',
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
        image: '/images/projects/bad-ui.jpg',
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
        image: '/images/projects/c2i-portfolio.webp',
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

/** "BeeSafe — Smart Connected Beehive Monitoring" -> "BeeSafe" */
const shortTitle = (title: string) => title.split(' — ')[0];
/** "BeeSafe — Smart Connected Beehive Monitoring" -> "Smart Connected Beehive Monitoring" */
const descriptor = (title: string) => title.split(' — ').slice(1).join(': ');

const monoLabel = 'font-mono text-[11px] uppercase tracking-[0.08em]';
const sectionMark = `${monoLabel} flex items-center gap-2 border-b border-border pb-3 text-muted-foreground`;

const ProjectsGallery = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const rootRef = useRef<HTMLElement>(null);

    useReveal(rootRef);

    // Other sections (the BeeSafe feature) can open a project by id
    useEffect(() => {
        const onOpen = (e: Event) => {
            const id = (e as CustomEvent<string>).detail;
            const project = projects.find((p) => String(p.id) === id);
            if (project) setSelectedProject(project);
        };
        window.addEventListener('open-project', onOpen);
        return () => window.removeEventListener('open-project', onOpen);
    }, []);

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
        <section ref={rootRef} id="projects" className="relative z-[1] pb-28 md:pb-40">
            <div className="page-shell">
                <SectionLabel label="Featured work" meta={`${projects.length} projects, internships first`} />
                <h2 className="sr-only">Selected work and internships</h2>

                <div className="grid gap-x-5 gap-y-14 pt-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <article key={project.id} data-reveal>
                            <button
                                type="button"
                                onClick={() => setSelectedProject(project)}
                                aria-label={`Open details: ${project.title}`}
                                className="group block w-full text-left"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-card">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover grayscale-[0.35] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                                    />
                                    {project.badge && (
                                        <span className="absolute left-3 top-3 flex items-center gap-2 bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] backdrop-blur-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            {project.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 flex items-baseline justify-between gap-4">
                                    <h3 className="text-2xl font-light tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1">{shortTitle(project.title)}</h3>
                                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{project.category.split(' · ')[0]}</span>
                                </div>
                                <p className="mt-2 line-clamp-2 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">{project.subtitle ?? project.description}</p>
                            </button>
                        </article>
                    ))}
                </div>
            </div>

            {/* Project page, full screen, in the site's style */}
            {typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {selectedProject && (
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                aria-label={selectedProject.title}
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
                                <div className="relative z-10 flex h-[50px] shrink-0 items-center justify-between gap-4 border-b border-border px-5 md:px-6">
                                    <p className={`${monoLabel} flex items-center gap-2`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                        Project
                                    </p>
                                    <p className={`${monoLabel} hidden truncate text-muted-foreground md:block`}>{selectedProject.category}</p>
                                    <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close" className={`${monoLabel} press shrink-0 hover:opacity-60`}>
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
                                        {/* title */}
                                        <div className={`${monoLabel} flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground`}>
                                            {selectedProject.badge && (
                                                <span className="flex items-center gap-2 text-foreground">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    {selectedProject.badge}
                                                </span>
                                            )}
                                            {selectedProject.period && <span>{selectedProject.period}</span>}
                                            {selectedProject.role && <span>{selectedProject.role}</span>}
                                        </div>
                                        <h2 className="type-heavy mt-6 text-[clamp(3.5rem,10vw,10.5rem)]">{shortTitle(selectedProject.title)}.</h2>
                                        {(selectedProject.subtitle || descriptor(selectedProject.title)) && (
                                            <p className="mt-6 max-w-[34ch] text-[clamp(1.4rem,2.6vw,2.4rem)] font-light leading-[1.1] tracking-[-0.03em]">
                                                {descriptor(selectedProject.title) || selectedProject.subtitle}
                                            </p>
                                        )}

                                        {/* gallery */}
                                        <div className="mt-12 border-y border-border py-6">
                                            <div className="relative flex aspect-[16/9] max-h-[68dvh] w-full items-center justify-center overflow-hidden bg-card">
                                                <AnimatePresence mode="wait">
                                                    <motion.img
                                                        key={activeImageIndex}
                                                        src={galleryImages[activeImageIndex]?.src}
                                                        alt={galleryImages[activeImageIndex]?.alt}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </AnimatePresence>
                                            </div>
                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                                <p className={`${monoLabel} max-w-[70ch] text-muted-foreground`}>{galleryImages[activeImageIndex]?.caption ?? galleryImages[activeImageIndex]?.alt}</p>
                                                {galleryImages.length > 1 && (
                                                    <div className="flex items-stretch border border-border font-mono text-[11px]">
                                                        <button type="button" onClick={handlePrevImage} aria-label="Previous image" className="press px-4 py-2.5 hover:bg-foreground hover:text-background">
                                                            ←
                                                        </button>
                                                        <span className="flex items-center border-x border-border px-4 text-muted-foreground">
                                                            {String(activeImageIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
                                                        </span>
                                                        <button type="button" onClick={handleNextImage} aria-label="Next image" className="press px-4 py-2.5 hover:bg-foreground hover:text-background">
                                                            →
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {galleryImages.length > 1 && (
                                                <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto">
                                                    {galleryImages.map((img, idx) => (
                                                        <button
                                                            key={img.src + idx}
                                                            type="button"
                                                            onClick={() => setActiveImageIndex(idx)}
                                                            aria-label={`Show image ${idx + 1}`}
                                                            className={`h-16 w-24 shrink-0 overflow-hidden border transition-opacity ${idx === activeImageIndex ? 'border-primary opacity-100' : 'border-border opacity-50 hover:opacity-90'}`}
                                                        >
                                                            <img src={img.src} alt="" className="h-full w-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* story + facts */}
                                        <div className="mt-16 grid gap-12 lg:grid-cols-12">
                                            <div className="lg:col-span-7">
                                                <p className={`${sectionMark}`}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                                    The project
                                                </p>
                                                <div className="mt-6 max-w-[62ch] space-y-5 text-lg font-light leading-snug tracking-tight md:text-xl">
                                                    {(selectedProject.longDescription ?? selectedProject.description).split('\n\n').map((paragraph, i) => (
                                                        <p key={i}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-10 lg:col-span-5">
                                                {selectedProject.overview && (
                                                    <div>
                                                        <p className={sectionMark}>
                                                            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                                            Overview
                                                        </p>
                                                        <p className="mt-4 text-sm leading-relaxed text-foreground/75">{selectedProject.overview}</p>
                                                    </div>
                                                )}
                                                {selectedProject.context && (
                                                    <div>
                                                        <p className={sectionMark}>
                                                            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                                            Context
                                                        </p>
                                                        <p className="mt-4 text-sm leading-relaxed text-foreground/75">{selectedProject.context}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={sectionMark}>
                                                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                                        Stack
                                                    </p>
                                                    <ul className="mt-4 flex flex-wrap gap-2">
                                                        {selectedProject.tech.map((tech) => (
                                                            <li key={tech} className="border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-foreground/85">
                                                                {tech}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* contributions */}
                                        {selectedProject.contribution && selectedProject.contribution.length > 0 && (
                                            <div className="mt-20">
                                                <p className={sectionMark}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                                    What I did
                                                </p>
                                                <ul>
                                                    {selectedProject.contribution.map((item, idx) => {
                                                        const cut = item.indexOf(': ');
                                                        const head = cut > 0 ? item.slice(0, cut) : '';
                                                        const body = cut > 0 ? item.slice(cut + 2) : item;
                                                        return (
                                                            <li key={idx} className="grid gap-x-8 gap-y-2 border-b border-border py-7 md:grid-cols-[3rem_1fr_2fr]">
                                                                <span className="font-mono text-[11px] text-muted-foreground">{String(idx + 1).padStart(2, '0')}</span>
                                                                <h3 className="text-xl font-light tracking-[-0.03em] md:text-2xl">{head || `Contribution ${idx + 1}`}</h3>
                                                                <p className="max-w-[68ch] text-sm leading-relaxed text-foreground/70">{body}</p>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}

                                        {/* outcome + links */}
                                        <div className="band-paper mt-20 grid gap-8 p-6 md:grid-cols-12 md:p-10">
                                            <div className="md:col-span-8">
                                                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/60">Outcome</p>
                                                <p className="mt-4 max-w-[60ch] text-lg leading-snug md:text-xl">
                                                    {selectedProject.outcome ?? selectedProject.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-end gap-3 md:col-span-4 md:justify-end">
                                                {selectedProject.url && selectedProject.url !== selectedProject.github && (
                                                    <BoxButton tone="light" href={selectedProject.url}>
                                                        Live site
                                                    </BoxButton>
                                                )}
                                                {selectedProject.github && (
                                                    <BoxButton tone="light" href={selectedProject.github}>
                                                        Source code
                                                    </BoxButton>
                                                )}
                                                <BoxButton tone="light" onClick={() => setSelectedProject(null)}>
                                                    Back to the work
                                                </BoxButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </section>
    );
};

export default ProjectsGallery;

