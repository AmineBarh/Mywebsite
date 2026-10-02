import { useRef, useState, type ReactNode } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE_OUT } from '@/lib/gsap';
import { useReveal } from '@/hooks/useReveal';
import SectionLabel from '@/components/ui-kit/SectionLabel';

interface Skill {
    name: string;
    category: string;
    description: string;
    status: 'expert' | 'learning';
}

const skills: Skill[] = [
    // Data Analysis
    { name: 'Python', category: 'Data Analysis', description: 'Versatile language for automation, AI, and data analysis.', status: 'expert' },
    { name: 'R', category: 'Data Analysis', description: 'Language and environment for statistical computing and graphics.', status: 'expert' },
    { name: 'SQL', category: 'Data Analysis', description: 'Managing and manipulating databases (MySQL, PostgreSQL).', status: 'expert' },
    { name: 'Pandas', category: 'Data Analysis', description: 'Powerful data structures for data analysis and manipulation.', status: 'expert' },
    { name: 'NumPy', category: 'Data Analysis', description: 'Fundamental package for scientific computing with Python.', status: 'expert' },
    { name: 'Analyse Statistique', category: 'Data Analysis', description: 'Applying statistical methods to collect and analyze data.', status: 'expert' },
    { name: 'Nettoyage de Données', category: 'Data Analysis', description: 'Process of fixing or removing incorrect, corrupted, or incomplete data.', status: 'expert' },
    { name: 'ETL', category: 'Data Analysis', description: 'Extract, Transform, Load data integration processes.', status: 'learning' },
    { name: 'Analyse Exploratoire', category: 'Data Analysis', description: 'Analyzing datasets to summarize their main characteristics.', status: 'expert' },
    { name: 'Excel', category: 'Data Analysis', description: 'Advanced spreadsheet data organization and analysis.', status: 'learning' },

    // Machine Learning & Deep Learning
    { name: 'PyTorch', category: 'Machine Learning', description: 'Deep learning framework for training neural networks and computer vision models.', status: 'expert' },
    { name: 'Scikit-learn', category: 'Machine Learning', description: 'Simple and efficient tools for predictive data analysis.', status: 'expert' },
    { name: 'Random Forest', category: 'Machine Learning', description: 'Ensemble learning method for classification and regression.', status: 'expert' },
    { name: 'YOLO11', category: 'Machine Learning', description: 'State-of-the-art computer vision models for real-time object detection.', status: 'expert' },
    { name: 'Computer Vision', category: 'Machine Learning', description: 'Image analysis, cell segmentation, heatmap localization, and classification.', status: 'expert' },
    { name: 'U-Net', category: 'Machine Learning', description: 'Convolutional neural network for dense feature extraction and heatmap generation.', status: 'expert' },
    { name: 'K-Means', category: 'Machine Learning', description: 'Vector quantization method for cluster analysis.', status: 'expert' },
    { name: 'PCA', category: 'Machine Learning', description: 'Principal Component Analysis for dimensionality reduction.', status: 'expert' },
    { name: 'Régression', category: 'Machine Learning', description: 'Estimating the relationships among variables.', status: 'expert' },
    { name: 'Classification', category: 'Machine Learning', description: 'Identifying to which of a set of categories a new observation belongs.', status: 'expert' },
    { name: 'XGBoost', category: 'Machine Learning', description: 'Optimized distributed gradient boosting library.', status: 'expert' },

    // IoT & Embedded Systems
    { name: 'ESP32', category: 'IoT & Embedded', description: 'Low-power microcontroller with Wi-Fi & Bluetooth for edge sensing.', status: 'expert' },
    { name: 'LoRa', category: 'IoT & Embedded', description: 'Long-range low-power radio communication protocol for remote telemetry.', status: 'expert' },
    { name: 'MQTT', category: 'IoT & Embedded', description: 'Lightweight publish/subscribe messaging protocol for IoT systems.', status: 'expert' },
    { name: 'ONNX Runtime', category: 'Tools', description: 'Cross-platform accelerator for high-performance embedded AI inference.', status: 'expert' },

    // Visualization
    { name: 'Tableau', category: 'Visualization', description: 'Interactive data visualization software focused on business intelligence.', status: 'expert' },
    { name: 'Power BI', category: 'Visualization', description: 'Interactive data visualization service by Microsoft.', status: 'learning' },
    { name: 'Data Storytelling', category: 'Visualization', description: 'Communicating insights from a dataset using narratives and visualizations.', status: 'expert' },
    { name: 'Dashboards', category: 'Visualization', description: 'Visual display of the most important information needed to achieve objectives.', status: 'expert' },
    { name: 'Suivi de KPIs', category: 'Visualization', description: 'Monitoring Key Performance Indicators.', status: 'expert' },

    // Databases
    { name: 'MongoDB', category: 'Database', description: 'Source-available cross-platform document-oriented database program.', status: 'expert' },
    { name: 'MySQL', category: 'Database', description: 'Open-source relational database management system.', status: 'expert' },
    { name: 'Optimisation', category: 'Database', description: 'Optimisation de Requêtes for better performance.', status: 'expert' },
    { name: 'Modélisation', category: 'Database', description: 'Modélisation de Données for efficient storage.', status: 'expert' },

    // Mobile & Web
    { name: 'React Native', category: 'Frontend', description: 'Framework for building native mobile applications using React.', status: 'expert' },
    { name: 'Expo', category: 'Frontend', description: 'Ecosystem for universal native React application development and native builds.', status: 'expert' },
    { name: 'React', category: 'Frontend', description: 'JavaScript library for building user interfaces.', status: 'expert' },
    { name: 'JavaScript', category: 'Language', description: 'High-level, dynamic language of modern web development.', status: 'expert' },
    { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.', status: 'expert' },

    // Tools & DevOps
    { name: 'Docker', category: 'DevOps', description: 'Platform to containerize applications and manage multi-service architectures.', status: 'expert' },
    { name: 'Git/GitHub', category: 'Tools', description: 'Version control system and code hosting platform.', status: 'expert' },
    { name: 'AWS', category: 'Cloud', description: 'On-demand cloud computing platforms and services.', status: 'expert' },
    { name: 'Jupyter', category: 'Tools', description: 'Interactive computing environment for data science and machine learning.', status: 'expert' },
    { name: 'Jest', category: 'Testing', description: 'JavaScript testing framework with a focus on simplicity.', status: 'learning' },
    { name: 'Google Analytics', category: 'Tools', description: 'Web analytics service offered by Google.', status: 'learning' },
];

/** Raw categories grouped into six readable clusters. Order here is display order. */
const clusters: { title: string; categories: string[]; names?: string[] }[] = [
    { title: 'AI & Computer Vision', categories: ['Machine Learning'], names: ['ONNX Runtime'] },
    { title: 'IoT & Embedded', categories: ['IoT & Embedded'] },
    { title: 'Software', categories: ['Frontend', 'Language', 'Backend'] },
    { title: 'Data & Analytics', categories: ['Data Analysis', 'Visualization'] },
    { title: 'Databases', categories: ['Database'] },
    { title: 'Infrastructure & Tooling', categories: ['DevOps', 'Cloud', 'Tools', 'Testing'] },
];

const grouped = clusters.map((cluster) => ({
    title: cluster.title,
    items: skills.filter(
        (s) => cluster.names?.includes(s.name) || (cluster.categories.includes(s.category) && !clusters.some((c) => c !== cluster && c.names?.includes(s.name))),
    ),
}));

const defaultSkill = skills.find((s) => s.name === 'YOLO11') ?? skills[0];

const stroke = { stroke: 'currentColor', strokeWidth: 1.25, fill: 'none' } as const;
const icons: ReactNode[] = [
    <svg key="a" viewBox="0 0 24 24" className="h-6 w-6" {...stroke}><rect x="4" y="4" width="16" height="16" /></svg>,
    <svg key="b" viewBox="0 0 24 24" className="h-6 w-6" {...stroke}><path d="M12 2l10 10-10 10L2 12z" /></svg>,
    <svg key="c" viewBox="0 0 24 24" className="h-6 w-6" {...stroke}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /></svg>,
    <svg key="d" viewBox="0 0 24 24" className="h-6 w-6" {...stroke}><path d="M7 5h15l-5 14H2z" /></svg>,
    <svg key="e" viewBox="0 0 24 24" className="h-6 w-6" {...stroke}><path d="M12 3l10 18H2z" /></svg>,
    <svg key="f" viewBox="0 0 24 24" className="h-6 w-6" {...stroke}><path d="M12 2v20M2 12h20" /></svg>,
];

const SkillsSection = () => {
    const rootRef = useRef<HTMLElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<Skill>(defaultSkill);

    useReveal(rootRef);

    // Swap detail text with a short rise so the change reads as feedback, not a jump
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.fromTo(panelRef.current!.querySelectorAll('[data-swap]'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: EASE_OUT });
            });
        },
        { scope: panelRef, dependencies: [active.name] },
    );

    return (
        <section ref={rootRef} id="skills" className="relative z-[1] pb-28 md:pb-40">
            <div className="page-shell">
                <SectionLabel label="Skills" meta="Hover or tap a skill for details" />
                <h2 className="sr-only">Skills</h2>

                <div className="grid md:grid-cols-3">
                    {grouped.map((group, i) => (
                        <div
                            key={group.title}
                            data-reveal
                            className="border-b border-border py-9 md:px-6 md:[&:nth-child(3n+1)]:pl-0 md:[&:not(:nth-child(3n+1))]:border-l"
                        >
                            <span className="text-foreground">{icons[i % icons.length]}</span>
                            <h3 className="mt-16 text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.02] tracking-[-0.035em] md:mt-24">{group.title}</h3>
                            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
                                {group.items.map((skill) => {
                                    const isActive = active.name === skill.name;
                                    return (
                                        <li key={skill.name}>
                                            <button
                                                type="button"
                                                onMouseEnter={() => setActive(skill)}
                                                onFocus={() => setActive(skill)}
                                                onClick={() => setActive(skill)}
                                                aria-pressed={isActive}
                                                className={`transition-colors ${isActive ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                {skill.name}
                                                {skill.status === 'learning' && <span className="ml-1 inline-block h-1 w-1 rounded-full bg-primary align-middle" aria-label="learning" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Detail bar */}
                <div ref={panelRef} aria-live="polite" className="grid gap-3 border-b border-border py-8 md:grid-cols-12 md:items-baseline">
                    <p data-swap className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground md:col-span-3">
                        {active.category}
                        {active.status === 'learning' && <span className="ml-3 text-primary">Learning</span>}
                    </p>
                    <p data-swap className="text-3xl font-light tracking-[-0.035em] md:col-span-3">
                        {active.name}
                    </p>
                    <p data-swap className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground md:col-span-5">
                        {active.description}
                        {active.status === 'learning' && ' Learning it, not yet a skill of mine.'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;
