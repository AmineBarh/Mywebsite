import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';

const stack = ['PyTorch', 'YOLO11', 'U-Net', 'ONNX', 'ESP32', 'LoRa', 'MQTT', 'React Native', 'Node.js', 'Docker'];

/** One line of oversized type that travels sideways as the page scrolls past. */
const StackMarquee = () => {
    const rootRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.fromTo(
                    trackRef.current,
                    { xPercent: 0 },
                    {
                        xPercent: -50,
                        ease: 'none',
                        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
                    },
                );
            });
            return () => mm.revert();
        },
        { scope: rootRef },
    );

    const row = stack.map((item) => (
        <span key={item} className="flex items-center gap-[0.35em] pr-[0.35em]">
            {item}
            <span className="text-[0.3em] text-primary" aria-hidden="true">
                +
            </span>
        </span>
    ));

    return (
        <section ref={rootRef} aria-label="Technologies I work with" className="relative z-[1] overflow-hidden border-y border-border py-10 md:py-16">
            <div ref={trackRef} className="type-heavy flex w-max whitespace-nowrap text-[clamp(5rem,15vw,16rem)] uppercase">
                <div className="flex">{row}</div>
                <div className="flex" aria-hidden="true">
                    {row}
                </div>
            </div>
        </section>
    );
};

export default StackMarquee;
