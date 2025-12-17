import { Note } from 'tonal';
import type { Exercise, ExerciseQuestion, Clef } from '../types';

const BASIC_INTERVALS = ['m2', 'M2', 'm3', 'M3', 'P4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];
const ROOT_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const INTERVAL_LABELS: Record<string, { en: string; ru: string }> = {
    m2: { en: 'minor 2nd', ru: 'малую секунду' },
    M2: { en: 'major 2nd', ru: 'большую секунду' },
    m3: { en: 'minor 3rd', ru: 'малую терцию' },
    M3: { en: 'major 3rd', ru: 'большую терцию' },
    P4: { en: 'perfect 4th', ru: 'чистую кварту' },
    A4: { en: 'augmented 4th', ru: 'увеличенную кварту' },
    d5: { en: 'diminished 5th', ru: 'уменьшенную квинту' },
    P5: { en: 'perfect 5th', ru: 'чистую квинту' },
    m6: { en: 'minor 6th', ru: 'малую сексту' },
    M6: { en: 'major 6th', ru: 'большую сексту' },
    m7: { en: 'minor 7th', ru: 'малую септиму' },
    M7: { en: 'major 7th', ru: 'большую септиму' },
    P8: { en: 'perfect octave', ru: 'чистую октаву' },
};

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
    const intervalLabel = INTERVAL_LABELS[interval];

    return {
        id: `interval-up-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-construction',
        prompt: {
            en: `Build a ${intervalLabel.en} UP from ${rootNote}`,
            ru: `Постройте ${intervalLabel.ru} ВВЕРХ от ${rootNote}`,
        },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave],
        correctAnswer: targetPitchClass,
        options: generateOptions(targetPitchClass, rootNote),
        difficulty: 'medium',
        hint: {
            en: `Start from ${rootNote} and count up ${interval}`,
            ru: `Начните с ${rootNote} и отсчитайте ${interval} вверх`,
        },
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
    const intervalLabel = INTERVAL_LABELS[interval];

    return {
        id: `interval-down-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-construction',
        prompt: {
            en: `Build a ${intervalLabel.en} DOWN from ${rootNote}`,
            ru: `Постройте ${intervalLabel.ru} ВНИЗ от ${rootNote}`,
        },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave],
        correctAnswer: targetPitchClass,
        options: generateOptions(targetPitchClass, rootNote),
        difficulty: 'hard',
        hint: {
            en: `Start from ${rootNote} and count down ${interval}`,
            ru: `Начните с ${rootNote} и отсчитайте ${interval} вниз`,
        },
    };
}

export const IntervalConstructionUpExercise: Exercise = {
    id: 'interval-construction-up',
    categoryId: 'intervals',
    title: {
        en: 'Interval Construction (Up)',
        ru: 'Построение интервалов (Вверх)',
    },
    description: {
        en: 'Given a starting note and target interval ("Build a P5 up") → select the second note.',
        ru: 'Дана начальная нота и целевой интервал («Постройте ч5 вверх») → выберите вторую ноту.',
    },
    generateQuestion: generateUpwardQuestion,
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'medium',
    },
};

export const IntervalConstructionDownExercise: Exercise = {
    id: 'interval-construction-down',
    categoryId: 'intervals',
    title: {
        en: 'Interval Construction (Down)',
        ru: 'Построение интервалов (Вниз)',
    },
    description: {
        en: 'Same as above, but build the interval downward.',
        ru: 'То же самое, но постройте интервал вниз.',
    },
    generateQuestion: generateDownwardQuestion,
    settings: {
        clefs: ['treble', 'bass'],
        difficulty: 'hard',
    },
};
