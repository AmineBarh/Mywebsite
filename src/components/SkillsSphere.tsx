import { useState, useRef, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { X, BookOpen } from 'lucide-react';

const skills = [
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

    // Machine Learning
    { name: 'Scikit-learn', category: 'Machine Learning', description: 'Simple and efficient tools for predictive data analysis.', status: 'expert' },
    { name: 'Random Forest', category: 'Machine Learning', description: 'Ensemble learning method for classification and regression.', status: 'learning' },
    { name: 'K-Means', category: 'Machine Learning', description: 'Vector quantization method for cluster analysis.', status: 'expert' },
    { name: 'PCA', category: 'Machine Learning', description: 'Principal Component Analysis for dimensionality reduction.', status: 'learning' },
    { name: 'Régression', category: 'Machine Learning', description: 'Estimating the relationships among variables.', status: 'expert' },
    { name: 'Classification', category: 'Machine Learning', description: 'Identifying to which of a set of categories a new observation belongs.', status: 'expert' },
    { name: 'XGBoost', category: 'Machine Learning', description: 'Optimized distributed gradient boosting library.', status: 'learning' },

    // Visualization
    { name: 'Tableau', category: 'Visualization', description: 'Interactive data visualization software focused on business intelligence.', status: 'expert' },
    { name: 'Power BI', category: 'Visualization', description: 'Interactive data visualization service by Microsoft.', status: 'learning' },
    { name: 'Data Storytelling', category: 'Visualization', description: 'Communicating insights from a dataset using narratives and visualizations.', status: 'expert' },
    { name: 'Dashboards', category: 'Visualization', description: 'visual display of the most important information needed to achieve one or more objectives.', status: 'expert' },
    { name: 'Suivi de KPIs', category: 'Visualization', description: 'Monitoring Key Performance Indicators.', status: 'expert' },

    // Databases
    { name: 'MongoDB', category: 'Database', description: 'Source-available cross-platform document-oriented database program.', status: 'expert' },
    { name: 'MySQL', category: 'Database', description: 'Open-source relational database management system.', status: 'expert' },
    { name: 'Optimisation', category: 'Database', description: 'Optimisation de Requêtes for better performance.', status: 'expert' },
    { name: 'Modélisation', category: 'Database', description: 'Modélisation de Données for efficient storage.', status: 'expert' },

    // Tools
    { name: 'Git/GitHub', category: 'Tools', description: 'Version control system and code hosting platform.', status: 'expert' },
    { name: 'JavaScript', category: 'Language', description: 'High-level, often just-in-time compiled language of the Web.', status: 'expert' },
    { name: 'React', category: 'Frontend', description: 'JavaScript library for building user interfaces.', status: 'expert' },
    { name: 'Node.js', category: 'Backend', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.', status: 'expert' },
    { name: 'Jest', category: 'Testing', description: 'Delightful JavaScript Testing Framework with a focus on simplicity.', status: 'learning' },
    { name: 'AWS', category: 'Cloud', description: 'On-demand cloud computing platforms and APIs.', status: 'expert' },
    { name: 'Docker', category: 'DevOps', description: 'Platform to use OS-level virtualization to deliver software in packages.', status: 'expert' },
    { name: 'Jupyter', category: 'Tools', description: 'Project for interactive computing across all programming languages.', status: 'expert' },
    { name: 'Google Analytics', category: 'Tools', description: 'Web analytics service offered by Google.', status: 'learning' },
];

interface SkillNodeProps {
    skill: typeof skills[0];
    position: [number, number, number];
    onSelect: (skill: typeof skills[0]) => void;
    isModalOpen: boolean;
}

const SkillNode = ({ skill, position, onSelect, isModalOpen }: SkillNodeProps) => {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    const isLearning = skill.status === 'learning';

    // Expert colors: Blue/Indigo (default) -> Purple (hover)
    // Learning colors: Orange (default) -> Red/Pink (hover)
    const baseColor = isLearning ? '#fdba74' : '#6366f1';
    const hoverColor = isLearning ? '#fed7aa' : '#a855f7';
    const emissiveColor = isLearning ? '#fb923c' : '#4f46e5';
    const emissiveHover = isLearning ? '#fdba74' : '#a855f7';

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={position}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onClick={() => onSelect(skill)}
                >
                    <sphereGeometry args={[0.15, 32, 32]} />
                    <meshStandardMaterial
                        color={hovered ? hoverColor : baseColor}
                        emissive={hovered ? emissiveHover : emissiveColor}
                        emissiveIntensity={hovered ? 0.6 : 0.3}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
                <Html
                    position={[0, 0.35, 0]}
                    center
                    distanceFactor={8}
                    style={{ pointerEvents: 'none' }}
                >
                    <span
                        className={`text-xs font-sans whitespace-nowrap transition-all duration-300 ${isLearning
                            ? (hovered ? 'text-orange-200 font-bold' : 'text-orange-300/80')
                            : (hovered ? 'text-white' : 'text-muted-foreground')
                            } ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}
                    >
                        {skill.name} {isLearning && '*'}
                    </span>
                </Html>
            </group>
        </Float>
    );
};

const SkillsCloud = ({ onSelect, isModalOpen }: { onSelect: (skill: typeof skills[0]) => void, isModalOpen: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    const positions = useMemo(() => {
        return skills.map((_, i) => {
            const phi = Math.acos(-1 + (2 * i) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            const radius = 2.8; // Slightly increased radius for more items
            return [
                radius * Math.cos(theta) * Math.sin(phi),
                radius * Math.sin(theta) * Math.sin(phi),
                radius * Math.cos(phi),
            ] as [number, number, number];
        });
    }, []);

    return (
        <group ref={groupRef}>
            {skills.map((skill, i) => (
                <SkillNode
                    key={skill.name}
                    skill={skill}
                    position={positions[i]}
                    onSelect={onSelect}
                    isModalOpen={isModalOpen}
                />
            ))}
            {/* Core glow */}
            <mesh>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial color="#4f46e5" transparent opacity={0.05} />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={1} color="#a855f7" distance={6} />
        </group>
    );
};

const SkillsSphere = () => {
    const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null);

    // Close modal on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (selectedSkill) {
                setSelectedSkill(null);
            }
        };

        if (selectedSkill) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [selectedSkill]);

    return (
        <section id="skills" className="relative min-h-screen py-24">
            {/* Section Header */}
            <div className="container px-6 md:px-12 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
                        Expertise
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                        The <span className="gradient-text-glow">Constellation</span> of Skills
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Explore the universe of technologies I work with.
                        <br />
                        <span className="text-orange-500 text-sm mt-2 block">* Orange stars are skills I am currently learning</span>
                    </p>
                </motion.div>
            </div>

            {/* 3D Canvas */}
            <div className="relative h-[600px] md:h-[700px]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="absolute w-[550px] h-[550px] rounded-full animate-pulse-glow"
                        style={{
                            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
                        }}
                    />
                </div>

                <Canvas
                    camera={{ position: [0, 0, 7], fov: 50 }}
                    style={{ background: 'transparent' }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.3} />
                        <pointLight position={[10, 10, 10]} intensity={0.5} />
                        <SkillsCloud onSelect={setSelectedSkill} isModalOpen={!!selectedSkill} />
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* Skill Detail Modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                        onClick={() => setSelectedSkill(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative glass rounded-2xl p-8 max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* HUD-style border */}
                            <div className={`absolute inset-0 rounded-2xl border pointer-events-none ${selectedSkill.status === 'learning' ? 'border-orange-300/30' : 'border-primary/20'
                                }`} />
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent to-transparent ${selectedSkill.status === 'learning' ? 'via-orange-300' : 'via-primary'
                                }`} />

                            <button
                                onClick={() => setSelectedSkill(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center relative z-10">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-[0.15em] uppercase mb-4 ${selectedSkill.status === 'learning'
                                    ? 'bg-orange-300/10 text-orange-300'
                                    : 'bg-primary/10 text-primary'
                                    }`}>
                                    {selectedSkill.category}
                                </span>
                                <h3 className="font-display text-3xl font-bold mb-4">{selectedSkill.name}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {selectedSkill.description}
                                </p>

                                {selectedSkill.status === 'learning' && (
                                    <div className="mt-6 flex items-center justify-center gap-2 text-orange-200 bg-orange-300/5 p-3 rounded-lg border border-orange-300/10">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-sm font-medium">Learning it, not yet a skill of mine</span>
                                    </div>
                                )}
                            </div>

                            {/* Background decoration for learning items */}
                            {selectedSkill.status === 'learning' && (
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-300/10 rounded-full blur-2xl" />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default SkillsSphere;
