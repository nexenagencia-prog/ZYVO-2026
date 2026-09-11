'use client';

import {ChangeEvent,PointerEvent,useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {BarChart3,ChevronLeft,ChevronRight,ImagePlus,Pencil,Play,Star,Trash2,X} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import AppTopbar from '../AppTopbar';
import './gravacoes.css';

type Recording={id:string;title:string;phrase:string;thumbnail:string;performance:number;font:string;fontSize:number;src?:string};

const STORAGE_KEY='zyvo-recordings';
const defaults:Recording[]=[
 {id:'r1',title:'Reunião de planejamento',phrase:'Estratégia, proposta e próximos passos.',thumbnail:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=88',performance:5,font:'SF Pro Display',fontSize:42},
 {id:'r2',title:'Alinhamento comercial',phrase:'Decisões mais claras para acelerar o fechamento.',thumbnail:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:38},
 {id:'r3',title:'Reunião com cliente',phrase:'Objeções, escuta e próximos compromissos.',thumbnail:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:36},
 {id:'r4',title:'Kickoff de projeto',phrase:'Prioridades e responsabilidades definidas.',thumbnail:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=86',performance:5,font:'SF Pro Display',fontSize:34},
 {id:'r5',title:'Revisão semanal',phrase:'O que avançou e o que precisa mudar.',thumbnail:'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=86',performance:3,font:'SF Pro Display',fontSize:34},
 {id:'r6',title:'Apresentação de proposta',phrase:'Valor percebido, timing e decisão.',thumbnail:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=86',performance:5,font:'SF Pro Display',fontSize:34},
 {id:'r7',title:'Estratégia de lançamento',phrase:'Mensagem, prioridade e execução.',thumbnail:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:34},
 {id:'r8',title:'Reunião de performance',phrase:'Pontos fortes, ruídos e evolução.',thumbnail:'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=86',performance:5,font:'SF Pro Display',fontSize:34},
 {id:'r9',title:'Entrevista estratégica',phrase:'Perguntas melhores, respostas mais úteis.',thumbnail:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:34},
];

function Rail({children,className=''}:{children:React.ReactNode;className?:string}){
 const ref=useRef<HTMLDivElement>(null);const drag=useRef({active:false,x:0,left:0});
 const down=(e:PointerEvent<HTMLDivElement>)=>{if((e.target as HTMLElement).closest('button,input,select,textarea'))return;const el=ref.current;if(!el)return;drag.current={active:true,x:e.clientX,left:el.scrollLeft};el.setPointerCapture(e.pointerId);el.classList.add('dragging')};
 const move=(e:PointerEvent<HTMLDivElement>)=>{const el=ref.current;if(!el||!drag.current.active)return;el.scrollLeft=drag.current.left-(e.clientX-drag.current.x)};
 const up=(e:PointerEvent<HTMLDivElement>)=>{const el=ref.current;if(!el)return;drag.current.active=false;try{el.releasePointerCapture(e.pointerId)}catch{}el.classList.remove('dragging')};
 useEffect(()=>{const el=ref.current;if(!el)return;const wheel=(e:WheelEvent)=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;if(Math.abs(e.deltaY)<2)return;e.preventDefault();el.scrollLeft+=e.deltaY*.78};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[]);
 return <div ref={ref} className={`recordings-rail ${className}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>{children}</div>;
}

export default function RecordingsPage(){
 const router=useRouter();const[recordings,setRecordings]=useState<Recording[]>(defaults);const[active,setActive]=useState(1);const[editing,setEditing]=useState<Recording|null>(null);const fileRef=useRef<HTMLInputElement>(null);const pendingThumbnailId=useRef<string|null>(null);
 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const parsed=JSON.parse(raw);const list=Array.isArray(parsed)?parsed:Array.isArray(parsed?.recordings)?parsed.recordings:[];if(list.length)setRecordings(list.map((r:Partial<Recording>,i:number)=>({...defaults[i%defaults.length],...r,id:String(r.id??`saved-${i}`)})))}}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(recordings));window.dispatchEvent(new Event('zyvo:recordings-updated'))}catch{}},[recordings]);
 const update=(next:Recording)=>{setRecordings(list=>list.map(item=>item.id===next.id?next:item));setEditing(null)};
 const remove=(id:string)=>{setRecordings(list=>list.filter(item=>item.id!==id));setActive(0)};
 const pickThumbnail=(id:string)=>{pendingThumbnailId.current=id;fileRef.current?.click()};
 const changeThumbnail=(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];const id=pendingThumbnailId.current;if(!file||!id)return;const reader=new FileReader();reader.onload=()=>setRecordings(list=>list.map(item=>item.id===id?{...item,thumbnail:String(reader.result)}:item));reader.readAsDataURL(file);e.target.value=''};
 const featured=recordings[active]??recordings[0];
 const shift=(dir:number)=>{if(!recordings.length)return;setActive(i=>(i+dir+recordings.length)%recordings.length)};
 return <main className="recordings-page"><AppSidebar/><section className="recordings-content"><AppTopbar/><div className="recordings-stage">
  <input ref={fileRef} className="recordings-file-input" type="file" accept="image/*" onChange={changeThumbnail}/>
  {featured&&<section className="recordings-featured-wrap">
   <button className="recordings-arrow left" onClick={()=>shift(-1)} aria-label="Gravação anterior"><ChevronLeft/></button>
   <Rail className="recordings-featured-rail">
    {recordings.map((item,index)=><article className={`recordings-featured-card ${index===active?'is-active':''}`} key={item.id} style={{backgroundImage:`linear-gradient(180deg,rgba(4,8,12,.03),rgba(4,8,12,.72)),url(${item.thumbnail})`}} onClick={()=>setActive(index)}>
      <div className="featured-copy"><span>GRAVAÇÃO ZYVO</span><h1 style={{fontFamily:item.font,fontSize:`${item.fontSize}px`}}>{item.title}</h1><p>{item.phrase}</p><PerformanceStars value={item.performance}/></div>
      <div className="featured-actions"><button onClick={e=>{e.stopPropagation();router.push('/skills')}}><BarChart3/>Analisar</button><button className="watch" onClick={e=>e.stopPropagation()}><Play fill="currentColor"/>Assistir agora</button></div>
      <CardTools onEdit={()=>setEditing(item)} onThumb={()=>pickThumbnail(item.id)} onDelete={()=>remove(item.id)} onAnalyze={()=>router.push('/skills')}/>
    </article>)}
   </Rail>
   <button className="recordings-arrow right" onClick={()=>shift(1)} aria-label="Próxima gravação"><ChevronRight/></button>
  </section>}
  <Rail>{recordings.slice(0,7).map(item=><SmallCard key={`a-${item.id}`} item={item} onOpen={()=>setActive(recordings.findIndex(r=>r.id===item.id))} onEdit={()=>setEditing(item)} onThumb={()=>pickThumbnail(item.id)} onDelete={()=>remove(item.id)} onAnalyze={()=>router.push('/skills')}/>)}</Rail>
  <Rail>{recordings.slice().reverse().map(item=><SmallCard key={`b-${item.id}`} item={item} onOpen={()=>setActive(recordings.findIndex(r=>r.id===item.id))} onEdit={()=>setEditing(item)} onThumb={()=>pickThumbnail(item.id)} onDelete={()=>remove(item.id)} onAnalyze={()=>router.push('/skills')}/>)}</Rail>
  <button className="recordings-back" onClick={()=>router.push('/')}>Voltar ao menu <ChevronRight/></button>
 </div></section>
 {editing&&<EditModal value={editing} onClose={()=>setEditing(null)} onSave={update} onThumb={()=>{pickThumbnail(editing.id);setEditing(null)}}/>}</main>;
}

function PerformanceStars({value,compact=false}:{value:number;compact?:boolean}){return <div className={`recordings-stars ${compact?'compact':''}`} aria-label={`Performance ${value} de 5`}>{[1,2,3,4,5].map(n=><Star key={n} className={n<=value?'filled':''}/>)}</div>}
function CardTools({onEdit,onThumb,onDelete,onAnalyze}:{onEdit:()=>void;onThumb:()=>void;onDelete:()=>void;onAnalyze:()=>void}){return <div className="recordings-tools"><button title="Assistir"><Play fill="currentColor"/></button><button title="Analisar" onClick={onAnalyze}><BarChart3/></button><button title="Editar gravação" onClick={onEdit}><Pencil/></button><button title="Alterar miniatura" onClick={onThumb}><ImagePlus/></button><button title="Excluir" onClick={onDelete}><Trash2/></button></div>}
function SmallCard({item,onOpen,onEdit,onThumb,onDelete,onAnalyze}:{item:Recording;onOpen:()=>void;onEdit:()=>void;onThumb:()=>void;onDelete:()=>void;onAnalyze:()=>void}){return <article className="recordings-small-card" style={{backgroundImage:`linear-gradient(180deg,rgba(5,8,12,.02),rgba(5,8,12,.56)),url(${item.thumbnail})`}} onDoubleClick={onOpen}><div className="small-meta"><strong style={{fontFamily:item.font}}>{item.title}</strong><PerformanceStars value={item.performance} compact/></div><CardTools onEdit={onEdit} onThumb={onThumb} onDelete={onDelete} onAnalyze={onAnalyze}/></article>}
function EditModal({value,onClose,onSave,onThumb}:{value:Recording;onClose:()=>void;onSave:(r:Recording)=>void;onThumb:()=>void}){const[draft,setDraft]=useState(value);return <div className="recordings-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="recordings-modal"><button className="modal-close" onClick={onClose}><X/></button><span>EDITAR GRAVAÇÃO</span><h2>Ajuste como essa reunião aparece.</h2><label>Título<input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label>Frase<textarea value={draft.phrase} onChange={e=>setDraft({...draft,phrase:e.target.value})}/></label><div className="modal-grid"><label>Fonte<select value={draft.font} onChange={e=>setDraft({...draft,font:e.target.value})}><option>SF Pro Display</option><option>Helvetica Neue</option><option>Georgia</option><option>Times New Roman</option></select></label><label>Tamanho do título<input type="range" min="24" max="58" value={draft.fontSize} onChange={e=>setDraft({...draft,fontSize:Number(e.target.value)})}/><b>{draft.fontSize}px</b></label></div><label>Performance<div className="modal-stars">{[1,2,3,4,5].map(n=><button key={n} className={n<=draft.performance?'active':''} onClick={()=>setDraft({...draft,performance:n})}><Star fill="currentColor"/></button>)}</div></label><div className="modal-actions"><button onClick={onThumb}><ImagePlus/>Alterar miniatura</button><button className="save" onClick={()=>onSave(draft)}>Salvar alterações</button></div></section></div>}
