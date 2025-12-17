import type { Exercise, ExerciseQuestion } from '../types';

const MAJOR_KEYS = [
    { key: 'C', sharps: 0, flats: 0 },
    { key: 'G', sharps: 1, flats: 0 },
    { key: 'D', sharps: 2, flats: 0 },
    { key: 'A', sharps: 3, flats: 0 },
    { key: 'E', sharps: 4, flats: 0 },
    { key: 'B', sharps: 5, flats: 0 },
    { key: 'F#', sharps: 6, flats: 0 },
    { key: 'F', sharps: 0, flats: 1 },
    { key: 'Bb', sharps: 0, flats: 2 },
    { key: 'Eb', sharps: 0, flats: 3 },
    { key: 'Ab', sharps: 0, flats: 4 },
    { key: 'Db', sharps: 0, flats: 5 },
    { key: 'Gb', sharps: 0, flats: 6 },
];

const RELATIVE_MINORS: Record<string, string> = {
    C: 'Am',
    G: 'Em',
    D: 'Bm',
    A: 'F#m',
    E: 'C#m',
    B: 'G#m',
    'F#': 'D#m',
    F: 'Dm',
    Bb: 'Gm',
    Eb: 'Cm',
    Ab: 'Fm',
    Db: 'Bbm',
    Gb: 'Ebm',
};

const SHARP_ORDER = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
const FLAT_ORDER = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'];

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateOptions(correctKey: string, includeMinor: boolean): string[] {
    const options = [correctKey];
    let allKeys = MAJOR_KEYS.map((k) => k.key);

    if (includeMinor) {
        allKeys = [...allKeys, ...Object.values(RELATIVE_MINORS)];
    }

    const otherKeys = allKeys.filter((k) => k !== correctKey);
    const shuffled = shuffle(otherKeys);
    options.push(...shuffled.slice(0, 5));
    return shuffle(options);
}

function generateKeySignatureQuestion(includeMinor: boolean = false): ExerciseQuestion {
    const keyData = MAJOR_KEYS[Math.floor(Math.random() * MAJOR_KEYS.length)];
    const useMajor = !includeMinor || Math.random() > 0.5;

    const correctKey = useMajor ? keyData.key : RELATIVE_MINORS[keyData.key];

    return {
        id: `key-sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'key-signature',
        prompt: {
            en: 'What key is this signature?',
            ru: 'Какой тональности соответствует этот ключевой знак?',
        },
        clef: 'treble',
        keySignature: keyData.key,
        displayNotes: [],
        correctAnswer: correctKey,
        options: generateOptions(correctKey, includeMinor),
        difficulty: includeMinor ? 'hard' : 'medium',
    };
}

export const KeySignatureIdentificationExercise: Exercise = {
    id: 'key-signature-identification',
    categoryId: 'staff-reading',
    title: {
        en: 'Key Signature Identification',
        ru: 'Определение ключевых знаков',
    },
    description: {
        en: 'Show a key signature → choose the key (Major keys, then add relative minor at harder levels).',
        ru: 'Показан ключевой знак → выберите тональность (сначала мажор, затем относительный минор).',
    },
    generateQuestion: () => generateKeySignatureQuestion(false),
    settings: {
        difficulty: 'medium',
    },
};

function getAffectedNotes(keySignature: string): string[] {
    const keyData = MAJOR_KEYS.find((k) => k.key === keySignature);
    if (!keyData) return [];

    if (keyData.sharps > 0) {
        return SHARP_ORDER.slice(0, keyData.sharps);
    } else if (keyData.flats > 0) {
        return FLAT_ORDER.slice(0, keyData.flats);
    }
    return [];
}

function generateAffectedNotesQuestion(): ExerciseQuestion {
    // Exclude C major (no accidentals)
    const keysWithAccidentals = MAJOR_KEYS.filter((k) => k.sharps > 0 || k.flats > 0);
    const keyData = keysWithAccidentals[Math.floor(Math.random() * keysWithAccidentals.length)];

    const affectedNotes = getAffectedNotes(keyData.key);
    const correctAnswer = affectedNotes.join(', ');

    // Generate wrong options by using different keys' affected notes
    const options = [correctAnswer];
    const otherKeys = keysWithAccidentals.filter((k) => k.key !== keyData.key);
    const shuffledKeys = shuffle(otherKeys);

    for (let i = 0; i < 3 && i < shuffledKeys.length; i++) {
        const wrongNotes = getAffectedNotes(shuffledKeys[i].key);
        options.push(wrongNotes.join(', '));
    }

    return {
        id: `key-notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'key-signature',
        prompt: {
            en: `In ${keyData.key} major, which notes are ${
                keyData.sharps > 0 ? 'sharp' : 'flat'
            }?`,
            ru: `В ${keyData.key} мажоре, какие ноты ${
                keyData.sharps > 0 ? 'диезные' : 'бемольные'
            }?`,
        },
        clef: 'treble',
        keySignature: keyData.key,
        displayNotes: [],
        correctAnswer,
        options: shuffle(options),
        difficulty: 'hard',
        hint: {
            en:
                keyData.sharps > 0
                    ? 'Sharps follow the order: F, C, G, D, A, E, B'
                    : 'Flats follow the order: B, E, A, D, G, C, F',
            ru:
                keyData.sharps > 0
                    ? 'Диезы идут в порядке: F, C, G, D, A, E, B'
                    : 'Бемоли идут в порядке: B, E, A, D, G, C, F',
        },
    };
}

export const KeySignatureNotesExercise: Exercise = {
    id: 'key-signature-notes',
    categoryId: 'staff-reading',
    title: {
        en: 'Key Signature: Affected Notes',
        ru: 'Ключевые знаки: Изменённые ноты',
    },
    description: {
        en: 'Given a key signature, identify which notes are sharp or flat.',
        ru: 'По ключевому знаку определите, какие ноты диезные или бемольные.',
    },
    generateQuestion: generateAffectedNotesQuestion,
    settings: {
        difficulty: 'hard',
    },
};
