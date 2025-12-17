import type { Exercise, ExerciseQuestion, Clef } from '../types';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ACCIDENTALS = ['#', 'b'];
const OCTAVES_TREBLE = [4, 5];
const OCTAVES_BASS = [2, 3];

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateOptions(correctNote: string): string[] {
    const options = [correctNote];
    const allPossibleNotes: string[] = [];

    NOTES.forEach((note) => {
        allPossibleNotes.push(note);
        allPossibleNotes.push(`${note}#`);
        allPossibleNotes.push(`${note}b`);
    });

    const otherNotes = allPossibleNotes.filter((n) => n !== correctNote);
    const shuffled = shuffle(otherNotes);
    options.push(...shuffled.slice(0, 5));
    return shuffle(options);
}

function generateQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
    const octaves = clef === 'treble' ? OCTAVES_TREBLE : OCTAVES_BASS;
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    const noteName = NOTES[Math.floor(Math.random() * NOTES.length)];
    const accidental = ACCIDENTALS[Math.floor(Math.random() * ACCIDENTALS.length)];

    const noteWithAccidental = `${noteName}${accidental}`;
    const fullNote = `${noteWithAccidental}${octave}`;

    return {
        id: `accidental-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'note-identification',
        prompt: {
            en: 'Name this note (including accidental)',
            ru: 'Назовите эту ноту (с учётом знака альтерации)',
        },
        clef,
        keySignature: 'C',
        displayNotes: [fullNote],
        correctAnswer: noteWithAccidental,
        options: generateOptions(noteWithAccidental),
        difficulty: 'medium',
    };
}

export const AccidentalReadingExercise: Exercise = {
    id: 'accidental-reading',
    categoryId: 'staff-reading',
    title: {
        en: 'Accidental Reading',
        ru: 'Чтение знаков альтерации',
    },
    description: {
        en: 'A note with ♯/♭ appears — identify the sounding note (e.g., "F#", "Bb").',
        ru: 'Появляется нота со знаком ♯/♭ — определите звучащую ноту (например, "F#", "Bb").',
    },
    generateQuestion,
    settings: {
        includeAccidentals: true,
        clefs: ['treble', 'bass'],
        difficulty: 'medium',
    },
};
