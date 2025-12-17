import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Menu,
    Home,
    Music,
    BookOpen,
    Folder,
    ChevronDown,
    ChevronRight,
    Languages,
    GitCompare,
    TrendingUp,
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { cn } from '../../lib/utils';
import { changeLanguage, type Language } from '../../i18n';
import { EXERCISE_CATEGORIES } from '../../exercises';
import { LESSON_CATEGORIES } from '../../pages/ProgressionsPage';
import { useMidi } from '../../engine/MidiManager';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: Breadcrumb[];
}

const CATEGORY_ICONS: Record<string, ReactNode> = {
    'staff-reading': <Music className="w-4 h-4 text-stone-400 shrink-0" />,
    intervals: <GitCompare className="w-4 h-4 text-stone-400 shrink-0" />,
    scales: <TrendingUp className="w-4 h-4 text-stone-400 shrink-0" />,
    basics: <Folder className="w-4 h-4 text-stone-400 shrink-0" />,
    classical: <Folder className="w-4 h-4 text-stone-400 shrink-0" />,
    jazz: <Folder className="w-4 h-4 text-stone-400 shrink-0" />,
};

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { midiEnabled } = useMidi();
    const { t, i18n } = useTranslation();
    const lang = i18n.language as Language;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

    const handleLanguageToggle = () => {
        const newLang = lang === 'en' ? 'ru' : 'en';
        changeLanguage(newLang);
    };

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans flex flex-col">
            {/* Navigation Drawer */}
            <Drawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                side="left"
                width="w-80"
                title={
                    <span className="flex items-center gap-2 text-lg">
                        <Music className="w-5 h-5 text-[var(--color-primary)]" />
                        {t('common.appTitle')}
                    </span>
                }
            >
                <div className="p-4">
                    {/* Home Link */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Home className="w-4 h-4" />
                        {t('common.home')}
                    </Link>

                    {/* Exercises Section */}
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4 px-2">
                        {t('home.exerciseCategories')}
                    </h3>
                    <div className="space-y-2 mb-6">
                        {EXERCISE_CATEGORIES.map((category) => {
                            const isOpen = openCategoryId === `ex-${category.id}`;
                            const icon = CATEGORY_ICONS[category.id] || (
                                <Folder className="w-4 h-4 text-stone-400 shrink-0" />
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
                                            <span className="truncate">{t(category.titleKey)}</span>
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
                                                                'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                                                isActivePath(`/exercise/${ex.id}`)
                                                                    ? 'bg-[var(--color-surface-highlight)] text-[var(--color-primary)]'
                                                                    : 'text-stone-600 hover:bg-stone-50'
                                                            )}
                                                        >
                                                            {t(ex.titleKey)}
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
                        {t('common.library')}
                    </h3>
                    <div className="space-y-2">
                        {LESSON_CATEGORIES.map((category) => {
                            const isOpen = openCategoryId === category.id;
                            const title = t(category.titleKey);

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
                                                    {category.lessons.map((lesson) => (
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => {
                                                                navigate(
                                                                    `/progressions/${lesson.id}`
                                                                );
                                                                setIsMenuOpen(false);
                                                            }}
                                                            className={cn(
                                                                'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3',
                                                                isActivePath(
                                                                    `/progressions/${lesson.id}`
                                                                )
                                                                    ? 'bg-[var(--color-surface-highlight)] text-[var(--color-primary)]'
                                                                    : 'text-stone-600 hover:bg-stone-50'
                                                            )}
                                                        >
                                                            <BookOpen className="w-4 h-4 opacity-50" />
                                                            {t(lesson.titleKey)}
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

            {/* Header */}
            <header className="w-full border-b border-stone-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
                <div className="w-full max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
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
                            {t('common.appTitle')}
                        </Link>

                        {/* Breadcrumbs */}
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <>
                                {breadcrumbs.map((crumb, index) => (
                                    <span key={index} className="flex items-center gap-4">
                                        <ChevronRight className="w-4 h-4 text-stone-300" />
                                        {crumb.href ? (
                                            <Link
                                                to={crumb.href}
                                                className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-stone-500">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <button
                            onClick={handleLanguageToggle}
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
                            {midiEnabled ? t('midi.on') : t('midi.off')}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
        </div>
    );
}

export default AppLayout;
