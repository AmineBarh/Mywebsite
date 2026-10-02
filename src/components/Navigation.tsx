import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';
import { scrollToId } from '@/lib/lenis';

const menuItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Designs', id: 'designs' },
    { label: 'Publications', id: 'publications' },
    { label: 'Experience', id: 'experience' },
    { label: 'Contact', id: 'contact' },
];

interface NavigationProps {
    onAbout: () => void;
}

const linkClass = 'font-mono text-[11px] uppercase tracking-[0.08em] transition-opacity hover:opacity-60';

const Navigation = ({ onAbout }: NavigationProps) => {
    const rootRef = useRef<HTMLElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from(rootRef.current!.querySelectorAll('[data-nav-in]'), {
                    autoAlpha: 0,
                    y: -14,
                    duration: 0.9,
                    stagger: 0.07,
                    delay: 0.3,
                    ease: EASE_OUT,
                });
            });
            return () => mm.revert();
        },
        { scope: rootRef },
    );

    // Overlay open / close
    useEffect(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const items = overlay.querySelectorAll('[data-menu-item]');
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
            gsap.set(overlay, { display: 'flex' });
            gsap.fromTo(overlay, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' });
            gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.05, delay: 0.25, ease: 'expo.out' });
        } else {
            document.body.style.overflow = '';
            gsap.to(overlay, {
                clipPath: 'inset(0% 0% 100% 0%)',
                duration: 0.5,
                ease: 'expo.inOut',
                onComplete: () => void gsap.set(overlay, { display: 'none' }),
            });
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const go = (id: string) => {
        const wasOpen = menuOpen;
        setMenuOpen(false);
        // let the overlay start closing so scrolling is unlocked first
        window.setTimeout(() => scrollToId(id), wasOpen ? 350 : 0);
    };

    return (
        <>
            <header ref={rootRef} className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 text-foreground">
                <nav className="grid h-[50px] grid-cols-[1fr_auto_1fr] items-center px-5 md:grid-cols-[1fr_1fr_auto_1fr_1fr] md:px-6" aria-label="Primary">
                    <a
                        data-nav-in
                        href="#hero"
                        onClick={(e) => {
                            e.preventDefault();
                            go('hero');
                        }}
                        aria-label="Mohamed Amine Barhoumi, home"
                        className="flex items-center gap-2 font-heavy text-xl leading-none"
                    >
                        <span>M</span>
                        <span className="h-px w-8 bg-foreground/60" aria-hidden="true" />
                        <span>B</span>
                    </a>

                    <a
                        data-nav-in
                        href="#projects"
                        onClick={(e) => {
                            e.preventDefault();
                            go('projects');
                        }}
                        className={`hidden md:block md:justify-self-center ${linkClass}`}
                    >
                        Projects
                    </a>

                    <button
                        data-nav-in
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="press relative grid h-8 w-8 place-items-center justify-self-center border border-foreground/30"
                    >
                        <span className={`h-3.5 w-3.5 rounded-full border border-foreground transition-transform duration-500 ${menuOpen ? 'scale-50 bg-foreground' : ''}`} />
                        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    </button>

                    <a
                        data-nav-in
                        href="#skills"
                        onClick={(e) => {
                            e.preventDefault();
                            go('skills');
                        }}
                        className={`hidden md:block md:justify-self-center ${linkClass}`}
                    >
                        Skills
                    </a>

                    <a
                        data-nav-in
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            go('contact');
                        }}
                        className={`justify-self-end ${linkClass}`}
                    >
                        Contact
                    </a>
                </nav>
            </header>

            {/* Full-screen menu */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-40 flex-col justify-between bg-background px-5 pb-8 pt-24 text-foreground md:px-6"
                style={{ display: 'none' }}
                data-lenis-prevent="true"
            >
                <ul className="flex flex-col">
                    {menuItems.map((item, i) => (
                        <li key={item.id} className="overflow-hidden border-b border-border">
                            <a
                                data-menu-item
                                href={`#${item.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    go(item.id);
                                }}
                                className="group flex items-baseline gap-4 py-2 md:py-3"
                            >
                                <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                                <span className="type-heavy text-[clamp(2.5rem,7.5vw,6rem)] transition-transform duration-500 group-hover:translate-x-3">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    <button
                        type="button"
                        onClick={() => {
                            setMenuOpen(false);
                            window.setTimeout(onAbout, 300);
                        }}
                        className="text-foreground underline underline-offset-4"
                    >
                        About me
                    </button>
                    <span>Paris, France</span>
                </div>
            </div>
        </>
    );
};

export default Navigation;
