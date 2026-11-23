import { useEffect, useMemo, useState } from 'react';
import { RoadmapView } from './components/RoadmapView';
import { SlideWorkspace } from './components/SlideWorkspace';
import { ToolkitView } from './components/ToolkitView';
import { TopBar } from './components/TopBar';
import { COURSE_DECKS } from './data/allClasses';
import type { AppView, ClassId } from './types/course';
import { clampSlideIndex, getClassPacingSummary } from './utils/courseLogic';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('deck');
  const [activeClassId, setActiveClassId] = useState<ClassId>(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showTeacherCue, setShowTeacherCue] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const activeDeck = COURSE_DECKS[activeClassId];
  const pacing = useMemo(
    () => getClassPacingSummary(activeDeck.slides),
    [activeDeck]
  );

  const handleSelectClass = (classId: ClassId, initialSlide = 0) => {
    setActiveClassId(classId);
    setSlideIndex(clampSlideIndex(initialSlide, COURSE_DECKS[classId].slides.length));
    setShowTeacherCue(false);
    setShowGrid(false);
    setActiveView('deck');
    window.scrollTo(0, 0);
  };

  const goToSlide = (nextIdx: number) => {
    setSlideIndex(clampSlideIndex(nextIdx, activeDeck.slides.length));
    setShowTeacherCue(false);
    setShowGrid(false);
    setActiveView('deck');
    window.scrollTo(0, 0);
  };

  // Keyboard shortcuts matching the Keynote deck
  useEffect(() => {
    if (activeView !== 'deck') return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (event.key === 'Escape') {
        if (showGrid) setShowGrid(false);
        else if (showTeacherCue) setShowTeacherCue(false);
        return;
      }

      if (event.key === 'g' || event.key === 'G') {
        event.preventDefault();
        setShowGrid((g) => !g);
        return;
      }

      if (event.key === 't' || event.key === 'T') {
        event.preventDefault();
        setShowTeacherCue((t) => !t);
        return;
      }

      if (showGrid) return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        setSlideIndex((idx) => clampSlideIndex(idx + 1, activeDeck.slides.length));
        setShowTeacherCue(false);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setSlideIndex((idx) => clampSlideIndex(idx - 1, activeDeck.slides.length));
        setShowTeacherCue(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeView, activeDeck.slides.length, showGrid, showTeacherCue]);

  const handleSelectView = (view: AppView) => {
    setActiveView(view);
    setShowTeacherCue(false);
    setShowGrid(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="deck-surface min-h-[100dvh] text-[#edf4f5]">
      {activeView !== 'deck' && (
        <TopBar
          activeView={activeView}
          onSelectView={handleSelectView}
          onJumpToLiveFlow={() => handleSelectClass(3, 29)}
        />
      )}

      {activeView === 'deck' && (
        <SlideWorkspace
          deck={activeDeck}
          currentIndex={slideIndex}
          pacing={pacing}
          pacingItem={pacing.items[slideIndex]}
          showTeacherCue={showTeacherCue}
          showGrid={showGrid}
          onSelectClass={(cid) => handleSelectClass(cid, 0)}
          onToggleTeacherCue={() => setShowTeacherCue((v) => !v)}
          onCloseTeacherCue={() => setShowTeacherCue(false)}
          onToggleGrid={() => setShowGrid((v) => !v)}
          onCloseGrid={() => setShowGrid(false)}
          onSelectSlide={goToSlide}
          onPrev={() => goToSlide(slideIndex - 1)}
          onNext={() => goToSlide(slideIndex + 1)}
          onSelectView={handleSelectView}
        />
      )}

      {activeView === 'roadmap' && (
        <RoadmapView onOpenClass={(cid) => handleSelectClass(cid, 0)} />
      )}

      {activeView === 'toolkit' && <ToolkitView />}
    </div>
  );
}
