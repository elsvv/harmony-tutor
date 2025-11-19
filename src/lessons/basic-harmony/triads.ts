import type { Lesson, Question } from '../types';
import { MusicTheory } from '../../engine/MusicTheory';
import { Key } from 'tonal';

const KEYS = ['C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'];
const CHORD_TYPES = [
  { name: 'Major', symbol: 'M' }, 
  { name: 'Minor', symbol: 'm' }
];

const generateAllQuestions = (): Question[] => {
  const questions: Question[] = [];
  KEYS.forEach(key => {
    CHORD_TYPES.forEach(type => {
      const root = key;
      const chordName = `${root}${type.symbol}`;
      
      // Determine key signature:
      let keySig = key;
      if (type.name === 'Minor') {
          keySig = Key.minorKey(key).relativeMajor;
      }

      const typeNameRu = type.name === 'Major' ? 'Мажорное' : 'Минорное';
      const typeNameEn = type.name;

      questions.push({
        id: `${root}-${type.symbol}`,
        text: {
            en: `Build a ${root} ${typeNameEn} Triad`,
            ru: `Постройте ${root} ${typeNameRu} трезвучие`
        },
        targetChord: chordName,
        clef: 'treble',
        keySignature: keySig,
        hint: {
            en: `A ${typeNameEn} triad consists of a root, a ${type.name === 'Major' ? 'major' : 'minor'} third, and a perfect fifth.`,
            ru: `${typeNameRu} трезвучие состоит из тоники, ${type.name === 'Major' ? 'большой' : 'малой'} терции и чистой квинты.`
        },
        validate: (notes: string[]) => MusicTheory.validateChord(notes, chordName)
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
  title: {
      en: 'Building Triads',
      ru: 'Построение трезвучий'
  },
  description: {
      en: 'Learn to build major and minor triads in root position.',
      ru: 'Научитесь строить мажорные и минорные трезвучия в основном виде.'
  },
  questions: generateAllQuestions(),
  generateQuestion: () => {
      const q = generateAllQuestions()[0];
      return q;
  }
};
