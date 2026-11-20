import {useEffect,useRef,useState} from 'react';

// One visibility policy for CSS, video and JS loops. No work in background tabs.
export function useVisibleMotion(ref){
 const [state,setState]=useState({active:false,reduced:false});
 useEffect(()=>{
  const el=ref.current;if(!el)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let visible=false;
  const sync=()=>setState({active:visible&&!document.hidden&&!media.matches,reduced:media.matches});
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();});
  io.observe(el);media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
  return()=>{io.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
 },[ref]);
 return state;
}

export function useCaseMotion(lang){
 const ref=useRef(null);
 useEffect(()=>{
  const root=ref.current;if(!root)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let dispose=()=>{};
  const setup=()=>{
   dispose();if(media.matches)return;
   const animations=new Set();const visible=new Set();let raf=0;
   const play=(node,frames,options)=>{
    const a=node.animate(frames,{duration:900,easing:'cubic-bezier(.22,1,.36,1)',...options});
    animations.add(a);a.onfinish=()=>animations.delete(a);
   };
   const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(!e.isIntersecting)return;const n=e.target;reveal.unobserve(n);
    const index=Array.from(n.parentElement.children).indexOf(n);
    const wipe=n.parentElement.classList.contains('source-palette');
    if(n.matches('#chaisa_moodboard_1 img')){play(n,[{filter:'brightness(.86)',transform:'scale(1.025)'},{filter:'brightness(1)',transform:'scale(1)'}],{duration:850});return;}
    if(n.matches('.character-bubble')){play(n,[{opacity:0,transform:'translateY(10px) scale(.88)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:420});return;}
    play(n,wipe?[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}]:[{opacity:0,transform:`translateY(${n.matches('img')?48:28}px)`},{opacity:1,transform:'translateY(0)'}],{delay:Math.min(index,4)*65,duration:wipe?620:900});
   }),{threshold:.08});
   root.querySelectorAll('.source-intro,.source-grid>div,.source-palette>div,.source-images:not(.mobile-parallax)>figure,.chaisa-ui-step>div,.chaisa-ui-step>img,.source-spine,.character-hero,.character-bubble,#chaisa_moodboard_1 img,.source-logo').forEach(n=>reveal.observe(n));
   const mobiles=[...root.querySelectorAll('.mobile-parallax>figure')];
   const hero=root.querySelector('.motion-hero');
   const update=()=>{
    raf=0;if(document.hidden)return;
    if(hero&&visible.has(hero)){
     const r=hero.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/r.height));
     hero.style.setProperty('--scroll-y',`${p*9}%`);hero.style.setProperty('--scroll-scale',`${1+p*(hero.classList.contains('refine-motion-hero')?.14:.035)}`);hero.style.setProperty('--scrim',`${p}`);
    }
    if(mobiles.length&&visible.has(mobiles[0].parentElement)){
     const r=mobiles[0].parentElement.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
     mobiles.forEach((n,i)=>n.style.translate=`0 ${[-46,30,-64,18][i%4]*p}px`);
    }
   };
   const kick=()=>{if(!raf)raf=requestAnimationFrame(update);};
   const visibility=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));kick();});
   if(hero)visibility.observe(hero);if(mobiles.length)visibility.observe(mobiles[0].parentElement);
   window.addEventListener('scroll',kick,{passive:true});window.addEventListener('resize',kick);document.addEventListener('visibilitychange',kick);
   dispose=()=>{reveal.disconnect();visibility.disconnect();animations.forEach(a=>a.cancel());cancelAnimationFrame(raf);window.removeEventListener('scroll',kick);window.removeEventListener('resize',kick);document.removeEventListener('visibilitychange',kick);mobiles.forEach(n=>n.style.removeProperty('translate'));if(hero){['--scroll-y','--scroll-scale','--scrim'].forEach(k=>hero.style.removeProperty(k));}};
  };
  setup();media.addEventListener('change',setup);return()=>{dispose();media.removeEventListener('change',setup);};
 },[lang]);
 return ref;
}
