import { useEffect, useState } from 'react';
import { Note } from 'tonal';



export function useMidi() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [midiEnabled, setMidiEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError("WebMIDI is not supported in this browser.");
      return;
    }

    const onMidiMessage = (event: MIDIMessageEvent) => {
      if (!event.data) return;
      const [command, note, velocity] = event.data;
      
      // Note On (144) or Note Off (128). Some devices send Note On with velocity 0 as Note Off.
      const isNoteOn = (command & 0xf0) === 144;
      const isNoteOff = (command & 0xf0) === 128;

      if (isNoteOn && velocity > 0) {
        const noteName = Note.fromMidi(note);
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.add(noteName);
          return newSet;
        });
      } else if (isNoteOff || (isNoteOn && velocity === 0)) {
        const noteName = Note.fromMidi(note);
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteName);
          return newSet;
        });
      }
    };

    navigator.requestMIDIAccess().then(
      (midiAccess) => {
        setMidiEnabled(true);
        const inputs = midiAccess.inputs.values();
        for (const input of inputs) {
          input.onmidimessage = onMidiMessage;
        }

        midiAccess.onstatechange = (e: MIDIConnectionEvent) => {
            if (e.port && e.port.type === 'input' && e.port.state === 'connected') {
                (e.port as MIDIInput).onmidimessage = onMidiMessage;
            }
        }
      },
      (err) => {
        setError("Could not access MIDI devices: " + err);
      }
    );
  }, []);

  return { activeNotes: Array.from(activeNotes), midiEnabled, error };
}
