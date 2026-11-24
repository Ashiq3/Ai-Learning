# Ai-Learning — Daily Engineering Tasklist

Incremental, production-focused improvements for **AI Backend Master Course** (`Ashiq3/Ai-Learning`).  
**Rule:** Complete 1 focused task per scheduled run to keep changes clean, atomic, and meaningful.

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
