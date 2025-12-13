import type { Lesson, Question } from '../types';
import { Chord, Key, Note } from 'tonal';
import { MusicTheory } from '../../engine/MusicTheory';

const KEYS = ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#'];

type Step = {
    label: string;
    getChordName: (key: string) => string;
};

const generateQuestionsForJazzProgression = (
    lessonId: string,
    steps: Step[],
    getQuestionText: (key: string, label: string, chordName: string) => { en: string; ru: string }
): Question[] => {
    const questions: Question[] = [];
    const functionalSequence = steps.map((s) => s.label);

    KEYS.forEach((key) => {
        steps.forEach((step, idx) => {
            const chordName = step.getChordName(key);
            const chordNotes = Chord.get(chordName).notes;

            questions.push({
                id: `${lessonId}-${key}-${idx}`,
                text: getQuestionText(key, step.label, chordName),
                targetChord: chordName,
                validate: (notes: string[]) => MusicTheory.validateChord(notes, chordName),
                hint: {
                    en: `Notes: ${chordNotes.join(' - ')}`,
                    ru: `Ноты: ${chordNotes.join(' - ')}`,
                },
                clef: 'treble',
                keySignature: key,
                metadata: {
                    key,
                    progressionIndex: idx,
                    progressionTotal: steps.length,
                    progressionLabel: step.label,
                    functionalSequence,
                },
            });
        });
    });

    return questions;
};

const majorImaj7 = (key: string) => Key.majorKey(key).chords[0];
const majorII7 = (key: string) => Key.majorKey(key).chords[1];
const majorV7 = (key: string) => Key.majorKey(key).chords[4];
const majorVi7 = (key: string) => Key.majorKey(key).chords[5];

const chordFromRoot = (root: string, suffix: string) => `${root}${suffix}`;

export const JazzIIVILesson: Lesson = {
    id: 'jazz-ii-v-i',
    type: 'progression',
    title: {
        en: 'Jazz: ii–V–I',
        ru: 'Джаз: ii–V–I',
    },
    description: {
        en: 'The most important jazz cadence: ii7 → V7 → Imaj7 in major keys.',
        ru: 'Главная джазовая каденция: ii7 → V7 → Imaj7 в мажорных тональностях.',
    },
    questions: generateQuestionsForJazzProgression(
        'jazz-ii-v-i',
        [
            { label: 'ii7', getChordName: (key) => majorII7(key) },
            { label: 'V7', getChordName: (key) => majorV7(key) },
            { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
        ],
        (key, label, chordName) => ({
            en: `In ${key} Major: Play ${label} (${chordName})`,
            ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
        })
    ),
    generateQuestion: () => {
        const qs = generateQuestionsForJazzProgression(
            'jazz-ii-v-i',
            [
                { label: 'ii7', getChordName: (key) => majorII7(key) },
                { label: 'V7', getChordName: (key) => majorV7(key) },
                { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
            ],
            (key, label, chordName) => ({
                en: `In ${key} Major: Play ${label} (${chordName})`,
                ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
            })
        );
        return qs[0];
    },
};

export const JazzTurnaroundLesson: Lesson = {
    id: 'jazz-turnaround',
    type: 'progression',
    title: {
        en: 'Jazz: I–vi–ii–V turnaround',
        ru: 'Джаз: оборот I–vi–ii–V',
    },
    description: {
        en: 'A classic turnaround: Imaj7 → vi7 → ii7 → V7 (loopable phrase ending).',
        ru: 'Классический turnaround: Imaj7 → vi7 → ii7 → V7 (оборот для завершения фразы).',
    },
    questions: generateQuestionsForJazzProgression(
        'jazz-turnaround',
        [
            { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
            { label: 'vi7', getChordName: (key) => majorVi7(key) },
            { label: 'ii7', getChordName: (key) => majorII7(key) },
            { label: 'V7', getChordName: (key) => majorV7(key) },
        ],
        (key, label, chordName) => ({
            en: `In ${key} Major: Play ${label} (${chordName})`,
            ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
        })
    ),
    generateQuestion: () => {
        const qs = generateQuestionsForJazzProgression(
            'jazz-turnaround',
            [
                { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
                { label: 'vi7', getChordName: (key) => majorVi7(key) },
                { label: 'ii7', getChordName: (key) => majorII7(key) },
                { label: 'V7', getChordName: (key) => majorV7(key) },
            ],
            (key, label, chordName) => ({
                en: `In ${key} Major: Play ${label} (${chordName})`,
                ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
            })
        );
        return qs[0];
    },
};

export const JazzBackdoorLesson: Lesson = {
    id: 'jazz-backdoor',
    type: 'progression',
    title: {
        en: 'Jazz: backdoor cadence',
        ru: 'Джаз: backdoor cadence',
    },
    description: {
        en: 'A common alternative resolution to the tonic: ivm7 → ♭VII7 → Imaj7.',
        ru: 'Популярный альтернативный путь к тонике: ivm7 → ♭VII7 → Imaj7.',
    },
    questions: generateQuestionsForJazzProgression(
        'jazz-backdoor',
        [
            {
                label: 'ivm7',
                getChordName: (key) => chordFromRoot(Note.transpose(key, '4P'), 'm7'),
            },
            {
                label: 'bVII7',
                getChordName: (key) => chordFromRoot(Note.transpose(key, '-2M'), '7'),
            },
            { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
        ],
        (key, label, chordName) => ({
            en: `In ${key} Major: Play ${label} (${chordName})`,
            ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
        })
    ),
    generateQuestion: () => {
        const qs = generateQuestionsForJazzProgression(
            'jazz-backdoor',
            [
                {
                    label: 'ivm7',
                    getChordName: (key) => chordFromRoot(Note.transpose(key, '4P'), 'm7'),
                },
                {
                    label: 'bVII7',
                    getChordName: (key) => chordFromRoot(Note.transpose(key, '-2M'), '7'),
                },
                { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
            ],
            (key, label, chordName) => ({
                en: `In ${key} Major: Play ${label} (${chordName})`,
                ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
            })
        );
        return qs[0];
    },
};

export const JazzTritoneSubLesson: Lesson = {
    id: 'jazz-tritone-sub',
    type: 'progression',
    title: {
        en: 'Jazz: tritone substitution',
        ru: 'Джаз: тритоновая замена',
    },
    description: {
        en: 'Replace V7 with ♭II7 inside ii–V–I: ii7 → ♭II7 → Imaj7.',
        ru: 'Замена V7 на ♭II7 в ii–V–I: ii7 → ♭II7 → Imaj7.',
    },
    questions: generateQuestionsForJazzProgression(
        'jazz-tritone-sub',
        [
            { label: 'ii7', getChordName: (key) => majorII7(key) },
            {
                label: 'bII7',
                getChordName: (key) => chordFromRoot(Note.transpose(key, '2m'), '7'),
            },
            { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
        ],
        (key, label, chordName) => ({
            en: `In ${key} Major: Play ${label} (${chordName})`,
            ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
        })
    ),
    generateQuestion: () => {
        const qs = generateQuestionsForJazzProgression(
            'jazz-tritone-sub',
            [
                { label: 'ii7', getChordName: (key) => majorII7(key) },
                {
                    label: 'bII7',
                    getChordName: (key) => chordFromRoot(Note.transpose(key, '2m'), '7'),
                },
                { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
            ],
            (key, label, chordName) => ({
                en: `In ${key} Major: Play ${label} (${chordName})`,
                ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
            })
        );
        return qs[0];
    },
};

export const JazzRhythmChangesBridgeLesson: Lesson = {
    id: 'jazz-rhythm-changes-bridge',
    type: 'progression',
    title: {
        en: 'Jazz: Rhythm Changes bridge',
        ru: 'Джаз: бридж Rhythm Changes',
    },
    description: {
        en: 'A dominant chain (often in Rhythm Changes): V/vi → V/ii → V/V → V7.',
        ru: 'Цепочка доминант (часто в Rhythm Changes): V/vi → V/ii → V/V → V7.',
    },
    questions: generateQuestionsForJazzProgression(
        'jazz-rhythm-changes-bridge',
        [
            {
                label: 'V/vi',
                getChordName: (key) => chordFromRoot(Note.transpose(key, '3M'), '7'),
            },
            {
                label: 'V/ii',
                getChordName: (key) => chordFromRoot(Note.transpose(key, '6M'), '7'),
            },
            {
                label: 'V/V',
                getChordName: (key) => chordFromRoot(Note.transpose(key, '2M'), '7'),
            },
            { label: 'V7', getChordName: (key) => majorV7(key) },
        ],
        (key, label, chordName) => ({
            en: `In ${key} Major: Play ${label} (${chordName})`,
            ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
        })
    ),
    generateQuestion: () => {
        const qs = generateQuestionsForJazzProgression(
            'jazz-rhythm-changes-bridge',
            [
                {
                    label: 'V/vi',
                    getChordName: (key) => chordFromRoot(Note.transpose(key, '3M'), '7'),
                },
                {
                    label: 'V/ii',
                    getChordName: (key) => chordFromRoot(Note.transpose(key, '6M'), '7'),
                },
                {
                    label: 'V/V',
                    getChordName: (key) => chordFromRoot(Note.transpose(key, '2M'), '7'),
                },
                { label: 'V7', getChordName: (key) => majorV7(key) },
            ],
            (key, label, chordName) => ({
                en: `In ${key} Major: Play ${label} (${chordName})`,
                ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
            })
        );
        return qs[0];
    },
};
