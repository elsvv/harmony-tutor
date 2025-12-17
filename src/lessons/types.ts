// Translation keys are used instead of LocalizedContent
// All translations are stored in src/i18n/locales/*.json

export interface Question {
    id: string;
    textKey: string; // i18n translation key
    textParams?: Record<string, string>; // Parameters for interpolation
    targetChord: string; // e.g. "C Major"
    clef?: 'treble' | 'bass';
    keySignature?: string;
    hintKey?: string; // i18n translation key for hint
    hintParams?: Record<string, string>;
    validate: (notes: string[]) => boolean;
    metadata?: {
        key?: string;
        progressionIndex?: number;
        progressionTotal?: number;
        progressionLabel?: string;
        functionalSequence?: string[]; // Array of labels for the whole sequence
    };
}

export interface Lesson {
    id: string;
    type?: 'standard' | 'progression';
    titleKey: string; // i18n translation key
    descriptionKey: string; // i18n translation key
    questions: Question[];
    generateQuestion: () => Question;
}
