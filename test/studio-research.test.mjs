import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('studio links the research desk and original source files',()=>{
 const desk=read('lab/research.html'),studio=read('lab/index.html');
 assert.match(studio,/href="\.\/research\.html"/);
 for(const p of ['signal-core.mjs','wave-core.mjs','studio.mjs','index.html','studio.css'])assert.match(desk,new RegExp('href="'+p.replaceAll('.','\\.')+'"'));
});
test('research desk cites primary standards and labels incomplete claims',()=>{
 const desk=read('lab/research.html');
 for(const ref of ['developer.mozilla.org','www.w3.org/TR/webaudio/','www.itu.int/rec/R-REC-BS.1770/','cwiki.apache.org','www.ncbi.nlm.nih.gov/books/'])assert.ok(desk.includes(ref),ref);
 assert.match(desk,/not currently implement operational transformation/i);
 assert.match(desk,/not.*a validated release/i);
 assert.match(desk,/does not reproduce confidential chamber layouts/i);
});
