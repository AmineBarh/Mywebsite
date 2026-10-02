import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface BoxButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
    tone?: 'dark' | 'light';
    className?: string;
}

/** Boxed mono label with an arrow cell, like the reference's "VISIT OUR MARKETPLACE". */
const BoxButton = ({ children, href, onClick, type = 'button', disabled, tone = 'dark', className = '' }: BoxButtonProps) => {
    const palette =
        tone === 'light'
            ? 'border-ink text-ink hover:bg-ink hover:text-paper [&_.cell]:border-ink/30 [&_.cell]:bg-ink/5'
            : 'border-foreground/70 text-foreground hover:bg-foreground hover:text-background [&_.cell]:border-foreground/30 [&_.cell]:bg-foreground/10';
    const classes = `press group inline-flex items-stretch border font-mono text-[11px] uppercase tracking-[0.06em] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${palette} ${className}`;
    const inner = (
        <>
            <span className="px-5 py-3.5">{children}</span>
            <span className="cell flex w-11 items-center justify-center border-l">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.25} />
            </span>
        </>
    );
    if (href) {
        return (
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={classes}>
                {inner}
            </a>
        );
    }
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>
            {inner}
        </button>
    );
};

export default BoxButton;
