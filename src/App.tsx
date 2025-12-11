import { useEffect, useState } from 'react';
import Staff from './components/music/Staff';
import Piano from './components/music/Piano';
import { useMidi } from './engine/MidiManager';
import { TriadsLesson } from './lessons/basic-harmony/triads';
import { 
  LessonSequenceA, LessonSequenceB, LessonSequenceC,
  LessonSequenceD, LessonSequenceE, LessonSequenceF 
} from './lessons/basic-harmony/chord-progressions';
import { MusicTheory } from './engine/MusicTheory';
import { type Lesson } from './lessons/types';
import { Play, RefreshCw, CheckCircle, XCircle, Menu, Music, BookOpen, Languages } from 'lucide-react';
import { cn } from './lib/utils';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { TRANSLATIONS } from './i18n/translations';
import type { Language } from './i18n/types';

// Simple registry for now
const AVAILABLE_LESSONS = [
  TriadsLesson, 
  LessonSequenceA, LessonSequenceB, LessonSequenceC,
  LessonSequenceD, LessonSequenceE, LessonSequenceF
];

function App() {
  const { activeNotes, midiEnabled } = useMidi();
  const [lesson, setLesson] = useState<Lesson>(TriadsLesson);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const t = TRANSLATIONS[lang];
  const currentQuestion = lesson.questions[currentQuestionIndex];

  // Sync MIDI notes to user input state
  useEffect(() => {
     setUserNotes(activeNotes);
  }, [activeNotes]);

  // Handle on-screen piano input
  const handlePianoToggle = (note: string) => {
    setUserNotes(prev => {
      if (prev.includes(note)) {
        return prev.filter(n => n !== note);
      } else {
        return [...prev, note].sort(MusicTheory.compareNotes);
      }
    });
  };

  // Compute notes with correct enharmonic spelling for display
  const displayNotes = currentQuestion 
    ? MusicTheory.spellNotesCorrectly(userNotes, currentQuestion.targetChord)
    : userNotes;

  const checkAnswer = () => {
    if (!currentQuestion) return;

    const isCorrect = currentQuestion.validate(userNotes);
    if (isCorrect) {
      setFeedback({ isCorrect: true, message: t.correct });
    } else {
      setFeedback({ isCorrect: false, message: t.incorrect });
    }
  };

  // Auto-check and auto-advance
  useEffect(() => {
     if (!currentQuestion) return;

     // 1. Auto-check if we have notes and haven't already marked correct
     if (!feedback?.isCorrect && userNotes.length > 0) {
         if (currentQuestion.validate(userNotes)) {
             setFeedback({ isCorrect: true, message: t.correct });
         }
     }

     // 2. Auto-advance if we are correct and the user RELEASED all notes
     if (feedback?.isCorrect && userNotes.length === 0) {
         // Add a small delay so they see the empty state for a split second? 
         // Or just instant. User asked "when I release key it switches". 
         // Instant feels fast, maybe too fast? Let's try 300ms debounce to avoid flicker if they release unevenly.
         const timer = setTimeout(() => {
             nextQuestion();
         }, 300);
         return () => clearTimeout(timer);
     }
  }, [userNotes, currentQuestion, feedback]);

  const nextQuestion = () => {
    setFeedback(null);
    setUserNotes([]);
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Loop back or finish (simple loop for now)
      setCurrentQuestionIndex(0);
    }
  };

  // Ensure a question is loaded when the component mounts
  useEffect(() => {
    if (!currentQuestion && lesson.questions.length > 0) {
      setCurrentQuestionIndex(0);
    }
  }, [lesson, currentQuestion]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans flex flex-col items-center transition-colors duration-300">
      
      {/* Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-80 bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-200">
            <div className="p-6 border-b border-stone-100">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Music className="w-6 h-6 text-[var(--color-primary)]" />
                {t.appTitle}
              </h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 px-2">{t.library}</h3>
              <div className="space-y-1">
                {AVAILABLE_LESSONS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLesson(l);
                      setCurrentQuestionIndex(0);
                      setFeedback(null);
                      setUserNotes([]);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3",
                      lesson.id === l.id 
                        ? "bg-[var(--color-surface-highlight)] text-[var(--color-primary)]" 
                        : "text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    <BookOpen className="w-4 h-4 opacity-50" />
                    {l.title[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="w-full max-w-[1600px] px-6 py-4 mb-6 flex justify-between items-center border-b border-[var(--color-border)] bg-white/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">{t.appTitle}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
             <button
                onClick={() => setLang(prev => prev === 'en' ? 'ru' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors text-xs font-medium uppercase"
             >
                <Languages className="w-3.5 h-3.5" />
                {lang}
             </button>

             <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-xs font-medium",
                midiEnabled 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-stone-100 border-stone-200 text-stone-500"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", midiEnabled ? "bg-emerald-500" : "bg-stone-400")} />
                {midiEnabled ? t.midiOn : t.midiOff}
              </div>
        </div>
      </header>

      <main className="w-full max-w-[1600px] px-6 flex flex-col lg:flex-row gap-6 pb-8 flex-1">
        
        {/* Left Column: Visualization & Input */}
        <div className="flex-1 space-y-6 min-w-0 flex flex-col">
          
          {/* Staff Card */}
          <div className="card rounded-xl p-6 flex flex-col items-center justify-center min-h-[240px] bg-white relative overflow-hidden shadow-sm border border-stone-100">
             {/* Subtle grid background for the staff area */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
             </div>

            {currentQuestion && (
              <ErrorBoundary>
                <Staff 
                  notes={displayNotes.length > 0 ? displayNotes : []} 
                  clef={currentQuestion.clef}
                  keySignature={currentQuestion.keySignature}
                  width={window.innerWidth > 1000 ? 800 : 600}
                  height={180}
                />
              </ErrorBoundary>
            )}
            
            <div className="mt-4 h-6 text-[var(--color-text-secondary)] font-medium text-base tracking-wide">
               {displayNotes.length > 0 ? displayNotes.join(" - ") : <span className="opacity-30">{t.playNotes}</span>}
            </div>
          </div>

          {/* Piano Card */}
          <div className="card rounded-xl p-6 bg-white shadow-sm border border-stone-100 flex-1 flex flex-col justify-center">
            <Piano 
              activeNotes={userNotes} 
              onNoteOn={handlePianoToggle} 
              onNoteOff={() => {}} 
              octaves={3}
            />
          </div>

        </div>

        {/* Right Column: Lesson Control */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
            
            <div className="card rounded-xl p-6 bg-white h-full flex flex-col shadow-sm border border-stone-100">
                <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] bg-stone-100 px-2 py-1 rounded-full">{t.currentLesson}</span>
                    <h2 className="text-lg font-bold mt-3 text-[var(--color-text-primary)] leading-tight">{lesson.title[lang]}</h2>
                    <p className="text-[var(--color-text-secondary)] mt-2 text-xs leading-relaxed">{lesson.description[lang]}</p>
                </div>

                <div className="flex-1 flex flex-col justify-center py-6 border-t border-b border-[var(--color-border)] my-2 border-dashed">
                    {currentQuestion ? (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-stone-400">{t.task} {currentQuestionIndex + 1}/{lesson.questions.length}</span>
                                <div className="h-1.5 w-24 bg-stone-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[var(--color-primary)] transition-all duration-300" 
                                        style={{ width: `${((currentQuestionIndex + 1) / lesson.questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
                                {currentQuestion.text[lang]}
                            </h3>
                            
                            {currentQuestion.hint && (
                                <div className="text-xs text-[var(--color-text-secondary)] italic bg-stone-50 p-3 rounded border border-stone-100">
                                    💡 {currentQuestion.hint[lang]}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-[var(--color-text-secondary)]">
                            {t.loading}
                        </div>
                    )}
                </div>

                <div className="mt-auto space-y-3 pt-4">
                    {feedback && (
                        <div className={cn(
                            "p-3 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-bottom-2",
                            feedback.isCorrect 
                                ? "bg-emerald-50 text-emerald-900 border border-emerald-100" 
                                : "bg-red-50 text-red-900 border border-red-100"
                        )}>
                            {feedback.isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            {feedback.message}
                        </div>
                    )}

                    <button
                        onClick={checkAnswer}
                        disabled={!currentQuestion || feedback?.isCorrect}
                        className={cn(
                            "w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm text-sm",
                            feedback?.isCorrect
                                ? "bg-[var(--color-surface-highlight)] text-[var(--color-text-muted)] cursor-not-allowed"
                                : "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 hover:shadow-md active:scale-[0.99]"
                        )}
                    >
                        <Play className="w-3.5 h-3.5 fill-current" /> {t.checkAnswer}
                    </button>

                    {feedback?.isCorrect && (
                        <button
                            onClick={nextQuestion}
                            className="w-full py-2.5 px-4 rounded-lg font-medium border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-highlight)] transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> {t.nextQuestion}
                        </button>
                    )}
                </div>
            </div>

        </div>

      </main>
    </div>
  );
}

export default App;
