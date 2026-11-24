# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants & Relationship Mapping
- **Master Source of Truth:**
  - `users/{userId}` holds verified Google user profiles (`uid`, `email`, `displayName`, `photoURL`, `role`, `createdAt`, `lastLoginAt`).
  - `examAttempts/{attemptId}` holds permanent, immutable exam submission snapshots belonging to a verified user (`studentUid` referencing `users/{studentUid}`), plus instructor-only review fields (`reviewStatus`, `teacherFeedback`, `shortAnswerScore`, `reviewedBy`, `updatedAt`).
- **Invariants:**
  1. Unauthenticated or unverified-email callers cannot read or write any collection.
  2. PII (`email`, `displayName`, `photoURL`) in `users/{userId}` is readable only by the document owner or the verified instructor (`ashiqebinrahman@gmail.com`).
  3. Non-instructor users are strictly locked to `role == 'student'` on create and cannot alter `role`, `uid`, `email`, or `createdAt` on update.
  4. An `examAttempts/{attemptId}` record cannot be created unless `users/$(request.auth.uid)` exists (no orphaned exam submissions), `studentUid == request.auth.uid`, `studentEmail == request.auth.token.email`, `reviewStatus == 'pending'`, `teacherFeedback == ''`, `shortAnswerScore == 0`, and timestamps strictly equal `request.time`.
  5. Students can list and read ONLY their own `examAttempts` (`resource.data.studentUid == request.auth.uid`). They can NEVER update or delete any submitted attempt.
  6. Only the verified instructor (`ashiqebinrahman@gmail.com`) can list all attempts and update ONLY `['reviewStatus', 'teacherFeedback', 'shortAnswerScore', 'reviewedBy', 'updatedAt']`, while all historical snapshot fields remain immutable.

## 2. The "Dirty Dozen" Attack Payloads (Must All Return PERMISSION_DENIED)
1. **Unauthenticated Read/Write**: Read `users/u1` or `examAttempts/att1` with `auth == null`.
2. **Email Spoofing Attack**: `auth.token.email == 'ashiqebinrahman@gmail.com'` with `email_verified == false` attempting to list `examAttempts`.
3. **Self-Assigned Instructor Escalation**: Student creates `users/{uid}` with `role: 'instructor'`.
4. **Role Escalation Update**: Student updates own `users/{uid}` changing `role` from `'student'` to `'instructor'`.
5. **PII Cross-User Read**: Student A attempts `get` on `users/studentB`.
6. **Shadow / Ghost Field Injection**: Student creates `examAttempts/{id}` including an extra ghost key `isAdminOverride: true`.
7. **Identity Spoofing on Attempt**: Student A creates `examAttempts/{id}` with `studentUid: 'studentB'`.
8. **Orphaned Attempt Create**: Verified user with no `users/{uid}` profile attempts to create `examAttempts/{id}`.
9. **Pre-Graded / Self-Reviewed Attempt**: Student creates `examAttempts/{id}` with `reviewStatus: 'reviewed'`, `shortAnswerScore: 2`, or `teacherFeedback: 'Great job'`.
10. **Client-Forged Timestamp**: Student creates `examAttempts/{id}` with backdated `submittedAt != request.time`.
11. **Student Score Tampering Update**: Student attempts `update` on own `examAttempts/{id}` changing `scorePercent` from `40` to `100`.
12. **Value Poisoning & ID Poisoning**:
    - Document ID longer than 128 chars or containing invalid symbols (`../evil`).
    - Instructor attempts update with `teacherFeedback` exceeding `2000` chars or `shortAnswerScore: 99`.
    - Student attempts `delete` on `examAttempts/{id}` or `users/{uid}`.
