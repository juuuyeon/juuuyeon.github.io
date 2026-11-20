import React,{useRef,useState} from 'react';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.mjs';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs';
import './cardnews.css';

function Series({series}){
 const ref=useRef(null),[position,setPosition]=useState(1);
 function move(direction){const el=ref.current,step=el.children[1].offsetLeft-el.children[0].offsetLeft;const index=Math.max(0,Math.min(series.pages.length-1,Math.round(el.scrollLeft/step)+direction));el.scrollTo({left:index*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 function track(){const el=ref.current;setPosition(Math.min(6,Math.round(el.scrollLeft/(el.firstElementChild.getBoundingClientRect().width+16))+1));}
 return <section className="card-series" aria-labelledby={`${series.id}-title`}>
  <div className="series-heading"><div><span>{series.kind} / 06 CARDS</span><h3 id={`${series.id}-title`}>{series.title}</h3></div><div className="series-controls"><span aria-live="polite">{String(position).padStart(2,'0')} — 06</span><button onClick={()=>move(-1)} aria-label={`${series.kind} 이전 카드`}><ArrowLeft size={18}/></button><button onClick={()=>move(1)} aria-label={`${series.kind} 다음 카드`}><ArrowRight size={18}/></button></div></div>
  <p className="series-description">{series.description}</p>
  <div className="series-track" ref={ref} onScroll={track} tabIndex={0} role="region" aria-label={`${series.kind} 카드 6장, 좌우로 넘겨보기`}>
   {series.pages.map((page,index)=><figure key={page.image}>{page.video?<video controls playsInline preload="none" poster={page.image} aria-label={page.alt}><source src={page.video} type="video/mp4"/>동영상을 재생할 수 없습니다.</video>:<a href={page.image} target="_blank" rel="noreferrer" aria-label={`${index+1}장 크게 보기: ${page.alt}`}><img src={page.image} alt={page.alt} loading="lazy" width="1080" height="1350"/></a>}<figcaption><span>{String(index+1).padStart(2,'0')} / 06</span><span>{page.video?'8초 영상 · 재생해서 보기':'클릭해서 크게 보기 ↗'}</span></figcaption></figure>)}
  </div>
 </section>;
}
export default function CardnewsShowcase({project}){
 return <div className="cardnews-showcase"><div className="showcase-intro"><span>NEW WORK / EDITORIAL SYSTEM</span><h2>하나의 기준으로,<br/>서로 다른 이야기를.</h2><p>정보형·퀴즈형·영상 소개형 3편, 총 18장.<br/>카드를 좌우로 넘기며 구성과 흐름을 살펴보세요.</p></div>
 {project.collections.map(series=><Series key={series.id} series={series}/>)}
 <section className="template-showcase"><span>REUSABLE TEMPLATES</span><h3>매번 새로 그리지 않도록,<br/>일곱 가지 역할로 나눈 템플릿.</h3><p>표지 · 정보 · 퀴즈 · 영상 · 장면 소개 · 이야기 전개 · 마무리. 문구와 사진, 로고를 분리하고 Auto Layout으로 구성했습니다.</p><a href={project.templateImage} target="_blank" rel="noreferrer" aria-label="재사용 템플릿 7종 크게 보기"><img src={project.templateImage} alt="표지, 정보, 퀴즈, 영상, 장면 소개, 이야기 전개, 마무리 카드뉴스 템플릿 7종" loading="lazy"/></a><a className="text-link" href="/resources/cardnews-templates.html" target="_blank" rel="noreferrer">템플릿 전체 보기 <ArrowUpRight size={18}/></a></section>
 <h3 className="previous-work-title">이전 제작 과정과 작업 기록</h3></div>;
}
