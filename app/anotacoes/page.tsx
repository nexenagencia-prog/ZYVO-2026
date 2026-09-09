'use client';

import { ArrowRight, FileText, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppTopbar from '../AppTopbar';
import { createBrowserSupabaseClient } from '../../lib/supabase/client';
import '../app-topbar.css';
import './notes-page.css';

type Note={id:string;subject:string;body:string;created_at:string;updated_at:string;demo?:boolean};
const demos:Note[]=[
{id:'demo-q4',subject:'Planejamento Q4',body:'Definir estratégias de crescimento, revisar metas do time, alinhar campanhas de marketing e analisar resultados do Q3. Foco em performance e expansão de mercado.',created_at:'2026-09-08T10:24:00-03:00',updated_at:'2026-09-08T10:24:00-03:00',demo:true},
{id:'demo-comercial',subject:'Reunião Comercial',body:'Revisar oportunidades em aberto, próximos contatos e propostas prioritárias. Organizar os pontos de negociação para acelerar decisões.',created_at:'2026-09-08T14:10:00-03:00',updated_at:'2026-09-08T14:10:00-03:00',demo:true},
{id:'demo-marketing',subject:'Estratégia de Marketing',body:'Mapear campanhas do mês, conteúdos de maior impacto e novas oportunidades de aquisição. Priorizar ações com melhor retorno e clareza de mensagem.',created_at:'2026-09-09T09:15:00-03:00',updated_at:'2026-09-09T09:15:00-03:00',demo:true},
];
const fmt=(date:string)=>new Date(date).toLocaleString('pt-BR',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',',' •');
export default function AnotacoesPage(){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);const[notes,setNotes]=useState<Note[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{let alive=true;(async()=>{const{data:{user}}=await supabase.auth.getUser();if(!user){if(alive)setLoading(false);return}const{data}=await supabase.from('notes').select('id,subject,body,created_at,updated_at').order('updated_at',{ascending:false});if(alive){setNotes((data||[]) as Note[]);setLoading(false)}})();return()=>{alive=false}},[supabase]);
 const cards=[...notes,...demos];
 return <><AppTopbar/><main className="notes-page"><section className="notes-shell"><div className="notes-heading"><div><span>ANOTAÇÕES</span><h1>Suas ideias, <em>sempre à mão.</em></h1><p>Registros de reuniões, decisões e próximos passos em um só lugar.</p></div><div className="notes-count">{loading?'…':cards.length}<small>anotações</small></div></div><div className="notes-grid">{cards.map((note,index)=><article className="saved-note-card" key={note.id}><div className="saved-note-top"><div className="saved-note-icon"><FileText/></div><div className="saved-note-actions"><button aria-label="Editar"><Pencil/></button><button aria-label="Excluir" disabled={note.demo}><Trash2/></button></div></div><span className="saved-note-label">Anotação</span><h2>{note.subject}</h2><time>{fmt(note.updated_at)}</time><p>{note.body}</p><div className="saved-note-bottom"><button>Ver anotação <ArrowRight/></button><div className={`note-bars bars-${index%3}`}><i/><i/><i/><i/></div></div></article>)}</div></section></main></>;
}
