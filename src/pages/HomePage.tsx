import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Music,
    GitCompare,
    TrendingUp,
    ChevronRight,
    BookOpen,
    Sparkles,
    Target,
    Award,
    Zap,
} from 'lucide-react';
import { EXERCISE_CATEGORIES } from '../exercises';
import { cn } from '../lib/utils';
import { AppLayout } from '../components/layout/AppLayout';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'staff-reading': <Music className="w-6 h-6" />,
    intervals: <GitCompare className="w-6 h-6" />,
    scales: <TrendingUp className="w-6 h-6" />,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; hover: string }> =
    {
        'staff-reading': {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            border: 'border-indigo-200',
            hover: 'hover:border-indigo-400 hover:bg-indigo-100',
        },
        intervals: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            border: 'border-emerald-200',
            hover: 'hover:border-emerald-400 hover:bg-emerald-100',
        },
        scales: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-200',
            hover: 'hover:border-amber-400 hover:bg-amber-100',
        },
    };

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
};

export const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <AppLayout>
            {/* Hero Section */}
            <section className="w-full max-w-[1400px] mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        {t('home.heroTagline')}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                        {t('home.heroTitle')}
                    </h1>

                    <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-8">
                        {t('home.heroSubtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to={`/exercise/${EXERCISE_CATEGORIES[0].exercises[0].id}`}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            {t('home.startLearning')}
                            <ChevronRight className="w-5 h-5" />
                        </Link>

                        <Link
                            to="/progressions"
                            className="px-8 py-4 bg-white border-2 border-stone-200 text-stone-700 font-bold rounded-xl hover:border-stone-300 hover:bg-stone-50 transition-colors flex items-center gap-2"
                        >
                            <BookOpen className="w-5 h-5" />
                            {t('home.viewProgressions')}
                        </Link>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 text-center"
                >
                    <div>
                        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-stone-900">
                            <Target className="w-7 h-7 text-indigo-500" />
                            {EXERCISE_CATEGORIES.reduce(
                                (acc, cat) => acc + cat.exercises.length,
                                0
                            )}
                        </div>
                        <div className="text-stone-500 text-sm mt-1">{t('home.exerciseTypes')}</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-stone-900">
                            <Award className="w-7 h-7 text-emerald-500" />
                            {EXERCISE_CATEGORIES.length}
                        </div>
                        <div className="text-stone-500 text-sm mt-1">{t('home.categories')}</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-3xl font-bold text-stone-900">
                            <Zap className="w-7 h-7 text-amber-500" />∞
                        </div>
                        <div className="text-stone-500 text-sm mt-1">
                            {t('home.practiceQuestions')}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Categories Section */}
            <section className="w-full max-w-[1400px] mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900 text-center mb-4">
                        {t('home.exerciseCategories')}
                    </h2>
                    <p className="text-stone-500 text-center mb-12 max-w-2xl mx-auto">
                        {t('home.categoriesSubtitle')}
                    </p>

                    <div className="space-y-8">
                        {EXERCISE_CATEGORIES.map((category, catIndex) => {
                            const colors =
                                CATEGORY_COLORS[category.id] || CATEGORY_COLORS['staff-reading'];
                            const icon = CATEGORY_ICONS[category.id];

                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 * catIndex }}
                                    className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
                                >
                                    {/* Category Header */}
                                    <div className={cn('p-6 border-b border-stone-100', colors.bg)}>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    'w-12 h-12 rounded-xl flex items-center justify-center',
                                                    colors.bg,
                                                    colors.text,
                                                    'border-2',
                                                    colors.border
                                                )}
                                            >
                                                {icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-stone-900">
                                                    {t(category.titleKey)}
                                                </h3>
                                                <p className="text-stone-600 text-sm mt-0.5">
                                                    {t(category.descriptionKey)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exercises Grid */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {category.exercises.map((exercise) => {
                                                const difficulty =
                                                    exercise.settings?.difficulty || 'medium';
                                                const badgeColor = DIFFICULTY_COLORS[difficulty];

                                                return (
                                                    <Link
                                                        key={exercise.id}
                                                        to={`/exercise/${exercise.id}`}
                                                        className={cn(
                                                            'group p-4 rounded-xl border-2 transition-all duration-200',
                                                            colors.border,
                                                            colors.hover
                                                        )}
                                                    >
                                                        <div className="flex items-start justify-between gap-3 mb-2">
                                                            <h4 className="font-semibold text-stone-800 group-hover:text-stone-900">
                                                                {t(exercise.titleKey)}
                                                            </h4>
                                                            <span
                                                                className={cn(
                                                                    'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
                                                                    badgeColor
                                                                )}
                                                            >
                                                                {t(`difficulty.${difficulty}`)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-stone-500 line-clamp-2">
                                                            {t(exercise.descriptionKey)}
                                                        </p>
                                                        <div className="mt-3 flex items-center gap-1 text-sm font-medium text-stone-400 group-hover:text-indigo-600 transition-colors">
                                                            {t('exercise.startExercise')}
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Progressions Section */}
            <section className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 py-16">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {t('home.progressionsTitle')}
                    </h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                        {t('home.progressionsSubtitle')}
                    </p>
                    <Link
                        to="/progressions"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                        <BookOpen className="w-5 h-5" />
                        {t('home.exploreProgressions')}
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-stone-100 bg-white py-8">
                <div className="max-w-[1400px] mx-auto px-6 text-center text-stone-500 text-sm">
                    {t('home.footerText')}
                </div>
            </footer>
        </AppLayout>
    );
};

export default HomePage;
