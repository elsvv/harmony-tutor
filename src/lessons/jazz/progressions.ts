import type { Lesson, Question } from '../types';
import { Chord, Key, Note } from 'tonal';
import { MusicTheory } from '../../engine/MusicTheory';

const KEYS = ['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#'];

type Step = {
    label: string;
    getChordName: (key: string) => string;
};

const generateQuestionsForJazzProgression = (lessonId: string, steps: Step[]): Question[] => {
    const questions: Question[] = [];
    const functionalSequence = steps.map((s) => s.label);

    KEYS.forEach((key) => {
        steps.forEach((step, idx) => {
            const chordName = step.getChordName(key);
            const chordNotes = Chord.get(chordName).notes;

            questions.push({
                id: `${lessonId}-${key}-${idx}`,
                textKey: 'lessons.playChord',
                textParams: { label: `${step.label} (${chordName})` },
                targetChord: chordName,
                validate: (notes: string[]) => MusicTheory.validateChord(notes, chordName),
                hintKey: 'lessons.progressionHint',
                hintParams: { notes: chordNotes.join(' - ') },
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

const IIIVI_STEPS: Step[] = [
    { label: 'ii7', getChordName: (key) => majorII7(key) },
    { label: 'V7', getChordName: (key) => majorV7(key) },
    { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
];

export const JazzIIVILesson: Lesson = {
    id: 'jazz-ii-v-i',
    type: 'progression',
    titleKey: 'lessons.jazzIIVI.title',
    descriptionKey: 'lessons.jazzIIVI.description',
    questions: generateQuestionsForJazzProgression('jazz-ii-v-i', IIIVI_STEPS),
    generateQuestion: () => generateQuestionsForJazzProgression('jazz-ii-v-i', IIIVI_STEPS)[0],
};

const TURNAROUND_STEPS: Step[] = [
    { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
    { label: 'vi7', getChordName: (key) => majorVi7(key) },
    { label: 'ii7', getChordName: (key) => majorII7(key) },
    { label: 'V7', getChordName: (key) => majorV7(key) },
];

export const JazzTurnaroundLesson: Lesson = {
    id: 'jazz-turnaround',
    type: 'progression',
    titleKey: 'lessons.jazzTurnaround.title',
    descriptionKey: 'lessons.jazzTurnaround.description',
    questions: generateQuestionsForJazzProgression('jazz-turnaround', TURNAROUND_STEPS),
    generateQuestion: () =>
        generateQuestionsForJazzProgression('jazz-turnaround', TURNAROUND_STEPS)[0],
};

const BACKDOOR_STEPS: Step[] = [
    { label: 'ivm7', getChordName: (key) => chordFromRoot(Note.transpose(key, '4P'), 'm7') },
    { label: 'bVII7', getChordName: (key) => chordFromRoot(Note.transpose(key, '-2M'), '7') },
    { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
];

export const JazzBackdoorLesson: Lesson = {
    id: 'jazz-backdoor',
    type: 'progression',
    titleKey: 'lessons.jazzBackdoor.title',
    descriptionKey: 'lessons.jazzBackdoor.description',
    questions: generateQuestionsForJazzProgression('jazz-backdoor', BACKDOOR_STEPS),
    generateQuestion: () => generateQuestionsForJazzProgression('jazz-backdoor', BACKDOOR_STEPS)[0],
};

const TRITONE_SUB_STEPS: Step[] = [
    { label: 'ii7', getChordName: (key) => majorII7(key) },
    { label: 'bII7', getChordName: (key) => chordFromRoot(Note.transpose(key, '2m'), '7') },
    { label: 'Imaj7', getChordName: (key) => majorImaj7(key) },
];

export const JazzTritoneSubLesson: Lesson = {
    id: 'jazz-tritone-sub',
    type: 'progression',
    titleKey: 'lessons.jazzTritoneSub.title',
    descriptionKey: 'lessons.jazzTritoneSub.description',
    questions: generateQuestionsForJazzProgression('jazz-tritone-sub', TRITONE_SUB_STEPS),
    generateQuestion: () =>
        generateQuestionsForJazzProgression('jazz-tritone-sub', TRITONE_SUB_STEPS)[0],
};

const RHYTHM_BRIDGE_STEPS: Step[] = [
    { label: 'V/vi', getChordName: (key) => chordFromRoot(Note.transpose(key, '3M'), '7') },
    { label: 'V/ii', getChordName: (key) => chordFromRoot(Note.transpose(key, '6M'), '7') },
    { label: 'V/V', getChordName: (key) => chordFromRoot(Note.transpose(key, '2M'), '7') },
    { label: 'V7', getChordName: (key) => majorV7(key) },
];

export const JazzRhythmChangesBridgeLesson: Lesson = {
    id: 'jazz-rhythm-changes-bridge',
    type: 'progression',
    titleKey: 'lessons.jazzRhythmBridge.title',
    descriptionKey: 'lessons.jazzRhythmBridge.description',
    questions: generateQuestionsForJazzProgression(
        'jazz-rhythm-changes-bridge',
        RHYTHM_BRIDGE_STEPS
    ),
    generateQuestion: () =>
        generateQuestionsForJazzProgression('jazz-rhythm-changes-bridge', RHYTHM_BRIDGE_STEPS)[0],
};
