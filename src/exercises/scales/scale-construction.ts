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

    return {
        id: `scale-build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'scale-construction',
        promptKey: 'exercises.scaleConstruction.prompt',
        promptParams: { root, type },
        clef: 'treble',
        keySignature,
        displayNotes: [`${root}4`],
        correctAnswer,
        options: shuffle(options),
        difficulty: 'medium',
        hintKey:
            type === 'major'
                ? 'exercises.scaleConstruction.hintMajor'
                : 'exercises.scaleConstruction.hintMinor',
    };
}

export const ScaleConstructionExercise: Exercise = {
    id: 'scale-construction',
    categoryId: 'scales',
    titleKey: 'exercises.scaleConstruction.title',
    descriptionKey: 'exercises.scaleConstruction.description',
    generateQuestion,
    settings: {
        difficulty: 'medium',
    },
};
