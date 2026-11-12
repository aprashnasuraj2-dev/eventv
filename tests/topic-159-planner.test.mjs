import test from "node:test";import assert from "node:assert/strict";import {plan,budget} from "../assets/edinburgh-fringe-2027-planner.js";test("topic 159 accepts valid original planner inputs",()=>{const r=plan({"end":"12:45","start":"13:30","walk":"25","queue":"15"});assert.equal(typeof r,"string");assert.ok(r.length>40)});test("topic 159 rejects malformed inputs",()=>{assert.throws(()=>plan({"end":"13:45","start":"13:30","walk":"25","queue":"15"}))});test("topic 159 budget works at boundaries",()=>{assert.deepEqual(budget({people:"2",ticket:"20",nights:"3",hotel:"40",travel:"15",other:"5"}),{total:180,perVisitor:90});assert.throws(()=>budget({people:"2",ticket:"",nights:"3",hotel:"40",travel:"15",other:"5"}))});test("topic 159 index remains disabled",async()=>{const fs=await import("node:fs");const h=fs.readFileSync(new URL("../content/pilots/edinburgh-fringe-2027.html",import.meta.url),"utf8");assert.equal((h.match(/name="robots"/g)||[]).length,1);assert.ok(h.includes('content="noindex,follow"'));assert.ok(h.includes('https://aafnaipatro.com/events/edinburgh-fringe-2027/'))});
test("Fringe three-show chain evaluates both independently buffered transfers",async()=>{
 const {showChain}=await import("../assets/edinburgh-fringe-2027-planner.js");
 const input={endA:"13:05",startB:"13:30",endB:"14:30",startC:"15:10",walkAB:"15",queueB:"10",walkBC:"25",queueC:"10"};
 const good=showChain(input);
 assert.equal(good.ab,0);assert.equal(good.bc,5);
 assert.match(good.message,/TIGHT 0 min/);
 assert.match(showChain({...input,endA:"13:45"}).message,/CONFLICT 40 min short/);
 assert.throws(()=>showChain({...input,endB:"13:00"}),/positive duration/);
 assert.throws(()=>showChain({...input,queueC:""}));
 assert.throws(()=>showChain({...input,startB:"27:00"}));
});
