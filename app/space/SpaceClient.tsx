'use client';

import {FormEvent,useEffect,useMemo,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Bell,CalendarDays,Camera,CameraOff,Check,ChevronLeft,ChevronRight,Copy,Ellipsis,Filter,Grid2X2,Heart,LayoutList,MessageCircle,Mic,MicOff,MonitorUp,NotebookPen,PanelBottomClose,Plus,Save,Send,Share2,SlidersHorizontal,Smile,StickyNote,Users,X} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import AppTopbar from '../AppTopbar';
import {appendMessage,filterParticipants,toggleAgendaItem,upsertNote} from './space-model.mjs';
import './space.css';

type Message={id:string;author:string;body:string;time:string;mine:boolean};
type AgendaItem={id:string;time:string;title:string;done:boolean};
type Note={id:string;subject:string;body:string;created_at:string;updated_at:string};
type Participant={id:string;name:string;activity:string;image:string;active:boolean;muted:boolean};
type ParticipantFilter='all'|'active'|'muted';

const MESSAGES_KEY='zyvo-space-messages';
const AGENDA_KEY='zyvo-space-agenda';
const NOTES_KEY='zyvo:guest-notes';

const initialMessages:Message[]=[
  {id:'message-1',author:'Amanda',body:'Ótima apresentação!',time:'14:21',mine:false},
  {id:'message-2',author:'Marcus',body:'Concordo, faz todo sentido.',time:'14:22',mine:false},
  {id:'message-3',author:'Julia',body:'Podemos alinhar isso na próxima?',time:'14:22',mine:false},
];
const initialAgenda:AgendaItem[]=[
  {id:'agenda-1',time:'14:00',title:'Reunião de planejamento',done:false},
  {id:'agenda-2',time:'16:30',title:'Alinhamento com time',done:false},
  {id:'agenda-3',time:'10:00',title:'Apresentação do projeto',done:false},
];
const initialNotes:Note[]=[
  {id:'space-note-1',subject:'Plano de marketing',body:'Prioridades, responsáveis e próximos passos.',created_at:'2026-09-11T14:22:00.000Z',updated_at:'2026-09-11T14:22:00.000Z'},
  {id:'space-note-2',subject:'Feedback da reunião',body:'Revisar perguntas estratégicas antes do próximo encontro.',created_at:'2026-09-11T12:10:00.000Z',updated_at:'2026-09-11T12:10:00.000Z'},
];
const participants:Participant[]=[
  {id:'p1',name:'Theresa Webb',activity:'Cantando',image:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=520&q=82',active:true,muted:false},
  {id:'p2',name:'Jane Cooper',activity:'Apresentando',image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=520&q=82',active:true,muted:false},
  {id:'p3',name:'Arlene McCoy',activity:'Ouvindo',image:'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=520&q=82',active:false,muted:true},
  {id:'p4',name:'Darrell Steward',activity:'Ouvindo',image:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=520&q=82',active:true,muted:true},
  {id:'p5',name:'Dianne Russell',activity:'Fotografando',image:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=520&q=82',active:true,muted:false},
  {id:'p6',name:'Ronald Richards',activity:'Falando',image:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=520&q=82',active:true,muted:false},
  {id:'p7',name:'Albert Flores',activity:'Ouvindo',image:'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=520&q=82',active:false,muted:true},
  {id:'p8',name:'Devon Lane',activity:'Ouvindo',image:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=520&q=82',active:true,muted:false},
];
const evolution=[
  {title:'Ótima evolução!',copy:'Você foi mais objetivo e fez perguntas mais estratégicas nesta reunião.',tone:'coral'},
  {title:'Escuta em alta',copy:'O tempo dedicado às respostas do time cresceu 18% desde a última reunião.',tone:'blue'},
  {title:'Próximo foco',copy:'Transforme os combinados finais em responsáveis e prazos ainda durante a conversa.',tone:'green'},
];

function readStored<T>(key:string,fallback:T):T{try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:fallback}catch{return fallback}}
function currentTime(){return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'}).format(new Date())}

export default function SpaceClient(){
  const router=useRouter();
  const videoRef=useRef<HTMLVideoElement>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const noteTitleRef=useRef<HTMLInputElement>(null);
  const [hydrated,setHydrated]=useState(false);
  const [messages,setMessages]=useState<Message[]>(initialMessages);
  const [message,setMessage]=useState('');
  const [agenda,setAgenda]=useState<AgendaItem[]>(initialAgenda);
  const [agendaForm,setAgendaForm]=useState(false);
  const [agendaTitle,setAgendaTitle]=useState('');
  const [agendaTime,setAgendaTime]=useState('09:00');
  const [notes,setNotes]=useState<Note[]>(initialNotes);
  const [noteId,setNoteId]=useState<string|null>(null);
  const [noteTitle,setNoteTitle]=useState('');
  const [noteBody,setNoteBody]=useState('');
  const [chatOpen,setChatOpen]=useState(true);
  const [layout,setLayout]=useState<'mosaic'|'list'>('mosaic');
  const [filter,setFilter]=useState<ParticipantFilter>('all');
  const [filterOpen,setFilterOpen]=useState(false);
  const [moreOpen,setMoreOpen]=useState(false);
  const [exitOpen,setExitOpen]=useState(false);
  const [cameraOn,setCameraOn]=useState(false);
  const [micOn,setMicOn]=useState(false);
  const [mediaError,setMediaError]=useState('');
  const [shared,setShared]=useState(false);
  const [slide,setSlide]=useState(0);

  useEffect(()=>{
    setMessages(readStored(MESSAGES_KEY,initialMessages));
    setAgenda(readStored(AGENDA_KEY,initialAgenda));
    setNotes(readStored(NOTES_KEY,initialNotes));
    setHydrated(true);
    return()=>{streamRef.current?.getTracks().forEach(track=>track.stop())};
  },[]);
  useEffect(()=>{if(hydrated)try{localStorage.setItem(MESSAGES_KEY,JSON.stringify(messages))}catch{}},[messages,hydrated]);
  useEffect(()=>{if(hydrated)try{localStorage.setItem(AGENDA_KEY,JSON.stringify(agenda))}catch{}},[agenda,hydrated]);
  useEffect(()=>{if(hydrated)try{localStorage.setItem(NOTES_KEY,JSON.stringify(notes))}catch{}},[notes,hydrated]);

  const visibleParticipants=useMemo(()=>filterParticipants(participants,filter) as Participant[],[filter]);
  const submitMessage=(event:FormEvent)=>{event.preventDefault();setMessages(items=>appendMessage(items,message,currentTime()));setMessage('')};
  const submitAgenda=(event:FormEvent)=>{event.preventDefault();const title=agendaTitle.trim();if(!title)return;setAgenda(items=>[...items,{id:`agenda-${Date.now()}`,time:agendaTime,title,done:false}]);setAgendaTitle('');setAgendaForm(false)};
  const editNote=(note:Note)=>{setNoteId(note.id);setNoteTitle(note.subject);setNoteBody(note.body);noteTitleRef.current?.focus()};
  const saveNote=(event:FormEvent)=>{event.preventDefault();const subject=noteTitle.trim();if(!subject)return;const stamp=new Date().toISOString();const existing=notes.find(item=>item.id===noteId);const saved:Note={id:noteId||`space-note-${Date.now()}`,subject,body:noteBody.trim(),created_at:existing?.created_at||stamp,updated_at:stamp};setNotes(items=>upsertNote(items,saved));try{localStorage.setItem('zyvo:last-saved-note',JSON.stringify(saved));window.dispatchEvent(new CustomEvent('zyvo:note-saved',{detail:saved}))}catch{}setNoteId(null);setNoteTitle('');setNoteBody('')};
  const removeNote=(id:string)=>setNotes(items=>items.filter(item=>item.id!==id));

  const attachStream=(stream:MediaStream)=>{streamRef.current=stream;if(videoRef.current)videoRef.current.srcObject=stream};
  const toggleDevice=async(kind:'camera'|'microphone')=>{
    const isCamera=kind==='camera';const enabled=isCamera?cameraOn:micOn;const trackKind=isCamera?'video':'audio';setMediaError('');
    if(enabled){streamRef.current?.getTracks().filter(track=>track.kind===trackKind).forEach(track=>{track.stop();streamRef.current?.removeTrack(track)});isCamera?setCameraOn(false):setMicOn(false);return}
    if(!navigator.mediaDevices?.getUserMedia){setMediaError('Câmera e microfone não estão disponíveis neste navegador.');return}
    try{const fresh=await navigator.mediaDevices.getUserMedia(isCamera?{video:true,audio:false}:{video:false,audio:true});const combined=new MediaStream([...(streamRef.current?.getTracks().filter(track=>track.readyState==='live')||[]),...fresh.getTracks()]);attachStream(combined);isCamera?setCameraOn(true):setMicOn(true)}catch{setMediaError(`Permissão de ${isCamera?'câmera':'microfone'} não concedida.`)}
  };
  const shareSpace=async()=>{setShared(false);try{if(navigator.share)await navigator.share({title:'ZYVO Space',text:'Entre no meu Space da ZYVO',url:location.href});else await navigator.clipboard.writeText(location.href);setShared(true);setTimeout(()=>setShared(false),2200)}catch{setMediaError('Não foi possível compartilhar o link agora.')}};

  return <main className="app-shell space-page">
    <AppSidebar/>
    <section className="content space-content">
      <AppTopbar/>
      <div className="space-workspace">
        <section className="space-live-card" aria-label="Reunião ao vivo">
          <div className="space-host"><span className="space-live-dot"/><strong>Sandro</strong><time>00:24</time><button aria-label="Mais opções da reunião"><Ellipsis/></button></div>
          <div className="space-host-media"><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1100&q=88" alt="Sandro na reunião"/><video ref={videoRef} autoPlay muted playsInline className={cameraOn?'is-visible':''}/><div className="space-reactions"><span><Heart fill="currentColor"/>12</span><span><MessageCircle/>8</span><span><Send/>3</span></div></div>
          {chatOpen&&<div className="space-chat-panel"><div className="space-chat-list">{messages.slice(-4).map(item=><div className={item.mine?'mine':''} key={item.id}><b>{item.author}</b><time>{item.time}</time><p>{item.body}</p></div>)}</div><form onSubmit={submitMessage}><input value={message} onChange={e=>setMessage(e.target.value)} aria-label="Mensagem" placeholder="Enviar uma mensagem..."/><Smile/><button aria-label="Enviar mensagem"><Send/></button></form></div>}
        </section>

        <section className="space-participants-panel space-glass" aria-label="Participantes">
          <header><div><strong>Participantes</strong><span>{visibleParticipants.length}</span></div><div className="space-view-switch"><button className={layout==='mosaic'?'active':''} onClick={()=>setLayout('mosaic')} aria-label="Visualização em mosaico" aria-pressed={layout==='mosaic'}><Grid2X2/>Mosaico</button><button className={layout==='list'?'active':''} onClick={()=>setLayout('list')} aria-label="Visualização em lista" aria-pressed={layout==='list'}><LayoutList/></button></div></header>
          <div className={`space-participants ${layout}`}>{visibleParticipants.map(person=><article key={person.id}><img src={person.image} alt={person.name}/><div><small>{person.activity}</small><strong>{person.name}</strong></div><span className={person.muted?'muted':'active'}>{person.muted?<MicOff/>:<Mic/>}</span></article>)}</div>
        </section>

        <section className={`space-evolution space-glass ${evolution[slide].tone}`} aria-label="Evolução da reunião"><div className="space-evolution-copy"><div><Copy/><Save/></div><h1>{evolution[slide].title}</h1><p>{evolution[slide].copy}</p><div className="space-dots">{evolution.map((_,index)=><button key={index} className={index===slide?'active':''} onClick={()=>setSlide(index)} aria-label={`Evolução ${index+1}`}/>)}</div></div><div className="space-wave"/><button className="space-next-slide" onClick={()=>setSlide(index=>(index+1)%evolution.length)} aria-label="Próxima evolução"><ChevronRight/></button></section>

        <section className="space-agenda space-glass" aria-label="Agenda do Space"><header><div><CalendarDays/><span><strong>Agenda</strong><small>Suas próximas reuniões</small></span></div><button onClick={()=>setAgendaForm(value=>!value)} aria-label="Adicionar à agenda"><Plus/></button></header>{agendaForm&&<form onSubmit={submitAgenda} className="space-agenda-form"><input aria-label="Horário da reunião" type="time" value={agendaTime} onChange={e=>setAgendaTime(e.target.value)}/><input aria-label="Nome da reunião" autoFocus value={agendaTitle} onChange={e=>setAgendaTitle(e.target.value)} placeholder="Nome da reunião"/><button aria-label="Salvar reunião"><Check/></button></form>}<div className="space-agenda-list">{agenda.map(item=><button key={item.id} className={item.done?'done':''} onClick={()=>setAgenda(items=>toggleAgendaItem(items,item.id))}><time>{item.time}</time><span>{item.title}</span>{item.done?<Check/>:<ChevronRight/>}</button>)}</div></section>

        <section className="space-notes space-glass" aria-label="Anotações do Space"><header><div><NotebookPen/><span><strong>Anotações</strong><small>Ideias, insights e decisões</small></span></div><button onClick={()=>noteTitleRef.current?.focus()} aria-label="Nova anotação"><Plus/></button></header><form onSubmit={saveNote} className="space-note-form"><input ref={noteTitleRef} value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} placeholder="Título da anotação" aria-label="Título da anotação"/><textarea value={noteBody} onChange={e=>setNoteBody(e.target.value)} placeholder="Escreva uma decisão ou insight..." aria-label="Conteúdo da anotação"/><button><Save/>{noteId?'Atualizar':'Salvar'}</button></form><div className="space-note-list">{notes.slice(0,4).map(note=><article key={note.id}><button onClick={()=>editNote(note)}><StickyNote/><span><strong>{note.subject}</strong><small>{new Date(note.updated_at).toLocaleString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</small></span></button><button onClick={()=>removeNote(note.id)} aria-label={`Excluir ${note.subject}`}><X/></button></article>)}</div></section>
      </div>

      <nav className="space-controls" aria-label="Controles da reunião">
        <button className={micOn?'active':''} onClick={()=>toggleDevice('microphone')} aria-pressed={micOn}>{micOn?<Mic/>:<MicOff/>}<span>Microfone</span></button>
        <button className={cameraOn?'active':''} onClick={()=>toggleDevice('camera')} aria-pressed={cameraOn}>{cameraOn?<Camera/>:<CameraOff/>}<span>Câmera</span></button>
        <button className={chatOpen?'active':''} onClick={()=>setChatOpen(value=>!value)} aria-pressed={chatOpen}><MessageCircle/><span>Chat</span></button>
        <button onClick={()=>noteTitleRef.current?.focus()}><NotebookPen/><span>Anotar</span></button>
        <button onClick={()=>setLayout(value=>value==='mosaic'?'list':'mosaic')}><Users/><span>Participantes</span></button>
        <div className="space-control-menu"><button onClick={()=>setFilterOpen(value=>!value)} aria-expanded={filterOpen}><Filter/><span>Filtros</span></button>{filterOpen&&<div>{(['all','active','muted'] as ParticipantFilter[]).map(value=><button key={value} className={filter===value?'active':''} onClick={()=>{setFilter(value);setFilterOpen(false)}}>{value==='all'?'Todos':value==='active'?'Ativos':'Silenciados'}</button>)}</div>}</div>
        <button onClick={shareSpace}><MonitorUp/><span>{shared?'Link copiado':'Compartilhar'}</span></button>
        <div className="space-control-menu"><button onClick={()=>setMoreOpen(value=>!value)} aria-expanded={moreOpen}><Ellipsis/><span>Mais</span></button>{moreOpen&&<div><button onClick={()=>setChatOpen(false)}><PanelBottomClose/>Ocultar chat</button><button onClick={()=>setMediaError('Preferências da reunião atualizadas.')}><SlidersHorizontal/>Preferências</button></div>}</div>
        <button className="space-leave" onClick={()=>setExitOpen(true)}><Share2/><span>Sair</span></button>
      </nav>
      {mediaError&&<div className="space-toast" role="status"><Bell/>{mediaError}<button onClick={()=>setMediaError('')} aria-label="Fechar aviso"><X/></button></div>}
      {exitOpen&&<div className="space-dialog-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setExitOpen(false)}}><div className="space-dialog" role="dialog" aria-modal="true" aria-labelledby="space-exit-title"><button className="space-dialog-close" onClick={()=>setExitOpen(false)} aria-label="Fechar"><X/></button><h2 id="space-exit-title">Sair do Space?</h2><p>A câmera e o microfone serão desligados. Suas mensagens, agenda e anotações permanecerão salvas.</p><div><button onClick={()=>setExitOpen(false)}>Continuar na reunião</button><button className="danger" onClick={()=>router.push('/')}>Sair agora</button></div></div></div>}
    </section>
  </main>;
}
