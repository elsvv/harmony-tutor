import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { RefreshCw, ArrowRight, Info } from 'lucide-react';

interface ProgressionTrackerProps {
    currentStepIndex: number;
    steps: string[]; // Functional labels (T53, S64, etc.)
    completedSteps: number; // How many steps are fully completed (redundant with index usually, but good for explicit state)
    availableKeys: string[];
    selectedKey: string;
    onKeyChange: (key: string) => void;
    onRestart: () => void;
    onChordInfoClick?: (label: string) => void; // Callback when info button is clicked
    keyLabel?: string;
    restartTitle?: string;
    chordInfoTitleTemplate?: string;
    className?: string;
}

export const ProgressionTracker: React.FC<ProgressionTrackerProps> = ({
    currentStepIndex,
    steps,
    availableKeys,
    selectedKey,
    onKeyChange,
    onRestart,
    onChordInfoClick,
    keyLabel = 'Key:',
    restartTitle = 'Restart sequence',
    chordInfoTitleTemplate = 'Info about {label}',
    className,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current step
    useEffect(() => {
        if (scrollContainerRef.current) {
            const currentEl = scrollContainerRef.current.children[currentStepIndex] as HTMLElement;
            if (currentEl) {
                // simple scroll into view logic
                currentEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [currentStepIndex]);

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {/* Controls Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        {keyLabel}
                    </span>
                    <select
                        value={selectedKey}
                        onChange={(e) => onKeyChange(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded px-2 py-0.5 text-xs font-bold text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer hover:bg-stone-100 transition-colors"
                    >
                        {availableKeys.map((k) => (
                            <option key={k} value={k}>
                                {k}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={onRestart}
                    className="p-1 text-stone-400 hover:text-[var(--color-primary)] hover:bg-stone-50 rounded-full transition-colors"
                    title={restartTitle}
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Steps Visualization (Minimalist Text) */}
            <div className="w-full">
                <div
                    ref={scrollContainerRef}
                    className="flex items-center flex-wrap gap-x-1 gap-y-2 py-2"
                >
                    {steps.map((label, idx) => {
                        const isActive = idx === currentStepIndex;
                        const isPassed = idx < currentStepIndex;
                        const isFuture = idx > currentStepIndex;

                        return (
                            <React.Fragment key={idx}>
                                {idx > 0 && (
                                    <ArrowRight
                                        className={cn(
                                            'w-3 h-3 mx-1 transition-colors duration-300',
                                            isPassed ? 'text-emerald-300' : 'text-stone-200'
                                        )}
                                    />
                                )}

                                <div
                                    className={cn(
                                        'flex items-center gap-1 px-2 py-1 rounded transition-all duration-300 group',
                                        isActive &&
                                            'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold ring-1 ring-[var(--color-primary)]/20',
                                        isPassed && 'text-emerald-600 font-medium',
                                        isFuture && 'text-stone-300'
                                    )}
                                >
                                    <span className="text-sm md:text-base leading-none">
                                        {label}
                                    </span>
                                    {onChordInfoClick && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onChordInfoClick(label);
                                            }}
                                            className={cn(
                                                'p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                                                isActive && 'hover:bg-[var(--color-primary)]/20',
                                                isPassed && 'hover:bg-emerald-100',
                                                isFuture && 'hover:bg-stone-100'
                                            )}
                                            title={chordInfoTitleTemplate.replace('{label}', label)}
                                        >
                                            <Info className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
