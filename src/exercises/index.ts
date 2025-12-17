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
        titleKey: 'categories.staffReading',
        descriptionKey: 'categories.staffReadingDesc',
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
        titleKey: 'categories.intervals',
        descriptionKey: 'categories.intervalsDesc',
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
        titleKey: 'categories.scales',
        descriptionKey: 'categories.scalesDesc',
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
