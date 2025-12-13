import React, { useEffect, useRef } from 'react';
import { Factory, Stave, StaveNote, Voice, Formatter, StaveConnector } from 'vexflow';

interface StaffProps {
  notes: string[]; // e.g., ["C/4", "E/4", "G/4"]
  clef?: 'treble' | 'bass';
  keySignature?: string; // e.g., "C", "G", "Eb"
  width?: number;
  height?: number;
}

const Staff: React.FC<StaffProps> = ({ 
  notes, 
  clef = 'treble', 
  keySignature = 'C',
  width = 500,
  height = 250 // Increased default height for Grand Staff
}) => {
  const containerId = useRef(`vexflow-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const element = document.getElementById(containerId.current);
    if (!element) return;

    // Clear previous render
    element.innerHTML = '';

    try {
      const vf = new Factory({
        renderer: { elementId: containerId.current, width, height },
      });

      const context = vf.getContext();
      
      // Split notes between Treble and Bass staves
      // Middle C (C4) is usually the split point. 
      // Heuristic: If note pitch index < C4, Bass. Else Treble.
      // VexFlow format is Key/Octave, e.g., "C/4"
      
      const trebleNotesData: string[] = [];
      const bassNotesData: string[] = [];

      notes.forEach(note => {
          // Normalize note
          let cleanNote = note;
          const match = note.match(/^([A-G](?:#|b|bb|##)?)([0-9]+)$/);
          if (match) {
             cleanNote = `${match[1]}/${match[2]}`;
          }
          
          if (!cleanNote.includes('/')) return;

          const [, octaveStr] = cleanNote.split('/');
          const octave = parseInt(octaveStr, 10);

          // C4 is middle C. Typically C4 can go on either, but often Treble starts at Middle C. 
          // Let's say < 4 (Bass) and >= 4 (Treble). 
          // Adjust logic: A3, B3 -> Bass. C4, D4 -> Treble.
          if (octave < 4) {
              bassNotesData.push(cleanNote);
          } else {
              trebleNotesData.push(cleanNote);
          }
      });

      // --- 1. SETUP STAVES ---
      // Treble Stave
      const staveTreble = new Stave(10, 20, width - 20); // Top
      staveTreble.addClef('treble').addKeySignature(keySignature);
      staveTreble.setContext(context).draw();

      // Bass Stave
      const staveBass = new Stave(10, 110, width - 20); // Bottom (spaced out)
      staveBass.addClef('bass').addKeySignature(keySignature);
      staveBass.setContext(context).draw();

      // Brace Connector (Left side brace)
      new StaveConnector(staveTreble, staveBass)
        .setType(3) // 3 = BRACE
        .setContext(context)
        .draw();
      
      // Line Connector (Left side line)
      new StaveConnector(staveTreble, staveBass)
        .setType(1) // 1 = SINGLE (Line)
        .setContext(context)
        .draw();
       
      // Right Bar Line
      new StaveConnector(staveTreble, staveBass)
        .setType(6) // 6 = SINGLE_RIGHT (Bar line)
        .setContext(context)
        .draw();


      // --- 2. CREATE VOICES ---
      
      // -- TREBLE VOICE --
      let trebleStaveNotes: StaveNote[];
      if (trebleNotesData.length > 0) {
        trebleStaveNotes = [new StaveNote({ keys: trebleNotesData, duration: 'w', clef: 'treble' })];
      } else {
        // Invisible rest for alignment if empty
        trebleStaveNotes = [new StaveNote({ keys: ['b/4'], duration: 'w', clef: 'treble' })];
        trebleStaveNotes[0].setStyle({ fillStyle: 'transparent', strokeStyle: 'transparent' }); // Hide it
      }
      
      const voiceTreble = new Voice({ numBeats: 4, beatValue: 4 });
      voiceTreble.addTickables(trebleStaveNotes);

      // -- BASS VOICE --
      let bassStaveNotes: StaveNote[];
      if (bassNotesData.length > 0) {
        bassStaveNotes = [new StaveNote({ keys: bassNotesData, duration: 'w', clef: 'bass' })];
      } else {
         // Invisible rest
        bassStaveNotes = [new StaveNote({ keys: ['d/3'], duration: 'w', clef: 'bass' })];
        bassStaveNotes[0].setStyle({ fillStyle: 'transparent', strokeStyle: 'transparent' });
      }

      const voiceBass = new Voice({ numBeats: 4, beatValue: 4 });
      voiceBass.addTickables(bassStaveNotes);

      // --- 3. FORMAT & DRAW ---
      // Format both voices to same width for alignment
      new Formatter()
          .joinVoices([voiceTreble])
          .joinVoices([voiceBass])
          .format([voiceTreble, voiceBass], width - 50);

      voiceTreble.draw(context, staveTreble);
      voiceBass.draw(context, staveBass);

    } catch (e) {
      console.error("VexFlow Error:", e);
      element.innerHTML = '<div class="text-red-300 text-[10px] p-2">Notation Error</div>';
    }

  }, [notes, clef, keySignature, width, height]);

  return <div id={containerId.current} className="flex justify-center" />;
};

export default React.memo(Staff);
