import test from "node:test";
import assert from "node:assert/strict";
import {plan,budget} from "../assets/roland-garros-2027-planner.js";
test("165 evidence-specific planner handles valid user assumptions",()=>{const result=plan({"date":"2027-05-23","ticket":"day","desired":"day"});assert.equal(typeof result,"string");assert.ok(result.length>35);assert.ok(!result.includes("<script>"))});
test("165 planner rejects malformed or inconsistent inputs",()=>{assert.throws(()=>plan({"ticket":"fake","desired":"day"}))});
test("165 group arithmetic and empty input safeguards",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}),{total:180,share:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",transport:"15",contingency:"5"}));assert.throws(()=>budget({people:"0",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}))});
test("165 noindex and canonical are deliberately retained",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/roland-garros-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.match(h,/<meta name="robots" content="noindex,follow">/);assert.ok(h.includes('href="https://aafnaipatro.com/events/roland-garros-2027/"'));assert.ok(h.includes('id="planner"')&&h.includes('id="cost"'))});

test("Roland-Garros 2027 day/night split is confined to actual published dates",()=>{
 assert.match(plan({date:"2027-05-17",ticket:"day",desired:"night"}),/Opening Week/);
 assert.match(plan({date:"2027-05-23",ticket:"day",desired:"night"}),/POTENTIAL SESSION MISMATCH/);
 assert.match(plan({date:"2027-06-02",ticket:"night",desired:"night"}),/label matches/);
 assert.match(plan({date:"2027-06-03",ticket:"night",desired:"night"}),/outside the organiser/);
 assert.throws(()=>plan({date:"2027-05-39",ticket:"day",desired:"day"}));
});
