// Verify the new A-E lane branches are compatible with both CI guards.
// A temporary real Git repository exercises git diff, not a mocked regex.
import assert from 'node:assert/strict';
import {copyFileSync, mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cwd=mkdtempSync(join(tmpdir(),'eventv-lane-check-'));
const exec=(bin,args,env=process.env)=>{
 const p=spawnSync(bin,args,{cwd,env,encoding:'utf8'});
 assert.equal(p.status,0,bin+' '+args.join(' ')+' failed: '+p.stderr);
 return p.stdout.trim();
};
const git=(...args)=>exec('git',args);
const check=(file,branch,shouldPass)=>{
 const p=spawnSync(process.execPath,[join(root,'scripts',file)],{
  cwd,encoding:'utf8',env:{...process.env,BASE_SHA:base,GITHUB_EVENT_NAME:'pull_request',GITHUB_HEAD_REF:branch}
 });
 assert.equal(p.status===0,shouldPass,file+' '+branch+' unexpectedly '+(p.status===0?'passed':'failed')+': '+p.stdout+' '+p.stderr);
};
let base;
try{
 mkdirSync(join(cwd,'data','topics'),{recursive:true});
 copyFileSync(join(root,'data','events-50.json'),join(cwd,'data','events-50.json'));
 copyFileSync(join(root,'data','worker-lanes-v2.json'),join(cwd,'data','worker-lanes-v2.json'));
 copyFileSync(join(root,'latest.md'),join(cwd,'latest.md'));
 const topic=join(cwd,'data','topics','170.json');
 writeFileSync(topic,JSON.stringify({rank:170,slug:'test-sparse-topic-170',state:'draft-research'})+'\n');
 git('init','-q');git('add','.');git('-c','user.email=test@example.test','-c','user.name=LaneTest','commit','-qm','base');
 base=git('rev-parse','HEAD');
 writeFileSync(topic,JSON.stringify({rank:170,slug:'test-sparse-topic-170',state:'approved'})+'\n');
 git('add','.');git('-c','user.email=test@example.test','-c','user.name=LaneTest','commit','-qm','topic edit');
 check('check-lanes.mjs','eventv/topic-170-lane-A',true);
 check('check-latest.mjs','eventv/topic-170-lane-A',true);
 check('check-lanes.mjs','eventv/topic-170-lane-B',false);
 check('check-lanes.mjs','eventv/topic-170-lane-1',false);
 check('check-latest.mjs','eventv/topic-170-lane-1',false);
 check('check-latest.mjs','eventv/unrelated-implementation',false);
 check('check-latest.mjs','eventv/latest-topic-170',false);
 mkdirSync(join(cwd,'scripts'),{recursive:true});
 writeFileSync(join(cwd,'scripts','build.mjs'),'unsafe cross-lane change\n');
 git('add','.');git('-c','user.email=test@example.test','-c','user.name=LaneTest','commit','-qm','shared edit');
 check('check-lanes.mjs','eventv/topic-170-lane-A',false);
 console.log('Worker lane/checkpoint v2 tests passed: owner accept, wrong owner deny, legacy-branch deny, shared-file deny, non-topic checkpoint deny, docs-only deny');
}finally{rmSync(cwd,{recursive:true,force:true});}
