import test from "node:test";import assert from "node:assert/strict";import {plan,budget} from "../assets/frankfurt-book-fair-2027-planner.js";test("topic 160 accepts valid original planner inputs",()=>{const r=plan({"date":"2027-01-15","milestone":"2027-01-31"});assert.equal(typeof r,"string");assert.ok(r.length>40)});test("topic 160 rejects malformed inputs",()=>{assert.throws(()=>plan({"date":"2027-02-31","milestone":"2027-01-31"}))});test("topic 160 budget works at boundaries",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",travel:"15",other:"5"}),{total:180,perVisitor:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",travel:"15",other:"5"}))});test("topic 160 index remains disabled",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/frankfurt-book-fair-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.ok(h.includes('content="noindex,follow"'));assert.ok(h.includes('https://aafnaipatro.com/events/frankfurt-book-fair-2027/'))});
test("Frankfurt milestone list is fixed to official 2027 dates",async()=>{
 const {plan,milestoneMatrix}=await import("../assets/frankfurt-book-fair-2027-planner.js");
 const m=milestoneMatrix("2026-11-12");
 assert.deepEqual(m.map(x=>x.date),["2026-11-30","2027-01-31","2027-08-01","2027-08-31"]);
 assert.equal(m[0].days,18);
 assert.equal(m[0].stage,"upcoming");
 assert.equal(milestoneMatrix("2026-11-30")[0].stage,"today");
 assert.equal(milestoneMatrix("2026-12-01")[0].stage,"past");
 assert.throws(()=>plan({date:"2026-11-12",milestone:"2028-01-01"}),/published/);
 assert.throws(()=>milestoneMatrix("2027-02-30"));
});
