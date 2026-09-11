import test from 'node:test';
import assert from 'node:assert/strict';

const modelPath=new URL('../app/space/space-model.mjs',import.meta.url);
const loadModel=async()=>{
  try{return await import(`${modelPath.href}?t=${Date.now()}`)}catch{return {}}
};

test('chat rejects blank messages and appends a trimmed message',async()=>{
  const model=await loadModel();
  assert.equal(typeof model.appendMessage,'function','Space chat model is missing');
  const initial=[{id:'m1',author:'Amanda',body:'Olá',time:'14:21',mine:false}];
  assert.deepEqual(model.appendMessage(initial,'   ','14:22'),initial);
  assert.deepEqual(model.appendMessage(initial,'  Vamos começar  ','14:22'),[
    ...initial,
    {id:'message-2',author:'Você',body:'Vamos começar',time:'14:22',mine:true},
  ]);
});

test('agenda toggle changes only the requested item',async()=>{
  const model=await loadModel();
  assert.equal(typeof model.toggleAgendaItem,'function','Space agenda model is missing');
  const initial=[
    {id:'a1',time:'14:00',title:'Planejamento',done:false},
    {id:'a2',time:'16:30',title:'Alinhamento',done:false},
  ];
  assert.deepEqual(model.toggleAgendaItem(initial,'a2'),[
    initial[0],
    {...initial[1],done:true},
  ]);
  assert.equal(initial[1].done,false,'toggle must not mutate stored state');
});

test('saving a note updates existing content without duplicating it',async()=>{
  const model=await loadModel();
  assert.equal(typeof model.upsertNote,'function','Space notes model is missing');
  const initial=[
    {id:'n1',subject:'Plano',body:'Primeira versão',updated_at:'2026-09-11T14:00:00.000Z'},
    {id:'n2',subject:'Feedback',body:'Manter',updated_at:'2026-09-11T13:00:00.000Z'},
  ];
  const saved={id:'n1',subject:'Plano final',body:'Versão revisada',updated_at:'2026-09-11T15:00:00.000Z'};
  assert.deepEqual(model.upsertNote(initial,saved),[saved,initial[1]]);
  assert.equal(initial[0].subject,'Plano','save must not mutate stored state');
});

test('participant filters return all, active, or muted people',async()=>{
  const model=await loadModel();
  assert.equal(typeof model.filterParticipants,'function','Space participant model is missing');
  const participants=[
    {id:'p1',name:'Amanda',active:true,muted:false},
    {id:'p2',name:'Marcus',active:false,muted:true},
    {id:'p3',name:'Julia',active:true,muted:true},
  ];
  assert.deepEqual(model.filterParticipants(participants,'all'),participants);
  assert.deepEqual(model.filterParticipants(participants,'active'),[participants[0],participants[2]]);
  assert.deepEqual(model.filterParticipants(participants,'muted'),[participants[1],participants[2]]);
});
