'use client';
import './refine.css';
import { ArrowLeft, ArrowRight, BarChart3, Bell, CalendarDays, Camera, ChevronRight, CirclePlus, DoorOpen, Grid2X2, Hexagon, Lightbulb, Menu, Pencil, Play, Search, Star, UserRound, Video, X } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';

const navItems=[
  {icon:Grid2X2,label:'Início'},
  {icon:CirclePlus,label:'Criar reunião'},
  {icon:CalendarDays,label:'Agenda'},
  {icon:BarChart3,label:'Skills'},
  {icon:UserRound,label:'Contatos'},
  {icon:Bell,label:'Notificações'},
  {icon:Video,label:'Gravações'},
  {icon:Hexagon,label:'Configurações'},
  {icon:DoorOpen,label:'Sair'}
];

export default function Home(){
  const[expanded,setExpanded]=useState(false);
  const[name,setName]=useState('Sandro Bello');
  const[editingName,setEditingName]=useState(false);
  const[avatar,setAvatar]=useState<string|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const changeAvatar=(event:ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  return <main className="app-shell light-shell">
    <div className="bg-sheen sheen-a"/><div className="bg-sheen sheen-b"/><div className="bg-line line-a"/><div className="bg-line line-b"/>
    <aside className={`sidebar ${expanded?'expanded':''}`}>
      <div className="avatar-wrap">
        <button className="avatar-button" onClick={()=>fileRef.current?.click()} aria-label="Alterar foto do perfil">
          <div className="avatar" style={avatar?{backgroundImage:`url(${avatar})`}:undefined}>{!avatar&&'SB'}</div>
          <span className="avatar-camera"><Camera size={11}/></span>
        </button>
        <input ref={fileRef} className="avatar-input" type="file" accept="image/*" onChange={changeAvatar}/>
        {expanded&&<div className="avatar-meta">
          {editingName?<input className="name-input" value={name} autoFocus onChange={e=>setName(e.target.value)} onBlur={()=>setEditingName(false)} onKeyDown={e=>e.key==='Enter'&&setEditingName(false)}/>:<button className="name-edit" onClick={()=>setEditingName(true)}><strong>{name}</strong><Pencil size={12}/></button>}
          <span>ZYVO Pro</span>
        </div>}
      </div>
      <div className="side-nav">{navItems.map(({icon:Icon,label},i)=><button className={`side-item ${i===0?'active':''}`} key={label}><Icon size={21} strokeWidth={1.7}/><span>{label}</span></button>)}</div>
      <button className="sidebar-toggle" onClick={()=>setExpanded(v=>!v)}>{expanded?<X size={18}/>:<Menu size={18}/>}<span>{expanded?'Encolher':'Menu'}</span></button>
    </aside>

    <section className={`content ${expanded?'shifted':''}`}>
      <header className="topbar">
        <div className="search-box"><Search size={28} strokeWidth={1.8}/><span>Buscar reunião, pessoa ou gravação...</span><kbd>⌘ K</kbd></div>
        <nav className="topnav"><a className="current" href="#">Início</a><a href="#skills">Skills</a><a href="#agenda">Agenda</a><a href="#planos">Planos e Preços</a></nav>
        <div className="next-meeting"><span>Seu próximo encontro</span><strong>14:00 — 30 Set 2026</strong></div>
        <button className="menu-top" onClick={()=>setExpanded(v=>!v)}><Menu size={17}/><span>MENU</span></button>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">| Videoconferência de alta performance</div>
          <h1>Reuniões com<br/>performance<br/>de verdade.</h1>
          <div className="rating-line"><div className="stars">{[0,1,2,3,4].map(n=><Star key={n} size={19} fill="currentColor" strokeWidth={1.3}/>)}</div><div><span>Mais performance em reuniões.</span><small>+10.000 usuários</small></div></div>
          <div className="hero-actions"><button className="primary-btn">Criar reunião <span><ChevronRight size={19}/></span></button><button className="secondary-btn">Ver recursos</button></div>
        </div>
        <div className="hero-feature">
          <div className="feature-card"><div className="feature-logo">Z</div><div className="feature-text">Mais do<br/>que reuniões.<br/>Evolução.</div><div className="feature-dot"/><div className="slider-dashes"><i/><i/></div><div className="feature-arrows"><button><ArrowLeft size={18}/></button><button><ArrowRight size={18}/></button></div></div>
        </div>
      </section>

      <section className="cards-grid">
        <article className="info-card skills-card" id="skills"><div className="card-wave wave-a"/><div className="card-dot"/><BarChart3 className="card-icon" size={36} strokeWidth={2}/><h2>Skills</h2><p>Analise suas reuniões, receba<br/>feedback e evolua com IA.</p><div className="card-bottom"><span>Explorar</span><button><ArrowRight size={18}/></button></div></article>
        <article className="info-card recordings-card"><div className="card-dot"/><Play className="card-icon circled" size={37} strokeWidth={1.8}/><h2>Gravações</h2><p>Reviva conversas, identifique<br/>pontos-chave e gere insights.</p><div className="phone-art"><div className="phone-lens one"/><div className="phone-lens two"/><div className="phone-lens three"/><div className="apple-mark">●</div></div><div className="card-bottom"><span>Explorar</span><button><ArrowRight size={18}/></button></div></article>
        <article className="info-card insights-card"><div className="card-wave wave-b"/><div className="card-dot"/><Lightbulb className="card-icon" size={36} strokeWidth={2}/><h2>Insights</h2><p>Transforme conversas em<br/>decisões mais inteligentes.</p><div className="card-bottom"><span>Explorar</span><button><ArrowRight size={18}/></button></div></article>
      </section>
    </section>
  </main>
}
