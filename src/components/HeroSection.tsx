import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import profilePic from '../assets/profile.jpg';

const HeroSection = () => {
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

            <div className="container relative z-10 px-6 md:px-12">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Overline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                            Available for Internship
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <div className="overflow-hidden mb-8">
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="font-display text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight"
                        >
                            <span className="block text-glow">Creative</span>
                        </motion.h1>
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="font-display text-[clamp(3rem,12vw,10rem)] font-bold leading-[0.9] tracking-tight"
                        >
                            <span className="gradient-text-glow">Developer</span>
                        </motion.h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-12"
                    >
                        Crafting immersive digital experiences through code, design, and a relentless pursuit of pixel-perfect excellence.
                    </motion.p>

                    {/* Profile Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1.8 }}
                        className="relative w-40 h-40 mx-auto mb-12 group cursor-pointer"
                    >
                        <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                            style={{
                                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                            }}
                        />
                        <div className="relative w-full h-full rounded-full glass p-2 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                                <img
                                    src={profilePic}
                                    alt="Mohamed Amine Barhoumi"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                                />
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
        </section>
    );
};

export default HeroSection;
