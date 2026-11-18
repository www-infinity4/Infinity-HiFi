import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('Wave Studio uses local audio file only with no automatic microphone or cloud transfer',()=>{
 const script=read('lab/studio.mjs'),page=read('lab/index.html');
 assert.match(page,/type="file" id="audioFile"/);
 assert.match(script,/createObjectURL\(chosen\)/);
 assert.match(script,/createMediaElementSource\(player\)/);
 assert.doesNotMatch(script,/(?:getUserMedia|fetch\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage)/);
 assert.match(page,/Nothing is transmitting/);
});
test('Wave rendering treats user content only as text, preserving no hidden publishing path',()=>{
 const script=read('lab/studio.mjs');
 assert.match(script,/body\.textContent=b\.text/);
 assert.doesNotMatch(script,/(?:innerHTML|\.insertAdjacentHTML|eval\(|new Function)/);
 assert.match(script,/draftCandidate\(/);
 assert.match(script,/visibility:'local'/);
});
test('Android readable controls and versioned source files are all present',()=>{
 const page=read('lab/index.html'),css=read('lab/studio.css');
 for(const label of ['audioFile','player','profile','waveCanvas','blips','addBlip','importBlips','exportCandidate'])assert.match(page,new RegExp('id="'+label+'"'));
 assert.match(css,/min-height:48px/);
 assert.match(page,/script type="module" src="\.\/studio\.mjs"/);
});
