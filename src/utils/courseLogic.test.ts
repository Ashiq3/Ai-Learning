import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSE_DECKS, READY_CLASS_IDS } from '../data/allClasses.ts';
import { CURRICULUM_CLASSES } from '../data/roadmapData.ts';
import {
  clampSlideIndex,
  computeContextWindowUsage,
  computeServerLoad,
  getClassPacingSummary,
  getCurriculumTotals,
  simulatePostmanCall,
  tokenizeText,
  validateJsonPayload,
  validateZeroForwardReference,
} from './courseLogic.ts';

test('All 3 ready classes each have 36 slides, exactly 180 minutes (3 hours), 15-min break, and ZERO forward-reference violations', () => {
  assert.deepEqual(READY_CLASS_IDS, [1, 2, 3]);

  for (const cid of READY_CLASS_IDS) {
    const deck = COURSE_DECKS[cid];
    assert.equal(deck.slides.length, 36, `Class ${cid} should have 36 slides`);

    const pacing = getClassPacingSummary(deck.slides);
    assert.equal(
      pacing.totalClassMinutes,
      180,
      `Class ${cid} must total exactly 180 minutes (got ${pacing.totalClassMinutes})`
    );
    assert.equal(pacing.totalBreakMinutes, 15, `Class ${cid} should have a 15-minute break`);
    assert.equal(pacing.totalInstructionMinutes, 165, `Class ${cid} instruction should be 165 min`);

    const violations = validateZeroForwardReference(deck.slides);
    assert.equal(
      violations.length,
      0,
      `Class ${cid} zero-forward-reference violations: ${JSON.stringify(violations)}`
    );
  }
});

test('20-Class Master Curriculum totals 20 classes, 60 hours, and 3 ready interactive decks', () => {
  const totals = getCurriculumTotals(CURRICULUM_CLASSES);
  assert.equal(totals.totalClasses, 20);
  assert.equal(totals.totalHours, 60);
  assert.equal(totals.readyCount, 3);
});

test('simulatePostmanCall accurately returns 200, 400, 401, 404, and 429', () => {
  const ok = simulatePostmanCall({
    method: 'POST',
    endpoint: '/v1/chat',
    hasValidApiKey: true,
    bodyText: '{"prompt":"hi"}',
    spamCount: 1,
  });
  assert.equal(ok.statusCode, 200);

  const badKey = simulatePostmanCall({
    method: 'POST',
    endpoint: '/v1/chat',
    hasValidApiKey: false,
    bodyText: '{"prompt":"hi"}',
    spamCount: 1,
  });
  assert.equal(badKey.statusCode, 401);

  const notFound = simulatePostmanCall({
    method: 'GET',
    endpoint: '/wrong',
    hasValidApiKey: true,
    bodyText: '',
    spamCount: 1,
  });
  assert.equal(notFound.statusCode, 404);

  const badJson = simulatePostmanCall({
    method: 'POST',
    endpoint: '/v1/chat',
    hasValidApiKey: true,
    bodyText: '{bad json}',
    spamCount: 1,
  });
  assert.equal(badJson.statusCode, 400);

  const rateLimited = simulatePostmanCall({
    method: 'GET',
    endpoint: '/v1/models',
    hasValidApiKey: true,
    bodyText: '',
    spamCount: 6,
  });
  assert.equal(rateLimited.statusCode, 429);
});

test('validateJsonPayload rejects malformed JSON and accepts clean JSON objects', () => {
  assert.equal(validateJsonPayload('{"a": 1, "b": true}').valid, true);
  assert.equal(validateJsonPayload("{'a': 1}").valid, false);
  assert.equal(validateJsonPayload('{"a": 1,}').valid, false);
});

test('computeContextWindowUsage drops oldest messages when token bucket overflows', () => {
  const msgs = [
    { text: 'Old 1', tokens: 20 },
    { text: 'Mid 2', tokens: 20 },
    { text: 'New 3', tokens: 20 },
  ];
  const usage = computeContextWindowUsage(msgs, 45);
  assert.equal(usage.usedTokens, 40);
  assert.equal(usage.droppedCount, 1);
  assert.deepEqual(usage.droppedMessages, ['Old 1']);
  assert.deepEqual(usage.keptMessages, ['Mid 2', 'New 3']);
});

test('tokenizeText, computeServerLoad, and clampSlideIndex behave deterministically', () => {
  const tok = tokenizeText('Understanding AI backends!');
  assert.ok(tok.tokenCount >= 4);
  assert.equal(computeServerLoad('laptop', 120).status, 'OVERLOADED');
  assert.equal(computeServerLoad('cloud', 120).status, 'NOMINAL');
  assert.equal(clampSlideIndex(-4, 36), 0);
  assert.equal(clampSlideIndex(99, 36), 35);
});
