import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Github } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: 'Travel Agency',
        category: 'Web Application',
        description: 'Immersive travel experience platform with hotel booking and destination discovery.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
        color: 'from-purple-500/20 to-blue-500/20',
        url: 'https://travel-mu-five.vercel.app/',
    },
    {
        id: 2,
        title: "BadUI Nuit d'info 2024",
        category: 'Hackathon Project',
        description: "BadUI Nuit d'info 2024",
        image: 'https://picsum.photos/400/400?grayscale',
        color: 'from-pink-500/20 to-orange-500/20',
        url: 'https://bad-ui-nuit.vercel.app/',
    },
    {
        id: 3,
        title: 'C2I Group Portfolio',
        category: 'Portfolio',
        description: 'C2I group portfolio website',
        image: 'https://picsum.photos/500/500?grayscale',
        color: 'from-green-500/20 to-cyan-500/20',
        url: 'https://c2i-eight.vercel.app/',
    },
    {
        id: 4,
        title: 'GoodJobs',
        category: 'Web Application',
        description: 'A LinkedIn clone focused on professional networking and job searching, built with PHP.',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
        color: 'from-blue-600/20 to-indigo-500/20',
        url: 'https://github.com/AmineBarh/Projet-php-GOODJOBS',
    },
    {
        id: 5,
        title: 'Restaurant Booking',
        category: 'Full Stack App',
        description: 'A comprehensive booking system featuring database integration and a responsive frontend interface.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
        color: 'from-orange-500/20 to-red-500/20',
        url: 'https://github.com/AmineBarh/Restaurant-booking',
    },
];

const ProjectCard = ({
    project,
    index,
    onSelect
}: {
    project: typeof projects[0];
    index: number;
    onSelect: () => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="flex-shrink-0 w-[350px] md:w-[450px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group"
                animate={{
                    scale: isHovered ? 1.02 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={onSelect}
                data-magnetic
            >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />

                {/* Image */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                </motion.div>

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <motion.div
                        animate={{ y: isHovered ? -10 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="inline-block px-3 py-1 rounded-full glass text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">
                            {project.category}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                            {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {project.description}
                        </p>
                    </motion.div>

                    {/* View button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3"
                    >
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                            View Project
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>

                {/* Border glow on hover */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary/50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
};

const ProjectsGallery = () => {
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollXProgress } = useScroll({
        container: containerRef,
    });

    return (
        <section id="projects" className="relative py-24 overflow-hidden">
            {/* Section Header */}
            <div className="container px-6 md:px-12 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
                        Selected Work
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                                The <span className="gradient-text-glow">Gallery</span>
                            </h2>
                            <p className="text-muted-foreground max-w-md">
                                A curated collection of projects that showcase creative problem-solving and technical excellence.
                            </p>
                        </div>

                        {/* Scroll indicator */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground tracking-wider uppercase">Scroll</span>
                            <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
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
                className="flex gap-6 overflow-x-auto pb-8 px-6 md:px-12 snap-x snap-mandatory scrollbar-hide"
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

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center theatre-mode"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-4xl max-h-[85vh] glass rounded-t-3xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glow border */}
                            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                            {/* Close button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Image */}
                                    <div className="flex-1">
                                        <div className="relative aspect-video rounded-xl overflow-hidden">
                                            <img
                                                src={selectedProject.image}
                                                alt={selectedProject.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-br ${selectedProject.color} mix-blend-overlay`} />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col">
                                        <span className="inline-block w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-[0.15em] uppercase mb-4">
                                            {selectedProject.category}
                                        </span>
                                        <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
                                            {selectedProject.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed mb-8">
                                            {selectedProject.description}
                                        </p>

                                        <div className="flex gap-4 mt-auto">
                                            <a
                                                href={selectedProject.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                                            >
                                                Visit Site
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
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

export default ProjectsGallery;
