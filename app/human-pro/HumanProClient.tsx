'use client';

import {ChangeEvent,FormEvent,KeyboardEvent,useEffect,useRef,useState} from 'react';
import {ArrowUp,BarChart3,BookOpen,BrainCircuit,Lightbulb,Paperclip,Target,UserRound} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import {createHumanParticleField,createLocalChatReply,getHumanScenePanels,getHumanProPresentation,HUMAN_PRO_PROMPTS,shouldSubmitOnKeyDown} from './human-pro-model.mjs';
import '../app-sidebar.css';
import './human-pro.css';

type Meeting={id:string;title:string;objective?:string;phrase?:string;summary?:string;transcript?:string};
type ChatMessage={id:string;role:'user'|'assistant';content:string};
const RECORDINGS_KEY='zyvo-recordings';
const promptIcons=[Target,Lightbulb,BookOpen,UserRound,BarChart3];
const prompts=HUMAN_PRO_PROMPTS.map((label,index)=>({label,Icon:promptIcons[index]}));
const presentation=getHumanProPresentation();
const particles=createHumanParticleField();
const scenePanels=getHumanScenePanels();
const defaultMeetings:Meeting[]=[
  {id:'r1',title:'Reunião de planejamento',objective:'gestão',phrase:'Estratégia, proposta e próximos passos.'},
  {id:'r2',title:'Alinhamento comercial',objective:'venda',phrase:'Decisões mais claras para acelerar o fechamento.'},
  {id:'r3',title:'Reunião com cliente',objective:'venda',phrase:'Objeções, escuta e próximos compromissos.'},
  {id:'r5',title:'Revisão semanal',objective:'liderança',phrase:'O que avançou e o que precisa mudar.'},
  {id:'r6',title:'Apresentação de proposta',objective:'negociação',phrase:'Valor percebido, timing e decisão.'},
  {id:'r9',title:'Entrevista estratégica',objective:'comunicação',phrase:'Perguntas melhores, respostas mais úteis.'},
];

function loadMeetings(){
  try{
    const parsed=JSON.parse(localStorage.getItem(RECORDINGS_KEY)||'[]');
    const value=Array.isArray(parsed)?parsed:Array.isArray(parsed?.recordings)?parsed.recordings:[];
    return value.length?value:defaultMeetings;
  }catch{return defaultMeetings}
}

function ScenePanel({panel}:{panel:ReturnType<typeof getHumanScenePanels>[number]}){
  return <div className={`scene-window scene-${panel.position} depth-${panel.depth}`}>
    <div className="scene-window-bar"><i/><i/><i/><span className="scene-search"/></div>
    {panel.kind==='workspace'&&<><div className="scene-workspace-body"><div className="scene-copy"><b/><span/><span/><span/></div><div className="scene-media scene-featured crop-portrait-a"><i className="scene-person-head"/><i className="scene-person-body"/></div></div><div className="scene-thumb-row">{[0,1,2].map(index=><div className="scene-media crop-portrait-b" key={index}><i className="scene-person-head"/><i className="scene-person-body"/></div>)}</div></>}
    {panel.kind==='call'&&<><div className="scene-call-grid">{[0,1,2].map(index=><div className="scene-media crop-call-a" key={index}><i className="scene-person-head"/><i className="scene-person-body"/></div>)}</div><div className="scene-call-controls"><span/></div></>}
    {panel.kind==='insights'&&<>{[0,1,2].map(index=><div className="scene-insight-row" key={index}><div className="scene-media crop-portrait-c"><i className="scene-person-head"/><i className="scene-person-body"/></div><div><b/><span/><span/></div></div>)}</>}
    {panel.kind==='console'&&<div className="scene-console-body"><div className="scene-media crop-meeting-a"><i className="scene-person-head"/><i className="scene-person-body"/></div><div><b/><span/><span/><span/></div></div>}
  </div>;
}

export default function HumanProClient(){
  const[question,setQuestion]=useState('');
  const[messages,setMessages]=useState<ChatMessage[]>([]);
  const[meetings,setMeetings]=useState<Meeting[]>(defaultMeetings);
  const[working,setWorking]=useState(false);
  const fileRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    setMeetings(loadMeetings());
  },[]);

  const runAnalysis=(value=question)=>{
    const clean=value.trim();if(!clean||working)return;
    const stamp=Date.now();
    setMessages(current=>[...current,{id:`user-${stamp}`,role:'user',content:clean}]);
    setQuestion('');
    setWorking(true);
    window.setTimeout(()=>{
      const reply=createLocalChatReply(clean,meetings);
      setMessages(current=>[...current,{id:`assistant-${stamp}`,role:'assistant',content:reply}]);
      setWorking(false);
    },420);
  };
  const submit=(event:FormEvent)=>{event.preventDefault();runAnalysis()};
  const submitOnEnter=(event:KeyboardEvent<HTMLTextAreaElement>)=>{
    if(!shouldSubmitOnKeyDown({key:event.key,shiftKey:event.shiftKey,isComposing:event.nativeEvent.isComposing}))return;
    event.preventDefault();
    runAnalysis();
  };
  const choosePrompt=(value:string)=>runAnalysis(value);
  const attach=(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>setQuestion(current=>`${current}${current?'\n\n':''}Contexto do arquivo ${file.name}:\n${String(reader.result).slice(0,5000)}`);reader.readAsText(file);event.target.value=''};

  return <main className="human-pro-page">
    <AppSidebar/>
    <section className="human-pro-content">
      <div className="human-scenery" aria-hidden="true">
        <div className="human-light-cone"/><div className="human-horizon"/><div className="human-glow-orb glow-left"/><div className="human-glow-orb glow-right"/>
        {scenePanels.map(panel=><ScenePanel key={panel.id} panel={panel}/>) }
        <div className="human-light-stream"><i/><i/><i/></div>
      </div>
      <div className="human-particle-field" aria-hidden="true">{particles.map(particle=><span key={particle.id} style={{
        '--particle-x':`${particle.x}%`,
        '--particle-y':`${particle.y}%`,
        '--particle-size':`${particle.size}px`,
        '--particle-opacity':particle.opacity,
        '--particle-duration':`${particle.duration}s`,
        '--particle-delay':`${particle.delay}s`,
        '--particle-drift-x':`${particle.driftX}px`,
        '--particle-drift-y':`${particle.driftY}px`,
      } as React.CSSProperties}/>)}</div>
      <div className="human-main">
        <header className="human-hero">
          <h1>{presentation.title}</h1>
          {presentation.subtitle&&<p>{presentation.subtitle}</p>}
        </header>

        <div className="human-prompts" aria-label="Perguntas sugeridas">{prompts.map(({label,Icon})=><button key={label} onClick={()=>choosePrompt(label)}><Icon/><span>{label}</span></button>)}</div>

        <section className={`human-chat ${messages.length?'has-messages':''}`}>
          {!!messages.length&&<div className="human-chat-thread" aria-live="polite">
            {messages.map(message=><article className={`human-message ${message.role}`} key={message.id}>
              <div className="human-message-avatar">{message.role==='assistant'?<BrainCircuit/>:<UserRound/>}</div>
              <div><strong>{message.role==='assistant'?'Human Pro':'Você'}</strong><p>{message.content}</p></div>
            </article>)}
            {working&&<article className="human-message assistant thinking"><div className="human-message-avatar"><BrainCircuit/></div><div><strong>Human Pro</strong><p>Analisando contexto e padrões locais...</p></div></article>}
          </div>}
          <form className="human-composer" onSubmit={submit}>
            <textarea aria-label="Pergunta para o Human Pro" value={question} onChange={event=>setQuestion(event.target.value)} onKeyDown={submitOnEnter} placeholder="O que você quer entender sobre sua performance?"/>
            <div><button type="button" className="human-attach" onClick={()=>fileRef.current?.click()} aria-label="Anexar contexto"><Paperclip/></button><input ref={fileRef} type="file" hidden accept=".txt,.md,.json,text/plain,application/json" onChange={attach}/><span>{meetings.length} reuniões locais disponíveis</span><button className="human-send" disabled={!question.trim()||working} aria-label="Enviar mensagem"><ArrowUp/></button></div>
          </form>
        </section>
      </div>
    </section>
  </main>;
}
