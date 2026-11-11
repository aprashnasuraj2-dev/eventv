import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const source=readFileSync(fileURLToPath(new URL('../content/pilots/mwc-barcelona-2027.html',import.meta.url)),'utf8');
const candidates=[process.env.CHROME_BIN,'chromium','chromium-browser','google-chrome','google-chrome-stable'].filter(Boolean);
const chrome=candidates.find(cmd=>spawnSync(cmd,['--version'],{encoding:'utf8',timeout:5000}).status===0);
test('real headless browser: planner, budget, storage, reset and mobile overflow', {skip:!chrome&&'Chromium/Chrome unavailable in this runner'},()=>{
 const dir=mkdtempSync(join(tmpdir(),'eventv-mwc-qa-'));
 try{
  const probe=`<script>try{
const e=id=>document.getElementById(id), results=[];
e('check').click();results.push(['exact-fit',/0 minute/.test(e('result').textContent)]);
e('secondStart').value='11:10';e('check').click();results.push(['conflict',/Conflict/.test(e('result').textContent)]);
e('transfer').value='';e('check').click();results.push(['blank-invalid',/cannot be blank/.test(e('result').textContent)]);
e('reset').click();e('save').click();results.push(['storage',!!localStorage.getItem('eventv-mwc27-scenario')]);
e('attendees').value='2';e('nights').value='3';e('hotel').value='180';e('badge').value='0';e('ground').value='60';e('contingency').value='15';e('budgetCheck').click();results.push(['budget',/€1380\\.00/.test(e('budgetResult').textContent)]);
e('reset').click();results.push(['reset',!localStorage.getItem('eventv-mwc27-scenario')]);
results.push(['mobile-width',document.documentElement.scrollWidth<=window.innerWidth+2]);
document.body.dataset.qa=JSON.stringify(results);
}catch(err){document.body.dataset.qa=JSON.stringify([['exception',String(err)]])}</script>`;
  const file=join(dir,'index.html');writeFileSync(file,source.replace('</body>',probe+'</body>'));
  const run=spawnSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=390,844','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,maxBuffer:4e6});
  assert.equal(run.status,0,run.stderr?.slice(-1000));
  const marker=run.stdout.match(/data-qa="([^"]+)"/)?.[1];
  assert.ok(marker,'browser probe did not execute');
  const results=JSON.parse(marker.replaceAll('&quot;','"').replaceAll('&amp;','&'));
  assert.deepEqual(results.filter(([,ok])=>!ok),[],JSON.stringify(results));
 }finally{rmSync(dir,{recursive:true,force:true})}
});