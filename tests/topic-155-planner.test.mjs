import test from "node:test";import assert from "node:assert/strict";import {plan,budget} from "../assets/tomorrowland-winter-2027-planner.js";test("topic #155 model computes original scenario",()=>{const s=plan({"people":"2","ticket":"200","hotel":"300","travel":"100","lift":"0"});assert.equal(typeof s,"string");assert.ok(s.length>45)});test("invalid topic #155 inputs fail closed",()=>{assert.throws(()=>plan({"people":"2","ticket":"200","hotel":"300","travel":"100","lift":""}))});test("scenario budget arithmetic and guards",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",extra:"5"}),{total:180,perPerson:90});assert.throws(()=>budget({people:"0",ticket:"20",nights:"3",hotel:"40",transport:"15",extra:"5"}))});test("unapproved draft robots/canonical and controls",async()=>{const fs=await import("node:fs"),h=fs.readFileSync(new URL("../content/pilots/tomorrowland-winter-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.match(h,/content="noindex,follow"/);assert.ok(h.includes("https://aafnaipatro.com/events/tomorrowland-winter-2027/"));assert.ok(h.includes('id="plan"')&&h.includes('id="cost"'))});
test("Tomorrowland Winter official 2027 festival access and MainStage day boundaries",async()=>{
 const {accessDay}=await import("../assets/tomorrowland-winter-2027-planner.js");
 assert.match(accessDay({date:"2027-03-20",kind:"seven"}),/CLOSED/);
 assert.match(accessDay({date:"2027-03-23",kind:"four"}),/OPEN/);
 assert.match(accessDay({date:"2027-03-22",kind:"lateOne"}),/Potential mismatch/);
 assert.match(accessDay({date:"2027-03-27",kind:"seven"}),/accommodation checkout/);
 assert.throws(()=>accessDay({date:"2027-03-32",kind:"seven"}));
 assert.throws(()=>accessDay({date:"2027-03-25",kind:"invented"}));
});
