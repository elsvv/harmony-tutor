import { Note, Chord, Key, Scale } from "tonal";

export const MusicTheory = {
  /**
   * Get notes of a chord.
   * @param chordName e.g., "C Major", "Dm7"
   */
  getChordNotes: (chordName: string): string[] => {
    return Chord.get(chordName).notes;
  },

  /**
   * Get notes of a scale.
   * @param key e.g., "C"
   * @param scaleType e.g., "major"
   */
  getScaleNotes: (key: string, scaleType: string = "major"): string[] => {
    return Scale.get(`${key} ${scaleType}`).notes;
  },

  /**
   * Get the chord at a specific degree in a key.
   * @param key e.g., "C"
   * @param scaleType e.g., "major"
   * @param degree Roman numeral e.g., "I", "V"
   */
  getChordAtDegree: (key: string, scaleType: string, degree: string): string => {
    // Tonal doesn't have a direct "get chord at degree" for all scales easily exposed in one function,
    // but for major/minor keys we can use Key.majorKey or Key.minorKey
    if (scaleType === "major") {
      const keyData = Key.majorKey(key);
      // chords are indexed 0-6. We need to map Roman to index.
      // This is a simplified lookup.
      const romanToIndex: Record<string, number> = {
        "I": 0, "II": 1, "III": 2, "IV": 3, "V": 4, "VI": 5, "VII": 6,
        "i": 0, "ii": 1, "iii": 2, "iv": 3, "v": 4, "vi": 5, "vii": 6
      };
      // Normalize degree to upper case for major key check (though Tonal returns specific casing)
      // Actually Tonal Key.majorKey().chords returns array like ["Cmaj7", "Dm7", ...]
      // We need to match the requested degree.
      // Let's try to find the chord that matches the degree function.
      // Or simpler: generate the progression.
      const chords = keyData.chords;
      const index = romanToIndex[degree.toUpperCase()] || romanToIndex[degree];
      if (index !== undefined && chords[index]) {
        return chords[index];
      }
    }
    // Fallback or other scales implementation
    return "";
  },

  /**
   * Check if a set of input notes matches a target chord.
   * @param inputNotes Array of notes played (e.g., ["C4", "E4", "G4"])
   * @param targetChordName Name of the chord (e.g., "C Major")
   */
  validateChord: (inputNotes: string[], targetChordName: string): boolean => {
    const targetNotes = Chord.get(targetChordName).notes.map(n => Note.chroma(n));
    const inputChromas = inputNotes.map(n => Note.chroma(n));
    
    if (targetNotes.some(n => n === undefined) || inputChromas.some(n => n === undefined)) {
        return false;
    }

    // Check if all target notes are present in input (ignoring octave)
    // We use chroma (0-11) to handle enharmonics (A# == Bb)
    const hasAllTarget = targetNotes.every(targetChroma => inputChromas.includes(targetChroma));
    
    // Check if all input notes are part of the chord (no wrong notes)
    const noExtra = inputChromas.every(inputChroma => targetNotes.includes(inputChroma));

    return hasAllTarget && noExtra;
  },
  
  /**
   * Normalize a note name to scientific notation (e.g., "c#4" -> "C#4")
   */
  normalizeNote: (note: string): string => {
    return Note.simplify(note);
  },

  /**
   * Compare two notes for sorting.
   */
  compareNotes: (a: string, b: string): number => {
    const midiA = Note.midi(a) || 0;
    const midiB = Note.midi(b) || 0;
    return midiA - midiB;
  },

  /**
   * Spell input notes correctly based on the target chord context.
   * e.g., if target is G Minor (G, Bb, D) and input is A#, convert A# to Bb.
   */
  spellNotesCorrectly: (inputNotes: string[], targetChordName: string): string[] => {
    const targetNotes = Chord.get(targetChordName).notes; 
    const targetChromas = targetNotes.map(n => Note.chroma(n));

    return inputNotes.map(inputNote => {
      const inputChroma = Note.chroma(inputNote);
      if (inputChroma === undefined) return inputNote;

      // Find if this chroma exists in the target chord
      const matchIndex = targetChromas.indexOf(inputChroma);
      if (matchIndex !== -1) {
        // Use the spelling from the target chord
        const targetSpelling = targetNotes[matchIndex];
        // We need to preserve the octave from the input note
        const inputOctave = Note.octave(inputNote);
        return `${targetSpelling}${inputOctave}`;
      }
      
      // If not in chord, return original simplified
      return Note.simplify(inputNote);
    });
  }
};
