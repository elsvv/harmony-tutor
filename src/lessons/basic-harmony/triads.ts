import type { Lesson, Question } from '../types';
import { MusicTheory } from '../../engine/MusicTheory';
import { Key } from 'tonal';

const KEYS = ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'];
const CHORD_TYPES = [
    { name: 'Major', symbol: 'M' },
    { name: 'Minor', symbol: 'm' },
];

const generateAllQuestions = (): Question[] => {
    const questions: Question[] = [];
    KEYS.forEach((key) => {
        CHORD_TYPES.forEach((type) => {
            const root = key;
            const chordName = `${root}${type.symbol}`;

            // Determine key signature:
            let keySig = key;
            if (type.name === 'Minor') {
                keySig = Key.minorKey(key).relativeMajor;
            }

            questions.push({
                id: `${root}-${type.symbol}`,
                textKey: 'lessons.triads.buildTriad',
                textParams: { root, type: type.name },
                targetChord: chordName,
                clef: 'treble',
                keySignature: keySig,
                hintKey:
                    type.name === 'Major' ? 'lessons.triads.hintMajor' : 'lessons.triads.hintMinor',
                validate: (notes: string[]) => MusicTheory.validateChord(notes, chordName),
            });
        });
    });
    // Fisher-Yates shuffle
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
};

export const TriadsLesson: Lesson = {
    id: 'basic-triads',
    titleKey: 'lessons.triads.title',
    descriptionKey: 'lessons.triads.description',
    questions: generateAllQuestions(),
    generateQuestion: () => {
        const q = generateAllQuestions()[0];
        return q;
    },
};
