import { Note } from 'tonal';
import type { Exercise, ExerciseQuestion, Clef } from '../types';

const BASIC_INTERVALS = ['m2', 'M2', 'm3', 'M3', 'P4', 'P5', 'm6', 'M6', 'm7', 'M7'];
const ROOT_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateOptions(correctInterval: string): string[] {
    const options = [correctInterval];
    const otherIntervals = BASIC_INTERVALS.filter((i) => i !== correctInterval);
    const shuffled = shuffle(otherIntervals);
    options.push(...shuffled.slice(0, 5));
    return shuffle(options);
}

function generateHarmonicQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
    const octave = clef === 'treble' ? 4 : 3;

    const rootNote = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
    const interval = BASIC_INTERVALS[Math.floor(Math.random() * BASIC_INTERVALS.length)];

    const rootWithOctave = `${rootNote}${octave}`;
    const secondNote = Note.transpose(rootWithOctave, interval);

    if (!secondNote) {
        // Fallback
        return generateHarmonicQuestion();
    }

    return {
        id: `interval-harmonic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-identification',
        prompt: {
            en: 'Name this harmonic interval',
            ru: 'Назовите этот гармонический интервал',
        },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave, secondNote],
        displayInterval: [rootWithOctave, secondNote],
        correctAnswer: interval,
        options: generateOptions(interval),
        difficulty: 'medium',
        hint: {
            en: 'Count the distance between the two notes (including both notes)',
            ru: 'Посчитайте расстояние между двумя нотами (включая обе ноты)',
        },
    };
}

function generateMelodicQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
    const octave = clef === 'treble' ? 4 : 3;

    const rootNote = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
    const interval = BASIC_INTERVALS[Math.floor(Math.random() * BASIC_INTERVALS.length)];

    const rootWithOctave = `${rootNote}${octave}`;
    const secondNote = Note.transpose(rootWithOctave, interval);

    if (!secondNote) {
        return generateMelodicQuestion();
    }

    return {
        id: `interval-melodic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-identification',
        prompt: {
            en: 'Name this melodic interval',
            ru: 'Назовите этот мелодический интервал',
        },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave, secondNote],
        displayInterval: [rootWithOctave, secondNote],
        correctAnswer: interval,
        options: generateOptions(interval),
        difficulty: 'medium',
        hint: {
            en: 'This is the distance between two consecutive notes',
            ru: 'Это расстояние между двумя последовательными нотами',
        },
    };
}

export const HarmonicIntervalExercise: Exercise = {
    id: 'interval-harmonic-identification',
    categoryId: 'intervals',
    title: {
        en: 'Interval ID (Harmonic)',
        ru: 'Интервалы (Гармонические)',
    },
    description: {
        en: 'Two notes stacked (played together) → pick the interval (m3, M3, P5…).',
        ru: 'Две ноты вместе → выберите интервал (м3, б3, ч5…).',
    },
    generateQuestion: generateHarmonicQuestion,
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'medium',
    },
};

export const MelodicIntervalExercise: Exercise = {
    id: 'interval-melodic-identification',
    categoryId: 'intervals',
    title: {
        en: 'Interval ID (Melodic)',
        ru: 'Интервалы (Мелодические)',
    },
    description: {
        en: 'Two consecutive notes on the staff → pick the interval.',
        ru: 'Две последовательные ноты на нотоносце → выберите интервал.',
    },
    generateQuestion: generateMelodicQuestion,
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'medium',
    },
};
