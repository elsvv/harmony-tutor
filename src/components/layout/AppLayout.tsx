import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Menu,
    Home,
    Music,
    BookOpen,
    Folder,
    ChevronDown,
    Languages,
    GitCompare,
    TrendingUp,
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { cn } from '../../lib/utils';
import { TRANSLATIONS } from '../../i18n/translations';
import type { Language } from '../../i18n/types';
import { EXERCISE_CATEGORIES } from '../../exercises';
import { LESSON_CATEGORIES } from '../../pages/ProgressionsPage';
import { useMidi } from '../../engine/MidiManager';

interface AppLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
}

const CATEGORY_ICONS: Record<string, ReactNode> = {
    'staff-reading': <Music className="w-4 h-4" />,
    intervals: <GitCompare className="w-4 h-4" />,
    scales: <TrendingUp className="w-4 h-4" />,
    basics: <BookOpen className="w-4 h-4" />,
    classical: <Music className="w-4 h-4" />,
    jazz: <Music className="w-4 h-4" />,
};

export function AppLayout({ children, showHeader = true }: AppLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { midiEnabled } = useMidi();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lang, setLang] = useState<Language>('en');
    const [openSections, setOpenSections] = useState<string[]>(['exercises']);

    const t = TRANSLATIONS[lang];

    const toggleSection = (sectionId: string) => {
        setOpenSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
        );
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

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
                <div className="p-4 space-y-6">
                    {/* Home Link */}
                    <Link
                        to="/"
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                            location.pathname === '/'
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-stone-600 hover:bg-stone-50'
                        )}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Home className="w-4 h-4" />
                        {t.home || 'Home'}
                    </Link>

                    {/* Exercises Section */}
                    <div>
                        <button
                            onClick={() => toggleSection('exercises')}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider"
                        >
                            <span>{t.exerciseCategories}</span>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 transition-transform',
                                    openSections.includes('exercises') && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence initial={false}>
                            {openSections.includes('exercises') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-2 mt-2">
                                        {EXERCISE_CATEGORIES.map((category) => (
                                            <div
                                                key={category.id}
                                                className="rounded-xl border border-stone-100 bg-white overflow-hidden"
                                            >
                                                <button
                                                    onClick={() =>
                                                        toggleSection(`ex-${category.id}`)
                                                    }
                                                    className={cn(
                                                        'w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold transition-colors',
                                                        openSections.includes(`ex-${category.id}`)
                                                            ? 'bg-stone-50 text-stone-900'
                                                            : 'text-stone-700 hover:bg-stone-50'
                                                    )}
                                                >
                                                    <span className="flex items-center gap-2 min-w-0">
                                                        {CATEGORY_ICONS[category.id] || (
                                                            <Folder className="w-4 h-4 text-stone-400" />
                                                        )}
                                                        <span className="truncate">
                                                            {category.title[lang]}
                                                        </span>
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'w-4 h-4 text-stone-400 transition-transform shrink-0',
                                                            openSections.includes(
                                                                `ex-${category.id}`
                                                            ) && 'rotate-180'
                                                        )}
                                                    />
                                                </button>

                                                <AnimatePresence initial={false}>
                                                    {openSections.includes(`ex-${category.id}`) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-2 pb-2 space-y-1">
                                                                {category.exercises.map((ex) => (
                                                                    <button
                                                                        key={ex.id}
                                                                        onClick={() => {
                                                                            navigate(
                                                                                `/exercise/${ex.id}`
                                                                            );
                                                                            setIsMenuOpen(false);
                                                                        }}
                                                                        className={cn(
                                                                            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                                                            isActive(
                                                                                `/exercise/${ex.id}`
                                                                            )
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
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progressions Section */}
                    <div>
                        <button
                            onClick={() => toggleSection('progressions')}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider"
                        >
                            <span>{t.library}</span>
                            <ChevronDown
                                className={cn(
                                    'w-4 h-4 transition-transform',
                                    openSections.includes('progressions') && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence initial={false}>
                            {openSections.includes('progressions') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-2 mt-2">
                                        {LESSON_CATEGORIES.map((category) => {
                                            const title = t[
                                                category.titleKey as keyof typeof t
                                            ] as string;
                                            return (
                                                <div
                                                    key={category.id}
                                                    className="rounded-xl border border-stone-100 bg-white overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() =>
                                                            toggleSection(`prog-${category.id}`)
                                                        }
                                                        className={cn(
                                                            'w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold transition-colors',
                                                            openSections.includes(
                                                                `prog-${category.id}`
                                                            )
                                                                ? 'bg-stone-50 text-stone-900'
                                                                : 'text-stone-700 hover:bg-stone-50'
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-2 min-w-0">
                                                            {CATEGORY_ICONS[category.id] || (
                                                                <Folder className="w-4 h-4 text-stone-400" />
                                                            )}
                                                            <span className="truncate">
                                                                {title}
                                                            </span>
                                                        </span>
                                                        <ChevronDown
                                                            className={cn(
                                                                'w-4 h-4 text-stone-400 transition-transform shrink-0',
                                                                openSections.includes(
                                                                    `prog-${category.id}`
                                                                ) && 'rotate-180'
                                                            )}
                                                        />
                                                    </button>

                                                    <AnimatePresence initial={false}>
                                                        {openSections.includes(
                                                            `prog-${category.id}`
                                                        ) && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{
                                                                    height: 'auto',
                                                                    opacity: 1,
                                                                }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-2 pb-2 space-y-1">
                                                                    {category.lessons.map(
                                                                        (lesson) => (
                                                                            <button
                                                                                key={lesson.id}
                                                                                onClick={() => {
                                                                                    navigate(
                                                                                        `/progressions/${lesson.id}`
                                                                                    );
                                                                                    setIsMenuOpen(
                                                                                        false
                                                                                    );
                                                                                }}
                                                                                className={cn(
                                                                                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                                                                    isActive(
                                                                                        `/progressions/${lesson.id}`
                                                                                    )
                                                                                        ? 'bg-indigo-50 text-indigo-600'
                                                                                        : 'text-stone-600 hover:bg-stone-50'
                                                                                )}
                                                                            >
                                                                                {lesson.title[lang]}
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Drawer>

            {/* Header */}
            {showHeader && (
                <header className="w-full border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                    <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
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
                    </div>
                </header>
            )}

            {children}
        </div>
    );
}

export default AppLayout;
