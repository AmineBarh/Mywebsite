const TILE = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><text x="110" y="116" text-anchor="middle" transform="rotate(-28 110 110)" font-family="ui-monospace,Menlo,monospace" font-size="13" letter-spacing="2" fill="white" fill-opacity="0.34" stroke="black" stroke-opacity="0.18" stroke-width="0.7" paint-order="stroke">© BARHOUMI</text></svg>`,
);

interface WatermarkProps {
    /** Repeating diagonal pattern across the whole picture (default on) */
    tile?: boolean;
    /** The small credit in the corner (default on) */
    corner?: boolean;
}

/**
 * A responsive credit laid over a picture. The parent must be `relative`. The tile size and the
 * corner text scale with the screen, and nothing here can be clicked, so it never blocks the image.
 */
const Watermark = ({ tile = true, corner = true }: WatermarkProps) => (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {tile && <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `url("data:image/svg+xml,${TILE}")`, backgroundSize: 'clamp(140px, 22vw, 230px)' }} />}
        {corner && (
            <span className="absolute bottom-1.5 right-2 font-mono text-[clamp(8px,1.5vw,11px)] uppercase tracking-[0.08em] text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] sm:bottom-2.5 sm:right-3">
                © Mohamed Amine Barhoumi
            </span>
        )}
    </div>
);

export default Watermark;
