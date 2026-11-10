// Require the single EventV handoff ledger to change alongside meaningful project changes.
// Works for push and pull_request workflow events; no external dependencies.
import {existsSync, readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';

const file='latest.md';
assert.ok(existsSync(file),'Missing latest.md (single source of truth)');
const t=readFileSync(file,'utf8');
for(const heading of ['## 1. Current verified state','## 2. Fixed product/SEO decisions','## 3. Immediate next work','## 4. Implementation files and run commands','## 5. How to update this file','## 6. Last completed work log']){
  assert.ok(t.includes(heading),'Missing handoff section: '+heading);
}
assert.ok(t.includes('2026-11-05'),'latest.md missing checkpoint date');
assert.ok(t.includes('noindex'),'latest.md missing SEO safety state');

const base=process.env.BASE_SHA;
const event=process.env.GITHUB_EVENT_NAME||'';
if(!['push','pull_request'].includes(event) || !base || /^0+$/.test(base)) {
  console.log('latest.md structure verified; change detection skipped without valid CI base');
  process.exit(0);
}
let files;
try {
  files=execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
} catch(e) {
  console.error('Could not inspect changed files against '+base+'; fail closed');
  process.exit(1);
}
// Topic feature PRs are deliberately reconciled by a separate docs-only PR after merge.
// This exemption is limited to named topic branches, not arbitrary PRs or policy changes.
const headBranch=process.env.GITHUB_HEAD_REF||process.env.GITHUB_REF_NAME||'';
const topicFeature=/^eventv\/topic-\d{3}-lane-[A-E]$/.test(headBranch);
const docsOnly=/^eventv\/latest-(?:topic-\d{3}|reconcile-[a-z0-9-]+)$/.test(headBranch);
// The feature PR was already gated. On main, a separate docs-only PR is required
// AFTER merge; treating the interim main push as a failed build contradicts that contract.
// All normal Node 22 build, route, SEO, catalog and topic tests still run on main.
if(event==='push' && headBranch==='main') {
  console.log('Main push verified: docs-only latest.md reconciliation remains a separate release gate.');
  process.exit(0);
}
if(docsOnly && files.some(p=>p!==file)) {
  console.error('Checkpoint reconciliation PR must modify latest.md only.');
  process.exit(1);
}
if(files.length && files.some(p=>p!==file) && !files.includes(file) && !topicFeature) {
  console.error('EventV changes require updating latest.md in the same commit/PR. Changed: '+files.join(', '));
  process.exit(1);
}
console.log('EventV latest.md checkpoint guard passed; changed files: '+files.length);
