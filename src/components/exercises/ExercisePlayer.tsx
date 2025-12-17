import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, RefreshCw, ArrowLeft, Zap, Target, Award } from 'lucide-react';
import Staff from '../music/Staff';
import { cn } from '../../lib/utils';
import type { Exercise, ExerciseQuestion } from '../../exercises/types';

interface ExercisePlayerProps {
    exercise: Exercise;
    onBack: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise, onBack }) => {
    const { t } = useTranslation();
    const [currentQuestion, setCurrentQuestion] = useState<ExerciseQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [streak, setStreak] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const generateNewQuestion = useCallback(() => {
        const question = exercise.generateQuestion();
        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setFeedback(null);
    }, [exercise]);

    useEffect(() => {
        generateNewQuestion();
    }, [generateNewQuestion]);

    const handleAnswerSelect = (answer: string) => {
        if (feedback !== null) return; // Already answered

        setSelectedAnswer(answer);
        const isCorrect = answer === currentQuestion?.correctAnswer;

        if (isCorrect) {
            setFeedback('correct');
            setStreak((prev) => prev + 1);
            setCorrectCount((prev) => prev + 1);
        } else {
            setFeedback('incorrect');
            setStreak(0);
        }
        setTotalAnswered((prev) => prev + 1);
    };

    const handleNext = () => {
        generateNewQuestion();
    };

    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-stone-400">{t('common.loading')}</div>
            </div>
        );
    }

    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
            {/* Header */}
            <header className="w-full max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between border-b border-stone-100">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">{t('common.back')}</span>
                </button>

                <div className="flex items-center gap-6">
                    {/* Streak */}
                    <div className="flex items-center gap-2 text-amber-600">
                        <Zap className="w-4 h-4" />
                        <span className="font-bold">{streak}</span>
                    </div>

                    {/* Accuracy */}
                    <div className="flex items-center gap-2 text-emerald-600">
                        <Target className="w-4 h-4" />
                        <span className="font-bold">{accuracy}%</span>
                    </div>

                    {/* Total */}
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Award className="w-4 h-4" />
                        <span className="font-bold">
                            {correctCount}/{totalAnswered}
                        </span>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-[900px] mx-auto px-6 py-8">
                {/* Exercise Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-stone-900">{t(exercise.titleKey)}</h1>
                    <p className="text-stone-500 mt-1">{t(exercise.descriptionKey)}</p>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                    {/* Staff Display */}
                    <div className="bg-stone-50 p-6 flex justify-center border-b border-stone-100">
                        <Staff
                            notes={currentQuestion.displayNotes || []}
                            clef={currentQuestion.clef || 'treble'}
                            keySignature={currentQuestion.keySignature || 'C'}
                            width={400}
                            height={220}
                        />
                    </div>

                    {/* Question */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-stone-800 text-center mb-6">
                            {t(currentQuestion.promptKey, currentQuestion.promptParams)}
                        </h2>

                        {/* Hint */}
                        {currentQuestion.hintKey && feedback === 'incorrect' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm"
                            >
                                <span className="font-semibold">{t('common.hint')}:</span>{' '}
                                {t(currentQuestion.hintKey, currentQuestion.hintParams)}
                            </motion.div>
                        )}

                        {/* Answer Options */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = option === currentQuestion.correctAnswer;
                                const showCorrect = feedback !== null && isCorrect;
                                const showIncorrect = feedback === 'incorrect' && isSelected;

                                return (
                                    <motion.button
                                        key={`${currentQuestion.id}-${index}`}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={feedback !== null}
                                        whileHover={feedback === null ? { scale: 1.02 } : undefined}
                                        whileTap={feedback === null ? { scale: 0.98 } : undefined}
                                        className={cn(
                                            'relative px-4 py-4 rounded-xl font-semibold text-base transition-all border-2',
                                            feedback === null &&
                                                'bg-white border-stone-200 hover:border-indigo-300 hover:bg-indigo-50 text-stone-700',
                                            showCorrect &&
                                                'bg-emerald-50 border-emerald-500 text-emerald-700',
                                            showIncorrect &&
                                                'bg-red-50 border-red-500 text-red-700',
                                            feedback !== null &&
                                                !showCorrect &&
                                                !showIncorrect &&
                                                'bg-stone-50 border-stone-200 text-stone-400'
                                        )}
                                    >
                                        {option}
                                        {showCorrect && (
                                            <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-emerald-500" />
                                        )}
                                        {showIncorrect && (
                                            <XCircle className="absolute top-2 right-2 w-5 h-5 text-red-500" />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Feedback & Next Button */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-6 flex flex-col items-center gap-4"
                                >
                                    <div
                                        className={cn(
                                            'flex items-center gap-2 font-bold text-lg',
                                            feedback === 'correct'
                                                ? 'text-emerald-600'
                                                : 'text-red-600'
                                        )}
                                    >
                                        {feedback === 'correct' ? (
                                            <>
                                                <CheckCircle className="w-6 h-6" />
                                                {t('exercise.correct')}
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-6 h-6" />
                                                {t('exercise.incorrect')}
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        {t('exercise.nextQuestion')}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExercisePlayer;
