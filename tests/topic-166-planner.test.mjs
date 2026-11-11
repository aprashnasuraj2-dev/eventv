import test from "node:test";
import assert from "node:assert/strict";
import {plan,budget} from "../assets/australian-open-2027-planner.js";
test("166 evidence-specific planner handles valid user assumptions",()=>{const result=plan({"date":"2027-01-11"});assert.equal(typeof result,"string");assert.ok(result.length>35);assert.ok(!result.includes("<script>"))});
test("166 planner rejects malformed or inconsistent inputs",()=>{assert.throws(()=>plan({"date":"2027-02-31"}))});
test("166 group arithmetic and empty input safeguards",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}),{total:180,share:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",transport:"15",contingency:"5"}));assert.throws(()=>budget({people:"0",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}))});
test("166 noindex and canonical are deliberately retained",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/australian-open-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.match(h,/<meta name="robots" content="noindex,follow">/);assert.ok(h.includes('href="https://aafnaipatro.com/events/australian-open-2027/"'));assert.ok(h.includes('id="planner"')&&h.includes('id="cost"'))});

test("official AO27 Kids Tennis Day outside tournament FAQ window is distinguished",()=>{assert.match(plan({date:"2027-01-10"}),/Kids Tennis Day/);assert.match(plan({date:"2027-01-11"}),/Opening Week/);assert.match(plan({date:"2027-01-17"}),/Main draw/);assert.match(plan({date:"2027-02-01"}),/Outside/)});
