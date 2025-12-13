import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import Staff from './components/music/Staff';
import Piano from './components/music/Piano';
import { useMidi } from './engine/MidiManager';
import { TriadsLesson } from './lessons/basic-harmony/triads';
import { 
  LessonSequenceA, LessonSequenceB, LessonSequenceC,
  LessonSequenceD, LessonSequenceE, LessonSequenceF 
} from './lessons/basic-harmony/chord-progressions';
import { MusicTheory } from './engine/MusicTheory';

import { Play, RefreshCw, CheckCircle, XCircle, Menu, Music, BookOpen, Languages } from 'lucide-react';
import { cn } from './lib/utils';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { TRANSLATIONS } from './i18n/translations';
import type { Language } from './i18n/types';
import { ProgressionTracker } from './components/ui/ProgressionTracker';

// Simple registry for now
const AVAILABLE_LESSONS = [
  TriadsLesson, 
  LessonSequenceA, LessonSequenceB, LessonSequenceC,
  LessonSequenceD, LessonSequenceE, LessonSequenceF
];

function LessonApp() {
  const { activeNotes, midiEnabled } = useMidi();
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  // Derived state from URL, fallback to first lesson if not found (or handle 404)
  const lesson = AVAILABLE_LESSONS.find(l => l.id === taskId) || AVAILABLE_LESSONS[0];

  // We don't need lesson state anymore, we use the derived one.
  // const [lesson, setLesson] = useState<Lesson>(TriadsLesson);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userNotes, setUserNotes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [selectedKey, setSelectedKey] = useState('C'); // State for Progression Mode

  const t = TRANSLATIONS[lang];
  const currentQuestion = lesson.questions[currentQuestionIndex];

  // Sync selected key when lesson changes slightly or just keep as user preference?
  // Better to reset 'selectedKey' to C or check if lesson supports it when lesson changes?
  // For now, persistent preference is fine, but we should make sure the question matches.
  
  // Effect to sync currentQuestion if key implies a jump
  // but simpler logic is: IF progression, we rely on 'selectedKey' to control start of sequence
  // But 'currentQuestionIndex' is master. 
  // We need to ensure that when we open a progression lesson, we find the index of the selected key.
  
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
    
    if (lesson.type === 'progression' && currentQuestion?.metadata) {
        // Find next question in the same key
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < lesson.questions.length && lesson.questions[nextIndex].metadata?.key === currentQuestion.metadata.key) {
             setCurrentQuestionIndex(nextIndex);
        } else {
             // Loop back to start of this key
             const startOfKey = lesson.questions.findIndex(q => q.metadata?.key === currentQuestion.metadata?.key);
             if (startOfKey !== -1) setCurrentQuestionIndex(startOfKey);
             else setCurrentQuestionIndex(0); // Fallback
        }
    } else {
        // Standard behavior
        if (currentQuestionIndex < lesson.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setCurrentQuestionIndex(0);
        }
    }
  };

  // Reset state when lesson (taskId) changes
  useEffect(() => {
     setFeedback(null);
     setUserNotes([]);
     
     // Smart Init for Progression
     if (lesson.type === 'progression') {
         const firstQKey = lesson.questions.findIndex(q => q.metadata?.key === selectedKey);
         setCurrentQuestionIndex(firstQKey !== -1 ? firstQKey : 0);
     } else {
         setCurrentQuestionIndex(0);
     }
  }, [lesson.id, selectedKey]); // selectedKey dependency allows re-init if key changes? Maybe not desired. 
  // Actually, original code only did this on "Click".
  // If we change key via "ProgressionTracker", we manually set index.
  // So here we only want to run this when `lesson.id` changes.
  // But wait, if I change `selectedKey` globally (it's state), and then switch lesson, I want it to respect that key.
  // So [lesson.id] is correct dependency. But inside we use `selectedKey`.
  
  // Note: We need to be careful not to reset if we just navigated to the SAME lesson? 
  // But usage of `lesson.id` ensures we only reset on change.


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
                        navigate(`/task/${l.id}`);
                        setIsMenuOpen(false);
                        // State resets handled by useEffect on taskId change
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

      <main className="w-full max-w-[1400px] px-6 pb-6 flex-1 flex flex-col gap-4 mx-auto">
        
        {/* Header: Lesson Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] bg-stone-100 px-2 py-0.5 rounded-full">{t.currentLesson}</span>
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] leading-tight">{lesson.title[lang]}</h2>
                 <p className="text-[var(--color-text-secondary)] mt-1 text-sm leading-relaxed max-w-2xl">{lesson.description[lang]}</p>
            </div>
            
            {/* Simple Progress Counter (Top Right) */}
            {lesson.type === 'progression' && currentQuestion?.metadata && (
               <div className="bg-stone-50 px-4 py-2 rounded-lg border border-stone-100 text-right">
                   <div className="text-[10px] uppercase font-bold text-stone-400">Step</div>
                   <div className="text-lg font-bold text-[var(--color-primary)]">
                       {(currentQuestion.metadata.progressionIndex || 0) + 1} <span className="text-stone-300 text-sm">/ {currentQuestion.metadata.progressionTotal}</span>
                   </div>
               </div>
            )}
        </div>

        {/* Main Interface */}
        <div className="space-y-4">
          
          {/* Top Section: Visualization & Task Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
             
             {/* Left Column: Musical Staff (Visuals) - Takes 5/12 columns */}
             <div className="lg:col-span-5 card rounded-2xl p-4 bg-stone-50/50 border border-stone-100/50 flex flex-col items-center justify-center relative min-h-[220px]">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                      style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                 </div>

                {currentQuestion && (
                  <ErrorBoundary>
                     <div className="transform scale-90 md:scale-100 origin-center w-full flex justify-center">
                        <Staff 
                        notes={displayNotes.length > 0 ? displayNotes : []} 
                        clef={currentQuestion.clef}
                        keySignature={currentQuestion.keySignature}
                        width={450} 
                        height={220} // Slightly taller for Grand Staff
                        />
                     </div>
                  </ErrorBoundary>
                )}
                
                <div className="mt-2 h-6 text-[var(--color-text-secondary)] font-medium text-sm tracking-wide bg-white px-4 py-0.5 rounded-full border border-stone-100 shadow-sm">
                   {displayNotes.length > 0 ? displayNotes.join(" - ") : <span className="opacity-40 italic">{t.playNotes}</span>}
                </div>
             </div>

             {/* Right Column: Task, Progression, Controls - Takes 7/12 columns */}
             <div className="lg:col-span-7 card rounded-2xl p-6 md:p-8 bg-white shadow-sm border border-stone-100 flex flex-col justify-between gap-6">
                 
                 {/* 1. Task Description */}
                 <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 block">
                        {t.task}
                    </span>
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] leading-none tracking-tight">
                        {currentQuestion ? currentQuestion.text[lang] : t.loading}
                    </h2>
                    
                    {currentQuestion?.hint && (
                        <div className="mt-4 text-sm text-[var(--color-text-secondary)] italic flex items-center gap-2">
                             <span className="bg-amber-100/50 text-amber-600 rounded px-1.5 py-0.5 text-xs font-bold not-italic">Hint</span>
                             <span>{currentQuestion.hint[lang]}</span>
                        </div>
                     )}
                 </div>

                 {/* 2. Progression Tracker (Now embedded here) */}
                 {lesson.type === 'progression' && currentQuestion && currentQuestion.metadata && (
                    <div className="border-t border-stone-100 pt-6 mt-2">
                        <ProgressionTracker 
                            currentStepIndex={currentQuestion.metadata.progressionIndex || 0}
                            steps={currentQuestion.metadata.functionalSequence || []}
                            completedSteps={currentQuestion.metadata.progressionIndex || 0}
                            availableKeys={['C', 'G', 'F', 'D', 'Bb', 'A', 'Eb', 'E', 'Ab', 'B', 'Db', 'F#']}
                            selectedKey={selectedKey}
                            onKeyChange={(k) => {
                                setSelectedKey(k);
                                setFeedback(null);
                                setUserNotes([]);
                                const firstQIndex = lesson.questions.findIndex(q => q.metadata?.key === k);
                                if (firstQIndex !== -1) setCurrentQuestionIndex(firstQIndex);
                            }}
                            onRestart={() => {
                                setFeedback(null);
                                setUserNotes([]);
                                const firstQIndex = lesson.questions.findIndex(q => q.metadata?.key === selectedKey);
                                if (firstQIndex !== -1) setCurrentQuestionIndex(firstQIndex);
                            }}
                        />
                    </div>
                 )}
                 
                 {/* 3. Controls (Inline) */}
                 <div className="flex items-center gap-4 mt-auto pt-2">
                     {/* Feedback Bubble */}
                     <div className="flex-1 min-h-[48px] flex items-center">
                        {feedback ? (
                             <div className={cn(
                                 "pl-0 pr-4 py-2 rounded-lg flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-left duration-200",
                                 feedback.isCorrect ? "text-emerald-700" : "text-red-600"
                             )}>
                                 {feedback.isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                 {feedback.message}
                             </div>
                        ) : (
                             <span className="text-stone-300 text-sm italic">Play the notes on the piano below...</span>
                        )}
                     </div>

                     <div className="flex items-center gap-3 shrink-0">
                         <button
                            onClick={checkAnswer}
                            disabled={!currentQuestion || feedback?.isCorrect}
                            className={cn(
                                "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-sm tracking-wide min-w-[140px]",
                                feedback?.isCorrect
                                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                    : "bg-[var(--color-primary)] text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-indigo-100"
                            )}
                        >
                            <Play className="w-4 h-4 fill-current" /> {t.checkAnswer}
                        </button>

                        {feedback?.isCorrect && (
                            <button
                                onClick={nextQuestion}
                                className="px-6 py-3 rounded-xl font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center gap-2 text-sm tracking-wide animate-in fade-in slide-in-from-right duration-300 min-w-[140px]"
                            >
                                <RefreshCw className="w-4 h-4" /> 
                                {lesson.type === 'progression' && ((currentQuestion?.metadata?.progressionIndex || 0) + 1 === currentQuestion?.metadata?.progressionTotal) 
                                    ? 'Finish' 
                                    : t.nextQuestion}
                            </button>
                        )}
                     </div>
                 </div>

             </div>
          </div>

          {/* Bottom Section: Piano */}
          <div className="card rounded-2xl p-4 bg-white shadow-sm border border-stone-100 flex flex-col justify-center overflow-hidden min-h-[220px]">
            <Piano 
              activeNotes={userNotes} 
              onNoteOn={handlePianoToggle} 
              onNoteOff={() => {}} 
              octaves={3}
            />
          </div>

        </div>

      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/task/${AVAILABLE_LESSONS[0].id}`} replace />} />
      <Route path="/task/:taskId" element={<LessonApp />} />
      <Route path="*" element={<Navigate to={`/task/${AVAILABLE_LESSONS[0].id}`} replace />} />
    </Routes>
  );
}

export default App;
