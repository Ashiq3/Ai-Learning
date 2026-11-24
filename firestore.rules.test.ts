import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

/**
 * Static & Policy Verification Suite for firestore.rules / DRAFT_firestore.rules
 * Verifies every Dirty Dozen attack vector in security_spec.md is explicitly blocked
 * and that every entity in firebase-blueprint.json is covered with matching constraints.
 */
const rulesPath = fs.existsSync('firestore.rules') ? 'firestore.rules' : 'DRAFT_firestore.rules';
const rulesText = fs.readFileSync(rulesPath, 'utf8');
const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

test('Rules declare rules_version = 2 and global default-deny catch-all first', () => {
  assert.match(rulesText, /rules_version\s*=\s*'2'/);
  const defaultDenyIdx = rulesText.indexOf('match /{document=**}');
  const usersIdx = rulesText.indexOf('match /users/{userId}');
  assert.ok(defaultDenyIdx > 0 && defaultDenyIdx < usersIdx, 'Default-deny must precede collection matches');
  assert.match(rulesText, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;/);
});

test('Every collection in firebase-blueprint.json has a matching rule block', () => {
  for (const colPath of Object.keys(blueprint.firestore)) {
    const normalized = colPath.startsWith('/') ? colPath : `/${colPath}`;
    assert.ok(
      rulesText.includes(`match ${normalized}`),
      `Missing rule match block for blueprint path ${normalized}`
    );
  }
});

test('Dirty Dozen #1 & #2: Unauthenticated & unverified email spoofing blocked', () => {
  assert.match(rulesText, /function isSignedIn\(\)\s*\{\s*return request\.auth != null;/);
  assert.match(rulesText, /function isVerifiedUser\(\)\s*\{\s*return isSignedIn\(\) && request\.auth\.token\.email_verified == true;/);
  assert.match(rulesText, /function isInstructor\(\)\s*\{\s*return isVerifiedUser\(\) && request\.auth\.token\.email == 'ashiqebinrahman@gmail\.com';/);
});

test('Dirty Dozen #3, #4, #5: Role escalation and cross-user PII reads blocked', () => {
  assert.match(rulesText, /isInstructor\(\)\s*\?\s*incoming\(\)\.role == 'instructor'\s*:\s*incoming\(\)\.role == 'student'/);
  assert.match(rulesText, /incoming\(\)\.role == existing\(\)\.role/);
  assert.match(rulesText, /allow get: if isVerifiedUser\(\)\s*&& isValidId\(userId\)\s*&& \(isOwner\(userId\) \|\| isInstructor\(\)\);/);
  assert.match(rulesText, /allow list: if isInstructor\(\);/);
});

test('Dirty Dozen #6, #7, #8, #9, #10: Shadow keys, identity spoofing, orphans, self-review, forged timestamps blocked', () => {
  assert.match(rulesText, /data\.keys\(\)\.hasOnly\(/);
  assert.match(rulesText, /incoming\(\)\.studentUid == request\.auth\.uid/);
  assert.match(rulesText, /exists\(\/databases\/\$\(database\)\/documents\/users\/\$\(request\.auth\.uid\)\)/);
  assert.match(rulesText, /incoming\(\)\.reviewStatus == 'pending'/);
  assert.match(rulesText, /incoming\(\)\.teacherFeedback == ''/);
  assert.match(rulesText, /incoming\(\)\.shortAnswerScore == 0/);
  assert.match(rulesText, /incoming\(\)\.submittedAt == request\.time/);
  assert.match(rulesText, /incoming\(\)\.updatedAt == request\.time/);
});

test('Dirty Dozen #11 & #12: Student score tampering, list scraping, ID/value poisoning, and deletes blocked', () => {
  assert.match(rulesText, /allow list: if isVerifiedUser\(\)\s*&& \(isInstructor\(\) \|\| resource\.data\.studentUid == request\.auth\.uid\);/);
  assert.match(rulesText, /allow update: if isVerifiedUser\(\)\s*&& isValidId\(attemptId\)\s*&& isValidExamAttempt\(incoming\(\)\)\s*&& isInstructor\(\)/);
  assert.match(rulesText, /affectedKeys\(\)\.hasOnly\(\[\s*'reviewStatus',\s*'teacherFeedback',\s*'shortAnswerScore',\s*'reviewedBy',\s*'updatedAt'\s*\]\)/);
  assert.match(rulesText, /data\.teacherFeedback is string && data\.teacherFeedback\.size\(\) <= 2000/);
  assert.match(rulesText, /data\.shortAnswerScore is int && data\.shortAnswerScore >= 0 && data\.shortAnswerScore <= 2/);
  assert.match(rulesText, /data\.answers is list && data\.answers\.size\(\) >= 1 && data\.answers\.size\(\) <= 20 && data\.answers\[0\] is map/);
  assert.equal((rulesText.match(/allow delete: if false;/g) || []).length, 2);
});
