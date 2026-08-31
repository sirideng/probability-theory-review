import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import KnowledgeDetailPage from './pages/KnowledgeDetailPage'
import DistributionLibraryPage from './pages/DistributionLibraryPage'
import DistributionDetailPage from './pages/DistributionDetailPage'
import FormulaLibraryPage from './pages/FormulaLibraryPage'
import DataSciencePage from './pages/DataSciencePage'
import ChapterReviewPage from './pages/ChapterReviewPage'
import MachineLearningBridgePage from './pages/MachineLearningBridgePage'

const MachineLearningMapPage = lazy(() => import('./pages/MachineLearningMapPage'))
const MachineLearningLessonPage = lazy(() => import('./pages/MachineLearningLessonPage'))
const NumpyReferencePage = lazy(() => import('./pages/NumpyReferencePage'))

const machineLearningFallback = <div className="page-container py-20"><div className="h-56 animate-pulse rounded-[28px] bg-white/65" /></div>

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/knowledge/:slug" element={<KnowledgeDetailPage />} />
        <Route path="/distributions" element={<DistributionLibraryPage />} />
        <Route path="/distributions/:slug" element={<DistributionDetailPage />} />
        <Route path="/formulas" element={<FormulaLibraryPage />} />
        <Route path="/review" element={<Navigate to="/review/chapter-1" replace />} />
        <Route path="/review/:chapterId" element={<ChapterReviewPage />} />
        <Route path="/data-science" element={<DataSciencePage />} />
        <Route path="/machine-learning" element={<Suspense fallback={machineLearningFallback}><MachineLearningMapPage /></Suspense>} />
        <Route path="/machine-learning/numpy" element={<Suspense fallback={machineLearningFallback}><NumpyReferencePage /></Suspense>} />
        <Route path="/machine-learning/bridge/:groupId" element={<MachineLearningBridgePage />} />
        <Route path="/machine-learning/supervised-generalization" element={<Navigate to="/machine-learning/bridge/supervised-generalization" replace />} />
        <Route path="/machine-learning/probabilistic-classification" element={<Navigate to="/machine-learning/bridge/probabilistic-classification" replace />} />
        <Route path="/machine-learning/regularization-training" element={<Navigate to="/machine-learning/bridge/regularization-training" replace />} />
        <Route path="/machine-learning/:lessonId" element={<Suspense fallback={machineLearningFallback}><MachineLearningLessonPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
