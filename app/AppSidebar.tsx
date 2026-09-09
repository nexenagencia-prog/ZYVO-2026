'use client';

import Link from 'next/link';
import { BarChart3, Bell, Calculator, CalendarDays, ChevronLeft, ChevronRight, CirclePlus, DoorOpen, Grid2X2, Hexagon, NotebookPen, Presentation, StickyNote, UserRound, Video } from 'lucide-react';
import { useState } from 'react';
import './app-sidebar.css';

const items=[
 {label:'Início',href:'/',Icon:Grid2X2},
 {label:'Nova reunião',href:'/',Icon:CirclePlus},
 {label:'Agenda',href:'/agenda',Icon:CalendarDays},
 {label:'Skills',href:'/skills',Icon:BarChart3},
 {label:'Contatos',href:'/',Icon:UserRound},
 {label:'Notificações',href:'/',Icon:Bell},
 {label:'Gravações',href:'/',Icon:Video},
 {label:'Recursos',href:'/',Icon:Hexagon},
 {label:'Calculadora',href:'/',Icon:Calculator},
 {label:'Anotar',href:'/',Icon:NotebookPen},
 {label:'Anotações',href:'/anotacoes',Icon:StickyNote},
 {label:'Criar slides',href:'/',Icon:Presentation},
 {label:'Sair',href:'/',Icon:DoorOpen},
];
export default function AppSidebar(){
 const[expanded,setExpanded]=useState(false);
 return <aside className={`app-sidebar ${expanded?'expanded':''}`} aria-label="Menu lateral"><div className="app-sidebar-avatar">SB</div><nav>{items.map(({label,href,Icon})=><Link key={label} href={href} title={label}><Icon/><span>{label}</span></Link>)}</nav><button className="app-sidebar-toggle" onClick={()=>setExpanded(v=>!v)} aria-label={expanded?'Recolher menu':'Expandir menu'}>{expanded?<ChevronLeft/>:<ChevronRight/>}</button></aside>;
}
