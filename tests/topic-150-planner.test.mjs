import test from "node:test";
import assert from "node:assert/strict";
import {plan,feasibility,budget} from "../assets/singapore-grand-prix-2027-planner.js";
const cross={session:"race",end:"2027-10-10T23:40",last:"2027-10-11T00:30",queue:"20",walk:"25",delay:"0"};
test("Singapore midnight transfer uses FULL dates, not a time-only shortcut",()=>{
  const r=feasibility(cross);
  assert.equal(r.spare,5);
  assert.equal(r.ready,"2027-10-11T00:25");
  assert.match(plan(cross),/TIGHT/);
  assert.match(plan(cross),/further 15-minute disruption would leave -10 min/);
});
test("Singapore daylight and same-day planner boundaries",()=>{
  const x=feasibility({session:"practice1",end:"2027-10-08T17:00",last:"2027-10-08T18:00",queue:"10",walk:"15",delay:"5"});
  assert.equal(x.spare,30);
  assert.match(plan({...cross,delay:"15"}),/MISSED/);
});
test("schedule-day mismatch and date errors fail closed",()=>{
  assert.throws(()=>plan({...cross,session:"practice1"}),/scheduled for/);
  assert.throws(()=>plan({...cross,last:"2027-10-10T23:00"}),/before the assumed/);
  assert.throws(()=>plan({...cross,last:"2027-10-12T12:00"}),/12 hours/);
  assert.throws(()=>plan({...cross,end:"2027-10-32T23:40"}));
  assert.throws(()=>plan({...cross,queue:""}));
  assert.throws(()=>plan({...cross,delay:"-1"}));
});
test("budget uses user-entered group hotel cost, no ticket claim",()=>{
  assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",extra:"5"}),{total:180,perPerson:90});
  assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",transport:"15",extra:"5"}));
});
test("draft robots, canonical, and datetime inputs present",async()=>{
 const {readFileSync}=await import("node:fs");
 const h=readFileSync(new URL("../content/pilots/singapore-grand-prix-2027.html",import.meta.url),"utf8");
 assert.equal((h.match(/name="robots"/g)||[]).length,1);
 assert.match(h,/content="noindex,follow"/);
 assert.ok(h.includes("https://aafnaipatro.com/events/singapore-grand-prix-2027/"));
 assert.match(h,/name="session"/);
 assert.match(h,/name="last" type="datetime-local"/);
});
