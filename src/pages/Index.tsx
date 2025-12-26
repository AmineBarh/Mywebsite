import { useEffect } from 'react';
import FilmGrain from '@/components/FilmGrain';
import Aurora from '@/components/Aurora';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import SkillsSphere from '@/components/SkillsSphere';
import ProjectsGallery from '@/components/ProjectsGallery';
import DesignShowcase from '@/components/DesignShowcase';
import Publications from '@/components/Publications';
import ContactSection from '@/components/ContactSection';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const Index = () => {
    useSmoothScroll();

    useEffect(() => {
        // Reveal animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Background effects */}
            <Aurora />
            <FilmGrain />

            {/* Custom cursor (hidden on mobile) */}
            <div className="hidden md:block">
                <CustomCursor />
            </div>

            {/* Navigation */}
            <Navigation />

            {/* Main content */}
            <main>
                <HeroSection />
                <SkillsSphere />
                <ProjectsGallery />
                <DesignShowcase />
                <Publications />
                <ContactSection />
            </main>
        </div>
    );
};

export default Index;
