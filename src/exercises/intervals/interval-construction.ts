import { Note } from 'tonal';
import type { Exercise, ExerciseQuestion, Clef } from '../types';

const BASIC_INTERVALS = ['m2', 'M2', 'm3', 'M3', 'P4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];
const ROOT_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Interval labels are now in i18n locales under intervals.labels

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateOptions(correctNote: string, rootNote: string): string[] {
    const options = [correctNote];

    // Generate plausible wrong answers using other intervals from same root
    const wrongIntervals = BASIC_INTERVALS.filter((i) => {
        const result = Note.transpose(`${rootNote}4`, i);
        return result && Note.pitchClass(result) !== Note.pitchClass(correctNote);
    });

    const shuffled = shuffle(wrongIntervals);
    for (let i = 0; i < 5 && i < shuffled.length; i++) {
        const wrongNote = Note.transpose(`${rootNote}4`, shuffled[i]);
        if (wrongNote) {
            options.push(Note.pitchClass(wrongNote) || wrongNote);
        }
    }

    return shuffle(options);
}

function generateUpwardQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
    const octave = clef === 'treble' ? 4 : 3;

    const rootNote = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
    const interval = BASIC_INTERVALS[Math.floor(Math.random() * BASIC_INTERVALS.length)];

    const rootWithOctave = `${rootNote}${octave}`;
    const targetNote = Note.transpose(rootWithOctave, interval);

    if (!targetNote) {
        return generateUpwardQuestion();
    }

    const targetPitchClass = Note.pitchClass(targetNote) || targetNote;

    return {
        id: `interval-up-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-construction',
        promptKey: 'exercises.intervalConstructionUp.promptUp',
        promptParams: { interval, note: rootNote },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave],
        correctAnswer: targetPitchClass,
        options: generateOptions(targetPitchClass, rootNote),
        difficulty: 'medium',
        hintKey: 'exercises.intervalConstructionUp.hintUp',
        hintParams: { note: rootNote, interval },
    };
}

function generateDownwardQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
    const octave = clef === 'treble' ? 5 : 3;

    const rootNote = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
    const interval = BASIC_INTERVALS[Math.floor(Math.random() * BASIC_INTERVALS.length)];

    const rootWithOctave = `${rootNote}${octave}`;

    // Use semitones for downward calculation
    const semitones: Record<string, number> = {
        m2: 1,
        M2: 2,
        m3: 3,
        M3: 4,
        P4: 5,
        A4: 6,
        d5: 6,
        P5: 7,
        m6: 8,
        M6: 9,
        m7: 10,
        M7: 11,
        P8: 12,
    };

    const st = semitones[interval as keyof typeof semitones] || 0;
    const rootMidi = Note.midi(rootWithOctave);
    if (!rootMidi) return generateDownwardQuestion();

    const targetMidi = rootMidi - st;
    const targetNoteResult = Note.fromMidi(targetMidi);

    if (!targetNoteResult) {
        return generateDownwardQuestion();
    }

    const targetPitchClass = Note.pitchClass(targetNoteResult) || targetNoteResult;

    return {
        id: `interval-down-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-construction',
        promptKey: 'exercises.intervalConstructionDown.promptDown',
        promptParams: { interval, note: rootNote },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave],
        correctAnswer: targetPitchClass,
        options: generateOptions(targetPitchClass, rootNote),
        difficulty: 'hard',
        hintKey: 'exercises.intervalConstructionDown.hintDown',
        hintParams: { note: rootNote, interval },
    };
}

export const IntervalConstructionUpExercise: Exercise = {
    id: 'interval-construction-up',
    categoryId: 'intervals',
    titleKey: 'exercises.intervalConstructionUp.title',
    descriptionKey: 'exercises.intervalConstructionUp.description',
    generateQuestion: generateUpwardQuestion,
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'medium',
    },
};

export const IntervalConstructionDownExercise: Exercise = {
    id: 'interval-construction-down',
    categoryId: 'intervals',
    titleKey: 'exercises.intervalConstructionDown.title',
    descriptionKey: 'exercises.intervalConstructionDown.description',
    generateQuestion: generateDownwardQuestion,
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'hard',
    },
};
