import { useEffect, useMemo, useState } from 'react';
import { ClassExamView } from './components/ClassExamView';
import { InstructorDashboardView } from './components/InstructorDashboardView';
import { RoadmapView } from './components/RoadmapView';
import { SlideWorkspace } from './components/SlideWorkspace';
import { StudentResultsView } from './components/StudentResultsView';
import { ToolkitView } from './components/ToolkitView';
import { TopBar } from './components/TopBar';
import { useAuth } from './context/AuthContext';
import { COURSE_DECKS } from './data/allClasses';
import { subscribeAllAttempts, subscribeUserAttempts } from './services/examService';
import type { AppView, ClassId } from './types/course';
import type { ExamAttemptRecord } from './types/exam';
import { clampSlideIndex, getClassPacingSummary } from './utils/courseLogic';
import {
  loadLearningProgress,
  recordSlideVisit,
  type StoredLearningProgress,
} from './utils/progressStorage';

export default function App() {
  const { user, isInstructor, authReady, signInWithGoogle, signOutUser } = useAuth();

  const [activeView, setActiveView] = useState<AppView>('roadmap');
  const [activeClassId, setActiveClassId] = useState<ClassId>(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showTeacherCue, setShowTeacherCue] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [pendingClassAfterSignIn, setPendingClassAfterSignIn] = useState<ClassId | null>(null);
  const [learningProgress, setLearningProgress] = useState<StoredLearningProgress>(() =>
    loadLearningProgress(null)
  );

  const [myAttempts, setMyAttempts] = useState<ExamAttemptRecord[]>([]);
  const [myAttemptsLoading, setMyAttemptsLoading] = useState(false);
  const [allAttempts, setAllAttempts] = useState<ExamAttemptRecord[]>([]);
  const [allAttemptsLoading, setAllAttemptsLoading] = useState(false);

  const activeDeck = COURSE_DECKS[activeClassId];
  const pacing = useMemo(() => getClassPacingSummary(activeDeck.slides), [activeDeck]);

  // Load saved lesson progress whenever authenticated user changes
  useEffect(() => {
    setLearningProgress(loadLearningProgress(user?.uid));
  }, [user?.uid]);

  // Record visited lessons automatically when viewing the Lesson Player
  useEffect(() => {
    if (!user || activeView !== 'deck') return;
    const currentSlide = activeDeck.slides[slideIndex];
    if (!currentSlide) return;
    setLearningProgress((prev) =>
      recordSlideVisit(user.uid, prev, activeClassId, slideIndex, currentSlide.id)
    );
  }, [user, activeView, activeClassId, slideIndex, activeDeck.slides]);

  // After signing in from a specific class CTA, enter that class immediately
  useEffect(() => {
    if (user && pendingClassAfterSignIn !== null) {
      setActiveClassId(pendingClassAfterSignIn);
      setSlideIndex(0);
      setActiveView('deck');
      setPendingClassAfterSignIn(null);
      window.scrollTo(0, 0);
    }
  }, [user, pendingClassAfterSignIn]);

  // Enforce strict logged-out syllabus gate
  useEffect(() => {
    if (authReady && !user && activeView !== 'roadmap') {
      setActiveView('roadmap');
      setShowTeacherCue(false);
      setShowGrid(false);
    }
  }, [authReady, user, activeView]);

  // Never allow non-instructors to keep Teacher Cue or Instructor view open
  useEffect(() => {
    if (!isInstructor) {
      if (showTeacherCue) setShowTeacherCue(false);
      if (activeView === 'instructor') setActiveView('results');
    }
  }, [isInstructor, showTeacherCue, activeView]);

  // Attach Firestore live listeners ONLY when auth is ready and user is signed in
  useEffect(() => {
    if (!authReady || !user) {
      setMyAttempts([]);
      setMyAttemptsLoading(false);
      return;
    }

    setMyAttemptsLoading(true);
    const unsub = subscribeUserAttempts(
      user.uid,
      (records) => {
        setMyAttempts(records);
        setMyAttemptsLoading(false);
      },
      () => {
        setMyAttemptsLoading(false);
      }
    );
    return () => unsub();
  }, [authReady, user]);

  useEffect(() => {
    if (!authReady || !user || !isInstructor) {
      setAllAttempts([]);
      setAllAttemptsLoading(false);
      return;
    }

    setAllAttemptsLoading(true);
    const unsub = subscribeAllAttempts(
      (records) => {
        setAllAttempts(records);
        setAllAttemptsLoading(false);
      },
      () => {
        setAllAttemptsLoading(false);
      }
    );
    return () => unsub();
  }, [authReady, user, isInstructor]);

  const pendingReviewCount = useMemo(
    () => allAttempts.filter((a) => a.reviewStatus === 'pending').length,
    [allAttempts]
  );

  const handleSelectClass = (classId: ClassId, initialSlide = 0) => {
    if (!user) return;
    setActiveClassId(classId);
    setSlideIndex(clampSlideIndex(initialSlide, COURSE_DECKS[classId].slides.length));
    setShowTeacherCue(false);
    setShowGrid(false);
    setActiveView('deck');
    window.scrollTo(0, 0);
  };

  const handleOpenExam = (classId: ClassId) => {
    if (!user) return;
    setActiveClassId(classId);
    setShowTeacherCue(false);
    setShowGrid(false);
    setActiveView('exam');
    window.scrollTo(0, 0);
  };

  const handleJumpToSlide1Based = (classId: ClassId, slideNumber1Based: number) => {
    handleSelectClass(classId, Math.max(0, slideNumber1Based - 1));
  };

  const handleRequestSignInForClass = (classId: ClassId) => {
    setPendingClassAfterSignIn(classId);
    void signInWithGoogle();
  };

  const goToSlide = (nextIdx: number) => {
    setSlideIndex(clampSlideIndex(nextIdx, activeDeck.slides.length));
    setShowTeacherCue(false);
    setShowGrid(false);
    setActiveView('deck');
    window.scrollTo(0, 0);
  };

  const handleSelectView = (view: AppView) => {
    if (!user) {
      setActiveView('roadmap');
      return;
    }
    if (view === 'instructor' && !isInstructor) {
      setActiveView('results');
      return;
    }
    setActiveView(view);
    setShowTeacherCue(false);
    setShowGrid(false);
    window.scrollTo(0, 0);
  };

  // Keyboard shortcuts matching the Keynote deck (Teacher Cue T shortcut gated to instructor!)
  useEffect(() => {
    if (!user || activeView !== 'deck') return;
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

      if ((event.key === 't' || event.key === 'T') && isInstructor) {
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
  }, [user, isInstructor, activeView, activeDeck.slides.length, showGrid, showTeacherCue]);

  if (!authReady) {
    return (
      <div className="app-canvas flex min-h-[100dvh] items-center justify-center text-slate-900">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-xs">
          Connecting to AI Backend Master Course…
        </div>
      </div>
    );
  }

  const effectiveView: AppView = user ? activeView : 'roadmap';

  return (
    <div className="app-canvas min-h-[100dvh] text-slate-900">
      {effectiveView !== 'deck' && (
        <TopBar
          activeView={effectiveView}
          pendingReviewCount={pendingReviewCount}
          onSelectView={handleSelectView}
        />
      )}

      {effectiveView === 'deck' && user && (
        <SlideWorkspace
          deck={activeDeck}
          currentIndex={slideIndex}
          visitedSlideIds={learningProgress.visitedByClass[activeClassId] ?? []}
          pacing={pacing}
          pacingItem={pacing.items[slideIndex]}
          showTeacherCue={showTeacherCue}
          showGrid={showGrid}
          isInstructor={isInstructor}
          pendingReviewCount={pendingReviewCount}
          onSelectClass={(cid) => handleSelectClass(cid, 0)}
          onOpenExam={handleOpenExam}
          onToggleTeacherCue={() => {
            if (isInstructor) setShowTeacherCue((v) => !v);
          }}
          onCloseTeacherCue={() => setShowTeacherCue(false)}
          onToggleGrid={() => setShowGrid((v) => !v)}
          onCloseGrid={() => setShowGrid(false)}
          onSelectSlide={goToSlide}
          onPrev={() => goToSlide(slideIndex - 1)}
          onNext={() => goToSlide(slideIndex + 1)}
          onSelectView={handleSelectView}
          onSignOut={() => void signOutUser()}
        />
      )}

      {effectiveView === 'roadmap' && (
        <RoadmapView
          myAttempts={myAttempts}
          learningProgress={learningProgress}
          onOpenClass={(cid, initialSlide = 0) => handleSelectClass(cid, initialSlide)}
          onOpenExam={handleOpenExam}
          onOpenResults={() => handleSelectView('results')}
          onRequestSignInForClass={handleRequestSignInForClass}
        />
      )}

      {effectiveView === 'exam' && user && (
        <ClassExamView
          classId={activeClassId}
          myAttempts={myAttempts}
          onSelectClass={(cid) => setActiveClassId(cid)}
          onJumpToSlide={handleJumpToSlide1Based}
          onOpenResults={() => handleSelectView('results')}
        />
      )}

      {effectiveView === 'results' && user && (
        <StudentResultsView
          myAttempts={myAttempts}
          loading={myAttemptsLoading}
          onStartExam={handleOpenExam}
          onJumpToSlide={handleJumpToSlide1Based}
        />
      )}

      {effectiveView === 'instructor' && user && isInstructor && (
        <InstructorDashboardView
          allAttempts={allAttempts}
          loading={allAttemptsLoading}
          onJumpToSlide={handleJumpToSlide1Based}
        />
      )}

      {effectiveView === 'toolkit' && user && <ToolkitView />}
    </div>
  );
}
