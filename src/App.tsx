import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeModeProvider } from '@/theme/ThemeModeContext';
import { ResumeProvider } from '@/context/ResumeContext';
import { AppRoutes } from '@/routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <ResumeProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                style: { borderRadius: 12, fontFamily: 'Inter, sans-serif', fontSize: 14 },
              }}
            />
          </BrowserRouter>
        </ResumeProvider>
      </ThemeModeProvider>
    </QueryClientProvider>
  );
}

export default App;
