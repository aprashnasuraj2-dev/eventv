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
 const expected='from "/assets/rhs-chelsea-flower-show-2027-logic.mjs"';
 assert.ok(html.includes(expected),"expected browser module import");
 assert.ok(fs.existsSync("assets/rhs-chelsea-flower-show-2027-logic.mjs"),"missing imported browser asset");
 for(const id of ["visit","costForm","visitResult","costResult","compareResult","storageStatus"])
  assert.match(html,new RegExp('id="'+id+'"'));
});

test("Friday visits crossing 17:30 warn about separate evening access",()=>{
 const overlap=assess({date:"2027-05-21",arrival:"16:30",minutesInside:90,buffer:0});
 assert.equal(overlap.feasible,false);
 assert.match(overlap.warnings.join(" "),/overlaps Chelsea Late/);
 const daytime=assess({date:"2027-05-21",arrival:"15:30",minutesInside:90,buffer:0});
 assert.equal(daytime.feasible,true);
});

// Member-rate guest limits apply on public dates as well as member-only dates.
test("member-rate guest cap applies on public days",()=>{
 const member=assess({date:"2027-05-20",arrival:"09:00",minutesInside:180,membership:"member",ticket:"member",guestCount:4});
 assert.equal(member.feasible,false);
 assert.match(member.warnings.join(" "),/four tickets/);
 const publicBooking=assess({date:"2027-05-20",arrival:"09:00",minutesInside:180,membership:"public",ticket:"public",guestCount:4});
 assert.equal(publicBooking.feasible,true);
});

// Missing quotes must not be treated as free admission or free membership.
test("missing prices fail closed rather than silently becoming zero",()=>{
 assert.throws(()=>budget({people:2,perTicket:""}),/valid party/);
 assert.throws(()=>budget({people:2,perTicket:null}),/valid party/);
 assert.throws(()=>breakEven({memberPrice:"",publicPrice:61,membershipFee:55.99,eligibleTickets:2}),/nonnegative prices/);
 assert.throws(()=>breakEven({memberPrice:48,publicPrice:61,membershipFee:"",eligibleTickets:2}),/nonnegative prices/);
 const html=fs.readFileSync("content/pilots/rhs-chelsea-flower-show-2027.html","utf8");
 assert.match(html,/id="price"[^>]+required/);
 assert.match(html,/value\(id\)\.trim\(\)===""\?NaN/);
 assert.doesNotMatch(html,/id="mp"[^>]+value="48"/);
});

test("browser form wiring exercises visit, budget, and storage without network", async()=>{
 const {runInNewContext}=await import("node:vm");
 const html=fs.readFileSync("content/pilots/rhs-chelsea-flower-show-2027.html","utf8");
 const source=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
 assert.ok(source);
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
 const elements=Object.fromEntries(ids.map(id=>[id,{value:"",textContent:"",className:"",handlers:{},addEventListener(type,cb){this.handlers[type]=cb},reset(){},click(){}}]));
 Object.assign(elements.date,{value:"2027-05-20"});Object.assign(elements.arrival,{value:"09:00"});
 Object.assign(elements.duration,{value:"180"});Object.assign(elements.buffer,{value:"30"});
 Object.assign(elements.guests,{value:"0"});Object.assign(elements.membership,{value:"public"});
 Object.assign(elements.ticket,{value:"public"});Object.assign(elements.people,{value:"2"});
 Object.assign(elements.price,{value:"61"});for(const id of ["fee","travel","food","extras"])elements[id].value="0";
 for(const id of ["mp","pp","mf"])elements[id].value="10";elements.eligible.value="2";
 const stored=new Map();
 const context={assess,budget,breakEven,document:{getElementById:id=>elements[id],createElement:()=>({click(){}})},localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v),removeItem:k=>stored.delete(k)},Blob:class{},URL:{createObjectURL:()=> "blob:test",revokeObjectURL(){}},setTimeout(){}};
 runInNewContext(source.replace(/^\s*import\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?/m,""),context);
 const submit=id=>elements[id].handlers.submit({preventDefault(){}});
 submit("visit");assert.match(elements.visitResult.textContent,/Fits the published daytime window/);
 elements.date.value="2027-05-22";elements.arrival.value="16:00";submit("visit");assert.match(elements.visitResult.textContent,/exceeds published closing time/);
 submit("costForm");assert.match(elements.costResult.textContent,/Total £122.00/);
 elements.price.value="";submit("costForm");assert.match(elements.costResult.textContent,/valid party/);
 elements.notes.value="Garden route";elements.save.handlers.click();assert.equal(JSON.parse([...stored.values()][0]).notes,"Garden route");
 elements.clear.handlers.click();assert.equal(stored.size,0);
});
