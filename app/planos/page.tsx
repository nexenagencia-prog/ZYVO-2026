'use client';

import { Crown, Sparkles, UsersRound, Check } from 'lucide-react';
import { useState } from 'react';
import AppTopbar from '../AppTopbar';
import '../app-topbar.css';
import './pricing.css';

const plans = [
  {key:'free',name:'Grátis',monthly:0,description:'Para começar e testar a experiência ZYVO.',features:['Reuniões essenciais','Até 40 min por reunião','Chat e anotações','Filtros básicos'],cta:'Usar Grátis',note:'Sem compromisso. Cancele quando quiser.',Icon:Sparkles},
  {key:'pro',name:'Pro',monthly:69.9,description:'Para profissionais que fazem reuniões todos os dias.',features:['Reuniões de até 30 horas','Até 100 participantes','Gravações e biblioteca','Todos os filtros ZYVO','Ferramentas flutuantes'],cta:'Selecionado',note:'Plano salvo como sua preferência.',Icon:Crown,featured:true},
  {key:'business',name:'Business',monthly:109.9,description:'Para equipes que precisam de mais capacidade e gestão.',features:['Tudo do Pro','Até 300 participantes','Controles avançados do anfitrião','Espaço ampliado para gravações','Recursos de equipe'],cta:'Escolher Business',note:'Mais gestão, mais controle, mais resultados.',Icon:UsersRound},
];
const money=(value:number)=>value.toLocaleString('pt-BR',{minimumFractionDigits:value===0?0:2,maximumFractionDigits:2});
export default function PlanosPage(){const[billing,setBilling]=useState<'monthly'|'annual'>('monthly');return <><AppTopbar/><main className="pricing-page"><section className="pricing-shell"><div className="pricing-kicker">PLANOS E PREÇOS</div><h1>Escolha o nível <span>ideal para você</span></h1><p className="pricing-subtitle">Planos para começar, evoluir e escalar suas reuniões com a ZYVO.</p><div className="billing-toggle" role="group" aria-label="Período de cobrança"><button className={billing==='monthly'?'active':''} onClick={()=>setBilling('monthly')}>Mensal</button><button className={billing==='annual'?'active':''} onClick={()=>setBilling('annual')}>Anual <span>-20%</span></button></div><div className="pricing-grid">{plans.map(({key,name,monthly,description,features,cta,note,Icon,featured})=>{const value=billing==='annual'?monthly*.8:monthly;return <article key={key} className={`price-card ${featured?'featured':''}`}><div className="price-card-top"><div className="plan-icon"><Icon/></div>{featured&&<span className="choice-badge">MAIS ESCOLHIDO</span>}</div><h2>{name}</h2><div className="plan-price"><span>R$</span> {money(value)}{monthly>0&&<small>/mês</small>}</div><p className="plan-description">{description}</p><div className="plan-divider"/><ul>{features.map(feature=><li key={feature}><span className="check"><Check/></span>{feature}</li>)}</ul><button className="plan-cta">{cta}</button><p className="plan-note">{note}</p></article>})}</div></section></main></>}
