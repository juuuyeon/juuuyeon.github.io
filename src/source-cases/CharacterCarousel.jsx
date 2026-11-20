import React,{useEffect,useRef,useState} from 'react';
import {Media} from './primitives';
import {useVisibleMotion} from './motion-hooks';
const COPY=['내 차 견적, 간편하게 받고 합리적으로 비교하세요','회원가입 없이 100% 무료','평균 28분 안에 직접 연락드려요','검증된 전문 업체 무료로 매칭'];
const CAPTIONS=['신차패키지 · 래핑 · 튜닝 · 틴팅 · 수리·정비 · 판금·도색','무료 견적','빠른 응답','검증 업체 매칭'];
export default function CharacterCarousel({image}){
 const root=useRef(null),viewport=useRef(null),timer=useRef(null);
 const {active,reduced}=useVisibleMotion(root);
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false),[focus,setFocus]=useState(false);
 const go=i=>{
  const next=(i+COPY.length)%COPY.length,el=viewport.current,card=el.children[next];
  el.scrollTo({left:card.offsetLeft-el.children[0].offsetLeft,behavior:reduced?'instant':'smooth'});setIndex(next);
 };
 useEffect(()=>{
  if(!active||paused||hover||focus)return;
  const id=setInterval(()=>go(index+1),3200);return()=>clearInterval(id);
 },[active,paused,hover,focus,index,reduced]);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const scrolled=()=>{
  clearTimeout(timer.current);timer.current=setTimeout(()=>{
   const el=viewport.current;const width=el.children[1].offsetLeft-el.children[0].offsetLeft;
   setIndex(Math.min(3,Math.round(el.scrollLeft/width)));
  },150);
 };
 return <div ref={root} className="character-carousel" role="region" aria-roledescription="carousel" aria-label="차타 이사님 캠페인 콘텐츠" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocus(false);}}>
  <div ref={viewport} className="character-feed" onScroll={scrolled} tabIndex={0} aria-label="캠페인 카드, 좌우 방향키로 이동" onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1));}}}>
   {COPY.map((copy,i)=><article key={copy} aria-label={`${i+1} / 4`}><span>chaisa.official</span><h3>{copy}</h3><Media item={image}/><p>{CAPTIONS[i]}</p><small>차량 견적 비교 플랫폼</small></article>)}
  </div><div className="carousel-controls"><button aria-label="이전 캠페인" onClick={()=>go(index-1)}>←</button><span aria-live={paused||focus?'polite':'off'}>{String(index+1).padStart(2,'0')} / 04</span><button aria-label="다음 캠페인" onClick={()=>go(index+1)}>→</button><button aria-pressed={paused} disabled={reduced} onClick={()=>setPaused(!paused)}>{paused||reduced?'자동 넘김 재생':'자동 넘김 일시정지'}</button></div>
 </div>;
}
