import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = ['hero', 'skills', 'projects', 'contact'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 200 && rect.bottom >= 200) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'
                }`}
        >
            <nav className="container mx-auto px-6 md:px-12">
                <div className={`glass rounded-full px-2 py-2 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'max-w-2xl mx-auto' : 'max-w-4xl mx-auto'
                    }`}>
                    {/* Logo */}
                    <motion.a
                        href="#hero"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('#hero');
                        }}
                        className="px-4 py-2 font-display text-lg font-semibold tracking-wide"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-magnetic
                    >
                        {/* M.A.<span className="text-primary">B.</span> */}
                    </motion.a>

                    {/* Nav Items */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <motion.button
                                key={item.label}
                                onClick={() => scrollToSection(item.href)}
                                className={`relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${activeSection === item.href.slice(1)
                                    ? 'text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                data-magnetic
                            >
                                {item.label}
                                <AnimatePresence>
                                    {activeSection === item.href.slice(1) && (
                                        <motion.span
                                            layoutId="activeNav"
                                            className="absolute inset-0 rounded-full bg-secondary -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: 'spring', duration: 0.5 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('#contact');
                        }}
                        className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide uppercase transition-all hover:shadow-lg hover:shadow-primary/25"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-magnetic
                    >
                        Let's Talk
                    </motion.a>
                </div>
            </nav>
        </motion.header>
    );
};

export default Navigation;
