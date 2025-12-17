// Music theory helpers for exercises

// Map of major keys to their key signatures (what VexFlow expects)
export const MAJOR_KEY_SIGNATURES: Record<string, string> = {
    C: 'C',
    G: 'G',
    D: 'D',
    A: 'A',
    E: 'E',
    B: 'B',
    'F#': 'F#',
    'C#': 'C#',
    F: 'F',
    Bb: 'Bb',
    Eb: 'Eb',
    Ab: 'Ab',
    Db: 'Db',
    Gb: 'Gb',
    Cb: 'Cb',
};

// Relative minor keys map to their parallel major for key signature
export const MINOR_TO_RELATIVE_MAJOR: Record<string, string> = {
    A: 'C',
    E: 'G',
    B: 'D',
    'F#': 'A',
    'C#': 'E',
    'G#': 'B',
    'D#': 'F#',
    D: 'F',
    G: 'Bb',
    C: 'Eb',
    F: 'Ab',
    Bb: 'Db',
    Eb: 'Gb',
};

/**
 * Get the key signature for a given scale (major or natural minor)
 * For VexFlow, we need the major key that shares the same key signature
 */
export function getKeySignatureForScale(root: string, type: 'major' | 'minor'): string {
    if (type === 'major') {
        return MAJOR_KEY_SIGNATURES[root] || 'C';
    } else {
        // For minor, use relative major
        return MINOR_TO_RELATIVE_MAJOR[root] || 'C';
    }
}

/**
 * Get list of simple major keys (no double sharps/flats) for exercises
 */
export const SIMPLE_MAJOR_KEYS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab'];

/**
 * Get list of simple minor keys for exercises
 */
export const SIMPLE_MINOR_KEYS = ['A', 'E', 'B', 'D', 'G', 'C', 'F'];

/**
 * Fisher-Yates shuffle
 */
export function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Pick random element from array
 */
export function pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}
