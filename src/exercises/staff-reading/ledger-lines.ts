import type { Exercise, ExerciseQuestion, Clef } from '../types';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Ledger line notes - above and below the staff
const LEDGER_TREBLE_ABOVE = ['A5', 'B5', 'C6', 'D6', 'E6'];
const LEDGER_TREBLE_BELOW = ['C4', 'B3', 'A3', 'G3'];
const LEDGER_BASS_ABOVE = ['C4', 'D4', 'E4'];
const LEDGER_BASS_BELOW = ['E2', 'D2', 'C2', 'B1', 'A1'];

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

function generateQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';

    let ledgerNotes: string[];
    if (clef === 'treble') {
        ledgerNotes = Math.random() > 0.5 ? LEDGER_TREBLE_ABOVE : LEDGER_TREBLE_BELOW;
    } else {
        ledgerNotes = Math.random() > 0.5 ? LEDGER_BASS_ABOVE : LEDGER_BASS_BELOW;
    }

    const fullNote = ledgerNotes[Math.floor(Math.random() * ledgerNotes.length)];
    const noteName = fullNote.charAt(0);

    return {
        id: `ledger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'note-identification',
        prompt: {
            en: 'Name this ledger line note',
            ru: 'Назовите эту ноту на добавочной линейке',
        },
        clef,
        keySignature: 'C',
        displayNotes: [fullNote],
        correctAnswer: noteName,
        options: generateOptions(noteName),
        difficulty: 'hard',
        hint: {
            en: 'Notes on ledger lines extend above or below the staff',
            ru: 'Добавочные линейки расширяют нотоносец вверх или вниз',
        },
    };
}

export const LedgerLinesExercise: Exercise = {
    id: 'ledger-lines-trainer',
    categoryId: 'staff-reading',
    title: {
        en: 'Ledger Lines Trainer',
        ru: 'Тренажёр добавочных линеек',
    },
    description: {
        en: 'Notes only above/below the staff — identify quickly for improved fluency.',
        ru: 'Только ноты выше/ниже нотоносца — определяйте быстро для развития беглости.',
    },
    generateQuestion,
    settings: {
        includeLedgerLines: true,
        clefs: ['treble', 'bass'],
        difficulty: 'hard',
    },
};
