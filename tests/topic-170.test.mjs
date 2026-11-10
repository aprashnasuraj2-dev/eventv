import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import {assess,budget,breakEven,minutes} from "../assets/rhs-chelsea-flower-show-2027-logic.mjs";
test("official member-day rules",()=>{assert.equal(assess({date:"2027-05-18",arrival:"09:00",minutesInside:180}).feasible,false);assert.equal(assess({date:"2027-05-18",arrival:"09:00",minutesInside:180,membership:"member",ticket:"member"}).feasible,true);});
test("non-member guest cap",()=>assert.match(assess({date:"2027-05-19",arrival:"09:00",minutesInside:180,membership:"member",ticket:"member",guestCount:4}).warnings.join(" "),/four tickets/));
test("Saturday shortened window",()=>{assert.equal(assess({date:"2027-05-22",arrival:"15:00",minutesInside:180}).feasible,false);assert.equal(assess({date:"2027-05-22",arrival:"09:00",minutesInside:180}).feasible,true)});
test("Friday late is not ordinary daytime entry",()=>assert.match(assess({date:"2027-05-21",arrival:"18:00",minutesInside:45}).warnings.join(" "),/separate Friday/));
test("invalid dates and times fail closed",()=>{assert.throws(()=>assess({date:"2027-05-23",arrival:"09:00",minutesInside:90}),/published/);assert.throws(()=>minutes("25:01"));assert.throws(()=>assess({date:"2027-05-20",arrival:"09:00",minutesInside:-5}));});
test("budget and break-even boundaries",()=>{assert.equal(budget({people:2,perTicket:61,travel:30}).total,152);assert.throws(()=>budget({people:0,perTicket:61}));assert.throws(()=>budget({people:1,perTicket:-1}));assert.equal(breakEven({memberPrice:48,publicPrice:61,membershipFee:55.99,eligibleTickets:2}).worthIt,false);assert.throws(()=>breakEven({memberPrice:48,publicPrice:61,membershipFee:0,eligibleTickets:5}));});
test("SEO and safe rendering",()=>{const html=fs.readFileSync("content/pilots/rhs-chelsea-flower-show-2027.html","utf8");assert.match(html,/noindex,follow/);assert.match(html,/rel="canonical"/);assert.match(html,/textContent=msg/);assert.doesNotMatch(html,/innerHTML\s*=/);assert.match(html,/RHS Chelsea Flower Show 2027/);assert.match(html,/2027-05-22/);});

// Catch browser-only inline syntax and broken event wiring that pure helper tests miss.
test("inline browser module parses and every wired control exists", async()=>{
 const {Script}=await import("node:vm");
 const html=fs.readFileSync("content/pilots/rhs-chelsea-flower-show-2027.html","utf8");
 const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script,"expected browser module");
 assert.doesNotThrow(()=>new Script(script.replace(/^\s*import\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?/m,"")));
 const controls=[...script.matchAll(/\$\("([A-Za-z][A-Za-z0-9]*)"\)/g)].map(m=>m[1]);
 for(const id of new Set(controls)) assert.match(html,new RegExp('id="'+id+'"'),"missing DOM control: "+id);
 assert.match(html,/meta name="robots" content="noindex,follow"/);
});

test("long visits display actual next-day end, never a fabricated 23:59",()=>{
 const result=assess({date:"2027-05-20",arrival:"23:30",minutesInside:90});
 assert.equal(result.end,"01:00 (next day)");
 assert.equal(result.feasible,false);
 assert.match(result.warnings.join(" "),/closing/);
});
test("browser module import resolves to a committed asset and key controls exist",()=>{
 const html=fs.readFileSync("content/pilots/rhs-chelsea-flower-show-2027.html","utf8");
 const match=html.match(/import\\s+\\{assess,budget,breakEven\\}\\s+from\\s+["'](\\/assets\\/[^"']+)["']/);
 assert.ok(match,"expected browser module import");
 assert.ok(fs.existsSync("."+match[1]),"missing imported browser asset");
 for(const id of ["visit","costForm","visitResult","costResult","compareResult","storageStatus"])
  assert.match(html,new RegExp('id="'+id+'"'));
});
