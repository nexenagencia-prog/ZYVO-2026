'use client';

import Link from 'next/link';
import { BarChart3,Bell,Calculator,CalendarDays,Camera,ChevronLeft,ChevronRight,CirclePlus,DoorOpen,Grid2X2,Hexagon,NotebookPen,Presentation,StickyNote,UserRound,Video } from 'lucide-react';
import { ChangeEvent,useEffect,useRef,useState } from 'react';
import './app-sidebar.css';

const PROFILE_AVATAR_KEY='zyvo-profile-avatar';
const items=[
 {label:'Início',href:'/',Icon:Grid2X2},{label:'Nova reunião',href:'/',Icon:CirclePlus},{label:'Agenda',href:'/agenda',Icon:CalendarDays},{label:'Skills',href:'/skills',Icon:BarChart3},{label:'Contatos',href:'/',Icon:UserRound},{label:'Notificações',href:'/',Icon:Bell},{label:'Gravações',href:'/',Icon:Video},{label:'Recursos',href:'/',Icon:Hexagon},{label:'Calculadora',href:'/',Icon:Calculator},{label:'Anotar',href:'/',Icon:NotebookPen},{label:'Anotações',href:'/anotacoes',Icon:StickyNote},{label:'Criar slides',href:'/',Icon:Presentation},{label:'Sair',href:'/',Icon:DoorOpen},
];
export default function AppSidebar(){
 const[expanded,setExpanded]=useState(false);const[avatar,setAvatar]=useState<string|null>(null);const fileRef=useRef<HTMLInputElement>(null);
 useEffect(()=>{try{setAvatar(window.localStorage.getItem(PROFILE_AVATAR_KEY))}catch{}},[]);
 const changeAvatar=(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const value=String(reader.result);setAvatar(value);try{window.localStorage.setItem(PROFILE_AVATAR_KEY,value)}catch{}};reader.readAsDataURL(file)};
 return <aside className={`app-sidebar ${expanded?'expanded':''}`} aria-label="Menu lateral"><button className="app-sidebar-avatar-button" onClick={()=>fileRef.current?.click()} aria-label="Alterar foto do perfil"><div className="app-sidebar-avatar" style={avatar?{backgroundImage:`url(${avatar})`}:undefined}>{!avatar&&'SB'}</div><span><Camera/></span></button><input ref={fileRef} className="app-sidebar-avatar-input" type="file" accept="image/*" onChange={changeAvatar}/><nav>{items.map(({label,href,Icon})=><Link key={label} href={href} title={label}><Icon/><span>{label}</span></Link>)}</nav><button className="app-sidebar-toggle" onClick={()=>setExpanded(v=>!v)} aria-label={expanded?'Recolher menu':'Expandir menu'}>{expanded?<ChevronLeft/>:<ChevronRight/>}</button></aside>;
}
