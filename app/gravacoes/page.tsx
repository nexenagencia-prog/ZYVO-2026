'use client';

import {ChangeEvent,PointerEvent,useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {BarChart3,ChevronLeft,ChevronRight,ImagePlus,Pencil,Play,Star,Trash2,X} from 'lucide-react';
import AppSidebar from '../AppSidebar';
import AppTopbar from '../AppTopbar';
import './gravacoes.css';

type Recording={id:string;title:string;phrase:string;thumbnail:string;performance:number;font:string;fontSize:number;titleLine1?:string;titleLine2?:string;titleColor1?:string;titleColor2?:string;titleWeight?:number;src?:string};

const STORAGE_KEY='zyvo-recordings';
const defaults:Recording[]=[
 {id:'r1',title:'Reunião de planejamento',titleLine1:'Reunião de',titleLine2:'planejamento',phrase:'Estratégia, proposta e próximos passos.',thumbnail:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=88',performance:5,font:'SF Pro Display',fontSize:48,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r2',title:'Alinhamento comercial',titleLine1:'Alinhamento',titleLine2:'comercial',phrase:'Decisões mais claras para acelerar o fechamento.',thumbnail:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:48,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r3',title:'Reunião com cliente',titleLine1:'Reunião com',titleLine2:'cliente',phrase:'Objeções, escuta e próximos compromissos.',thumbnail:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:46,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r4',title:'Kickoff de projeto',titleLine1:'Kickoff de',titleLine2:'projeto',phrase:'Prioridades e responsabilidades definidas.',thumbnail:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=86',performance:5,font:'SF Pro Display',fontSize:44,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r5',title:'Revisão semanal',titleLine1:'Revisão',titleLine2:'semanal',phrase:'O que avançou e o que precisa mudar.',thumbnail:'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=86',performance:3,font:'SF Pro Display',fontSize:44,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r6',title:'Apresentação de proposta',titleLine1:'Apresentação',titleLine2:'de proposta',phrase:'Valor percebido, timing e decisão.',thumbnail:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=86',performance:5,font:'SF Pro Display',fontSize:44,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r7',title:'Estratégia de lançamento',titleLine1:'Estratégia de',titleLine2:'lançamento',phrase:'Mensagem, prioridade e execução.',thumbnail:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:44,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r8',title:'Reunião de performance',titleLine1:'Reunião de',titleLine2:'performance',phrase:'Pontos fortes, ruídos e evolução.',thumbnail:'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=86',performance:5,font:'SF Pro Display',fontSize:44,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
 {id:'r9',title:'Entrevista estratégica',titleLine1:'Entrevista',titleLine2:'estratégica',phrase:'Perguntas melhores, respostas mais úteis.',thumbnail:'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=86',performance:4,font:'SF Pro Display',fontSize:44,titleColor1:'#ffffff',titleColor2:'#ffffff',titleWeight:650},
];

function splitTitle(title:string){const words=title.trim().split(/\s+/);const cut=Math.max(1,Math.ceil(words.length/2));return [words.slice(0,cut).join(' '),words.slice(cut).join(' ')]}
function titleParts(item:Recording){const [fallbackOne,fallbackTwo]=splitTitle(item.title);return [item.titleLine1||fallbackOne,item.titleLine2??fallbackTwo]}
function normalizeRecording(r:Partial<Recording>,i:number):Recording{const base=defaults[i%defaults.length];const merged={...base,...r,id:String(r.id??`saved-${i}`)} as Recording;const [line1,line2]=titleParts(merged);return {...merged,titleLine1:line1,titleLine2:line2,titleColor1:merged.titleColor1||'#ffffff',titleColor2:merged.titleColor2||'#ffffff',titleWeight:merged.titleWeight||650}}

function Rail({children,className='',loop=false}:{children:React.ReactNode;className?:string;loop?:boolean}){
 const ref=useRef<HTMLDivElement>(null);const drag=useRef({active:false,x:0,left:0});
 const down=(e:PointerEvent<HTMLDivElement>)=>{if((e.target as HTMLElement).closest('button,input,select,textarea'))return;const el=ref.current;if(!el)return;drag.current={active:true,x:e.clientX,left:el.scrollLeft};el.setPointerCapture(e.pointerId);el.classList.add('dragging')};
 const move=(e:PointerEvent<HTMLDivElement>)=>{const el=ref.current;if(!el||!drag.current.active)return;el.scrollLeft=drag.current.left-(e.clientX-drag.current.x)};
 const up=(e:PointerEvent<HTMLDivElement>)=>{const el=ref.current;if(!el)return;drag.current.active=false;try{el.releasePointerCapture(e.pointerId)}catch{}el.classList.remove('dragging')};
 useEffect(()=>{const el=ref.current;if(!el)return;const wheel=(e:WheelEvent)=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;if(Math.abs(e.deltaY)<2)return;e.preventDefault();el.scrollLeft+=e.deltaY*.78};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[]);
 useEffect(()=>{const el=ref.current;if(!el||!loop)return;let frame=0;const center=()=>{const segment=el.scrollWidth/3;if(segment>0)el.scrollLeft=segment};frame=requestAnimationFrame(center);const keepLoop=()=>{const segment=el.scrollWidth/3;if(!segment)return;if(el.scrollLeft<segment*.45)el.scrollLeft+=segment;else if(el.scrollLeft>segment*1.55)el.scrollLeft-=segment};el.addEventListener('scroll',keepLoop,{passive:true});return()=>{cancelAnimationFrame(frame);el.removeEventListener('scroll',keepLoop)}},[loop,children]);
 return <div ref={ref} className={`recordings-rail ${className}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>{children}</div>;
}

export default function RecordingsPage(){
 const router=useRouter();const[recordings,setRecordings]=useState<Recording[]>(defaults);const[active,setActive]=useState(1);const[editing,setEditing]=useState<Recording|null>(null);const fileRef=useRef<HTMLInputElement>(null);const pendingThumbnailId=useRef<string|null>(null);
 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const parsed=JSON.parse(raw);const list=Array.isArray(parsed)?parsed:Array.isArray(parsed?.recordings)?parsed.recordings:[];if(list.length)setRecordings(list.map((r:Partial<Recording>,i:number)=>normalizeRecording(r,i)))}}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(recordings));window.dispatchEvent(new Event('zyvo:recordings-updated'))}catch{}},[recordings]);
 const update=(next:Recording)=>{setRecordings(list=>list.map(item=>item.id===next.id?next:item));setEditing(null)};
 const remove=(id:string)=>{setRecordings(list=>list.filter(item=>item.id!==id));setActive(0)};
 const pickThumbnail=(id:string)=>{pendingThumbnailId.current=id;fileRef.current?.click()};
 const changeThumbnail=(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];const id=pendingThumbnailId.current;if(!file||!id)return;const reader=new FileReader();reader.onload=()=>setRecordings(list=>list.map(item=>item.id===id?{...item,thumbnail:String(reader.result)}:item));reader.readAsDataURL(file);e.target.value=''};
 const featured=recordings[active]??recordings[0];
 const shift=(dir:number)=>{if(!recordings.length)return;setActive(i=>(i+dir+recordings.length)%recordings.length)};
 const featuredItems=[...recordings,...recordings,...recordings];
 const rowOne=[...recordings,...recordings,...recordings];
 const reversed=[...recordings].reverse();
 const rowTwo=[...reversed,...reversed,...reversed];
 return <main className="recordings-page"><AppSidebar/><section className="content recordings-content"><AppTopbar floating={false}/><div className="recordings-stage">
  <input ref={fileRef} className="recordings-file-input" type="file" accept="image/*" onChange={changeThumbnail}/>
  {featured&&<section className="recordings-featured-wrap">
   <button className="recordings-arrow left" onClick={()=>shift(-1)} aria-label="Gravação anterior"><ChevronLeft/></button>
   <Rail className="recordings-featured-rail" loop>
    {featuredItems.map((item,index)=>{const originalIndex=index%recordings.length;const [line1,line2]=titleParts(item);return <article className={`recordings-featured-card ${originalIndex===active?'is-active':''}`} key={`featured-${index}-${item.id}`} style={{backgroundImage:`linear-gradient(180deg,rgba(4,8,12,.03),rgba(4,8,12,.72)),url(${item.thumbnail})`}} onClick={()=>setActive(originalIndex)}>
      <div className="featured-copy"><span>GRAVAÇÃO ZYVO</span><h1 style={{fontFamily:item.font,fontSize:`${item.fontSize}px`,fontWeight:item.titleWeight||650}}><span className="featured-title-line-one" style={{color:item.titleColor1||'#fff'}}>{line1}</span>{line2&&<span className="featured-title-line-two" style={{color:item.titleColor2||'#fff'}}>{line2}</span>}</h1><p>{item.phrase}</p><PerformanceStars value={item.performance}/></div>
      <div className="featured-actions"><button onClick={e=>{e.stopPropagation();router.push('/skills')}}><BarChart3/>Analisar</button><button className="watch" onClick={e=>e.stopPropagation()}><Play fill="currentColor"/>Assistir agora</button></div>
      <CardTools onEdit={()=>setEditing(item)} onThumb={()=>pickThumbnail(item.id)} onDelete={()=>remove(item.id)} onAnalyze={()=>router.push('/skills')}/>
    </article>})}
   </Rail>
   <button className="recordings-arrow right" onClick={()=>shift(1)} aria-label="Próxima gravação"><ChevronRight/></button>
  </section>}
  <Rail className="recordings-row-one" loop>{rowOne.map((item,index)=><SmallCard key={`a-${index}-${item.id}`} item={item} onOpen={()=>setActive(recordings.findIndex(r=>r.id===item.id))} onEdit={()=>setEditing(item)} onThumb={()=>pickThumbnail(item.id)} onDelete={()=>remove(item.id)} onAnalyze={()=>router.push('/skills')}/>)}</Rail>
  <Rail className="recordings-row-two" loop>{rowTwo.map((item,index)=><SmallCard key={`b-${index}-${item.id}`} item={item} onOpen={()=>setActive(recordings.findIndex(r=>r.id===item.id))} onEdit={()=>setEditing(item)} onThumb={()=>pickThumbnail(item.id)} onDelete={()=>remove(item.id)} onAnalyze={()=>router.push('/skills')}/>)}</Rail>
 </div></section>
 {editing&&<EditModal value={editing} onClose={()=>setEditing(null)} onSave={update} onThumb={()=>{pickThumbnail(editing.id);setEditing(null)}}/>}</main>;
}

function PerformanceStars({value,compact=false}:{value:number;compact?:boolean}){return <div className={`recordings-stars ${compact?'compact':''}`} aria-label={`Performance ${value} de 5`}>{[1,2,3,4,5].map(n=><Star key={n} className={n<=value?'filled':''}/>)}</div>}
function CardTools({onEdit,onThumb,onDelete,onAnalyze}:{onEdit:()=>void;onThumb:()=>void;onDelete:()=>void;onAnalyze:()=>void}){return <div className="recordings-tools"><button title="Assistir"><Play fill="currentColor"/></button><button title="Analisar" onClick={onAnalyze}><BarChart3/></button><button title="Editar gravação" onClick={onEdit}><Pencil/></button><button title="Alterar miniatura" onClick={onThumb}><ImagePlus/></button><button title="Excluir" onClick={onDelete}><Trash2/></button></div>}
function SmallCard({item,onOpen,onEdit,onThumb,onDelete,onAnalyze}:{item:Recording;onOpen:()=>void;onEdit:()=>void;onThumb:()=>void;onDelete:()=>void;onAnalyze:()=>void}){return <article className="recordings-small-card" style={{backgroundImage:`linear-gradient(180deg,rgba(5,8,12,.02),rgba(5,8,12,.56)),url(${item.thumbnail})`}} onDoubleClick={onOpen}><div className="small-meta"><strong style={{fontFamily:item.font}}>{item.title}</strong><PerformanceStars value={item.performance} compact/></div><CardTools onEdit={onEdit} onThumb={onThumb} onDelete={onDelete} onAnalyze={onAnalyze}/></article>}
function EditModal({value,onClose,onSave,onThumb}:{value:Recording;onClose:()=>void;onSave:(r:Recording)=>void;onThumb:()=>void}){const[line1,line2]=titleParts(value);const[draft,setDraft]=useState<Recording>({...value,titleLine1:line1,titleLine2:line2,titleColor1:value.titleColor1||'#ffffff',titleColor2:value.titleColor2||'#ffffff',titleWeight:value.titleWeight||650});const save=()=>onSave({...draft,title:[draft.titleLine1,draft.titleLine2].filter(Boolean).join(' ')});return <div className="recordings-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="recordings-modal"><button className="modal-close" onClick={onClose}><X/></button><span>EDITAR GRAVAÇÃO</span><h2>Personalize título e miniatura.</h2><div className="modal-grid"><label>Linha 1 do título<input value={draft.titleLine1||''} onChange={e=>setDraft({...draft,titleLine1:e.target.value})}/></label><label>Cor da linha 1<input type="color" value={draft.titleColor1||'#ffffff'} onChange={e=>setDraft({...draft,titleColor1:e.target.value})}/></label><label>Linha 2 do título<input value={draft.titleLine2||''} onChange={e=>setDraft({...draft,titleLine2:e.target.value})}/></label><label>Cor da linha 2<input type="color" value={draft.titleColor2||'#ffffff'} onChange={e=>setDraft({...draft,titleColor2:e.target.value})}/></label></div><label>Frase<textarea value={draft.phrase} onChange={e=>setDraft({...draft,phrase:e.target.value})}/></label><div className="modal-grid"><label>Fonte<select value={draft.font} onChange={e=>setDraft({...draft,font:e.target.value})}><option>SF Pro Display</option><option>Helvetica Neue</option><option>Arial</option><option>Georgia</option><option>Times New Roman</option></select></label><label>Peso<select value={draft.titleWeight||650} onChange={e=>setDraft({...draft,titleWeight:Number(e.target.value)})}><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra Bold</option></select></label><label>Tamanho do título<input type="range" min="28" max="76" value={draft.fontSize} onChange={e=>setDraft({...draft,fontSize:Number(e.target.value)})}/><b>{draft.fontSize}px</b></label><label>Performance<div className="modal-stars">{[1,2,3,4,5].map(n=><button key={n} className={n<=draft.performance?'active':''} onClick={()=>setDraft({...draft,performance:n})}><Star fill="currentColor"/></button>)}</div></label></div><div className="modal-actions"><button onClick={onThumb}><ImagePlus/>Alterar miniatura</button><button className="save" onClick={save}>Salvar alterações</button></div></section></div>}
