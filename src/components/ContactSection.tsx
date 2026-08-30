import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Replace these with your actual EmailJS credentials
        // Get these from your EmailJS dashboard: https://dashboard.emailjs.com/admin
        const serviceId = 'service_c9zh4m4';
        const templateId = 'template_cbl6etd';
        const publicKey = '3hPUSBblupmxQk9Wg';

        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            toast.success('Message sent successfully!', {
                description: 'I\'ll get back to you as soon as possible.',
            });

            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('EmailJS Error:', error);
            toast.error('Failed to send message', {
                description: 'Please try again later or email me directly.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const socialLinks = [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mohamed-amine-b-engineer' },
        { name: 'GitHub', url: 'https://github.com/AmineBarh' },
        { name: 'Medium', url: 'https://medamine-barhoumi.medium.com/' },
    ];

    return (
        <section id="contact" className="relative py-24 md:py-32">
            <div className="container px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
                            Get In Touch
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            Let's Create
                            <br />
                            <span className="gradient-text-glow">Something Amazing</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                            Looking for a dedicated final year engineering intern? Let's discuss how I can bring value to your team. Actively seeking a 6-month final year internship (PFE) starting February 2027.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium tracking-wider uppercase text-muted-foreground mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-lg"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium tracking-wider uppercase text-muted-foreground mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-lg"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium tracking-wider uppercase text-muted-foreground mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-0 py-4 bg-transparent border-b border-border focus:border-primary outline-none transition-colors text-lg resize-none"
                                        placeholder="Tell me about the opportunity..."
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-medium text-lg hover:opacity-90 transition-all disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    data-magnetic
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-12"
                        >
                            {/* Info Cards */}
                            <div className="space-y-6">
                                <div className="glass rounded-2xl p-6 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Email</h4>
                                        <a href="mailto:mohamed.amine.barhoumi.eng@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                                            mohamed.amine.barhoumi.eng@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-6 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-accent/10">
                                        <MapPin className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Location</h4>
                                        <p className="text-muted-foreground">Paris, France</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h4 className="text-sm font-medium tracking-wider uppercase text-muted-foreground mb-4">
                                    Connect
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {socialLinks.map((link) => (
                                        <motion.a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-secondary transition-colors text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            data-magnetic
                                        >
                                            {link.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="glass rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-medium">Currently Available</span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Actively seeking a 6-month Final Year Internship (PFE) starting February 2027. Based in Paris, France. Response time: within 24 hours.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="container px-6 md:px-12 mt-24 pt-8 border-t border-border"
            >
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© 2025 Mohamed Amine Barhoumi. All rights reserved.</p>
                    <p>Vibe coded with passion & precision</p>
                </div>
            </motion.footer>
        </section>
    );
};

export default ContactSection;
