import YeosuPanels1 from "./YeosuPanels1";
import YeosuPanels2 from "./YeosuPanels2";
import YeosuPanels3 from "./YeosuPanels3";


import React, { useEffect, useRef } from "react";

/* brand-identity.html 원본을 1:1 로 React 로 감싼 컴포넌트.
   에셋은 public/brand/ 아래 원본 상대경로 그대로 복사됨. */

const B = "/source-work/yeosu/brand";

/* 색상 동기화 슬라이드쇼 + 영상 lazy 재생 (scripts/grid.js 포팅) */
function useGridBehaviors(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups: Array<() => void> = [];
    const slots = Array.from(el.querySelectorAll<HTMLElement>(".slot--show"));
    const vids = Array.from(el.querySelectorAll<HTMLVideoElement>("video[data-lazy]"));
    const visible = new Set<Element>();
    let idx = 0;
    slots.forEach(s=>{const imgs=s.querySelectorAll('img');if(imgs.length&&!s.querySelector('.is-active'))imgs[0].classList.add('is-active');});
    const sync=()=>vids.forEach(v=>{
      v.controls=media.matches;
      if(visible.has(v)&&!document.hidden&&!media.matches){v.muted=true;v.play().catch(()=>{});}else v.pause();
    });
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));sync();});
    [...slots,...vids].forEach(n=>io.observe(n));
    const timer=setInterval(()=>{
      if(media.matches||document.hidden||!slots.some(s=>visible.has(s)))return;
      idx++;
      slots.forEach(s=>{if(!visible.has(s))return;const imgs=s.querySelectorAll('img');imgs.forEach((im,i)=>im.classList.toggle('is-active',i===idx%imgs.length));});
    },1800);
    media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
    cleanups.push(()=>{clearInterval(timer);io.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);vids.forEach(v=>v.pause());});

    return () => cleanups.forEach((fn) => fn());
  }, [root]);
}


export default function Showcase(){
 const rootRef=useRef<HTMLDivElement|null>(null);
 useGridBehaviors(rootRef);
 return <div ref={rootRef} className="yeosu-source">
<section className="bleed full-vw">
        <figure className="slot hero-slot">
          <video
            src={`${B}/img/mov/로고텍스쳐매핑_Seedance 2_0 - The logo silhouette stays perfectly fixed and unchanged throughout_ Only the surface.mp4`}
            muted
            loop
            playsInline
            preload="metadata"
            data-lazy=""
          />
        </figure>
      </section>
<div className="bi-stage"><YeosuPanels1/><YeosuPanels2/><YeosuPanels3/></div></div>;
}
