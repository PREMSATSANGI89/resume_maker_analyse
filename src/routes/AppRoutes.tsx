import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { MainLayout } from '@/components/layout/MainLayout';

// Route-level code splitting keeps the initial bundle lean.
const Dashboard = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder/ResumeBuilderPage'));
const ResumeAnalyzer = lazy(() => import('@/pages/ResumeAnalyzer/ResumeAnalyzerPage'));
const AnalyzerResult = lazy(() => import('@/pages/AnalyzerResult/AnalyzerResultPage'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFoundPage'));

function RouteFallback() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<ResumeBuilder />} />
          <Route path="/analyzer" element={<ResumeAnalyzer />} />
          <Route path="/analyzer/result" element={<AnalyzerResult />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
