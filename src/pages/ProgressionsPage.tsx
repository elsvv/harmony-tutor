import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Staff from '../components/music/Staff';
import Piano from '../components/music/Piano';
import { useMidi } from '../engine/MidiManager';
import { MusicTheory } from '../engine/MusicTheory';
import { Play, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { type Language } from '../i18n';
import { ProgressionTracker } from '../components/ui/ProgressionTracker';
import { InfoDrawer } from '../components/ui/InfoDrawer';
import { getProgressionContent, getChordContent } from '../content';
import { AppLayout } from '../components/layout/AppLayout';

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

// Lesson categories registry
export const LESSON_CATEGORIES = [
    {
        id: 'basics',
        titleKey: 'categories.basics',
        lessons: [TriadsLesson, SeventhChordsLesson, SusChordsLesson, AlteredTriadsLesson],
    },
    {
        id: 'classical',
        titleKey: 'categories.classical',
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
        titleKey: 'categories.jazz',
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
    const { activeNotes } = useMidi();
    const { taskId } = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language as Language;

    const lesson = AVAILABLE_LESSONS.find((l) => l.id === taskId) || AVAILABLE_LESSONS[0];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userNotes, setUserNotes] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
    const [selectedKey, setSelectedKey] = useState('C');

    const [isLessonInfoOpen, setIsLessonInfoOpen] = useState(false);
    const [isChordInfoOpen, setIsChordInfoOpen] = useState(false);
    const [activeChordLabel, setActiveChordLabel] = useState<string | null>(null);

    const currentQuestion = lesson.questions[currentQuestionIndex];

    const activeCategory = LESSON_CATEGORIES.find((c) => c.lessons.some((l) => l.id === lesson.id));
    const breadcrumbs = activeCategory ? [{ label: t(activeCategory.titleKey) }] : [];

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
        setFeedback({
            isCorrect,
            message: isCorrect ? t('exercise.correct') : t('exercise.incorrect'),
        });
    };

    useEffect(() => {
        if (!currentQuestion) return;

        if (!feedback?.isCorrect && userNotes.length > 0) {
            if (currentQuestion.validate(userNotes)) {
                setFeedback({ isCorrect: true, message: t('exercise.correct') });
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full max-w-[1400px] px-6 py-6 flex-1 flex flex-col gap-4 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] bg-stone-100 px-2 py-0.5 rounded-full">
                                {t('exercise.currentLesson')}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
                            {t(lesson.titleKey)}
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mt-1 text-sm leading-relaxed max-w-2xl">
                            {t(lesson.descriptionKey)}
                        </p>
                    </div>

                    {lesson.type === 'progression' && (
                        <button
                            onClick={() => setIsLessonInfoOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-[var(--color-primary)] text-stone-600 hover:text-[var(--color-primary)] transition-all group"
                            title={t('exercise.lessonInfoTitle')}
                        >
                            <Info className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {t('progression.progressionInfo')}
                            </span>
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
                                    <span className="opacity-40 italic">
                                        {t('exercise.playNotes')}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-7 card rounded-2xl p-6 md:p-8 bg-white shadow-sm border border-stone-100 flex flex-col justify-between gap-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 block">
                                    {t('exercise.task')}
                                </span>
                                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] leading-none tracking-tight">
                                    {currentQuestion
                                        ? t(currentQuestion.textKey, currentQuestion.textParams)
                                        : t('common.loading')}
                                </h2>

                                {currentQuestion?.hintKey && (
                                    <div className="mt-4 text-sm text-[var(--color-text-secondary)] italic flex items-center gap-2">
                                        <span className="bg-amber-100/50 text-amber-600 rounded px-1.5 py-0.5 text-xs font-bold not-italic">
                                            {t('common.hint')}
                                        </span>
                                        <span>
                                            {t(currentQuestion.hintKey, currentQuestion.hintParams)}
                                        </span>
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
                                            keyLabel={t('progression.keyLabel')}
                                            restartTitle={t('progression.restartSequence')}
                                            chordInfoTitleTemplate={t('progression.chordInfoTitle')}
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
                                            {t('exercise.playOnPiano')}
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
                                        <Play className="w-4 h-4 fill-current" />{' '}
                                        {t('exercise.checkAnswer')}
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
                                                ? t('exercise.finish')
                                                : t('exercise.nextQuestion')}
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

                <InfoDrawer
                    isOpen={isLessonInfoOpen}
                    onClose={() => setIsLessonInfoOpen(false)}
                    title={t(lesson.titleKey)}
                    content={getProgressionContent(lesson.id, lang)}
                    fallbackTitle={t('common.info')}
                    emptyText={t('common.infoUnavailable')}
                />

                <InfoDrawer
                    isOpen={isChordInfoOpen}
                    onClose={() => {
                        setIsChordInfoOpen(false);
                        setActiveChordLabel(null);
                    }}
                    title={activeChordLabel || t('common.chord')}
                    content={activeChordLabel ? getChordContent(activeChordLabel, lang) : null}
                    fallbackTitle={t('common.info')}
                    emptyText={t('common.infoUnavailable')}
                />
            </div>
        </AppLayout>
    );
}

export default ProgressionsPage;
