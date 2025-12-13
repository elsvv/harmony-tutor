import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

type DrawerSide = 'left' | 'right';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    side?: DrawerSide;
    title?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    side = 'right',
    title,
    children,
    className,
    showCloseButton = true,
    width = 'max-w-lg',
}) => {
    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when drawer is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const slideVariants = {
        left: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' },
        },
        right: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={cn('fixed inset-0 z-50 flex', side === 'right' && 'justify-end')}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={slideVariants[side].initial}
                        animate={slideVariants[side].animate}
                        exit={slideVariants[side].exit}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={cn(
                            'relative w-full bg-white shadow-2xl flex flex-col h-full',
                            width,
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div
                                className={cn(
                                    'flex items-center justify-between px-6 py-4 border-b border-stone-100',
                                    !title && 'justify-end'
                                )}
                            >
                                {title && (
                                    <div className="font-semibold text-stone-900 truncate pr-4">
                                        {title}
                                    </div>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 -mr-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Drawer;
