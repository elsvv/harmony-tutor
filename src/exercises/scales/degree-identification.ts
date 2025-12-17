import { Scale, Note } from 'tonal';
import type { Exercise, ExerciseQuestion } from '../types';

const MAJOR_KEYS = ['C', 'G', 'D', 'F', 'Bb', 'A', 'Eb'];

const DEGREE_NAMES = {
    en: [
        '1 (Tonic)',
        '2 (Supertonic)',
        '3 (Mediant)',
        '4 (Subdominant)',
        '5 (Dominant)',
        '6 (Submediant)',
        '7 (Leading)',
    ],
    ru: [
        '1 (Тоника)',
        '2 (Верхний вводный)',
        '3 (Медианта)',
        '4 (Субдоминанта)',
        '5 (Доминанта)',
        '6 (Субмедианта)',
        '7 (Вводный тон)',
    ],
};

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateQuestion(): ExerciseQuestion {
    const key = MAJOR_KEYS[Math.floor(Math.random() * MAJOR_KEYS.length)];
    const scale = Scale.get(`${key} major`);

    // Randomly choose a note (diatonic or potentially non-diatonic)
    const useNonDiatonic = Math.random() < 0.2; // 20% chance for non-diatonic

    let targetNote: string;
    let correctDegree: number | string;

    if (useNonDiatonic) {
        // Pick a chromatic note not in the scale
        const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const nonDiatonicNotes = chromaticNotes.filter((n) => {
            const chroma = Note.chroma(n);
            return !scale.notes.some((sn) => Note.chroma(sn) === chroma);
        });
        targetNote = nonDiatonicNotes[Math.floor(Math.random() * nonDiatonicNotes.length)];
        correctDegree = 'Non-diatonic';
    } else {
        const degreeIndex = Math.floor(Math.random() * 7);
        targetNote = scale.notes[degreeIndex];
        correctDegree = degreeIndex + 1;
    }

    const octave = 4;
    const displayNote = `${targetNote}${octave}`;

    // Generate options
    const options: string[] = [];
    DEGREE_NAMES.en.forEach((_, i) => {
        options.push(`${i + 1}`);
    });
    options.push('Non-diatonic');

    const correctAnswer = correctDegree.toString();

    return {
        id: `degree-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'degree-identification',
        prompt: {
            en: `In ${key} major, what scale degree is this note?`,
            ru: `В тональности ${key} мажор, какая это ступень?`,
        },
        clef: 'treble',
        keySignature: key,
        displayNotes: [displayNote],
        correctAnswer,
        options: shuffle(options).slice(0, 6),
        difficulty: 'hard',
        hint: {
            en: `The ${key} major scale is: ${scale.notes.join(', ')}`,
            ru: `Гамма ${key} мажор: ${scale.notes.join(', ')}`,
        },
    };
}

export const DegreeIdentificationExercise: Exercise = {
    id: 'degree-identification',
    categoryId: 'scales',
    title: {
        en: 'Scale Degree Identification',
        ru: 'Определение ступеней',
    },
    description: {
        en: 'Given a key (e.g., "D major") + one note → choose its scale degree (1–7, or "non-diatonic").',
        ru: 'Дана тональность (напр., «D мажор») + нота → выберите её ступень (1–7, или «не диатоническая»).',
    },
    generateQuestion,
    settings: {
        difficulty: 'hard',
    },
};
