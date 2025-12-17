import type { Lesson, Question } from '../types';
import { MusicTheory } from '../../engine/MusicTheory';
import { Key } from 'tonal';

const KEYS = ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'];

type ChordSpec = {
    id: string;
    titleKey: string;
    descriptionKey: string;
    chordTypes: Array<{
        nameEn: string;
        symbol: string;
        hintKey: string;
    }>;
};

const buildQuestions = (lessonId: string, chordTypes: ChordSpec['chordTypes']): Question[] => {
    const questions: Question[] = [];

    KEYS.forEach((key) => {
        chordTypes.forEach((type) => {
            const root = key;
            const chordName = `${root}${type.symbol}`;

            const typeLabelForId = type.symbol || 'triad';

            let keySig = key;
            if (type.nameEn.toLowerCase().includes('minor')) {
                keySig = Key.minorKey(key).relativeMajor;
            }

            questions.push({
                id: `${lessonId}-${root}-${typeLabelForId}`,
                textKey: 'lessons.seventhChords.buildChord',
                textParams: { root, type: type.nameEn },
                targetChord: chordName,
                clef: 'treble',
                keySignature: keySig,
                hintKey: type.hintKey,
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

const makeLesson = (spec: ChordSpec): Lesson => {
    const qs = buildQuestions(spec.id, spec.chordTypes);

    return {
        id: spec.id,
        titleKey: spec.titleKey,
        descriptionKey: spec.descriptionKey,
        questions: qs,
        generateQuestion: () => qs[0],
    };
};

export const SeventhChordsLesson: Lesson = makeLesson({
    id: 'basic-seventh-chords',
    titleKey: 'lessons.seventhChords.title',
    descriptionKey: 'lessons.seventhChords.description',
    chordTypes: [
        { nameEn: 'Major 7 (maj7)', symbol: 'maj7', hintKey: 'lessons.chordHints.maj7' },
        { nameEn: 'Minor 7 (m7)', symbol: 'm7', hintKey: 'lessons.chordHints.m7' },
        { nameEn: 'Dominant 7 (7)', symbol: '7', hintKey: 'lessons.chordHints.dom7' },
        { nameEn: 'Half-diminished 7 (m7♭5)', symbol: 'm7b5', hintKey: 'lessons.chordHints.m7b5' },
    ],
});

export const SusChordsLesson: Lesson = makeLesson({
    id: 'basic-sus-chords',
    titleKey: 'lessons.susChords.title',
    descriptionKey: 'lessons.susChords.description',
    chordTypes: [
        { nameEn: 'Sus2 (sus2)', symbol: 'sus2', hintKey: 'lessons.chordHints.sus2' },
        { nameEn: 'Sus4 (sus4)', symbol: 'sus4', hintKey: 'lessons.chordHints.sus4' },
    ],
});

export const AlteredTriadsLesson: Lesson = makeLesson({
    id: 'basic-altered-triads',
    titleKey: 'lessons.alteredTriads.title',
    descriptionKey: 'lessons.alteredTriads.description',
    chordTypes: [
        { nameEn: 'Diminished triad (dim)', symbol: 'dim', hintKey: 'lessons.chordHints.dim' },
        { nameEn: 'Augmented triad (aug)', symbol: 'aug', hintKey: 'lessons.chordHints.aug' },
    ],
});
