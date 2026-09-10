'use client';

import {useEffect} from 'react';

const slidePhotos=[
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=88',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=88'
];

export default function HeroSlidePhotoEnhancer(){
  useEffect(()=>{
    const apply=()=>{
      const card=document.querySelector<HTMLElement>('.hero-feature .feature-card');
      if(!card)return;
      const photo=card.querySelector<HTMLElement>('.feature-photo');
      const logo=card.querySelector<HTMLElement>('.feature-logo');
      const text=card.querySelector<HTMLElement>('.feature-text');
      const activeDash=Array.from(card.querySelectorAll('.slider-dashes i')).findIndex(item=>item.classList.contains('on'));
      const index=activeDash>=0?activeDash:0;
      const url=slidePhotos[index%slidePhotos.length];

      if(photo){
        if(!photo.style.backgroundImage)photo.style.backgroundImage=`url(${url})`;
        photo.style.backgroundSize='cover';
        photo.style.backgroundPosition='center';
      }

      if(logo){
        logo.textContent='';
        logo.style.backgroundImage=`linear-gradient(180deg,rgba(5,12,20,.04),rgba(5,12,20,.16)),url(${url})`;
        logo.style.backgroundSize='cover';
        logo.style.backgroundPosition='center';
        logo.style.color='transparent';
      }

      if(text)text.style.position='relative';
    };

    apply();
    const observer=new MutationObserver(apply);
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    return()=>observer.disconnect();
  },[]);

  return null;
}
