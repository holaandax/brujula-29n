import { lazy, Suspense } from 'react';
import { useRoute } from './lib/router';
import { Header, Footer, ErrorBoundary } from './components/Layout';
import { Landing } from './components/Landing';
import { Quiz } from './components/Quiz';
import { QuizProvider } from './state/quiz';

const Results = lazy(() => import('./components/Results').then((m) => ({ default: m.Results })));
const Methodology = lazy(() => import('./pages/Methodology').then((m) => ({ default: m.Methodology })));
const Sources = lazy(() => import('./pages/Sources').then((m) => ({ default: m.Sources })));
const DataView = lazy(() => import('./pages/DataView').then((m) => ({ default: m.DataView })));
const loadExplore = () => import('./pages/Explore');
const Parties = lazy(() => loadExplore().then((m) => ({ default: m.Parties })));
const Topics = lazy(() => loadExplore().then((m) => ({ default: m.Topics })));
const Compass = lazy(() => loadExplore().then((m) => ({ default: m.Compass })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));

function Page() {
  const { route, param } = useRoute();
  switch (route) {
    case 'test': return <Quiz />;
    case 'resultado': return <Results />;
    case 'metodologia': return <Methodology />;
    case 'fuentes': return <Sources />;
    case 'datos': return <DataView />;
    case 'privacidad': return <Privacy />;
    case 'partidos': return <Parties id={param} />;
    case 'temas': return <Topics id={param} />;
    case 'brujula': return <Compass />;
    default: return <Landing />;
  }
}

export default function App() {
  return (
    <QuizProvider>
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<main className="wrap" aria-busy="true" />}>
          <Page />
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </QuizProvider>
  );
}
