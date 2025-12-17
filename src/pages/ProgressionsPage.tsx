import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Staff from '../components/music/Staff';
import Piano from '../components/music/Piano';
import { useMidi } from '../engine/MidiManager';
import { MusicTheory } from '../engine/MusicTheory';
import {
    Play,
    RefreshCw,
    CheckCircle,
    XCircle,
    Menu,
    Music,
    BookOpen,
    Languages,
    Info,
    Folder,
    ChevronDown,
    Home,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../i18n/types';
import { ProgressionTracker } from '../components/ui/ProgressionTracker';
import { InfoDrawer } from '../components/ui/InfoDrawer';
import { Drawer } from '../components/ui/Drawer';
import { getProgressionContent, getChordContent } from '../content';

// Import lessons
import { TriadsLesson } from '../lessons/basic-harmony/triads';
import {
    LessonSequenceA,
    LessonSequenceB,
    LessonSequenceC,
    LessonSequenceD,
    LessonSequenceE,
    LessonSequenceF,
} from '../lessons/basic-harmony/chord-progressions';
import {
    JazzBackdoorLesson,
    JazzIIVILesson,
    JazzRhythmChangesBridgeLesson,
    JazzTritoneSubLesson,
    JazzTurnaroundLesson,
} from '../lessons/jazz/progressions';
import {
    AlteredTriadsLesson,
    SeventhChordsLesson,
    SusChordsLesson,
} from '../lessons/basic-harmony/common-chords';
import { EXERCISE_CATEGORIES } from '../exercises';
import { GitCompare, TrendingUp } from 'lucide-react';

// Lesson categories registry
export const LESSON_CATEGORIES = [
    {
        id: 'basics',
        titleKey: 'categoryBasics',
        lessons: [TriadsLesson, SeventhChordsLesson, SusChordsLesson, AlteredTriadsLesson],
    },
    {
        id: 'classical',
        titleKey: 'categoryClassical',
        lessons: [
            LessonSequenceA,
            LessonSequenceB,
            LessonSequenceC,
            LessonSequenceD,
            LessonSequenceE,
            LessonSequenceF,
        ],
    },
    {
        id: 'jazz',
        titleKey: 'categoryJazz',
        lessons: [
            JazzIIVILesson,
            JazzTurnaroundLesson,
            JazzBackdoorLesson,
            JazzTritoneSubLesson,
            JazzRhythmChangesBridgeLesson,
        ],
    },
] as const;

export const AVAILABLE_LESSONS = LESSON_CATEGORIES.flatMap((c) => c.lessons);

export function ProgressionsPage() {
    const { activeNotes, midiEnabled } = useMidi();
    const { taskId } = useParams();
    const navigate = useNavigate();

    const lesson = AVAILABLE_LESSONS.find((l) => l.id === taskId) || AVAILABLE_LESSONS[0];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userNotes, setUserNotes] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lang, setLang] = useState<Language>('en');
    const [selectedKey, setSelectedKey] = useState('C');
    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

    const [isLessonInfoOpen, setIsLessonInfoOpen] = useState(false);
    const [isChordInfoOpen, setIsChordInfoOpen] = useState(false);
    const [activeChordLabel, setActiveChordLabel] = useState<string | null>(null);

    const t = TRANSLATIONS[lang];
    const currentQuestion = lesson.questions[currentQuestionIndex];

    const activeCategoryId =
        LESSON_CATEGORIES.find((c) => c.lessons.some((l) => l.id === lesson.id))?.id || null;

    useEffect(() => {
        if (activeCategoryId) setOpenCategoryId(activeCategoryId);
    }, [activeCategoryId]);

    useEffect(() => {
        setUserNotes(activeNotes);
    }, [activeNotes]);

    const handlePianoToggle = (note: string) => {
        setUserNotes((prev) => {
            if (prev.includes(note)) {
                return prev.filter((n) => n !== note);
            } else {
                return [...prev, note].sort(MusicTheory.compareNotes);
            }
        });
    };

    const displayNotes = currentQuestion
        ? MusicTheory.spellNotesCorrectly(userNotes, currentQuestion.targetChord)
        : userNotes;

    const checkAnswer = () => {
        if (!currentQuestion) return;
        const isCorrect = currentQuestion.validate(userNotes);
        setFeedback({ isCorrect, message: isCorrect ? t.correct : t.incorrect });
    };

    useEffect(() => {
        if (!currentQuestion) return;

        if (!feedback?.isCorrect && userNotes.length > 0) {
            if (currentQuestion.validate(userNotes)) {
                setFeedback({ isCorrect: true, message: t.correct });
            }
        }

        if (feedback?.isCorrect && userNotes.length === 0) {
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
            const nextIndex = currentQuestionIndex + 1;
            if (
                nextIndex < lesson.questions.length &&
                lesson.questions[nextIndex].metadata?.key === currentQuestion.metadata.key
            ) {
                setCurrentQuestionIndex(nextIndex);
            } else {
                const startOfKey = lesson.questions.findIndex(
                    (q) => q.metadata?.key === currentQuestion.metadata?.key
                );
                if (startOfKey !== -1) setCurrentQuestionIndex(startOfKey);
                else setCurrentQuestionIndex(0);
            }
        } else {
            if (currentQuestionIndex < lesson.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
            } else {
                setCurrentQuestionIndex(0);
            }
        }
    };

    useEffect(() => {
        setFeedback(null);
        setUserNotes([]);

        if (lesson.type === 'progression') {
            const firstQKey = lesson.questions.findIndex((q) => q.metadata?.key === selectedKey);
            setCurrentQuestionIndex(firstQKey !== -1 ? firstQKey : 0);
        } else {
            setCurrentQuestionIndex(0);
        }
    }, [lesson.id]);

    useEffect(() => {
        if (!currentQuestion && lesson.questions.length > 0) {
            setCurrentQuestionIndex(0);
        }
    }, [lesson, currentQuestion]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans flex flex-col items-center transition-colors duration-300">
            {/* Navigation Drawer */}
            <Drawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                side="left"
                width="w-80"
                title={
                    <span className="flex items-center gap-2 text-lg">
                        <Music className="w-5 h-5 text-[var(--color-primary)]" />
                        {t.appTitle}
                    </span>
                }
            >
                <div className="p-4">
                    {/* Home link */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Home className="w-4 h-4" />
                        {t.back || 'Home'}
                    </Link>

                    {/* Exercises Section */}
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 px-2">
                        {t.exerciseCategories}
                    </h3>
                    <div className="space-y-2 mb-6">
                        {EXERCISE_CATEGORIES.map((category) => {
                            const isOpen = openCategoryId === `ex-${category.id}`;
                            const icon =
                                category.id === 'staff-reading' ? (
                                    <Music className="w-4 h-4 text-stone-400 shrink-0" />
                                ) : category.id === 'intervals' ? (
                                    <GitCompare className="w-4 h-4 text-stone-400 shrink-0" />
                                ) : (
                                    <TrendingUp className="w-4 h-4 text-stone-400 shrink-0" />
                                );

                            return (
                                <div
                                    key={category.id}
                                    className="rounded-xl border border-stone-100 bg-white"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenCategoryId((prev) =>
                                                prev === `ex-${category.id}`
                                                    ? null
                                                    : `ex-${category.id}`
                                            )
                                        }
                                        className={cn(
                                            'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                                            isOpen
                                                ? 'bg-stone-50 text-stone-900'
                                                : 'text-stone-700 hover:bg-stone-50'
                                        )}
                                    >
                                        <span className="flex items-center gap-2 min-w-0">
                                            {icon}
                                            <span className="truncate">{category.title[lang]}</span>
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                'w-4 h-4 text-stone-400 transition-transform shrink-0',
                                                isOpen && 'rotate-180'
                                            )}
                                        />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.18 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-2 pb-2 space-y-1">
                                                    {category.exercises.map((ex) => (
                                                        <button
                                                            key={ex.id}
                                                            onClick={() => {
                                                                navigate(`/exercise/${ex.id}`);
                                                                setIsMenuOpen(false);
                                                            }}
                                                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-stone-600 hover:bg-stone-50"
                                                        >
                                                            {ex.title[lang]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progressions Section */}
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 px-2">
                        {t.library}
                    </h3>
                    <div className="space-y-2">
                        {LESSON_CATEGORIES.map((category) => {
                            const isOpen = openCategoryId === category.id;
                            const title = t[category.titleKey as keyof typeof t] as string;

                            return (
                                <div
                                    key={category.id}
                                    className="rounded-xl border border-stone-100 bg-white"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenCategoryId((prev) =>
                                                prev === category.id ? null : category.id
                                            )
                                        }
                                        className={cn(
                                            'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                                            isOpen
                                                ? 'bg-stone-50 text-stone-900'
                                                : 'text-stone-700 hover:bg-stone-50'
                                        )}
                                    >
                                        <span className="flex items-center gap-2 min-w-0">
                                            <Folder className="w-4 h-4 text-stone-400 shrink-0" />
                                            <span className="truncate">{title}</span>
                                        </span>
                                        <ChevronDown
                                            className={cn(
                                                'w-4 h-4 text-stone-400 transition-transform shrink-0',
                                                isOpen && 'rotate-180'
                                            )}
                                        />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.18 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-2 pb-2 space-y-1">
                                                    {category.lessons.map((l) => (
                                                        <button
                                                            key={l.id}
                                                            onClick={() => {
                                                                navigate(`/progressions/${l.id}`);
                                                                setIsMenuOpen(false);
                                                            }}
                                                            className={cn(
                                                                'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3',
                                                                lesson.id === l.id
                                                                    ? 'bg-[var(--color-surface-highlight)] text-[var(--color-primary)]'
                                                                    : 'text-stone-600 hover:bg-stone-50'
                                                            )}
                                                        >
                                                            <BookOpen className="w-4 h-4 opacity-50" />
                                                            {l.title[lang]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Drawer>

            <header className="w-full max-w-[1600px] px-6 py-4 mb-6 flex justify-between items-center border-b border-[var(--color-border)] bg-white/50 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link
                        to="/"
                        className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] hover:text-indigo-600 transition-colors"
                    >
                        {t.appTitle}
                    </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <button
                        onClick={() => setLang((prev) => (prev === 'en' ? 'ru' : 'en'))}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors text-xs font-medium uppercase"
                    >
                        <Languages className="w-3.5 h-3.5" />
                        {lang}
                    </button>

                    <div
                        className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors text-xs font-medium',
                            midiEnabled
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-stone-100 border-stone-200 text-stone-500'
                        )}
                    >
                        <div
                            className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                midiEnabled ? 'bg-emerald-500' : 'bg-stone-400'
                            )}
                        />
                        {midiEnabled ? t.midiOn : t.midiOff}
                    </div>
                </div>
            </header>

            <main className="w-full max-w-[1400px] px-6 pb-6 flex-1 flex flex-col gap-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] bg-stone-100 px-2 py-0.5 rounded-full">
                                {t.currentLesson}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
                            {lesson.title[lang]}
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mt-1 text-sm leading-relaxed max-w-2xl">
                            {lesson.description[lang]}
                        </p>
                    </div>

                    {lesson.type === 'progression' && (
                        <button
                            onClick={() => setIsLessonInfoOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-[var(--color-primary)] text-stone-600 hover:text-[var(--color-primary)] transition-all group"
                            title={t.lessonInfoTitle}
                        >
                            <Info className="w-4 h-4" />
                            <span className="text-sm font-medium">{t.progressionInfo}</span>
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        <div className="lg:col-span-5 card rounded-2xl p-4 bg-stone-50/50 border border-stone-100/50 flex flex-col items-center justify-center relative min-h-[220px]">
                            <div
                                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                }}
                            />

                            {currentQuestion && (
                                <ErrorBoundary>
                                    <div className="transform scale-90 md:scale-100 origin-center w-full flex justify-center">
                                        <Staff
                                            notes={displayNotes.length > 0 ? displayNotes : []}
                                            clef={currentQuestion.clef}
                                            keySignature={currentQuestion.keySignature}
                                            width={380}
                                            height={220}
                                        />
                                    </div>
                                </ErrorBoundary>
                            )}

                            <div className="mt-2 h-6 text-[var(--color-text-secondary)] font-medium text-sm tracking-wide bg-white px-4 py-0.5 rounded-full border border-stone-100 shadow-sm">
                                {displayNotes.length > 0 ? (
                                    displayNotes.join(' - ')
                                ) : (
                                    <span className="opacity-40 italic">{t.playNotes}</span>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-7 card rounded-2xl p-6 md:p-8 bg-white shadow-sm border border-stone-100 flex flex-col justify-between gap-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 block">
                                    {t.task}
                                </span>
                                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] leading-none tracking-tight">
                                    {currentQuestion ? currentQuestion.text[lang] : t.loading}
                                </h2>

                                {currentQuestion?.hint && (
                                    <div className="mt-4 text-sm text-[var(--color-text-secondary)] italic flex items-center gap-2">
                                        <span className="bg-amber-100/50 text-amber-600 rounded px-1.5 py-0.5 text-xs font-bold not-italic">
                                            {t.hint}
                                        </span>
                                        <span>{currentQuestion.hint[lang]}</span>
                                    </div>
                                )}
                            </div>

                            {lesson.type === 'progression' &&
                                currentQuestion &&
                                currentQuestion.metadata && (
                                    <div className="border-t border-stone-100 pt-6 mt-2">
                                        <ProgressionTracker
                                            currentStepIndex={
                                                currentQuestion.metadata.progressionIndex || 0
                                            }
                                            steps={
                                                currentQuestion.metadata.functionalSequence || []
                                            }
                                            completedSteps={
                                                currentQuestion.metadata.progressionIndex || 0
                                            }
                                            availableKeys={[
                                                'C',
                                                'G',
                                                'F',
                                                'D',
                                                'Bb',
                                                'A',
                                                'Eb',
                                                'E',
                                                'Ab',
                                                'B',
                                                'Db',
                                                'F#',
                                            ]}
                                            selectedKey={selectedKey}
                                            onKeyChange={(k) => {
                                                setSelectedKey(k);
                                                setFeedback(null);
                                                setUserNotes([]);
                                                const firstQIndex = lesson.questions.findIndex(
                                                    (q) => q.metadata?.key === k
                                                );
                                                if (firstQIndex !== -1)
                                                    setCurrentQuestionIndex(firstQIndex);
                                            }}
                                            onRestart={() => {
                                                setFeedback(null);
                                                setUserNotes([]);
                                                const firstQIndex = lesson.questions.findIndex(
                                                    (q) => q.metadata?.key === selectedKey
                                                );
                                                if (firstQIndex !== -1)
                                                    setCurrentQuestionIndex(firstQIndex);
                                            }}
                                            onChordInfoClick={(label) => {
                                                setActiveChordLabel(label);
                                                setIsChordInfoOpen(true);
                                            }}
                                            keyLabel={t.keyLabel}
                                            restartTitle={t.restartSequence}
                                            chordInfoTitleTemplate={t.chordInfoTitle}
                                        />
                                    </div>
                                )}

                            <div className="flex items-center gap-4 mt-auto pt-2">
                                <div className="flex-1 min-h-[48px] flex items-center">
                                    {feedback ? (
                                        <div
                                            className={cn(
                                                'pl-0 pr-4 py-2 rounded-lg flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-left duration-200',
                                                feedback.isCorrect
                                                    ? 'text-emerald-700'
                                                    : 'text-red-600'
                                            )}
                                        >
                                            {feedback.isCorrect ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <XCircle className="w-5 h-5" />
                                            )}
                                            {feedback.message}
                                        </div>
                                    ) : (
                                        <span className="text-stone-300 text-sm italic">
                                            {t.playOnPiano}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={checkAnswer}
                                        disabled={!currentQuestion || feedback?.isCorrect}
                                        className={cn(
                                            'px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-sm tracking-wide min-w-[140px]',
                                            feedback?.isCorrect
                                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                                : 'bg-[var(--color-primary)] text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-indigo-100'
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
                                            {lesson.type === 'progression' &&
                                            (currentQuestion?.metadata?.progressionIndex || 0) +
                                                1 ===
                                                currentQuestion?.metadata?.progressionTotal
                                                ? t.finish
                                                : t.nextQuestion}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

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

            <InfoDrawer
                isOpen={isLessonInfoOpen}
                onClose={() => setIsLessonInfoOpen(false)}
                title={lesson.title[lang]}
                content={getProgressionContent(lesson.id, lang)}
                fallbackTitle={t.info}
                emptyText={t.infoUnavailable}
            />

            <InfoDrawer
                isOpen={isChordInfoOpen}
                onClose={() => {
                    setIsChordInfoOpen(false);
                    setActiveChordLabel(null);
                }}
                title={activeChordLabel || t.chord}
                content={activeChordLabel ? getChordContent(activeChordLabel, lang) : null}
                fallbackTitle={t.info}
                emptyText={t.infoUnavailable}
            />
        </div>
    );
}

export default ProgressionsPage;
