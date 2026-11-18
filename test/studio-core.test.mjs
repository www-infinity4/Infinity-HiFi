import test from 'node:test';
import assert from 'node:assert/strict';
import {measureSamples, profiles, resolveProfile} from '../lab/signal-core.mjs';
import {appendBlip, validateBlips, draftCandidate, createEvent} from '../lab/wave-core.mjs';
test('real audio RMS, peak, and clipping come from samples not invented labels',()=>{
 const x=new Float32Array([0,0.5,-0.5,1]);const m=measureSamples(x);
 assert.equal(m.rms,Math.sqrt(1.5/4));assert.equal(m.peak,1);assert.equal(m.clipped,true);assert.equal(m.samples,4);
});
test('silence reports negative infinity dB and finite zero RMS',()=>{
 const m=measureSamples(new Float32Array(16));
 assert.equal(m.rms,0);assert.equal(m.peakDbfs,null);assert.equal(m.clipped,false);
});
test('invalid samples fail closed',()=>{
 assert.throws(()=>measureSamples([1,2,3]),/Float32Array/);
 assert.throws(()=>measureSamples(new Float32Array()),/nonempty/);
});
test('audio profiles preserve dry original and bounded opt-in DSP',()=>{
 assert.equal(resolveProfile('original').wet,0);assert.equal(resolveProfile('original').dry,1);
 for(const mode of ['speech','phone','night']){
  const p=resolveProfile(mode);assert.equal(p.wet,1);assert.equal(p.dry,0);
  assert.ok(p.outputGain>=0&&p.outputGain<=1);
 }
 assert.throws(()=>resolveProfile('loudest-ever'),/Unknown/);assert.equal(Object.keys(profiles).length,4);
});
test('blips form a validated local branch without remote sending',()=>{
 const now='2026-11-18T00:00:00.000Z';
 const a=appendBlip([],{blipId:'b1',kind:'text',text:'  listen  ',parentIds:[],createdAt:now});
 const b=appendBlip(a,{blipId:'b2',kind:'audio-note',text:'timing observation',parentIds:['b1'],createdAt:now});
 assert.equal(b[0].text,'listen');assert.deepEqual(b[1].parentIds,['b1']);
 assert.deepEqual(validateBlips(b),b);
 assert.throws(()=>appendBlip(b,{blipId:'b3',kind:'text',text:'x',parentIds:['missing'],createdAt:now}),/Unknown parent/);
 assert.throws(()=>appendBlip(b,{blipId:'b1',kind:'text',text:'x',parentIds:[],createdAt:now}),/Duplicate/);
});
test('untrusted text is treated as data and cannot authorize a job',()=>{
 const x=appendBlip([],{blipId:'safe',kind:'text',text:'<script>alert(1)</script>',parentIds:[],createdAt:'2026-11-18T00:00:00Z'});
 assert.equal(x[0].text,'<script>alert(1)</script>');assert.equal(x[0].status,'local_draft');
 assert.throws(()=>appendBlip(x,{blipId:'bad',kind:'release.published',text:'ship',parentIds:[],createdAt:'2026-11-18T00:00:00Z'}),/Unsupported/);
});
test('import rejects broken references and oversized content',()=>{
 assert.throws(()=>validateBlips([{blipId:'a',kind:'text',text:'x',parentIds:['b'],createdAt:'2026-11-18T00:00:00Z'}]),/Unknown parent/);
 assert.throws(()=>appendBlip([],{blipId:'a',kind:'text',text:'z'.repeat(8001),parentIds:[],createdAt:'2026-11-18T00:00:00Z'}),/too long/);
});
test('Solidify candidate is draft-only, not falsely tested or published',()=>{
 const a=appendBlip([],{blipId:'b1',kind:'text',text:'note',parentIds:[],createdAt:'2026-11-18T00:00:00Z'});
 const c=draftCandidate(a,['b1']);
 assert.equal(c.status,'draft');assert.equal(c.approved,false);assert.equal(c.testsRun,false);assert.deepEqual(c.sourceBlips,['b1']);
 assert.throws(()=>draftCandidate(a,['notFound']),/Unknown source/);
});
test('Omni Gemini envelope carries provenance but no fabricated job authorization',()=>{
 const evt=createEvent({eventId:'evt_1',sessionId:'local',type:'hifi.signal.metrics',createdAt:'2026-11-18T00:00:00Z',payload:{rms:0.25}});
 assert.equal(evt.type,'hifi.signal.metrics');assert.equal(evt.visibility,'local');assert.ok(!('grant' in evt));
 assert.throws(()=>createEvent({eventId:'evt_2',sessionId:'local',type:'release.published',createdAt:'2026-11-18T00:00:00Z',payload:{}}),/Unsupported/);
});
