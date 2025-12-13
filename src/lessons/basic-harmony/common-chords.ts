import type { Lesson, Question } from '../types';
import { MusicTheory } from '../../engine/MusicTheory';
import { Key, Chord } from 'tonal';

const KEYS = ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'];

type ChordSpec = {
    id: string;
    title: { en: string; ru: string };
    description: { en: string; ru: string };
    chordTypes: Array<{
        nameEn: string;
        nameRu: string;
        symbol: string;
        hintEn: string;
        hintRu: string;
    }>;
};

const buildQuestions = (lessonId: string, chordTypes: ChordSpec['chordTypes']): Question[] => {
    const questions: Question[] = [];

    KEYS.forEach((key) => {
        chordTypes.forEach((type) => {
            const root = key;
            const chordName = `${root}${type.symbol}`;

            const typeLabelForId = type.symbol || 'triad';

            const chordNotes = Chord.get(chordName).notes;
            const noteList = chordNotes.length ? chordNotes.join(' - ') : '';

            let keySig = key;
            if (type.nameEn.toLowerCase().includes('minor')) {
                keySig = Key.minorKey(key).relativeMajor;
            }

            questions.push({
                id: `${lessonId}-${root}-${typeLabelForId}`,
                text: {
                    en: `Build ${root} ${type.nameEn}`,
                    ru: `Постройте ${root} ${type.nameRu}`,
                },
                targetChord: chordName,
                clef: 'treble',
                keySignature: keySig,
                hint: {
                    en: `${type.hintEn}${noteList ? ` Notes: ${noteList}` : ''}`,
                    ru: `${type.hintRu}${noteList ? ` Ноты: ${noteList}` : ''}`,
                },
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
        title: spec.title,
        description: spec.description,
        questions: qs,
        generateQuestion: () => qs[0],
    };
};

export const SeventhChordsLesson: Lesson = makeLesson({
    id: 'basic-seventh-chords',
    title: {
        en: 'Building 7th Chords',
        ru: 'Построение септаккордов',
    },
    description: {
        en: 'Learn to build the most common seventh chords in root position.',
        ru: 'Научитесь строить самые распространённые септаккорды в основном виде.',
    },
    chordTypes: [
        {
            nameEn: 'Major 7 (maj7)',
            nameRu: 'мажорный септаккорд (maj7)',
            symbol: 'maj7',
            hintEn: 'Major 7 chord: root + major 3rd + perfect 5th + major 7th.',
            hintRu: 'Мажорный септаккорд: тоника + большая терция + чистая квинта + большая септима.',
        },
        {
            nameEn: 'Minor 7 (m7)',
            nameRu: 'минорный септаккорд (m7)',
            symbol: 'm7',
            hintEn: 'Minor 7 chord: root + minor 3rd + perfect 5th + minor 7th.',
            hintRu: 'Минорный септаккорд: тоника + малая терция + чистая квинта + малая септима.',
        },
        {
            nameEn: 'Dominant 7 (7)',
            nameRu: 'доминантсептаккорд (7)',
            symbol: '7',
            hintEn: 'Dominant 7 chord: root + major 3rd + perfect 5th + minor 7th.',
            hintRu: 'Доминантсептаккорд: тоника + большая терция + чистая квинта + малая септима.',
        },
        {
            nameEn: 'Half-diminished 7 (m7♭5)',
            nameRu: 'полууменьшенный септаккорд (m7♭5)',
            symbol: 'm7b5',
            hintEn: 'Half-diminished: root + minor 3rd + diminished 5th + minor 7th.',
            hintRu: 'Полууменьшенный: тоника + малая терция + уменьшенная квинта + малая септима.',
        },
    ],
});

export const SusChordsLesson: Lesson = makeLesson({
    id: 'basic-sus-chords',
    title: {
        en: 'Building Sus Chords',
        ru: 'Построение sus-аккордов',
    },
    description: {
        en: 'Build suspended chords (sus2 and sus4) in different keys.',
        ru: 'Постройте задержанные аккорды (sus2 и sus4) в разных тональностях.',
    },
    chordTypes: [
        {
            nameEn: 'Sus2 (sus2)',
            nameRu: 'sus2',
            symbol: 'sus2',
            hintEn: 'Sus2 replaces the 3rd with the 2nd: root + 2nd + 5th.',
            hintRu: 'В sus2 терция заменена на секунду: тоника + секунда + квинта.',
        },
        {
            nameEn: 'Sus4 (sus4)',
            nameRu: 'sus4',
            symbol: 'sus4',
            hintEn: 'Sus4 replaces the 3rd with the 4th: root + 4th + 5th.',
            hintRu: 'В sus4 терция заменена на кварту: тоника + кварта + квинта.',
        },
    ],
});

export const AlteredTriadsLesson: Lesson = makeLesson({
    id: 'basic-altered-triads',
    title: {
        en: 'Building Diminished / Augmented Triads',
        ru: 'Построение уменьшённых и увеличенных трезвучий',
    },
    description: {
        en: 'Build diminished (dim) and augmented (aug) triads in different keys.',
        ru: 'Постройте уменьшённые (dim) и увеличенные (aug) трезвучия в разных тональностях.',
    },
    chordTypes: [
        {
            nameEn: 'Diminished triad (dim)',
            nameRu: 'уменьшённое трезвучие (dim)',
            symbol: 'dim',
            hintEn: 'Diminished triad: root + minor 3rd + diminished 5th.',
            hintRu: 'Уменьшённое трезвучие: тоника + малая терция + уменьшенная квинта.',
        },
        {
            nameEn: 'Augmented triad (aug)',
            nameRu: 'увеличенное трезвучие (aug)',
            symbol: 'aug',
            hintEn: 'Augmented triad: root + major 3rd + augmented 5th.',
            hintRu: 'Увеличенное трезвучие: тоника + большая терция + увеличенная квинта.',
        },
    ],
});
