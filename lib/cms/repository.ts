import { createClient } from '@supabase/supabase-js';
import { DEFAULT_HOME_CONTENT } from './defaults';
import type { HomeContent } from './types';

function cloneDefaults(): HomeContent {
  return JSON.parse(JSON.stringify(DEFAULT_HOME_CONTENT)) as HomeContent;
}

function publicClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) throw new Error('Supabase não configurado.');
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}

export async function loadHomeContent(): Promise<HomeContent> {
  const content=cloneDefaults();
  try{
    const supabase=publicClient();
    const [siteResult, carouselResult, cardResult]=await Promise.all([
      supabase.from('site_content').select('section,key,value'),
      supabase.from('carousel_items').select('id,title,subtitle,image_url,sort_order,is_active').order('sort_order'),
      supabase.from('home_cards').select('id,slug,title,description,percentage,image_url,cta_label,sort_order,is_active').order('sort_order')
    ]);
    if(siteResult.error||carouselResult.error||cardResult.error) throw new Error('Falha de leitura do CMS.');

    for(const row of siteResult.data ?? []){
      const section=row.section as keyof HomeContent | 'settings';
      if(section==='settings' && row.key==='carouselIntervalMs') content.carouselIntervalMs=Number(row.value)||4000;
      else if(section==='hero' && row.key in content.hero) (content.hero as unknown as Record<string,unknown>)[row.key]=row.value;
      else if(section==='nextMeeting' && row.key in content.nextMeeting) (content.nextMeeting as unknown as Record<string,unknown>)[row.key]=row.value;
      else if(section==='profile' && row.key in content.profile) (content.profile as unknown as Record<string,unknown>)[row.key]=row.value;
      else if(section==='navigation' && row.key in content.navigation) (content.navigation as unknown as Record<string,unknown>)[row.key]=row.value;
    }

    if((carouselResult.data?.length ?? 0)>0){
      content.carousel=(carouselResult.data ?? []).map(row=>({id:row.id,title:row.title,subtitle:row.subtitle,imageUrl:row.image_url,sortOrder:row.sort_order,isActive:row.is_active}));
    }
    if((cardResult.data?.length ?? 0)>0){
      content.cards=(cardResult.data ?? []).map(row=>({id:row.id,slug:row.slug,title:row.title,description:row.description,percentage:row.percentage,imageUrl:row.image_url,ctaLabel:row.cta_label,sortOrder:row.sort_order,isActive:row.is_active}));
    }
    return content;
  }catch{
    return content;
  }
}
