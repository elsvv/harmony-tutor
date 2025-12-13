// Content loader for MD files
// Vite supports importing .md files as raw strings with ?raw suffix

// Progression content
import seqA from './progressions/seq-a.md?raw';
import seqB from './progressions/seq-b.md?raw';
import seqC from './progressions/seq-c.md?raw';
import seqD from './progressions/seq-d.md?raw';
import seqE from './progressions/seq-e.md?raw';
import seqF from './progressions/seq-f.md?raw';

// Chord content
import T53 from './chords/T53.md?raw';
import T6 from './chords/T6.md?raw';
import T64 from './chords/T64.md?raw';
import T3 from './chords/T3.md?raw';
import S53 from './chords/S53.md?raw';
import S6 from './chords/S6.md?raw';
import S64 from './chords/S64.md?raw';
import D7 from './chords/D7.md?raw';
import D65 from './chords/D65.md?raw';
import D2 from './chords/D2.md?raw';
import II2 from './chords/II2.md?raw';
import II65 from './chords/II65.md?raw';
import II43 from './chords/II43.md?raw';
import VII7 from './chords/VII7.md?raw';
import VII43 from './chords/VII43.md?raw';
import VII2 from './chords/VII2.md?raw';

// Harmonic chord content (гармонический мажор)
import II2Harm from './chords/II2-harm.md?raw';
import II65Harm from './chords/II65-harm.md?raw';
import II43Harm from './chords/II43-harm.md?raw';
import VII7Harm from './chords/VII7-harm.md?raw';
import VII43Harm from './chords/VII43-harm.md?raw';
import VII2Harm from './chords/VII2-harm.md?raw';

// Progression content map
export const progressionContent: Record<string, string> = {
    'seq-a': seqA,
    'seq-b': seqB,
    'seq-c': seqC,
    'seq-d': seqD,
    'seq-e': seqE,
    'seq-f': seqF,
};

// Chord content map
export const chordContent: Record<string, string> = {
    // Tonic
    T53: T53,
    T6: T6,
    T64: T64,
    T3: T3,
    // Subdominant
    S53: S53,
    S6: S6,
    S64: S64,
    // Dominant
    D7: D7,
    D65: D65,
    D2: D2,
    // II ступень (натуральный мажор)
    II2: II2,
    II65: II65,
    II43: II43,
    // II ступень (гармонический мажор)
    'II2 (harm)': II2Harm,
    'II65 (harm)': II65Harm,
    'II43 (harm)': II43Harm,
    // VII ступень (натуральный мажор)
    VII7: VII7,
    VII43: VII43,
    VII2: VII2,
    // VII ступень (гармонический мажор)
    'VII7 (harm)': VII7Harm,
    'VII43 (harm)': VII43Harm,
    'VII2 (harm)': VII2Harm,
};

// Helper to get progression content by lesson ID
export const getProgressionContent = (lessonId: string): string | null => {
    return progressionContent[lessonId] || null;
};

// Helper to get chord content by label
export const getChordContent = (label: string): string | null => {
    // Remove "(harm)" suffix for lookup if present
    const cleanLabel = label.replace(' (harm)', '');
    return chordContent[label] || chordContent[cleanLabel] || null;
};
