import test from 'node:test';
import assert from 'node:assert/strict';
import { validateHomePayload } from '../lib/cms/payload.mjs';

const valid={
  hero:{eyebrow:'x',title:'y',ratingText:'z',performancePercent:69,performanceLabel:'d',primaryButton:'a',secondaryButton:'b'},
  nextMeeting:{label:'l',dateTime:'d'},
  profile:{name:'n',avatarUrl:'',planLabel:'p'},
  navigation:{searchPlaceholder:'s',top:['Início'],sidebar:['Início']},
  carouselIntervalMs:4000,
  carousel:[{title:'A',subtitle:'B',imageUrl:'',sortOrder:0,isActive:true}],
  cards:[{slug:'skills',title:'Skills',description:'d',percentage:82,imageUrl:'',ctaLabel:'Explorar',sortOrder:0,isActive:true}]
};

test('validates editable Home payload',()=>{
  const result=validateHomePayload(valid);
  assert.equal(result.hero.performancePercent,69);
  assert.equal(result.cards[0].percentage,82);
});

test('rejects percentage outside 0..100',()=>{
  assert.throws(()=>validateHomePayload({...valid,hero:{...valid.hero,performancePercent:101}}));
});

test('rejects empty required card copy',()=>{
  assert.throws(()=>validateHomePayload({...valid,cards:[{...valid.cards[0],title:''}]}));
});
