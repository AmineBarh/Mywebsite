import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { gsap, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/ui-kit/SectionLabel';
import BoxButton from '@/components/ui-kit/BoxButton';

type FormData = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof FormData, string>>;

const validate = (data: FormData): Errors => {
    const errors: Errors = {};
    if (data.name.trim().length < 2) errors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
    if (data.message.trim().length < 10) errors.message = 'Please write at least a short sentence.';
    return errors;
};

const fieldClass = (hasError: boolean) =>
    `w-full border-b bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground ${hasError ? 'border-destructive' : 'border-border'
    }`;

const labelClass = 'font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground';

const ContactSection = () => {
    const rootRef = useRef<HTMLElement>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useReveal(rootRef);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from('[data-line]', {
                    yPercent: 108,
                    duration: 1.3,
                    stagger: 0.12,
                    ease: EASE_OUT,
                    scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', once: true },
                });
            });
            return () => mm.revert();
        },
        { scope: rootRef },
    );

    const update = (key: keyof FormData, value: string) => {
        const next = { ...formData, [key]: value };
        setFormData(next);
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: validate(next)[key] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const found = validate(formData);
        setErrors(found);
        if (Object.keys(found).length) return;

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
        <section ref={rootRef} id="contact" className="relative z-[1] pt-28 md:pt-40">
            <div className="page-shell">
                <h2 data-statement aria-label="let’s work together." className="type-heavy text-[clamp(4.5rem,14vw,16rem)]">
                    {['let’s work', 'together.'].map((line) => (
                        <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.06em] pt-[0.04em]">
                            <span data-line className="block whitespace-nowrap">
                                {line}
                            </span>
                        </span>
                    ))}
                </h2>

                <p data-reveal className="mt-10 max-w-[54ch] text-lg leading-snug text-muted-foreground md:text-xl">
                    Looking for a dedicated final year engineering intern? Let's discuss how I can bring value to your team. Actively seeking a 6-month final year internship (PFE) starting February 2027.
                </p>

                <div className="mt-24 grid gap-16 md:mt-32 lg:grid-cols-12 lg:gap-12">
                    {/* Form */}
                    <div className="lg:col-span-7">
                        <SectionLabel label="Get in touch" />
                        <form data-reveal onSubmit={handleSubmit} noValidate className="mt-10 space-y-9">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className={labelClass}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => update('name', e.target.value)}
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                    className={fieldClass(!!errors.name)}
                                    placeholder="Your full name"
                                />
                                {errors.name && (
                                    <p id="name-error" className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className={labelClass}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    className={fieldClass(!!errors.email)}
                                    placeholder="you@company.com"
                                />
                                {errors.email && (
                                    <p id="email-error" className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className={labelClass}>
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => update('message', e.target.value)}
                                    rows={4}
                                    aria-invalid={!!errors.message}
                                    aria-describedby={errors.message ? 'message-error' : undefined}
                                    className={`${fieldClass(!!errors.message)} resize-none`}
                                    placeholder="Tell me about the opportunity"
                                />
                                {errors.message && (
                                    <p id="message-error" className="text-sm text-destructive">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <BoxButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending' : 'Send message'}
                            </BoxButton>
                        </form>
                    </div>

                    {/* Details */}
                    <aside className="lg:col-span-4 lg:col-start-9">
                        <SectionLabel label="Details" />
                        <dl>
                            <div data-reveal className="border-b border-border py-6">
                                <dt className={labelClass}>Email</dt>
                                <dd className="mt-2">
                                    <a href="mailto:mohamed.amine.barhoumi.eng@gmail.com" className="break-all text-lg underline-offset-4 hover:text-primary hover:underline">
                                        mohamed.amine.barhoumi.eng@gmail.com
                                    </a>
                                </dd>
                            </div>
                            <div data-reveal className="border-b border-border py-6">
                                <dt className={labelClass}>Location</dt>
                                <dd className="mt-2 text-lg">Paris, France</dd>
                            </div>
                            <div data-reveal className="border-b border-border py-6">
                                <dt className={labelClass}>Elsewhere</dt>
                                <dd className="mt-3 flex flex-col">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between border-t border-border py-3 first:border-t-0 hover:text-primary"
                                        >
                                            {link.name}
                                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.25} />
                                        </a>
                                    ))}
                                </dd>
                            </div>
                            <div data-reveal className="py-6">
                                <dt className={`${labelClass} flex items-center gap-2`}>
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-primary" style={{ animation: 'status-pulse 2.4s ease-in-out infinite' }} />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                    </span>
                                    Currently available
                                </dt>
                                <dd className="mt-3 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                                    Actively seeking a 6-month Final Year Internship (PFE) starting February 2027. Based in Paris, France. Response time: within 24 hours.
                                </dd>
                            </div>
                        </dl>
                    </aside>
                </div>
            </div>

            <footer className="mt-28 overflow-hidden md:mt-40">
                <div className="page-shell flex flex-col items-start justify-between gap-2 border-t border-border py-5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground md:flex-row md:items-center">
                    <p>© {new Date().getFullYear()} Mohamed Amine Barhoumi</p>
                    <p>Built with React, GSAP and Tailwind</p>
                </div>
                <p aria-hidden="true" className="type-cond select-none whitespace-nowrap px-5 text-center text-[min(34vw,60dvh)] leading-[0.74] md:px-6" style={{ ['--w' as string]: 100 }}>
                    BARHOUMI
                </p>
            </footer>
        </section>
    );
};

export default ContactSection;
