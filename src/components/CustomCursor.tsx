import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const moveCursor = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    }, [cursorX, cursorY]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setIsVisible(true);
            moveCursor(e);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Track hoverable elements
        const handleElementHover = () => setIsHovering(true);
        const handleElementLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        // Add hover listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, [data-magnetic]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleElementHover);
            el.addEventListener('mouseleave', handleElementLeave);
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleElementHover);
                el.removeEventListener('mouseleave', handleElementLeave);
            });
        };
    }, [moveCursor]);

    // Re-attach listeners when DOM changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const handleElementHover = () => setIsHovering(true);
            const handleElementLeave = () => setIsHovering(false);

            const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, [data-magnetic]');
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleElementHover);
                el.removeEventListener('mouseleave', handleElementLeave);
                el.addEventListener('mouseenter', handleElementHover);
                el.addEventListener('mouseleave', handleElementLeave);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                    animate={{
                        width: isHovering ? 60 : 12,
                        height: isHovering ? 60 : 12,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
            </motion.div>

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/30"
                    animate={{
                        width: isHovering ? 80 : 40,
                        height: isHovering ? 80 : 40,
                        opacity: isVisible ? 0.5 : 0,
                    }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                />
            </motion.div>
        </>
    );
};

export default CustomCursor;
