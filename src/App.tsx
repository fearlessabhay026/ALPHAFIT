import { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Training } from './components/Training';
import { Facility } from './components/Facility';
import { WeightExperience } from './components/WeightExperience';
import { PersonalTraining } from './components/PersonalTraining';
import { Results } from './components/Results';
import { Stats } from './components/Stats';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Grain } from './components/ui/Grain';
import { ScrollTrigger } from './lib/motion';
import { useSmoothScroll } from './lib/useSmoothScroll';

/**
 * The page is one continuous scroll, ordered as a journey:
 * arrival -> belief -> training -> environment -> intensity -> coaching ->
 * proof -> scale -> action.
 */
export function App() {
  useSmoothScroll();

  // Sections measure themselves from web fonts; refresh once those have landed
  // so no trigger is pinned against a stale layout.
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <Grain />
      <Navigation />
      <main id="main">
        <Hero />
        <Manifesto />
        <Training />
        <Facility />
        <WeightExperience />
        <PersonalTraining />
        <Results />
        <Stats />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
