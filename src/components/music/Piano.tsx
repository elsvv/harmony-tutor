import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import * as Tone from 'tone';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PianoProps {
  activeNotes: string[]; // e.g., ["C4", "E4"]
  onNoteOn?: (note: string) => void;
  onNoteOff?: (note: string) => void;
  startOctave?: number;
  octaves?: number;
}

const Piano: React.FC<PianoProps> = ({ 
    activeNotes, 
    onNoteOn, 
    onNoteOff, 
    startOctave = 3, 
    octaves = 2 
  }) => {
    const [currentStartOctave, setCurrentStartOctave] = useState(startOctave);
    const [synth, setSynth] = useState<Tone.PolySynth | null>(null);

    useEffect(() => {
        const newSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
        }).toDestination();
        setSynth(newSynth);

        return () => {
            newSynth.dispose();
        };
    }, []);

    const playNote = (note: string) => {
        if (synth && Tone.context.state === 'suspended') {
            Tone.start();
        }
        synth?.triggerAttack(note);
        onNoteOn?.(note);
    };

    const stopNote = (note: string) => {
        synth?.triggerRelease(note);
        onNoteOff?.(note);
    };

    const renderKeys = () => {
        const whiteKeysInOctave = 7; // C D E F G A B
        const totalWhiteKeys = octaves * whiteKeysInOctave + 1; // +1 for final C
        const whiteKeyWidth = 100 / totalWhiteKeys;
        const blackKeyWidth = whiteKeyWidth * 0.65;
        
        const elements = [];
        let currentWhiteKeyIndex = 0;

        for (let i = 0; i < octaves; i++) {
            const octave = currentStartOctave + i;
            const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            
            notes.forEach((note) => {
                const fullNote = `${note}${octave}`;
                const isActive = activeNotes.includes(fullNote);
                const leftPos = currentWhiteKeyIndex * whiteKeyWidth;

                // White Key
                elements.push(
                    <div
                        key={fullNote}
                        onMouseDown={() => playNote(fullNote)}
                        onMouseUp={() => stopNote(fullNote)}
                        onMouseLeave={() => stopNote(fullNote)}
                        className={cn(
                            "absolute top-0 h-full border-r border-b border-l border-stone-200 rounded-b-md transition-colors duration-100 cursor-pointer flex items-end justify-center pb-4 text-sm select-none shadow-[0_2px_0_rgba(0,0,0,0.05)]",
                            isActive ? "bg-[var(--color-accent)] shadow-none" : "bg-white hover:bg-stone-50 active:bg-stone-100"
                        )}
                        style={{ 
                            left: `${leftPos}%`, 
                            width: `${whiteKeyWidth}%`,
                            zIndex: 1
                        }}
                    >
                        <span className={cn(
                            "absolute bottom-3 left-1/2 -translate-x-1/2 font-medium select-none text-xs",
                            isActive ? "text-white" : "text-stone-400"
                        )}>
                            {note === 'C' ? `C${octave}` : ''}
                        </span>
                    </div>
                );

                // Black Key
                if (['C', 'D', 'F', 'G', 'A'].includes(note)) {
                    const blackNote = `${note}#${octave}`;
                    const isBlackActive = activeNotes.includes(blackNote);
                    // Position black key centered on the line between white keys
                    const blackKeyLeft = leftPos + whiteKeyWidth - (blackKeyWidth / 2);
                    
                    elements.push(
                        <div
                            key={blackNote}
                            onMouseDown={() => playNote(blackNote)}
                            onMouseUp={() => stopNote(blackNote)}
                            onMouseLeave={() => stopNote(blackNote)}
                            className={cn(
                                "absolute top-0 h-[60%] rounded-b-md transition-colors duration-100 cursor-pointer z-20 shadow-md border border-stone-800",
                                isBlackActive ? "bg-[var(--color-accent)]" : "bg-stone-900 hover:bg-stone-800"
                            )}
                            style={{ 
                                left: `${blackKeyLeft}%`, 
                                width: `${blackKeyWidth}%` 
                            }}
                        />
                    );
                }
                
                currentWhiteKeyIndex++;
            });
        }
        
        // Add final C
        const finalNote = `C${currentStartOctave + octaves}`;
        const isFinalActive = activeNotes.includes(finalNote);
        const leftPos = currentWhiteKeyIndex * whiteKeyWidth;
        
        elements.push(
            <div
                key={finalNote}
                onMouseDown={() => playNote(finalNote)}
                onMouseUp={() => stopNote(finalNote)}
                onMouseLeave={() => stopNote(finalNote)}
                className={cn(
                    "absolute top-0 h-full border-r border-b border-l border-stone-200 rounded-b-md transition-colors duration-100 cursor-pointer flex items-end justify-center pb-4 text-sm select-none shadow-[0_2px_0_rgba(0,0,0,0.05)]",
                    isFinalActive ? "bg-[var(--color-accent)] shadow-none" : "bg-white hover:bg-stone-50 active:bg-stone-100"
                )}
                style={{ 
                    left: `${leftPos}%`, 
                    width: `${whiteKeyWidth}%`,
                    zIndex: 1
                }}
            >
                <span className={cn(
                    "absolute bottom-3 left-1/2 -translate-x-1/2 font-medium select-none text-xs",
                    isFinalActive ? "text-white" : "text-stone-400"
                )}>
                    {`C${currentStartOctave + octaves}`}
                </span>
            </div>
        );

        return <div className="relative h-80 w-full">{elements}</div>;
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center justify-between w-full px-4">
                <button 
                    onClick={() => setCurrentStartOctave(prev => Math.max(0, prev - 1))}
                    className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                    disabled={currentStartOctave <= 1}
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                    Octave {currentStartOctave}-{currentStartOctave + octaves}
                </span>
                <button 
                    onClick={() => setCurrentStartOctave(prev => Math.min(7, prev + 1))}
                    className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                    disabled={currentStartOctave >= 6}
                >
                    <ChevronRight size={24} />
                </button>
            </div>
            
            <div className="w-full relative">
                {renderKeys()}
            </div>
        </div>
    );
  };

export default Piano;
