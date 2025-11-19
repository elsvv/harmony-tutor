import React, { useEffect, useRef } from 'react';
import { Factory, Stave, StaveNote, Voice, Formatter } from 'vexflow';

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
  height = 200
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
      
      // Create Stave
      const stave = new Stave(10, 40, width - 20);
      stave.addClef(clef).addKeySignature(keySignature);
      stave.setContext(context).draw();

      // Filter and format notes
      const validNotes = notes
        .map(n => {
          // Handle "C4", "C#4", "Db4" -> "C/4", "C#/4", "Db/4"
          const match = n.match(/^([A-G](?:#|b|bb|##)?)([0-9]+)$/);
          if (match) {
            return `${match[1]}/${match[2]}`;
          }
          // If it already looks like VexFlow format "C/4", keep it
          if (n.match(/^[A-G](?:#|b|bb|##)?\/[0-9]+$/)) {
            return n;
          }
          return null;
        })
        .filter((n): n is string => n !== null);

      let staveNotes: StaveNote[];

      if (validNotes.length > 0) {
          staveNotes = [
              new StaveNote({
                  keys: validNotes,
                  duration: "w",
                  clef: clef
              })
          ];
      } else {
          // Render a rest if no notes
          staveNotes = [
              new StaveNote({
                  keys: ["b/4"],
                  duration: "wr",
                  clef: clef
              })
          ];
      }

      // Create a voice in 4/4 and add the notes
      const voice = new Voice({
          numBeats: 4,
          beatValue: 4
      });

      voice.addTickables(staveNotes);

      // Format and justify the notes
      new Formatter().joinVoices([voice]).format([voice], width - 50);

      // Render voice
      voice.draw(context, stave);

    } catch (e) {
      console.error("VexFlow Error:", e);
      // Fallback rendering
      try {
         element.innerHTML = ''; 
         const vfFallback = new Factory({
            renderer: { elementId: containerId.current, width, height },
         });
         const scoreFallback = vfFallback.EasyScore();
         const systemFallback = vfFallback.System();
         
         const voiceFallback = scoreFallback.voice(scoreFallback.notes('B/4/w/r', { clef }), { time: '4/4' });
         
         systemFallback.addStave({
            voices: [voiceFallback]
         })
         .addClef(clef)
         .addKeySignature(keySignature);
         
         vfFallback.draw();
      } catch (fallbackError) {
         console.error("VexFlow Fallback Error:", fallbackError);
         element.innerHTML = '<div class="text-red-500 text-xs p-4">Error rendering notation</div>';
      }
    }

  }, [notes, clef, keySignature, width, height]);

  return <div id={containerId.current} className="flex justify-center" />;
};

export default React.memo(Staff);
