import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { X, ZoomIn, Palette } from 'lucide-react';


// Correct Imports based on available assets
import robotsTemplate from '../assets/EPI Robots Day 4.0 - Post example template.jpg';
import survivalBanner from '../assets/survival.jpg';
import cyberPoster from '../assets/cyber.jpg';
import robotsBanner from '../assets/csgo.jpg'; // Matches "EPI Robots Day 4.0 Banner" (CS:GO theme)
import integrationPoster from '../assets/jpo.png'; // Best guess for "Integration Day"
import book from '../assets/book csgo.jpg';
import workshop from '../assets/workshop.png';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const designs = [
    {
        id: 1,
        title: 'EPI Robots Day 4.0 Banner',
        description: 'CS:GO inspired event poster',
        image: robotsBanner,
    },
    {
        id: 2,
        title: 'Cyberbenders AI Challenge 2.0 - Poster A0',
        description: 'AI Challenge 2.0 poster',
        image: cyberPoster,
    },
    {
        id: 3,
        title: 'EPI Survival Challenge Banner',
        description: 'Survival Challenge banner',
        image: survivalBanner,
    },
    {
        id: 4,
        title: 'Integration Day poster 2024-2025',
        description: 'Integration Day poster',
        image: integrationPoster,
    },
    {
        id: 5,
        title: 'EPI Robots Day 4.0 - Post example template',
        description: 'EPI Robots Day 4.0 poster',
        image: robotsTemplate,
    },
    {
        id: 6,
        title: 'Book design themed CS:GO',
        description: 'Book design themed CS:GO poster',
        image: book,
    },
    {
        id: 7,
        title: 'EPI Workshop Banner',
        description: 'Workshop banner',
        image: workshop,
    },
];

const DesignShowcase = () => {
    const [selectedDesign, setSelectedDesign] = useState<typeof designs[0] | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section id="designs" className="relative py-24 overflow-hidden">
            {/* Background enhancement */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="container px-6 md:px-12 relative z-10">
                {/* Clickable Header Trigger */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8 cursor-pointer group"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
                        Visual Design
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-6">
                        Creative <span className="gradient-text-glow">Posters</span>

                        {/* Creative Toggle Button */}
                        <motion.div
                            animate={{
                                rotate: isExpanded ? [0, -10, 10, 0] : 0,
                                scale: isExpanded ? 1.1 : 1,
                                backgroundColor: isExpanded ? 'rgba(var(--primary), 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                borderColor: isExpanded ? 'rgba(var(--primary), 0.5)' : 'rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className={`p-3 rounded-2xl border backdrop-blur-md transition-colors duration-300 ${isExpanded ? 'text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground'}`}
                        >
                            <Palette className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                        </motion.div>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg group-hover:text-white transition-colors">
                        Tap the palette to {isExpanded ? 'close' : 'open'} the showcase.
                    </p>
                </motion.div>

                {/* Collapsible Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            {/* 3D Coverflow Slider */}
                            <div className="w-full max-w-6xl mx-auto py-8">
                                <Swiper
                                    effect={'coverflow'}
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView={'auto'}
                                    initialSlide={2}
                                    coverflowEffect={{
                                        rotate: 30,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 1,
                                        slideShadows: true,
                                    }}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    pagination={{ clickable: true }}
                                    modules={[EffectCoverflow, Pagination, Autoplay]}
                                    className="w-full py-12"
                                    style={{ paddingBottom: '30px' }}
                                >
                                    {designs.map((design) => (
                                        <SwiperSlide
                                            key={design.id}
                                            className="w-[300px] sm:w-[350px] md:w-[400px] h-[450px] sm:h-[500px] md:h-[600px] bg-black/40 rounded-2xl overflow-hidden glass border border-white/10"
                                        >
                                            <div className="relative w-full h-full group flex items-center justify-center">
                                                <img
                                                    src={design.image}
                                                    alt={design.title}
                                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                                />

                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                    <h3 className="text-xl font-bold text-white mb-1">{design.title}</h3>
                                                    <p className="text-sm text-gray-300 mb-4">{design.description}</p>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent slider expansion toggle
                                                            setSelectedDesign(design);
                                                        }}
                                                        className="self-start flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-xs font-medium uppercase tracking-wider text-white border border-white/20"
                                                    >
                                                        <ZoomIn className="w-3 h-3" />
                                                        View Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Lightbox Modal */}
            {selectedDesign && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedDesign(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden bg-background border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedDesign(null)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full">
                            <div className="md:w-2/3 max-h-[60vh] md:max-h-[85vh] bg-black">
                                <img
                                    src={selectedDesign.image}
                                    alt={selectedDesign.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-center bg-zinc-900/50 backdrop-blur-md">
                                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2">Design Poster</span>
                                <h3 className="text-3xl font-display font-bold mb-4">{selectedDesign.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {selectedDesign.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
};

export default DesignShowcase;
