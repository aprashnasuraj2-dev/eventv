import test from "node:test";
import assert from "node:assert/strict";
import {plan,budget} from "../assets/san-diego-comic-con-2027-planner.js";
test("164 evidence-specific planner handles valid user assumptions",()=>{const result=plan({"date":"2027-07-21"});assert.equal(typeof result,"string");assert.ok(result.length>35);assert.ok(!result.includes("<script>"))});
test("164 planner rejects malformed or inconsistent inputs",()=>{assert.throws(()=>plan({"date":"2027-02-31"}))});
test("164 group arithmetic and empty input safeguards",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}),{total:180,share:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",transport:"15",contingency:"5"}));assert.throws(()=>budget({people:"0",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}))});
test("164 noindex and canonical are deliberately retained",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/san-diego-comic-con-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.match(h,/<meta name="robots" content="noindex,follow">/);assert.ok(h.includes('href="https://aafnaipatro.com/events/san-diego-comic-con-2027/"'));assert.ok(h.includes('id="planner"')&&h.includes('id="cost"'))});

test("SDCC badge-day label is not mistaken for Preview Night access",()=>{
 assert.match(plan({date:"2027-07-21",badgeDay:"thursday"}),/POTENTIAL BADGE-DAY MISMATCH/);
 assert.match(plan({date:"2027-07-21",badgeDay:"preview"}),/Day labels match/);
 assert.match(plan({date:"2027-07-25",badgeDay:"multi"}),/must be checked/);
 assert.match(plan({date:"2027-07-26",badgeDay:"unknown"}),/Outside/);
 assert.throws(()=>plan({date:"2027-07-21",badgeDay:"fictional"}));
});
