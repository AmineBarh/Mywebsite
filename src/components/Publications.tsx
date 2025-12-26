import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowUpRight, ChevronDown } from 'lucide-react';

const publications = [
    {
        id: 1,
        title: "Secure MQTT Communication with ESP32: AES Encryption & Decryption (Step-by-Step)",
        description: "A comprehensive guide on implementing secure MQTT communication using AES encryption on ESP32 microcontrollers. Written following my internship at C2I.",
        link: "https://medium.com/@medamine-barhoumi/secure-mqtt-communication-with-esp32-aes-encryption-decryption-step-by-step-7842b0d5499f",
        tags: ["IoT", "Security", "ESP32", "AES"],
        context: "Internship at C2I",
        date: "2022"
    },
    {
        id: 2,
        title: "Understanding Git and Different Workflow Types",
        description: "An in-depth exploration of Git version control and various workflow strategies for effective team collaboration. Insights gained from my internship at BIOMEDIQA.",
        link: "https://medium.com/@medamine-barhoumi/git-and-understanding-workflow-types-c113fce22761",
        tags: ["Git", "DevOps", "Workflow"],
        context: "Internship at BIOMEDIQA",
        date: "2025"
    }
];

const Publications = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section id="publications" className="relative py-24 overflow-hidden">
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
                        Writing & Thoughts
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-6">
                        Selected <span className="gradient-text-glow">Publications</span>

                        <motion.div
                            animate={{
                                rotate: isExpanded ? 180 : 0,
                                scale: isExpanded ? 1.1 : 1,
                                backgroundColor: isExpanded ? 'rgba(var(--primary), 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                borderColor: isExpanded ? 'rgba(var(--primary), 0.5)' : 'rgba(255, 255, 255, 0.1)'
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className={`p-3 rounded-2xl border backdrop-blur-md transition-colors duration-300 ${isExpanded ? 'text-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-muted-foreground'}`}
                        >
                            <ChevronDown className="w-8 h-8 md:w-10 md:h-10" />
                        </motion.div>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg group-hover:text-white transition-colors">
                        Tap to {isExpanded ? 'collapse' : 'expand'} my technical articles.
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto py-8">
                                {publications.map((pub, index) => (
                                    <motion.div
                                        key={pub.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] hover:-translate-y-1"
                                    >
                                        <div className="absolute top-8 right-8 text-primary/20 group-hover:text-primary transition-colors duration-300">
                                            <BookOpen className="w-12 h-12" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                                                    Medium
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-white/5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                                                    {pub.context}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                                {pub.title}
                                            </h3>

                                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                                {pub.description}
                                            </p>

                                            <a
                                                href={pub.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-primary transition-colors group/link"
                                            >
                                                Read Article
                                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                            </a>
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Publications;
