import { Note } from 'tonal';
import type { Exercise, ExerciseQuestion, Clef } from '../types';

const ROOT_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Intervals grouped by number for quality comparison
const INTERVALS_BY_NUMBER: Record<
    string,
    { quality: string; interval: string; semitones: number }[]
> = {
    '2nd': [
        { quality: 'minor', interval: 'm2', semitones: 1 },
        { quality: 'major', interval: 'M2', semitones: 2 },
    ],
    '3rd': [
        { quality: 'minor', interval: 'm3', semitones: 3 },
        { quality: 'major', interval: 'M3', semitones: 4 },
    ],
    '4th': [
        { quality: 'perfect', interval: 'P4', semitones: 5 },
        { quality: 'augmented', interval: 'A4', semitones: 6 },
    ],
    '5th': [
        { quality: 'diminished', interval: 'd5', semitones: 6 },
        { quality: 'perfect', interval: 'P5', semitones: 7 },
    ],
    '6th': [
        { quality: 'minor', interval: 'm6', semitones: 8 },
        { quality: 'major', interval: 'M6', semitones: 9 },
    ],
    '7th': [
        { quality: 'minor', interval: 'm7', semitones: 10 },
        { quality: 'major', interval: 'M7', semitones: 11 },
    ],
};

// Quality and number labels are now in i18n locales under intervals.quality and intervals.number

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateOptions(correctNote: string, rootNote: string, intervalNumber: string): string[] {
    const options = [correctNote];

    // Add notes from different qualities of the same interval number
    const intervalsOfNumber = INTERVALS_BY_NUMBER[intervalNumber];
    intervalsOfNumber.forEach((intData) => {
        const rootMidi = Note.midi(`${rootNote}4`);
        if (rootMidi) {
            const noteMidi = rootMidi + intData.semitones;
            const note = Note.fromMidi(noteMidi);
            if (note) {
                const pc = Note.pitchClass(note);
                if (pc && !options.includes(pc)) {
                    options.push(pc);
                }
            }
        }
    });

    // Add some random notes to fill options
    const allNotes = [
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
        'Db',
        'Eb',
        'Gb',
        'Ab',
        'Bb',
    ];
    const shuffledNotes = shuffle(allNotes.filter((n) => !options.includes(n)));

    while (options.length < 6 && shuffledNotes.length > 0) {
        options.push(shuffledNotes.pop()!);
    }

    return shuffle(options);
}

function generateQuestion(): ExerciseQuestion {
    const clef: Clef = Math.random() > 0.5 ? 'treble' : 'bass';
    const octave = clef === 'treble' ? 4 : 3;

    const rootNote = ROOT_NOTES[Math.floor(Math.random() * ROOT_NOTES.length)];
    const intervalNumbers = Object.keys(INTERVALS_BY_NUMBER);
    const intervalNumber = intervalNumbers[Math.floor(Math.random() * intervalNumbers.length)];
    const intervalsOfNumber = INTERVALS_BY_NUMBER[intervalNumber];
    const chosenInterval = intervalsOfNumber[Math.floor(Math.random() * intervalsOfNumber.length)];

    const rootWithOctave = `${rootNote}${octave}`;
    const rootMidi = Note.midi(rootWithOctave);

    if (!rootMidi) {
        return generateQuestion();
    }

    const targetMidi = rootMidi + chosenInterval.semitones;
    const targetNote = Note.fromMidi(targetMidi);

    if (!targetNote) {
        return generateQuestion();
    }

    const targetPitchClass = Note.pitchClass(targetNote) || targetNote;

    return {
        id: `interval-quality-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'interval-construction',
        promptKey: 'exercises.intervalQualityDrill.prompt',
        promptParams: { note: rootNote, quality: chosenInterval.quality, number: intervalNumber },
        clef,
        keySignature: 'C',
        displayNotes: [rootWithOctave],
        correctAnswer: targetPitchClass,
        options: generateOptions(targetPitchClass, rootNote, intervalNumber),
        difficulty: 'hard',
        hintKey: 'exercises.intervalQualityDrill.hint',
        hintParams: {
            quality: chosenInterval.quality,
            number: intervalNumber,
            semitones: String(chosenInterval.semitones),
        },
    };
}

export const IntervalQualityDrillExercise: Exercise = {
    id: 'interval-quality-drill',
    categoryId: 'intervals',
    titleKey: 'exercises.intervalQualityDrill.title',
    descriptionKey: 'exercises.intervalQualityDrill.description',
    generateQuestion,
    settings: {
        difficulty: 'hard',
    },
};
