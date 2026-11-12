import test from "node:test";import assert from "node:assert/strict";import {plan,budget} from "../assets/australian-grand-prix-2027-planner.js";test("topic #156 model computes original scenario",()=>{const s=plan({"start":"15:00","travel":"60","queue":"45","walk":"20","margin":"15"});assert.equal(typeof s,"string");assert.ok(s.length>45)});test("invalid topic #156 inputs fail closed",()=>{assert.throws(()=>plan({"start":"15:00","travel":"-1","queue":"45","walk":"20","margin":"15"}))});test("scenario budget arithmetic and guards",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",transport:"15",extra:"5"}),{total:180,perPerson:90});assert.throws(()=>budget({people:"0",ticket:"20",nights:"3",hotel:"40",transport:"15",extra:"5"}))});test("unapproved draft robots/canonical and controls",async()=>{const fs=await import("node:fs"),h=fs.readFileSync(new URL("../content/pilots/australian-grand-prix-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.match(h,/content="noindex,follow"/);assert.ok(h.includes("https://aafnaipatro.com/events/australian-grand-prix-2027/"));assert.ok(h.includes('id="plan"')&&h.includes('id="cost"'))});
test("Australian GP 2027 official Sprint session days and multi-day departure",async()=>{
 const {sessionDay,plan}=await import("../assets/australian-grand-prix-2027-planner.js");
 assert.match(sessionDay({session:"sprintQualifying",date:"2027-04-02"}),/matches/);
 assert.match(sessionDay({session:"sprint",date:"2027-04-02"}),/SESSION-DAY MISMATCH/);
 assert.match(sessionDay({session:"race",date:"2027-04-04"}),/TBC/);
 assert.throws(()=>sessionDay({session:"unknown",date:"2027-04-04"}));
 assert.throws(()=>sessionDay({session:"race",date:"2027-04-31"}));
 assert.match(plan({start:"00:00",travel:"1440",queue:"600",walk:"240",margin:"240"}),/2 days before/);
});
