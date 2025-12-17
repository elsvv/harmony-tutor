import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, ExercisePage, ProgressionsPage, AVAILABLE_LESSONS } from './pages';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
            <Route
                path="/progressions"
                element={<Navigate to={`/progressions/${AVAILABLE_LESSONS[0].id}`} replace />}
            />
            <Route path="/progressions/:taskId" element={<ProgressionsPage />} />
            {/* Legacy route support */}
            <Route path="/task/:taskId" element={<ProgressionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
