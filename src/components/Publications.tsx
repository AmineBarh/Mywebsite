import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';
import BoxButton from '@/components/ui-kit/BoxButton';

const publications = [
    {
        id: 3,
        title: "Our bee comb detector hit a ceiling. The model was fine. The labels weren't.",
        description: "Why a cell detector for beehive frames stopped improving: the public dataset's annotations cover only a small share of the cells really present, so the labels, not the model, set the limit. Written after my BeeSafe internship.",
        link: "https://medamine-barhoumi.medium.com/our-bee-comb-detector-hit-a-ceiling-the-model-was-fine-the-labels-werent-1c5a745697db",
        tags: ["U-Net", "Computer Vision", "Data quality", "BeeSafe"],
        context: "Internship at BeeSafe",
        date: "2026"
    },
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

const lines = ['liked the work?', 'there’s more.'];

/** Off-white band: heavy black statement, then the articles as ruled rows. */
const Publications = () => {
    const rootRef = useRef<HTMLElement>(null);
    useReveal(rootRef);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from('[data-line]', {
                    yPercent: 108,
                    duration: 1.2,
                    stagger: 0.12,
                    ease: EASE_OUT,
                    scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', once: true },
                });
            });
            return () => mm.revert();
        },
        { scope: rootRef },
    );

    return (
        <section ref={rootRef} id="publications" className="band-paper pb-24 pt-24 md:pb-32 md:pt-36">
            <div className="page-shell">
                <h2 data-statement aria-label="liked the work? there’s more." className="type-heavy text-[clamp(3.75rem,11.4vw,13rem)] text-ink">
                    {lines.map((line) => (
                        <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.06em] pt-[0.04em]">
                            <span data-line className="block whitespace-nowrap">
                                {line}
                            </span>
                        </span>
                    ))}
                </h2>

                <div className="mt-14 flex flex-col justify-between gap-8 md:mt-20 md:flex-row md:items-end">
                    <p data-reveal className="max-w-[34ch] text-lg leading-snug md:text-xl">
                        Technical articles on Medium, written after my internships. I write about IoT security and engineering workflow.
                    </p>
                    <div data-reveal>
                        <BoxButton tone="light" href="https://medamine-barhoumi.medium.com/">
                            Visit my Medium
                        </BoxButton>
                    </div>
                </div>

                <ul className="mt-20 border-t border-ink/20 md:mt-28">
                    {publications.map((pub) => (
                        <li key={pub.id} data-reveal className="border-b border-ink/20">
                            <a
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group grid gap-x-10 gap-y-4 py-9 md:grid-cols-[6rem_1fr_auto]"
                            >
                                <span className="font-mono text-[11px] text-ink/50">{pub.date}</span>
                                <span>
                                    <span className="block max-w-[34ch] text-2xl font-light leading-tight tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                                        {pub.title}
                                    </span>
                                    <span className="mt-4 block max-w-[60ch] text-sm leading-relaxed text-ink/70">{pub.description}</span>
                                    <span className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/60">
                                        <span className="text-ink">{pub.context}</span>
                                        {pub.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </span>
                                </span>
                                <span className="inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.06em] md:pt-1">
                                    Read article
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.25} />
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Publications;
