import test from "node:test";
import assert from "node:assert/strict";
import {plan,budget} from "../assets/nrf-retails-big-show-2027-planner.js";
test("162 evidence-specific planner handles valid user assumptions",()=>{const result=plan({"people":"2","per":"100","alternate":"150"});assert.equal(typeof result,"string");assert.ok(result.length>35);assert.ok(!result.includes("<script>"))});
test("162 planner rejects malformed or inconsistent inputs",()=>{assert.throws(()=>plan({"people":"2","per":"-1","alternate":"150"}))});
test("162 group arithmetic and empty input safeguards",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}),{total:180,share:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",transport:"15",contingency:"5"}));assert.throws(()=>budget({people:"0",ticket:"20",nights:"3",hotel:"40",transport:"15",contingency:"5"}))});
test("162 noindex and canonical are deliberately retained",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/nrf-retails-big-show-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.match(h,/<meta name="robots" content="noindex,follow">/);assert.ok(h.includes('href="https://aafnaipatro.com/events/nrf-retails-big-show-2027/"'));assert.ok(h.includes('id="planner"')&&h.includes('id="cost"'))});

test("NRF published retail and non-retail rate windows and team arithmetic",async()=>{
 const {quote2027}=await import("../assets/nrf-retails-big-show-2027-planner.js");
 const q=x=>quote2027({date:"2026-11-12",segment:"retail",membership:"member",pass:"all",people:"2",...x});
 assert.deepEqual({rate:q({}).rate,total:q({}).total},{rate:1200,total:2400});
 assert.equal(q({people:"5"}).rate,900);
 assert.equal(q({people:"10"}).rate,750);
 assert.equal(q({date:"2027-01-08"}).rate,1400);
 assert.equal(q({segment:"retail",membership:"nonmember",pass:"expo",date:"2026-12-30"}).rate,0);
 assert.equal(q({segment:"retail",membership:"nonmember",pass:"expo",date:"2026-12-31"}).rate,100);
 assert.equal(q({segment:"nonretail",membership:"member",pass:"all",people:"5"}).rate,2600);
 assert.throws(()=>q({segment:"nonretail",membership:"nonmember",pass:"all",people:"3"}),/limit/);
 assert.throws(()=>q({date:"2027-02-31"}));
 assert.throws(()=>q({pass:"fictional"}));
});
