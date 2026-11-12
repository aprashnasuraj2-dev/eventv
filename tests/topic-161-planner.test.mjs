import test from "node:test";import assert from "node:assert/strict";import {plan,budget} from "../assets/tokyo-marathon-2027-planner.js";test("topic 161 accepts valid original planner inputs",()=>{const r=plan({"h":"4","m":"30"});assert.equal(typeof r,"string");assert.ok(r.length>40)});test("topic 161 rejects malformed inputs",()=>{assert.throws(()=>plan({"h":"0","m":"30"}))});test("topic 161 budget works at boundaries",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",travel:"15",other:"5"}),{total:180,perVisitor:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",travel:"15",other:"5"}))});test("topic 161 index remains disabled",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/tokyo-marathon-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.ok(h.includes('content="noindex,follow"'));assert.ok(h.includes('https://aafnaipatro.com/events/tokyo-marathon-2027/'))});
test("Tokyo official in-person pickup time windows and race-day absence",async()=>{
 const {packetPickup}=await import("../assets/tokyo-marathon-2027-planner.js");
 assert.match(packetPickup({date:"2027-03-04",arrival:"19:30",queue:"30"}),/30 minutes/);
 assert.match(packetPickup({date:"2027-03-06",arrival:"17:15",queue:"30"}),/POTENTIAL MISS: 15/);
 assert.match(packetPickup({date:"2027-03-06",arrival:"09:30",queue:"0"}),/before the published 10:00/);
 assert.throws(()=>packetPickup({date:"2027-03-07",arrival:"10:00",queue:"0"}),/no race-day pickup/);
 assert.throws(()=>packetPickup({date:"2027-03-04",arrival:"20:00",queue:""}));
 assert.throws(()=>packetPickup({date:"2027-03-04",arrival:"25:00",queue:"10"}));
});
