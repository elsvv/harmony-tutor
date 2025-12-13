import type { LocalizedContent } from '../i18n/types';

export interface Question {
  id: string;
  text: LocalizedContent; // The question text, e.g. "Build a C Major Triad"
  targetChord: string; // e.g. "C Major"
  clef?: 'treble' | 'bass';
  keySignature?: string;
  hint?: LocalizedContent;
  validate: (notes: string[]) => boolean;
  metadata?: {
    key?: string;
    progressionIndex?: number;
    progressionTotal?: number;
    progressionLabel?: string; 
    functionalSequence?: string[]; // Array of labels for the whole sequence
  };
}

export interface Lesson {
  id: string;
  type?: 'standard' | 'progression';
  title: LocalizedContent;
  description: LocalizedContent;
  questions: Question[];
  generateQuestion: () => Question;
}
