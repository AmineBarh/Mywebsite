import { useEffect } from 'react';

/**
 * Deters casual saving of images: no right-click menu or dragging on pictures.
 * This is a deterrent only. Anything a browser can display can still be captured
 * with a screenshot or the network panel; it cannot be made truly secure.
 */
export const useImageProtection = () => {
    useEffect(() => {
        const isMedia = (t: EventTarget | null) => t instanceof Element && !!t.closest('img, canvas, picture, video');
        const block = (e: Event) => {
            if (isMedia(e.target)) e.preventDefault();
        };
        document.addEventListener('contextmenu', block, true);
        document.addEventListener('dragstart', block, true);
        return () => {
            document.removeEventListener('contextmenu', block, true);
            document.removeEventListener('dragstart', block, true);
        };
    }, []);
};
