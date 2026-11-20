import React,{useEffect,useRef,useState} from 'react';
import {Media} from './primitives';
import {useVisibleMotion} from './motion-hooks';

// Original 0.7s hold → 1.3s wipe → 1.5s hold → 0.6s crossfade.
export default function BeforeAfter({pairs}){
 const ref=useRef(null),{active,reduced}=useVisibleMotion(ref);
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[value,setValue]=useState(100);
 useEffect(()=>{
  if(!active||paused)return;
  const after=ref.current.querySelectorAll('.comparison-after')[index];
  const wipe=after.animate([{clipPath:'inset(0 100% 0 0)',offset:0},{clipPath:'inset(0 100% 0 0)',offset:.17},{clipPath:'inset(0 0% 0 0)',offset:.49},{clipPath:'inset(0 0% 0 0)',offset:1}],{duration:4100,easing:'ease-in-out'});
  const timer=setTimeout(()=>setIndex(i=>(i+1)%pairs.length),4100);
  return()=>{clearTimeout(timer);wipe.cancel();};
 },[active,paused,index,pairs.length]);
 const toggle=()=>{if(!paused){const n=ref.current.querySelectorAll('.comparison-after')[index];const right=parseFloat(getComputedStyle(n).clipPath.replace('inset(','').split(' ')[1]);setValue(Number.isFinite(right)?100-right:100);}setPaused(!paused);};
 const choose=i=>{setIndex(i);setValue(100);};
 return <div ref={ref} className="comparison" aria-label="차량 시공 전후 비교">
  <div className="comparison-stage">{pairs.map((p,i)=><div className="comparison-pair" key={p.label} aria-hidden={i!==index} data-current={i===index}><Media item={p.before}/><img className="comparison-after" src={p.after.src} alt={p.after.alt} style={{clipPath:`inset(0 ${100-value}% 0 0)`}}/></div>)}</div>
  <div className="comparison-controls"><div>{pairs.map((p,i)=><button key={p.label} aria-pressed={i===index} onClick={()=>choose(i)}>{p.label}</button>)}</div><button onClick={toggle} aria-pressed={paused} disabled={reduced}>{paused||reduced?'자동 전환 재생':'자동 전환 일시정지'}</button></div>
  <label className="comparison-slider">BEFORE <input type="range" aria-label="시공 전후 비교 비율" min="0" max="100" value={value} onChange={e=>{setPaused(true);setValue(Number(e.target.value));}}/> AFTER</label>
 </div>;
}
