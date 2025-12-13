// Content loader for MD files
// Vite supports importing .md files as raw strings with ?raw suffix

import type { Language } from '../i18n/types';

// Progression content
import seqA from './progressions/seq-a.md?raw';
import seqB from './progressions/seq-b.md?raw';
import seqC from './progressions/seq-c.md?raw';
import seqD from './progressions/seq-d.md?raw';
import seqE from './progressions/seq-e.md?raw';
import seqF from './progressions/seq-f.md?raw';

// Progression content (EN)
import seqAEn from './en/progressions/seq-a.md?raw';
import seqBEn from './en/progressions/seq-b.md?raw';
import seqCEn from './en/progressions/seq-c.md?raw';
import seqDEn from './en/progressions/seq-d.md?raw';
import seqEEn from './en/progressions/seq-e.md?raw';
import seqFEn from './en/progressions/seq-f.md?raw';

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

// Chord content (EN)
import T53En from './en/chords/T53.md?raw';
import T6En from './en/chords/T6.md?raw';
import T64En from './en/chords/T64.md?raw';
import T3En from './en/chords/T3.md?raw';
import S53En from './en/chords/S53.md?raw';
import S6En from './en/chords/S6.md?raw';
import S64En from './en/chords/S64.md?raw';
import D7En from './en/chords/D7.md?raw';
import D65En from './en/chords/D65.md?raw';
import D2En from './en/chords/D2.md?raw';
import II2En from './en/chords/II2.md?raw';
import II65En from './en/chords/II65.md?raw';
import II43En from './en/chords/II43.md?raw';
import VII7En from './en/chords/VII7.md?raw';
import VII43En from './en/chords/VII43.md?raw';
import VII2En from './en/chords/VII2.md?raw';

// Harmonic chord content (гармонический мажор)
import II2Harm from './chords/II2-harm.md?raw';
import II65Harm from './chords/II65-harm.md?raw';
import II43Harm from './chords/II43-harm.md?raw';
import VII7Harm from './chords/VII7-harm.md?raw';
import VII43Harm from './chords/VII43-harm.md?raw';
import VII2Harm from './chords/VII2-harm.md?raw';

// Harmonic chord content (EN)
import II2HarmEn from './en/chords/II2-harm.md?raw';
import II65HarmEn from './en/chords/II65-harm.md?raw';
import II43HarmEn from './en/chords/II43-harm.md?raw';
import VII7HarmEn from './en/chords/VII7-harm.md?raw';
import VII43HarmEn from './en/chords/VII43-harm.md?raw';
import VII2HarmEn from './en/chords/VII2-harm.md?raw';

// Progression content map
export const progressionContent: Record<string, string> = {
    'seq-a': seqA,
    'seq-b': seqB,
    'seq-c': seqC,
    'seq-d': seqD,
    'seq-e': seqE,
    'seq-f': seqF,
};

const progressionContentEn: Record<string, string> = {
    'seq-a': seqAEn,
    'seq-b': seqBEn,
    'seq-c': seqCEn,
    'seq-d': seqDEn,
    'seq-e': seqEEn,
    'seq-f': seqFEn,
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
    'II2-harm': II2Harm,
    'II65-harm': II65Harm,
    'II43-harm': II43Harm,
    // VII ступень (натуральный мажор)
    VII7: VII7,
    VII43: VII43,
    VII2: VII2,
    // VII ступень (гармонический мажор)
    'VII7-harm': VII7Harm,
    'VII43-harm': VII43Harm,
    'VII2-harm': VII2Harm,
};

const chordContentEn: Record<string, string> = {
    // Tonic
    T53: T53En,
    T6: T6En,
    T64: T64En,
    T3: T3En,
    // Subdominant
    S53: S53En,
    S6: S6En,
    S64: S64En,
    // Dominant
    D7: D7En,
    D65: D65En,
    D2: D2En,
    // II degree (natural major)
    II2: II2En,
    II65: II65En,
    II43: II43En,
    // II degree (harmonic major)
    'II2-harm': II2HarmEn,
    'II65-harm': II65HarmEn,
    'II43-harm': II43HarmEn,
    // VII degree (natural major)
    VII7: VII7En,
    VII43: VII43En,
    VII2: VII2En,
    // VII degree (harmonic major)
    'VII7-harm': VII7HarmEn,
    'VII43-harm': VII43HarmEn,
    'VII2-harm': VII2HarmEn,
};

const progressionContentByLang: Record<Language, Record<string, string>> = {
    en: progressionContentEn,
    ru: progressionContent,
};

const chordContentByLang: Record<Language, Record<string, string>> = {
    en: chordContentEn,
    ru: chordContent,
};

// Helper to get progression content by lesson ID
export const getProgressionContent = (lessonId: string, lang: Language = 'en'): string | null => {
    return (
        progressionContentByLang[lang]?.[lessonId] ||
        progressionContentByLang.ru?.[lessonId] ||
        null
    );
};

// Helper to get chord content by label
export const getChordContent = (label: string, lang: Language = 'en'): string | null => {
    const map = chordContentByLang[lang];
    const ruMap = chordContentByLang.ru;

    return map?.[label] || ruMap?.[label] || null;
};
