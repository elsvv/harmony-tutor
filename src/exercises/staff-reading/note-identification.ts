import type { Exercise, ExerciseQuestion, Clef } from '../types';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
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
    const otherNotes = NOTES.filter((n) => n !== correctNote);
    const shuffled = shuffle(otherNotes);
    options.push(...shuffled.slice(0, 3));
    return shuffle(options);
}

function generateQuestion(clef: Clef = 'treble'): ExerciseQuestion {
    const octaves = clef === 'treble' ? OCTAVES_TREBLE : OCTAVES_BASS;
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    const noteName = NOTES[Math.floor(Math.random() * NOTES.length)];
    const fullNote = `${noteName}${octave}`;

    return {
        id: `note-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'note-identification',
        prompt: {
            en: 'Name this note',
            ru: 'Назовите эту ноту',
        },
        clef,
        keySignature: 'C',
        displayNotes: [fullNote],
        correctAnswer: noteName,
        options: generateOptions(noteName),
        difficulty: 'easy',
    };
}

export const NoteIdentificationExercise: Exercise = {
    id: 'staff-note-identification',
    categoryId: 'staff-reading',
    title: {
        en: 'Staff Note Identification',
        ru: 'Определение нот на нотоносце',
    },
    description: {
        en: 'Identify single notes on the musical staff. A great starting point for reading music.',
        ru: 'Определите ноту на нотном стане. Отличное начало для чтения нот.',
    },
    generateQuestion: () => generateQuestion('treble'),
    settings: {
        clefs: ['treble'],
        difficulty: 'easy',
    },
};

export const NoteIdentificationClefSwitchingExercise: Exercise = {
    id: 'staff-note-clef-switching',
    categoryId: 'staff-reading',
    title: {
        en: 'Note ID: Treble vs Bass',
        ru: 'Ноты: Скрипичный и Басовый ключи',
    },
    description: {
        en: 'Same as above but the clef randomly switches. Train to adapt quickly!',
        ru: 'То же самое, но ключ меняется случайным образом. Тренируйтесь быстро адаптироваться!',
    },
    generateQuestion: () => {
        const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
        return generateQuestion(clef);
    },
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'medium',
    },
};
