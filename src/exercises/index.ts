import type { ExerciseCategory } from './types';

// Staff Reading exercises
import {
    NoteIdentificationExercise,
    NoteIdentificationClefSwitchingExercise,
    AccidentalReadingExercise,
    LedgerLinesExercise,
    KeySignatureIdentificationExercise,
    KeySignatureNotesExercise,
} from './staff-reading';

// Interval exercises
import {
    HarmonicIntervalExercise,
    MelodicIntervalExercise,
    IntervalConstructionUpExercise,
    IntervalConstructionDownExercise,
    IntervalQualityDrillExercise,
} from './intervals';

// Scale exercises
import {
    ScaleIdentificationExercise,
    ScaleIdentificationAdvancedExercise,
    ScaleConstructionExercise,
    DegreeIdentificationExercise,
} from './scales';

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
    {
        id: 'staff-reading',
        title: {
            en: 'Staff Reading',
            ru: 'Чтение нот',
        },
        description: {
            en: 'Learn to read notes on the musical staff quickly and accurately.',
            ru: 'Научитесь быстро и точно читать ноты на нотном стане.',
        },
        icon: 'music',
        color: 'indigo',
        exercises: [
            NoteIdentificationExercise,
            NoteIdentificationClefSwitchingExercise,
            AccidentalReadingExercise,
            LedgerLinesExercise,
            KeySignatureIdentificationExercise,
            KeySignatureNotesExercise,
        ],
    },
    {
        id: 'intervals',
        title: {
            en: 'Intervals',
            ru: 'Интервалы',
        },
        description: {
            en: 'Master musical intervals — the building blocks of harmony and melody.',
            ru: 'Освойте музыкальные интервалы — основу гармонии и мелодии.',
        },
        icon: 'git-compare',
        color: 'emerald',
        exercises: [
            HarmonicIntervalExercise,
            MelodicIntervalExercise,
            IntervalConstructionUpExercise,
            IntervalConstructionDownExercise,
            IntervalQualityDrillExercise,
        ],
    },
    {
        id: 'scales',
        title: {
            en: 'Scales & Tonality',
            ru: 'Гаммы и тональность',
        },
        description: {
            en: 'Understand scales, keys, and how notes function within a tonal context.',
            ru: 'Понимание гамм, тональностей и функций нот в тональном контексте.',
        },
        icon: 'trending-up',
        color: 'amber',
        exercises: [
            ScaleIdentificationExercise,
            ScaleIdentificationAdvancedExercise,
            ScaleConstructionExercise,
            DegreeIdentificationExercise,
        ],
    },
];

export const ALL_EXERCISES = EXERCISE_CATEGORIES.flatMap((c) => c.exercises);

export function getExerciseById(id: string) {
    return ALL_EXERCISES.find((e) => e.id === id);
}

export function getCategoryById(id: string) {
    return EXERCISE_CATEGORIES.find((c) => c.id === id);
}

// Re-export types
export * from './types';
