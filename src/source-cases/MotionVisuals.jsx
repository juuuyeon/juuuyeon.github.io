import React,{useEffect,useRef,useState} from 'react';
import {Media} from './primitives';
import {useVisibleMotion} from './motion-hooks';

export function MotionHero({item,title,kind}){
 const ref=useRef(null),{active,reduced}=useVisibleMotion(ref);
 const move=e=>{
  if(!active||e.pointerType==='touch'||kind!=='refine')return;
  const r=e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--pointer-x',`${((e.clientX-r.left)/r.width-.5)*-30}px`);
  e.currentTarget.style.setProperty('--pointer-y',`${((e.clientY-r.top)/r.height-.5)*-20}px`);
 };
 const reset=()=>{ref.current?.style.setProperty('--pointer-x','0px');ref.current?.style.setProperty('--pointer-y','0px');};
 useEffect(()=>{if(!active)reset();},[active]);
 return <div ref={ref} className={`motion-hero ${kind}-motion-hero`} data-motion-active={active} onPointerMove={move} onPointerLeave={reset}>
  <h1 className="sr-only">{title}</h1><div className="hero-camera"><div className="hero-curtain"><Media item={item} eager/></div></div><span className="hero-scrim" aria-hidden="true"/>{kind==='chaisa'&&!reduced&&<span className="hero-sweep" aria-hidden="true"/>}
 </div>;
}

export function ColorPromise({item}){
 const [color,setColor]=useState(false);
 return <button className="color-promise" aria-label="브랜드 이미지 컬러 전환" aria-pressed={color} onClick={()=>setColor(!color)}><Media item={item}/><span className="promise-tint" aria-hidden="true"/><span className="promise-hint">hover · tap → color</span></button>;
}

export function ClosingVisual({item,colors}){
 const ref=useRef(null),{active,reduced}=useVisibleMotion(ref),done=useRef(false);
 useEffect(()=>{
  if(!active||done.current)return;done.current=true;
  const animations=[...ref.current.querySelectorAll('.closing-panel')].map((n,i)=>n.animate([{transform:'scaleX(1)',opacity:1},{transform:'scaleX(0)',opacity:1}],{duration:680,delay:i*130,easing:'cubic-bezier(.65,0,.18,1)',fill:'backwards'}));
  const sweep=ref.current.querySelector('.closing-sweep');animations.push(sweep.animate([{transform:'translateX(-170%)',opacity:0},{opacity:.68,offset:.3},{transform:'translateX(470%)',opacity:0}],{duration:1000,delay:700}));
  return()=>animations.forEach(a=>a.cancel());
 },[active]);
 return <div ref={ref} className="closing-motion"><Media item={item}/>{!reduced&&<div className="closing-panels" aria-hidden="true">{colors.map((c,i)=><span className="closing-panel" key={i} style={{background:c.swatch}}/>)}</div>}<span className="closing-sweep" aria-hidden="true"/></div>;
}
