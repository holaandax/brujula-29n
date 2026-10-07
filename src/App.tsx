import { lazy, Suspense } from 'react';
import { useRoute } from './lib/router';
import { Header, Footer, ErrorBoundary } from './components/Layout';
import { Landing } from './components/Landing';
import { Quiz } from './components/Quiz';
import { QuizProvider } from './state/quiz';
import { LocaleProvider, UntranslatedNotice, useLocale } from './i18n';

const Results = lazy(() => import('./components/Results').then((m) => ({ default: m.Results })));
const Methodology = lazy(() => import('./pages/Methodology').then((m) => ({ default: m.Methodology })));
const Sources = lazy(() => import('./pages/Sources').then((m) => ({ default: m.Sources })));
const DataView = lazy(() => import('./pages/DataView').then((m) => ({ default: m.DataView })));
const loadExplore = () => import('./pages/Explore');
const Parties = lazy(() => loadExplore().then((m) => ({ default: m.Parties })));
const Topics = lazy(() => loadExplore().then((m) => ({ default: m.Topics })));
const Compass = lazy(() => loadExplore().then((m) => ({ default: m.Compass })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));
const Calendar = lazy(() => import('./pages/Calendar').then((m) => ({ default: m.Calendar })));
const HowToVote = lazy(() => import('./pages/HowToVote').then((m) => ({ default: m.HowToVote })));
const Pacts = lazy(() => import('./pages/Pacts').then((m) => ({ default: m.Pacts })));
const Proposals = lazy(() => import('./pages/Proposals').then((m) => ({ default: m.Proposals })));
const Candidates = lazy(() => import('./pages/Candidates').then((m) => ({ default: m.Candidates })));

function Page({ route, param }: ReturnType<typeof useRoute>) {
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
    case 'calendario': return <Calendar />;
    case 'como-votar': return <HowToVote />;
    case 'pactos': return <Pacts />;
    case 'propuestas': return <Proposals key={param ?? ''} topic={param} />;
    case 'candidatos': return <Candidates />;
    default: return <Landing />;
  }
}

/** Todas las páginas están traducidas. Si alguna nueva no lo está, añádela aquí para mostrar el aviso. */
const SPANISH_ONLY = new Set<string>([]);

function Shell() {
  const r = useRoute();
  const { locale } = useLocale();
  // key={locale}: al cambiar de idioma se vuelve a pintar todo; las respuestas siguen en QuizProvider.
  return (
    <div key={locale}>
      <Header route={r.route} />
      <ErrorBoundary>
        <Suspense fallback={<main className="wrap" aria-busy="true" />}>
          {SPANISH_ONLY.has(r.route) && <div className="wrap wide" style={{ paddingTop: '1rem' }}><UntranslatedNotice /></div>}
          <Page {...r} />
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <QuizProvider>
        <Shell />
      </QuizProvider>
    </LocaleProvider>
  );
}
