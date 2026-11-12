import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const html=readFileSync(new URL('../content/pilots/rsac-conference-2027.html',import.meta.url),'utf8');
const chrome=[process.env.CHROME_BIN,'chromium','chromium-browser','google-chrome','google-chrome-stable'].filter(Boolean).find(x=>spawnSync(x,['--version'],{timeout:5000}).status===0);
test('RSAC draft browser interaction, validation, storage, evidence, reset and mobile layout',{skip:!chrome&&'Chrome unavailable'},()=>{
 const dir=mkdtempSync(join(tmpdir(),'rsac-browser-'));
 try {
 const probe=`<script>try{const e=id=>document.getElementById(id),r=[];
 e('check').click();r.push(['positive',/10 minute/.test(e('result').textContent)]);
 e('next').value='11:15';e('check').click();r.push(['conflict',/20 more minute/.test(e('result').textContent)]);
 e('walk').value='';e('save').click();r.push(['invalid-save',/Correct invalid/.test(e('result').textContent)&&!localStorage.getItem('eventv-rsac27')]);
 e('walk').value='20';e('save').click();r.push(['save',!!localStorage.getItem('eventv-rsac27')]);
 e('vendor').value='Example';e('claim').value='Latency under load';e('proof').click();r.push(['missing-evidence',/Missing independent/.test(e('proofResult').textContent)]);
 e('evidence').value='Independent workload replay';e('proof').click();r.push(['evidence',/Evidence note recorded/.test(e('proofResult').textContent)]);
 e('reset').click();r.push(['reset',!localStorage.getItem('eventv-rsac27')&&e('vendor').value==='']);
 r.push(['mobile-overflow',document.documentElement.scrollWidth<=innerWidth+2]);
 document.body.dataset.qa=JSON.stringify(r);
 }catch(x){document.body.dataset.qa=JSON.stringify([['exception',String(x)]])}</script>`;
 const path=join(dir,'index.html');writeFileSync(path,html.replace('</body>',probe+'</body>'));
 const run=spawnSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--window-size=390,844','--dump-dom','file://'+path],{encoding:'utf8',timeout:30000,maxBuffer:4e6});
 assert.equal(run.status,0,run.stderr?.slice(-1200));
 const match=run.stdout.match(/data-qa="([^"]+)"/);assert.ok(match,'Browser probe did not run');
 const results=JSON.parse(match[1].replaceAll('&quot;','"').replaceAll('&amp;','&'));
 assert.deepEqual(results.filter(x=>!x[1]),[],JSON.stringify(results));
 }finally{rmSync(dir,{recursive:true,force:true})}
});