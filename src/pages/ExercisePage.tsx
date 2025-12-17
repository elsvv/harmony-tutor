import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EXERCISE_CATEGORIES, getExerciseById } from '../exercises';
import { ExercisePlayer } from '../components/exercises';
import { AppLayout } from '../components/layout/AppLayout';

export function ExercisePage() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const exercise = exerciseId ? getExerciseById(exerciseId) : null;

    if (!exercise) {
        return <Navigate to="/" replace />;
    }

    const currentCategory = EXERCISE_CATEGORIES.find((c) =>
        c.exercises.some((e) => e.id === exerciseId)
    );

    const breadcrumbs = currentCategory ? [{ label: t(currentCategory.titleKey) }] : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ExercisePlayer exercise={exercise} onBack={() => navigate('/')} />
        </AppLayout>
    );
}

export default ExercisePage;
