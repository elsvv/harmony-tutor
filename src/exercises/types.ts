import type { LocalizedContent } from '../i18n/types';

// Exercise types - multiple choice based exercises
export type ExerciseType =
    | 'note-identification' // Identify note on staff
    | 'interval-identification' // Identify interval
    | 'interval-construction' // Build interval
    | 'key-signature' // Key signature exercises
    | 'scale-identification' // Identify scale type
    | 'scale-construction' // Build a scale
    | 'degree-identification'; // Identify scale degree

export type Clef = 'treble' | 'bass';
export type Accidental = 'sharp' | 'flat' | 'natural' | 'none';

export interface ExerciseQuestion {
    id: string;
    type: ExerciseType;
    prompt: LocalizedContent;

    // Visual configuration
    clef?: Clef;
    keySignature?: string;
    displayNotes?: string[]; // Notes to show on staff
    displayInterval?: [string, string]; // Two notes for interval display

    // Answer configuration
    correctAnswer: string;
    options: string[]; // Multiple choice options

    // Optional metadata
    hint?: LocalizedContent;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Exercise {
    id: string;
    categoryId: string;
    title: LocalizedContent;
    description: LocalizedContent;
    icon?: string;
    generateQuestion: () => ExerciseQuestion;

    // Settings
    settings?: {
        includeAccidentals?: boolean;
        includeLedgerLines?: boolean;
        clefs?: Clef[];
        difficulty?: 'easy' | 'medium' | 'hard';
    };
}

export interface ExerciseCategory {
    id: string;
    title: LocalizedContent;
    description: LocalizedContent;
    icon: string;
    color: string;
    exercises: Exercise[];
}

// Note names for different locales
export const NOTE_NAMES = {
    en: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    ru: ['До', 'Ре', 'Ми', 'Фа', 'Соль', 'Ля', 'Си'],
};

export const ACCIDENTAL_NAMES = {
    en: { sharp: '♯', flat: '♭', natural: '♮', doubleSharp: '𝄪', doubleFlat: '𝄫' },
    ru: { sharp: '♯', flat: '♭', natural: '♮', doubleSharp: '𝄪', doubleFlat: '𝄫' },
};

export const INTERVAL_NAMES = {
    en: {
        P1: 'Perfect Unison',
        m2: 'Minor 2nd',
        M2: 'Major 2nd',
        m3: 'Minor 3rd',
        M3: 'Major 3rd',
        P4: 'Perfect 4th',
        A4: 'Augmented 4th',
        d5: 'Diminished 5th',
        P5: 'Perfect 5th',
        m6: 'Minor 6th',
        M6: 'Major 6th',
        m7: 'Minor 7th',
        M7: 'Major 7th',
        P8: 'Perfect Octave',
    },
    ru: {
        P1: 'Чистая прима',
        m2: 'Малая секунда',
        M2: 'Большая секунда',
        m3: 'Малая терция',
        M3: 'Большая терция',
        P4: 'Чистая кварта',
        A4: 'Увеличенная кварта',
        d5: 'Уменьшенная квинта',
        P5: 'Чистая квинта',
        m6: 'Малая секста',
        M6: 'Большая секста',
        m7: 'Малая септима',
        M7: 'Большая септима',
        P8: 'Чистая октава',
    },
};

export const SCALE_DEGREE_NAMES = {
    en: [
        '1 (Tonic)',
        '2 (Supertonic)',
        '3 (Mediant)',
        '4 (Subdominant)',
        '5 (Dominant)',
        '6 (Submediant)',
        '7 (Leading Tone)',
    ],
    ru: [
        '1 (Тоника)',
        '2 (Супертоника)',
        '3 (Медианта)',
        '4 (Субдоминанта)',
        '5 (Доминанта)',
        '6 (Субмедианта)',
        '7 (Вводный тон)',
    ],
};
