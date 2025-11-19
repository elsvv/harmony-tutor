import type { LocalizedContent } from '../i18n/types';

export interface Question {
  id: string;
  text: LocalizedContent; // The question text, e.g. "Build a C Major Triad"
  targetChord: string; // e.g. "C Major"
  clef?: 'treble' | 'bass';
  keySignature?: string;
  hint?: LocalizedContent;
  validate: (notes: string[]) => boolean;
}

export interface Lesson {
  id: string;
  title: LocalizedContent;
  description: LocalizedContent;
  questions: Question[];
  generateQuestion: () => Question;
}
