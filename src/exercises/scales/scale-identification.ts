import { Scale } from 'tonal';
import type { Exercise, ExerciseQuestion } from '../types';
import { getKeySignatureForScale, shuffle, pickRandom } from '../utils';

// Use keys that work well visually and musically
const MAJOR_ROOTS = ['C', 'G', 'D', 'F', 'Bb', 'A'];
const MINOR_ROOTS = ['A', 'E', 'D', 'G', 'B'];

function getScaleNotes(root: string, type: 'major' | 'minor'): string[] {
    const scaleName = type === 'minor' ? `${root} natural minor` : `${root} major`;
    const scale = Scale.get(scaleName);
    return scale.notes;
}

function generateOptions(correctAnswer: string, includeRoot: boolean): string[] {
    const options = [correctAnswer];

    if (includeRoot) {
        // Add plausible wrong answers
        MAJOR_ROOTS.forEach((root) => {
            const majorOpt = `${root} Major`;
            if (majorOpt !== correctAnswer && !options.includes(majorOpt)) options.push(majorOpt);
        });
        MINOR_ROOTS.forEach((root) => {
            const minorOpt = `${root} Minor`;
            if (minorOpt !== correctAnswer && !options.includes(minorOpt)) options.push(minorOpt);
        });
    } else {
        options.push('Major', 'Minor');
    }

    return shuffle(options).slice(0, 6);
}

function generateQuestion(includeRoot: boolean = false): ExerciseQuestion {
    // Choose type first, then pick appropriate root
    const type: 'major' | 'minor' = Math.random() > 0.5 ? 'major' : 'minor';
    const root = type === 'major' ? pickRandom(MAJOR_ROOTS) : pickRandom(MINOR_ROOTS);

    const scaleNotes = getScaleNotes(root, type);
    // Generate notes ascending through one octave
    const displayNotes = scaleNotes.map((note, i) => `${note}${i < 4 ? 4 : 5}`);

    // Get the correct key signature for this scale
    const keySignature = getKeySignatureForScale(root, type);

    const correctAnswer = includeRoot
        ? `${root} ${type === 'major' ? 'Major' : 'Minor'}`
        : type === 'major'
        ? 'Major'
        : 'Minor';

    return {
        id: `scale-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'scale-identification',
        prompt: includeRoot
            ? {
                  en: 'What scale is this?',
                  ru: 'Какая это гамма?',
              }
            : {
                  en: 'Is this scale Major or Minor?',
                  ru: 'Это мажорная или минорная гамма?',
              },
        clef: 'treble',
        keySignature,
        displayNotes,
        correctAnswer,
        options: generateOptions(correctAnswer, includeRoot),
        difficulty: includeRoot ? 'hard' : 'easy',
        hint: {
            en:
                type === 'major'
                    ? 'Major scales have a bright, happy sound'
                    : 'Minor scales have a dark, sad sound',
            ru:
                type === 'major'
                    ? 'Мажорные гаммы звучат ярко и радостно'
                    : 'Минорные гаммы звучат темно и грустно',
        },
    };
}

export const ScaleIdentificationExercise: Exercise = {
    id: 'scale-identification',
    categoryId: 'scales',
    title: {
        en: 'Scale Identification',
        ru: 'Определение гамм',
    },
    description: {
        en: 'Show a scale (notes on staff) → choose Major or Natural Minor (+ tonic on harder mode).',
        ru: 'Показана гамма (ноты на нотоносце) → выберите Мажор или Натуральный минор (+ тонику на сложном уровне).',
    },
    generateQuestion: () => generateQuestion(false),
    settings: {
        difficulty: 'easy',
    },
};

export const ScaleIdentificationAdvancedExercise: Exercise = {
    id: 'scale-identification-advanced',
    categoryId: 'scales',
    title: {
        en: 'Scale Identification (Advanced)',
        ru: 'Определение гамм (Продвинутый)',
    },
    description: {
        en: 'Identify both the type and root note of the scale.',
        ru: 'Определите тип и тонику гаммы.',
    },
    generateQuestion: () => generateQuestion(true),
    settings: {
        difficulty: 'hard',
    },
};
