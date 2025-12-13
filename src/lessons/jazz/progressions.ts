import type { Lesson, Question } from '../types';
import { Chord, Key } from 'tonal';
import { MusicTheory } from '../../engine/MusicTheory';

const KEYS = ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#'];

type Step = {
    label: string;
    chordIndex: number;
};

const generateQuestionsForJazzProgression = (
    lessonId: string,
    steps: Step[],
    getQuestionText: (key: string, label: string, chordName: string) => { en: string; ru: string }
): Question[] => {
    const questions: Question[] = [];
    const functionalSequence = steps.map((s) => s.label);

    KEYS.forEach((key) => {
        const diatonic = Key.majorKey(key).chords;

        steps.forEach((step, idx) => {
            const chordName = diatonic[step.chordIndex];
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
            { label: 'ii7', chordIndex: 1 },
            { label: 'V7', chordIndex: 4 },
            { label: 'Imaj7', chordIndex: 0 },
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
                { label: 'ii7', chordIndex: 1 },
                { label: 'V7', chordIndex: 4 },
                { label: 'Imaj7', chordIndex: 0 },
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
            { label: 'Imaj7', chordIndex: 0 },
            { label: 'vi7', chordIndex: 5 },
            { label: 'ii7', chordIndex: 1 },
            { label: 'V7', chordIndex: 4 },
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
                { label: 'Imaj7', chordIndex: 0 },
                { label: 'vi7', chordIndex: 5 },
                { label: 'ii7', chordIndex: 1 },
                { label: 'V7', chordIndex: 4 },
            ],
            (key, label, chordName) => ({
                en: `In ${key} Major: Play ${label} (${chordName})`,
                ru: `В ${key} мажоре: Сыграйте ${label} (${chordName})`,
            })
        );
        return qs[0];
    },
};
