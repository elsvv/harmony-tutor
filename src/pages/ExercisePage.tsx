import { useState } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Menu,
    Home,
    Music,
    ChevronRight,
    ChevronDown,
    Folder,
    BookOpen,
    GitCompare,
    TrendingUp,
} from 'lucide-react';
import { EXERCISE_CATEGORIES, getExerciseById } from '../exercises';
import { ExercisePlayer } from '../components/exercises';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../i18n/types';
import { Drawer } from '../components/ui/Drawer';
import { cn } from '../lib/utils';
import { LESSON_CATEGORIES } from './ProgressionsPage';

export function ExercisePage() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const [lang, setLang] = useState<Language>('en');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
    const t = TRANSLATIONS[lang];

    const exercise = exerciseId ? getExerciseById(exerciseId) : null;

    if (!exercise) {
        return <Navigate to="/" replace />;
    }

    const currentCategory = EXERCISE_CATEGORIES.find((c) =>
        c.exercises.some((e) => e.id === exerciseId)
    );

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
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
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Home className="w-4 h-4" />
                        {t.back}
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
                                                            className={cn(
                                                                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                                                exercise.id === ex.id
                                                                    ? 'bg-indigo-50 text-indigo-600'
                                                                    : 'text-stone-600 hover:bg-stone-50'
                                                            )}
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
                                                            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 text-stone-600 hover:bg-stone-50"
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

            {/* Header with menu button */}
            <header className="w-full max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 -ml-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link
                        to="/"
                        className="text-xl font-bold tracking-tight text-stone-900 hover:text-indigo-600 transition-colors"
                    >
                        {t.appTitle}
                    </Link>
                    {currentCategory && (
                        <>
                            <ChevronRight className="w-4 h-4 text-stone-300" />
                            <span className="text-sm text-stone-500">
                                {currentCategory.title[lang]}
                            </span>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setLang((prev) => (prev === 'en' ? 'ru' : 'en'))}
                    className="px-3 py-1.5 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors text-xs font-medium uppercase"
                >
                    {lang === 'en' ? 'RU' : 'EN'}
                </button>
            </header>

            {/* Exercise Player */}
            <ExercisePlayer
                exercise={exercise}
                lang={lang}
                onBack={() => navigate('/')}
                translations={t}
            />
        </div>
    );
}

export default ExercisePage;
