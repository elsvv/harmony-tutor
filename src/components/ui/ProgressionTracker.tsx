import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { RefreshCw, ArrowRight } from 'lucide-react';

interface ProgressionTrackerProps {
  currentStepIndex: number;
  steps: string[]; // Functional labels (T53, S64, etc.)
  completedSteps: number; // How many steps are fully completed (redundant with index usually, but good for explicit state)
  availableKeys: string[];
  selectedKey: string;
  onKeyChange: (key: string) => void;
  onRestart: () => void;
  className?: string;
}

export const ProgressionTracker: React.FC<ProgressionTrackerProps> = ({
  currentStepIndex,
  steps,
  availableKeys,
  selectedKey,
  onKeyChange,
  onRestart,
  className
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current step
    useEffect(() => {
        if (scrollContainerRef.current) {
            const currentEl = scrollContainerRef.current.children[currentStepIndex] as HTMLElement;
            if (currentEl) {
                // simple scroll into view logic
                currentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentStepIndex]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
        
        {/* Controls Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Key:</span>
                 <select 
                    value={selectedKey}
                    onChange={(e) => onKeyChange(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded px-2 py-0.5 text-xs font-bold text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer hover:bg-stone-100 transition-colors"
                 >
                    {availableKeys.map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                 </select>
            </div>

            <button 
                onClick={onRestart}
                className="p-1 text-stone-400 hover:text-[var(--color-primary)] hover:bg-stone-50 rounded-full transition-colors"
                title="Restart Sequence"
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
                                <ArrowRight className={cn(
                                    "w-3 h-3 mx-1 transition-colors duration-300", 
                                    isPassed ? "text-emerald-300" : "text-stone-200"
                                )} />
                            )}
                            
                            <div className={cn(
                                "flex items-center px-2 py-1 rounded transition-all duration-300",
                                isActive && "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold ring-1 ring-[var(--color-primary)]/20",
                                isPassed && "text-emerald-600 font-medium",
                                isFuture && "text-stone-300"
                            )}>
                                <span className="text-sm md:text-base leading-none">{label}</span>
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>

    </div>
  );
};
