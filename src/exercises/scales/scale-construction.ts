import { Scale } from 'tonal';
import type { Exercise, ExerciseQuestion } from '../types';
import { getKeySignatureForScale, shuffle, pickRandom } from '../utils';

// Use keys that work well
const MAJOR_ROOTS = ['C', 'G', 'D', 'F', 'Bb', 'A'];
const MINOR_ROOTS = ['A', 'E', 'D', 'G', 'B'];

function getScaleNotes(root: string, type: 'major' | 'minor'): string[] {
    const scaleName = type === 'minor' ? `${root} natural minor` : `${root} major`;
    const scale = Scale.get(scaleName);
    return scale.notes;
}

function generateQuestion(): ExerciseQuestion {
    const type: 'major' | 'minor' = Math.random() > 0.5 ? 'major' : 'minor';
    const roots = type === 'major' ? MAJOR_ROOTS : MINOR_ROOTS;
    const root = pickRandom(roots);

    const scaleNotes = getScaleNotes(root, type);
    const correctAnswer = scaleNotes.join(', ');
    const keySignature = getKeySignatureForScale(root, type);

    // Generate wrong options
    const options = [correctAnswer];

    // Wrong option 1: different root, same type
    const otherRoots = roots.filter((r) => r !== root);
    const wrongRoot1 = pickRandom(otherRoots);
    options.push(getScaleNotes(wrongRoot1, type).join(', '));

    // Wrong option 2: same root, different type (if valid)
    const wrongType = type === 'major' ? 'minor' : 'major';
    const wrongTypeRoots = wrongType === 'major' ? MAJOR_ROOTS : MINOR_ROOTS;
    if (wrongTypeRoots.includes(root)) {
        options.push(getScaleNotes(root, wrongType).join(', '));
    }

    // Wrong option 3: different root and type
    const wrongRoot2 = pickRandom(wrongTypeRoots.filter((r) => r !== root));
    options.push(getScaleNotes(wrongRoot2, wrongType).join(', '));

    const typeLabel =
        type === 'major'
            ? { en: 'major', ru: 'мажор' }
            : { en: 'natural minor', ru: 'натуральный минор' };

    return {
        id: `scale-build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'scale-construction',
        prompt: {
            en: `Build ${root} ${typeLabel.en} scale`,
            ru: `Постройте гамму ${root} ${typeLabel.ru}`,
        },
        clef: 'treble',
        keySignature,
        displayNotes: [`${root}4`],
        correctAnswer,
        options: shuffle(options),
        difficulty: 'medium',
        hint: {
            en:
                type === 'major'
                    ? 'Major scale pattern: W-W-H-W-W-W-H'
                    : 'Natural minor pattern: W-H-W-W-H-W-W',
            ru:
                type === 'major'
                    ? 'Структура мажорной гаммы: Т-Т-П-Т-Т-Т-П'
                    : 'Структура натурального минора: Т-П-Т-Т-П-Т-Т',
        },
    };
}

export const ScaleConstructionExercise: Exercise = {
    id: 'scale-construction',
    categoryId: 'scales',
    title: {
        en: 'Scale Construction',
        ru: 'Построение гамм',
    },
    description: {
        en: 'Build a scale: "Build G major" → select the correct sequence of notes.',
        ru: 'Постройте гамму: «Постройте G мажор» → выберите правильную последовательность нот.',
    },
    generateQuestion,
    settings: {
        difficulty: 'medium',
    },
};
