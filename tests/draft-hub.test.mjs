import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateDraftHub} from '../scripts/draft-hub.mjs';

const canonical = '<link rel="canonical" href="https://aafnaipatro.com/events/example/">';
test('accepts a noindex draft with its own canonical regardless of attribute order', () => {
  assert.doesNotThrow(() => validateDraftHub(`<meta content="noindex,follow" name="robots">${canonical}`, 'example'));
});
test('rejects indexable or contradictory directives', () => {
  for (const meta of ['', '<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow"><meta name="robots" content="index,follow">'])
    assert.throws(() => validateDraftHub(meta + canonical, 'example'));
});
test('rejects an absent or incorrect canonical even if its URL appears in page text', () => {
  const meta = '<meta name="robots" content="noindex,follow">';
  assert.throws(() => validateDraftHub(meta + 'https://aafnaipatro.com/events/example/', 'example'));
  assert.throws(() => validateDraftHub(meta + canonical, 'other'));
});
