import test from "node:test";
import assert from "node:assert/strict";
import {plan,sessionInstant,budget} from "../assets/japanese-grand-prix-2027-planner.js";
const assumed={session:"sprint",local:"2027-04-10T15:00",zone:"Europe/London"};
test("Japan Sprint weekend is assigned to the correct official days",()=>{
  for(const [session,date] of Object.entries({practice1:"09",sprintQualifying:"09",sprint:"10",qualifying:"10",race:"11"})){
    assert.equal(sessionInstant({session,local:`2027-04-${date}T15:00`,zone:"UTC"}).session.length>0,true);
  }
  assert.throws(()=>plan({...assumed,session:"race"}),/listed for 2027-04-11/);
});
test("Japan time conversion accounts for British Summer Time and prior day",()=>{
  assert.match(plan(assumed),/07:00/);
  const early=plan({...assumed,session:"practice1",local:"2027-04-09T00:30"});
  assert.match(early,/Thursday, 8 April 2027 at 16:30/);
  assert.match(plan({...assumed,zone:"Asia/Kathmandu"}),/11:45/);
});
test("empty, impossible and unsupported schedule values are rejected",()=>{
  assert.throws(()=>plan({session:"race",local:"",zone:"UTC"}));
  assert.throws(()=>plan({session:"race",local:"2027-04-11T25:00",zone:"UTC"}));
  assert.throws(()=>plan({session:"race",local:"2027-04-11T15:00",zone:"Invalid/Zone"}));
  assert.throws(()=>plan({session:"race",local:"2027-04-31T15:00",zone:"UTC"}));
});
test("Japan hypothetical group budget is cent exact",()=>{
  assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",extra:"5"}),{total:180,perPerson:90});
  assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",transport:"15",extra:"5"}));
});
test("independent draft has one noindex directive and valid canonical",async()=>{
  const {readFileSync}=await import("node:fs");
  const html=readFileSync(new URL("../content/pilots/japanese-grand-prix-2027.html",import.meta.url),"utf8");
  assert.equal((html.match(/name="robots"/g)||[]).length,1);
  assert.match(html,/content="noindex,follow"/);
  assert.match(html,/https:\/\/aafnaipatro.com\/events\/japanese-grand-prix-2027\//);
  assert.ok(html.includes('name="session"'));
});
