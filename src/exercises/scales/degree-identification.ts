import { Scale, Note } from 'tonal';
import type { Exercise, ExerciseQuestion } from '../types';

const MAJOR_KEYS = ['C', 'G', 'D', 'F', 'Bb', 'A', 'Eb'];

// Degree names are now in i18n locales under scaleDegrees

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

    // Generate options (1-7 + Non-diatonic)
    const options: string[] = [];
    for (let i = 1; i <= 7; i++) {
        options.push(`${i}`);
    }
    options.push('Non-diatonic');

    const correctAnswer = correctDegree.toString();

    return {
        id: `degree-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'degree-identification',
        promptKey: 'exercises.degreeIdentification.prompt',
        promptParams: { key },
        clef: 'treble',
        keySignature: key,
        displayNotes: [displayNote],
        correctAnswer,
        options: shuffle(options).slice(0, 6),
        difficulty: 'hard',
        hintKey: 'exercises.degreeIdentification.hint',
        hintParams: { key, notes: scale.notes.join(', ') },
    };
}

export const DegreeIdentificationExercise: Exercise = {
    id: 'degree-identification',
    categoryId: 'scales',
    titleKey: 'exercises.degreeIdentification.title',
    descriptionKey: 'exercises.degreeIdentification.description',
    generateQuestion,
    settings: {
        difficulty: 'hard',
    },
};
