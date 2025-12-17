import type { Lesson, Question } from '../types';
import { Note } from 'tonal';

// Helper to generate notes for specific functions and inversions in a key
// Re-implement getChordNotes to return scientific notation with explicit octave management
const generateChord = (key: string, func: any, inv: any, harm: boolean): string[] => {
    // 1. Get scale
    const scale = [0, 2, 4, 5, 7, 9, 11].map((semitones) => {
        // for harmonic major flat 6. Major scale: 0, 2, 4, 5, 7, 9, 11
        // Harmonic major: 0, 2, 4, 5, 7, 8, 11 (flat 6)
        if (harm && semitones === 9) return 8;
        return semitones;
    });

    const rootMidi = Note.midi(key + '3'); // Anchor around octave 3
    if (!rootMidi) return [];

    const getNote = (degree0Based: number) => {
        const octaveShift = Math.floor(degree0Based / 7);
        const index = degree0Based % 7;
        const semitones = scale[index];
        return Note.fromMidi(rootMidi + semitones + octaveShift * 12);
    };

    // Func roots (0-based scale degree)
    const roots: Record<string, number> = { T: 0, II: 1, S: 3, D: 4, VII: 6 };
    const rootDeg = roots[func];

    // Chord structure (1, 3, 5, 7) relative to root
    let structure = [0, 2, 4]; // triad
    if (inv === '3') {
        // T3 - incomplete triad (only root + third, no fifth)
        structure = [0, 2];
    } else if (['7', '65', '43', '2'].includes(inv) || func === 'II' || func === 'VII') {
        // II and VII are usually 7ths in these sequences
        structure = [0, 2, 4, 6];
    }

    // Map absolute scale degrees
    let notesDegrees = structure.map((interval) => rootDeg + interval);

    // Inversions (rotate the array of degrees)
    // 0 = root, 1 = 3rd, 2 = 5th, 3 = 7th
    let rotated = [...notesDegrees];

    // Triad Inversions
    if (inv === '6') {
        // 3rd in bass
        rotated = [notesDegrees[1], notesDegrees[2], notesDegrees[0] + 7];
    } else if (inv === '64') {
        // 5th in bass
        rotated = [notesDegrees[2], notesDegrees[0] + 7, notesDegrees[1] + 7];
    }
    // 7th Inversions
    else if (inv === '65') {
        // 3rd in bass, 5, 7, Root
        rotated = [notesDegrees[1], notesDegrees[2], notesDegrees[3], notesDegrees[0] + 7];
    } else if (inv === '43') {
        // 5th in bass, 7, Root, 3
        rotated = [notesDegrees[2], notesDegrees[3], notesDegrees[0] + 7, notesDegrees[1] + 7];
    } else if (inv === '2') {
        // 7th in bass, Root, 3, 5
        rotated = [notesDegrees[3], notesDegrees[0] + 7, notesDegrees[1] + 7, notesDegrees[2] + 7];
    }
    // 7 (Root position)
    else if (inv === '7') {
        // no rotation
    }
    // 53 (Triad Root)
    else if (inv === '53') {
        // no rotation
    }
    // 3 (Incomplete triad - root + third only)
    else if (inv === '3') {
        // no rotation, structure already set to [0, 2]
    }

    // Convert degrees to Note names
    return rotated.map((deg) => getNote(deg));
};

// Sequence Definitions
const SEQUENCE_A = [
    { f: 'T', i: '53', h: false, label: 'T53' },
    { f: 'S', i: '64', h: false, label: 'S64' },
    { f: 'II', i: '2', h: true, label: 'II2-harm' },
    { f: 'D', i: '65', h: false, label: 'D65' },
    { f: 'T', i: '53', h: false, label: 'T53' },
] as const;

const SEQUENCE_B = [
    { f: 'T', i: '6', h: false, label: 'T6' },
    { f: 'S', i: '53', h: false, label: 'S53' },
    { f: 'II', i: '65', h: true, label: 'II65-harm' },
    { f: 'D', i: '2', h: false, label: 'D2' },
    { f: 'T', i: '6', h: false, label: 'T6' },
] as const;

const SEQUENCE_C = [
    { f: 'T', i: '64', h: false, label: 'T64' },
    { f: 'S', i: '6', h: false, label: 'S6' },
    { f: 'II', i: '43', h: true, label: 'II43-harm' },
    { f: 'D', i: '7', h: false, label: 'D7' },
    { f: 'T', i: '3', h: false, label: 'T3' },
] as const;

const SEQUENCE_D = [
    { f: 'T', i: '53', h: false, label: 'T53' },
    { f: 'S', i: '64', h: false, label: 'S64' },
    { f: 'II', i: '2', h: true, label: 'II2-harm' },
    { f: 'VII', i: '7', h: true, label: 'VII7-harm' },
    { f: 'D', i: '65', h: false, label: 'D65' },
    { f: 'T', i: '53', h: false, label: 'T53' },
] as const;

const SEQUENCE_E = [
    { f: 'T', i: '6', h: false, label: 'T6' },
    { f: 'S', i: '53', h: false, label: 'S53' },
    { f: 'II', i: '65', h: true, label: 'II65-harm' },
    { f: 'VII', i: '43', h: true, label: 'VII43-harm' },
    { f: 'D', i: '2', h: false, label: 'D2' },
    { f: 'T', i: '6', h: false, label: 'T6' },
] as const;

const SEQUENCE_F = [
    { f: 'T', i: '64', h: false, label: 'T64' },
    { f: 'S', i: '6', h: false, label: 'S6' },
    { f: 'II', i: '43', h: true, label: 'II43-harm' },
    { f: 'VII', i: '2', h: true, label: 'VII2-harm' },
    { f: 'D', i: '7', h: false, label: 'D7' },
    { f: 'T', i: '3', h: false, label: 'T3' },
] as const;

// Ordered by complexity (circle of fifths / practical usage)
const KEYS = ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#'];

const generateQuestionsForSequence = (sequence: typeof SEQUENCE_A, seqName: string): Question[] => {
    const questions: Question[] = [];
    const sequenceLabels = sequence.map((s) => s.label);

    KEYS.forEach((key) => {
        sequence.forEach((step, idx) => {
            const notes = generateChord(key, step.f, step.i, step.h);
            const noteNames = notes.map((n) => Note.pitchClass(n)).join(' - ');
            questions.push({
                id: `${seqName}-${key}-${idx}`,
                textKey: 'lessons.playChord',
                textParams: { label: step.label },
                targetChord: `${key} Major`,
                validate: (inputNotes) => {
                    if (inputNotes.length === 0) return false;
                    const targetChromas = notes.map((n) => Note.chroma(n));
                    const inputChromas = inputNotes.map((n) => Note.chroma(n));

                    if (targetChromas.length !== inputChromas.length) return false;
                    if (!targetChromas.every((t) => inputChromas.includes(t))) return false;

                    // Strict Bass Check
                    const sortedInput = [...inputNotes].sort(
                        (a, b) => (Note.midi(a) || 0) - (Note.midi(b) || 0)
                    );
                    const sortedTarget = [...notes].sort(
                        (a, b) => (Note.midi(a) || 0) - (Note.midi(b) || 0)
                    );

                    return Note.chroma(sortedInput[0]) === Note.chroma(sortedTarget[0]);
                },
                hintKey: 'lessons.progressionHint',
                hintParams: { notes: noteNames },
                clef: 'treble',
                keySignature: key,
                metadata: {
                    key: key,
                    progressionIndex: idx,
                    progressionTotal: sequence.length,
                    progressionLabel: step.label,
                    functionalSequence: sequenceLabels,
                },
            });
        });
    });

    return questions;
};

// Create Lesson Objects
const createLesson = (
    id: string,
    sequence: any,
    name: string,
    titleKey: string,
    descriptionKey: string
): Lesson => {
    const qs = generateQuestionsForSequence(sequence, name);
    return {
        id,
        type: 'progression',
        titleKey,
        descriptionKey,
        questions: qs,
        generateQuestion: () => qs[0],
    };
};

export const LessonSequenceA = createLesson(
    'seq-a',
    SEQUENCE_A,
    'seq-a',
    'lessons.seqA.title',
    'lessons.seqA.description'
);
export const LessonSequenceB = createLesson(
    'seq-b',
    SEQUENCE_B,
    'seq-b',
    'lessons.seqB.title',
    'lessons.seqB.description'
);
export const LessonSequenceC = createLesson(
    'seq-c',
    SEQUENCE_C,
    'seq-c',
    'lessons.seqC.title',
    'lessons.seqC.description'
);

export const LessonSequenceD = createLesson(
    'seq-d',
    SEQUENCE_D,
    'seq-d',
    'lessons.seqD.title',
    'lessons.seqD.description'
);
export const LessonSequenceE = createLesson(
    'seq-e',
    SEQUENCE_E,
    'seq-e',
    'lessons.seqE.title',
    'lessons.seqE.description'
);
export const LessonSequenceF = createLesson(
    'seq-f',
    SEQUENCE_F,
    'seq-f',
    'lessons.seqF.title',
    'lessons.seqF.description'
);
