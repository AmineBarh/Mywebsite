import type Lenis from 'lenis';

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
    instance = lenis;
};

export const getLenis = () => instance;

/** Smooth-scroll to a section id (without '#'), falling back to native scrolling. */
export const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (instance) {
        instance.scrollTo(el, { offset: id === 'hero' ? 0 : -64, duration: 1.4 });
    } else {
        el.scrollIntoView({ behavior: 'smooth' });
    }
};
