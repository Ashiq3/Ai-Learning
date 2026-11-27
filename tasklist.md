# Ai-Learning — Daily Engineering Tasklist

Incremental, production-focused improvements for **AI Backend Master Course** (`Ashiq3/Ai-Learning`).  
**Rule:** Complete 1–2 focused tasks per run, selected by estimated effort and current backlog state to keep changes clean, atomic, and meaningful.

## Documentation & Curriculum Polish
- [x] Add MIT `LICENSE` file to the repository (2026-11-24)
- [ ] Add `CONTRIBUTING.md` with guidelines for contributing lessons, fixes, or visual slides
- [ ] Add `CHANGELOG.md` to track curriculum and UI updates
- [ ] Add `docs/curriculum-roadmap.md` outlining the 20-class AI backend learning path
- [ ] Add `.github/ISSUE_TEMPLATE/bug_report.md` for reporting lesson or UI issues
- [ ] Document all required environment variables in `.env.example` with clear setup notes

## Code Quality, UX & Automation
- [ ] Polish `index.html` with proper page title, meta description, and Open Graph tags
- [ ] Update `package.json` `name` field from `react-example` to `ai-backend-master-course`
- [ ] Add JSDoc documentation to helper utilities in `src/utils/`
- [ ] Review `src/types/` for clean TypeScript interfaces across lesson and slide data
- [ ] Add a GitHub Actions CI workflow (`.github/workflows/typecheck.yml`) to run `npm run lint` (`tsc --noEmit`) on push/PR
- [ ] Review accessibility attributes (`aria-label`, keyboard navigation hints) in `src/App.tsx`


## Expanded Course & Product Backlog — AIL-013 to AIL-040

The original checklist above is preserved. Each item is a small, reviewable task. Done means the change is implemented, checked, and documented where appropriate. Keep the beginner-friendly teaching style and preserve the existing 20-class roadmap and ready-deck pacing rules.

### Build, tests & curriculum integrity
- [ ] **AIL-013 — Add a repeatable test command.** Wire the existing Node test files through the repository's installed TypeScript runner. **Done when:** one documented command runs course-logic and exam-logic tests from a clean install.
- [ ] **AIL-014 — Add pull-request CI for lint, tests and build.** Reuse the committed lockfile and avoid unnecessary package-manager mixing. **Done when:** a pull request fails when any required check fails.
- [ ] **AIL-015 — Add a course deck integrity test.** Check unique slide IDs, valid slide references, non-empty titles and valid class IDs. **Done when:** malformed or duplicate slide metadata is caught automatically.
- [ ] **AIL-016 — Add curriculum-to-deck consistency tests.** Verify roadmap class IDs, ready deck IDs and class titles stay aligned. **Done when:** missing, duplicate or orphaned ready classes fail the test.
- [ ] **AIL-017 — Add exam definition validation tests.** Cover empty questions, duplicate question IDs, invalid correct-answer indexes and unsupported question types. **Done when:** invalid exam definitions are rejected before rendering or grading.
- [ ] **AIL-018 — Add exam submission boundary tests.** Cover missing answers, extra answer IDs, duplicate selections and malformed short answers. **Done when:** grading is deterministic and malformed input cannot increase a score.
- [ ] **AIL-019 — Add attempt document mapping tests.** Cover missing fields, malformed timestamps, invalid numeric values and unknown review states in examService.ts. **Done when:** stored Firestore data maps to safe defaults without runtime exceptions.
- [ ] **AIL-020 — Add a Firebase Emulator test guide.** Document local emulator setup and the exact commands for running Firestore rules tests. **Done when:** a new contributor can reproduce the security test environment from the guide.
- [ ] **AIL-021 — Add emulator-backed Firestore authorization tests.** Test real rule evaluation for signed-out, unverified, student and instructor cases. **Done when:** cross-student reads, role escalation and unauthorized writes are denied by the emulator.
- [ ] **AIL-022 — Add a regression test for default-deny Firestore behavior.** Verify an unlisted collection/path is denied. **Done when:** adding a collection without a matching explicit rule cannot accidentally grant access.
- [ ] **AIL-023 — Test exam subscription cleanup.** Verify listeners report errors and unsubscribe correctly when the consuming view unmounts. **Done when:** no stale subscription remains after cleanup in the service tests.
- [ ] **AIL-024 — Add progress-storage migration tests.** Cover missing data, old schema versions, malformed JSON and storage access errors. **Done when:** learners keep a safe default progress state and compatible old data is migrated intentionally.

### Beginner teaching experience
- [x] **AIL-025 — Add a beginner glossary for Classes 1–3.** Explain recurring terms such as API, backend, database, token, webhook and deployment in plain language. **Done when:** each term has a short definition and one everyday analogy. (2026-11-27)
- [ ] **AIL-026 — Add a lesson prerequisite map.** Show which concepts a learner should understand before each ready class. **Done when:** the map links to actual class/slide IDs and contains no broken references.
- [ ] **AIL-027 — Add a slide content QA checklist.** Check learning objective, beginner explanation, analogy, practical example and recap for each lesson section. **Done when:** the checklist is usable before publishing new slides.
- [ ] **AIL-028 — Review slide wording for unexplained jargon.** Start with the first three ready classes and flag terms introduced without a plain-language explanation. **Done when:** every flagged term is explained on first use or linked to the glossary.
- [ ] **AIL-029 — Add accessible keyboard controls to slide navigation.** Support predictable previous/next navigation and visible focus without interfering with text inputs. **Done when:** a learner can complete slide navigation without a mouse.
- [ ] **AIL-030 — Add reduced-motion support to interactive labs.** Respect prefers-reduced-motion for non-essential animations. **Done when:** core lab information remains available with motion reduced.
- [ ] **AIL-031 — Add accessible labels to interactive lab controls.** Label buttons, sliders, toggles and status output in InteractiveLabs and StageEngines. **Done when:** controls expose meaningful names and status changes are announced.
- [ ] **AIL-032 — Audit alternative text for course images.** Give informative images meaningful alt text and mark purely decorative images accordingly. **Done when:** the audit covers slide data and shared course components.
- [ ] **AIL-033 — Improve the mobile slide workspace.** Review narrow screens for overflow, unreadable code and hidden navigation controls. **Done when:** a documented mobile smoke test passes for the ready classes.
- [ ] **AIL-034 — Add clear loading, empty and error states to exam views.** Cover student results and instructor dashboard states. **Done when:** each state explains what happened and what the learner can do next.
- [ ] **AIL-035 — Add an exam review accessibility pass.** Verify answer correctness, feedback and score information are not conveyed by color alone. **Done when:** keyboard focus and accessible names identify all review states.

### Security, performance & documentation
- [ ] **AIL-036 — Audit Firebase configuration and environment documentation.** Distinguish public Firebase client configuration from private credentials and document safe setup. **Done when:** no server secret is placed in client assets and .env.example contains placeholders only.
- [ ] **AIL-037 — Add a security-rules change checklist.** Document the required positive and negative tests for every collection added to the Firestore blueprint. **Done when:** contributors have a repeatable checklist before rules changes.
- [ ] **AIL-038 — Measure the initial course bundle.** Record a baseline and identify the largest course data, image and interactive modules. **Done when:** a reproducible build report is committed without arbitrary performance claims.
- [ ] **AIL-039 — Evaluate lazy loading for non-ready class decks.** Load only the data needed for the active ready class where architecture permits. **Done when:** initial bundle impact is measured and behavior remains unchanged.
- [ ] **AIL-040 — Add a manual release smoke-test guide.** Cover authentication, learner progress, slide navigation, exams, instructor review and mobile layout. **Done when:** each release can be checked with a short repeatable checklist.
