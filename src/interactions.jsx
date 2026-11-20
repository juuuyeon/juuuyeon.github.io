import React,{useEffect,useRef} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
export function CursorGlow(){
 const ref=useRef(null);
 useEffect(()=>{
  const node=ref.current;
  const precisePointer=matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!node||!precisePointer.matches||reducedMotion.matches)return;
  let frame=0,currentX=innerWidth/2,currentY=innerHeight/2,targetX=currentX,targetY=currentY;
  const render=()=>{currentX+=(targetX-currentX)*.16;currentY+=(targetY-currentY)*.16;node.style.transform=`translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;frame=requestAnimationFrame(render);};
  const move=e=>{targetX=e.clientX;targetY=e.clientY;node.dataset.visible='true';};
  const hide=()=>{node.dataset.visible='false';};
  const over=e=>{node.dataset.interactive=e.target.closest('a,button,input,[tabindex]')?'true':'false';};
  addEventListener('pointermove',move,{passive:true});
  addEventListener('pointerover',over,{passive:true});
  document.documentElement.addEventListener('mouseleave',hide);
  frame=requestAnimationFrame(render);
  return()=>{cancelAnimationFrame(frame);removeEventListener('pointermove',move);removeEventListener('pointerover',over);document.documentElement.removeEventListener('mouseleave',hide);};
 },[]);
 return <div ref={ref} className="cursor-glow" aria-hidden="true"/>;
}
export function useScroll(blocked){
 const instance=useRef(null);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');function setup(){instance.current?.destroy();instance.current=m.matches?null:new Lenis({autoRaf:true,anchors:{offset:-80},duration:1.1,prevent:n=>!!n.closest('dialog,[data-lenis-prevent]')});}setup();m.addEventListener('change',setup);return()=>{instance.current?.destroy();m.removeEventListener('change',setup);};},[]);
 useEffect(()=>{
  if(!window.location.hash)return;
  let id;try{id=decodeURIComponent(window.location.hash.slice(1));}catch{return;}
  let frame=0,done=false;
  const observer=new MutationObserver(findTarget);
  const timeout=setTimeout(()=>observer.disconnect(),10000);
  function findTarget(){
   const target=document.getElementById(id);
   if(!target||done)return;
   done=true;observer.disconnect();clearTimeout(timeout);
   frame=requestAnimationFrame(()=>{
    if(instance.current)instance.current.scrollTo(target,{offset:-80,immediate:true,force:true});
    else window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-80),behavior:'instant'});
   });
  }
  observer.observe(document.body,{childList:true,subtree:true});findTarget();
  return()=>{observer.disconnect();clearTimeout(timeout);cancelAnimationFrame(frame);};
 },[]);
 useEffect(()=>{blocked?instance.current?.stop():instance.current?.start();},[blocked]);
}
export function Reveal({as:Tag='div',children,className='',delay=0,...props}){
 const ref=useRef(null);
 useEffect(()=>{const n=ref.current;const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){n.classList.add('revealed');observer.unobserve(n);}},{threshold:.08});observer.observe(n);return()=>observer.disconnect();},[]);
 return <Tag ref={ref} className={`reveal ${className}`} style={{'--delay':`${delay}ms`}} {...props}>{children}</Tag>;
}
export function Rolling({children}){return <span className="rolling" aria-hidden="true">{[...children].map((c,i)=><span className="letter" style={{'--i':i}} key={i}><span>{c===' '?'\u00a0':c}</span><span>{c===' '?'\u00a0':c}</span></span>)}</span>;}
export function RollLink({children,...props}){return <a className="roll-link" aria-label={children} {...props}><Rolling>{children}</Rolling></a>;}
export function Menu({open,onClose}){
 const ref=useRef(null);
 useEffect(()=>{if(!open)return;const previous=document.activeElement;const first=ref.current.querySelector('a');const focusTimer=setTimeout(()=>{if(!ref.current.contains(document.activeElement))first.focus();},420);const key=e=>{if(e.key==='Escape')onClose();if(e.key!=='Tab')return;const nodes=[...ref.current.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}};document.addEventListener('keydown',key);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{clearTimeout(focusTimer);document.removeEventListener('keydown',key);document.body.style.overflow=old;previous?.focus();};},[open]);
 return <div ref={ref} className={`full-menu ${open?'is-open':''}`} role="dialog" aria-modal={open?'true':undefined} aria-label="전체 메뉴" inert={!open}>
 <nav>{[['HOME','/#top','Go home'],['PROJECTS','/projects','View projects'],['ABOUT','/#about','Meet Juyeon'],['ARCHIVE','/#archive','Explore archive']].map(([label,href,hint])=><a href={href} onClick={onClose} key={label}><span className="menu-label">{label}</span><span className="menu-marquee" aria-hidden="true"><span>{Array(12).fill(`[ ${hint.toUpperCase()} ]`).join('　　')}</span></span></a>)}</nav>
 <div className="menu-bottom"><span>박주연 · Designer</span><a href="/editions/portfolio-20261106.pdf" target="_blank" rel="noreferrer">PORTFOLIO PDF ↗</a><button onClick={onClose}>메뉴 닫기</button></div></div>;
}
