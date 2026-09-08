import { validatePercentage, validateRequiredText } from './validation.mjs';

export function validateHomePayload(input){
  if(!input || typeof input !== 'object') throw new Error('Conteúdo inválido.');
  const hero=input.hero ?? {};
  const nextMeeting=input.nextMeeting ?? {};
  const profile=input.profile ?? {};
  const navigation=input.navigation ?? {};
  const cards=Array.isArray(input.cards)?input.cards:[];
  const carousel=Array.isArray(input.carousel)?input.carousel:[];
  const interval=Number(input.carouselIntervalMs);
  if(!Number.isFinite(interval) || interval < 1000 || interval > 60000) throw new Error('Intervalo do carrossel inválido.');

  return {
    hero:{
      eyebrow:validateRequiredText(hero.eyebrow,'Eyebrow'),
      title:validateRequiredText(hero.title,'Título da hero'),
      ratingText:validateRequiredText(hero.ratingText,'Texto de performance'),
      performancePercent:validatePercentage(hero.performancePercent),
      performanceLabel:validateRequiredText(hero.performanceLabel,'Label de performance'),
      primaryButton:validateRequiredText(hero.primaryButton,'Botão principal'),
      secondaryButton:validateRequiredText(hero.secondaryButton,'Botão secundário'),
      imageUrl:typeof hero.imageUrl==='string'?hero.imageUrl:''
    },
    nextMeeting:{label:validateRequiredText(nextMeeting.label,'Próxima reunião'),dateTime:validateRequiredText(nextMeeting.dateTime,'Data da próxima reunião')},
    profile:{name:validateRequiredText(profile.name,'Nome do perfil'),avatarUrl:typeof profile.avatarUrl==='string'?profile.avatarUrl:'',planLabel:validateRequiredText(profile.planLabel,'Plano')},
    navigation:{
      searchPlaceholder:validateRequiredText(navigation.searchPlaceholder,'Busca'),
      top:Array.isArray(navigation.top)?navigation.top.map(v=>validateRequiredText(v,'Navegação')):[],
      sidebar:Array.isArray(navigation.sidebar)?navigation.sidebar.map(v=>validateRequiredText(v,'Menu lateral')):[]
    },
    carouselIntervalMs:Math.round(interval),
    carousel:carousel.map((item,index)=>({id:typeof item.id==='string'?item.id:undefined,title:validateRequiredText(item.title,'Título do carrossel'),subtitle:validateRequiredText(item.subtitle,'Subtítulo do carrossel'),imageUrl:typeof item.imageUrl==='string'?item.imageUrl:'',sortOrder:Number.isFinite(Number(item.sortOrder))?Number(item.sortOrder):index,isActive:item.isActive!==false})),
    cards:cards.map((card,index)=>({id:typeof card.id==='string'?card.id:undefined,slug:validateRequiredText(card.slug,'Slug do card'),title:validateRequiredText(card.title,'Título do card'),description:validateRequiredText(card.description,'Descrição do card'),percentage:validatePercentage(card.percentage),imageUrl:typeof card.imageUrl==='string'?card.imageUrl:'',ctaLabel:validateRequiredText(card.ctaLabel,'CTA do card'),sortOrder:Number.isFinite(Number(card.sortOrder))?Number(card.sortOrder):index,isActive:card.isActive!==false}))
  };
}
