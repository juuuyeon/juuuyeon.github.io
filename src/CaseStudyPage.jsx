import React,{useEffect,useRef,useState} from 'react';
import AssetImage,{imageSize} from './AssetImage';
import projects from './projects.json';
import scenes from './case-scenes.json';
import {Picture} from './ProjectDetail';
import LandscapeScene from './LandscapeScene';
import CardnewsShowcase from './CardnewsShowcase';
import {Reveal,useScroll} from './interactions';
import BrandShowcase from './BrandShowcase';
import ProductCaseStory,{productChapters} from './ProductCaseStory';
import './case-study.css';
import './case-editorial.css';

function Contents({items,project}){
 const [active,setActive]=useState('overview');
 const navRef=useRef(null);
 const ids=items.map(item=>item.id).join('|');
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   frame=0;
   const threshold=Math.min(180,innerHeight*.25);
   const reached=ids.split('|').filter(id=>document.getElementById(id)?.getBoundingClientRect().top<=threshold);
   setActive(reached.at(-1)||'overview');
  };
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
  update();
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue);
  return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',queue);removeEventListener('resize',queue);};
 },[ids]);
 useEffect(()=>{
  const nav=navRef.current;
  const link=nav?.querySelector('[aria-current]');
  if(!nav||!link||nav.scrollWidth<=nav.clientWidth)return;
  const bounds=nav.getBoundingClientRect(),item=link.getBoundingClientRect();
  if(item.left<bounds.left||item.right>bounds.right){
   nav.scrollLeft+=item.left-bounds.left-(nav.clientWidth-item.width)/2;
  }
 },[active]);
 return <aside className="case-toc">
  <div className="case-toc-heading"><span>이 프로젝트에서</span><strong>{project.name}</strong></div>
  <nav ref={navRef} aria-label="프로젝트 목차">{items.map(item=><a key={item.id} href={`#${item.id}`} aria-current={active===item.id?'location':undefined} className={item.sub?'case-toc-sub':undefined}>{item.label}</a>)}</nav>
  <a href="/projects" className="case-toc-all">모든 프로젝트</a>
 </aside>;
}

function Cover({project:p}){
 if(p.id==='product')return <figure className="case-product-cover">
  <div className="case-device-stage">
   <div className="case-stage-label"><span>WITIM</span><span>DESKTOP & iOS</span></div>
   <AssetImage className="case-device-desktop" src="/case-assets/p015-1.png" alt="WITIM 데스크톱 다크 모드의 업무 협업 화면" loading="eager" fetchPriority="high"/>
   <AssetImage className="case-device-mobile" src="/case-assets/p017-2.png" alt="WITIM iOS 근태 상태 확인 화면" loading="eager"/>
  </div>
  <figcaption><span>업무 맥락을 이어 주는 데스크톱과 모바일</span><span>실제 제품 화면</span></figcaption>
 </figure>;
 return <figure className="case-cover-figure"><div className={`case-hero-art ${p.category.toLowerCase()}`}><Picture project={p} priority/></div><figcaption>{p.source}</figcaption></figure>;
}

function WorkGallery({project:p}){
 if(!p.gallery.length)return null;
 return <section id="work" className="case-work" aria-labelledby="work-title">
  <BrandShowcase project={p}/>
  <div className="case-section-intro"><span>SELECTED WORK</span><h2 id="work-title">실제 작업 화면.</h2><p>이미지를 선택하면 원본 크기로 살펴볼 수 있습니다.</p></div>
  <div className={`case-gallery ${p.category.toLowerCase()}`}>{p.gallery.map((src,i)=>{
   const size=imageSize(src);
   const portrait=size.height>size.width*1.2;
   return <Reveal as="figure" key={src} className={portrait?'case-portrait':i%3===0?'panoramic':''}>
    <a href={src} target="_blank" rel="noreferrer" aria-label={`${p.name} 결과 이미지 ${i+1} 크게 보기`}><AssetImage src={src} alt={`${p.name} ${p.galleryLabel||'실제 작업'} ${i+1}`} loading="lazy"/></a>
    <figcaption><span>{p.galleryLabel||p.source}</span><span>크게 보기</span></figcaption>
   </Reveal>;
  })}</div>
 </section>;
}

export default function CaseStudyPage({project:p}){
 useScroll(false);
 const chapters=scenes[p.id]||[];
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 const isProduct=p.id==='product';
 const hasWork=Boolean(p.collections||p.gallery.length);
 const contents=[
  {id:'overview',label:'프로젝트 개요'},
  ...(isProduct?productChapters.map(item=>({...item,sub:true})):chapters.length?[{id:'story',label:'설계 과정'}]:[]),
  ...(hasWork?[{id:p.collections?'new-work':'work',label:'작업 결과'}]:[]),
  {id:'notes',label:'범위와 기록'}
 ];
 useEffect(()=>{document.title=`${p.name} — 박주연 포트폴리오`;document.body.classList.add('case-page-body');return()=>document.body.classList.remove('case-page-body');},[p.id]);
 return <div id="top" className={`case-page case-editorial case-${p.id}`}>
  <a className="skip-link" href="#overview">프로젝트 소개로 건너뛰기</a>
  <header className="case-header">
   <a href="/" className="case-monogram" aria-label="박주연 홈">JP.</a>
   <span className="case-header-caption">박주연 · 디자인 아카이브</span>
   <a href="/projects" className="case-back">모든 프로젝트</a>
  </header>
  <main>
   <section className="case-opening" aria-labelledby="case-title">
    <div className="case-opening-copy">
     <div><span className="case-kicker">{p.source}</span><h1 id="case-title">{p.name}</h1><p className="case-opening-headline">{p.headline}</p></div>
     <dl className="case-facts">
      <div><dt>분야</dt><dd>{p.category} Design</dd></div>
      <div><dt>기록 연도</dt><dd>{p.edition}</dd></div>
      {isProduct&&<div><dt>개인 기여</dt><dd>설계 · 검수</dd></div>}
      <div className="case-facts-scope"><dt>다룬 범위</dt><dd>{p.scope.join(' · ')}</dd></div>
     </dl>
    </div>
    <Cover project={p}/>
   </section>
   <div className="case-body-layout">
    <Contents items={contents} project={p}/>
    <div className="case-reading-column">
     <section id="overview" className="case-overview" aria-labelledby="overview-title">
      <span className="case-kicker">PROJECT OVERVIEW</span>
      <h2 id="overview-title">{p.description}</h2>
      <p className="case-lead">{p.goal}</p>
      <div className="case-scope-list"><span>설계 범위</span><ul>{p.scope.map(scope=><li key={scope}>{scope}</li>)}</ul></div>
      {isProduct&&<p className="case-evidence-note">실제 제품 화면과 QA 기록을 바탕으로 정리한 사례입니다. 전체 제품 구현은 팀 작업이며, 이 페이지는 설계와 검수의 판단을 다룹니다.</p>}
     </section>
     {chapters.length>0&&<section id="story" className="case-story" aria-label="설계 과정">
      {isProduct?<ProductCaseStory chapters={chapters}/>:<><div className="case-section-intro"><span>DESIGN STORY</span><h2>관찰에서 설계까지.</h2><p>판단의 근거와 설계 과정을 원본 장표로 확인할 수 있습니다.</p></div>{chapters.map(scene=><LandscapeScene key={scene.id} scene={scene}/>)}</>}
     </section>}
     {p.collections&&<section id="new-work" className="case-new-work"><CardnewsShowcase project={p}/></section>}
     <WorkGallery project={p}/>
     <section id="notes" className="case-notes" aria-labelledby="notes-title">
      <span className="case-kicker">PROJECT NOTES</span>
      <h2 id="notes-title">작업의 범위와 남은 질문.</h2>
      <p>{p.limits}</p>
      <div className="case-resource-links">{!import.meta.env.PROD&&p.sourceRepo&&<a href={p.sourceRepo} target="_blank" rel="noreferrer">GitHub 프로젝트 원본</a>}<a href="/editions/portfolio-20261106.pdf" target="_blank" rel="noreferrer">전체 포트폴리오 PDF</a></div>
     </section>
    </div>
   </div>
   <a className="next-project" href={`/projects/${next.id}`}>
    <div><span>다음 프로젝트</span><h2>{next.name}</h2><p>{next.headline}</p><span className="next-project-action">프로젝트 살펴보기</span></div>
    <div className="next-project-preview"><Picture project={next}/></div>
   </a>
  </main>
  <footer className="case-footer"><a href="/">© 2026 JUYEON PARK</a><a href="/projects">모든 프로젝트</a><a href="#top">맨 위로</a></footer>
 </div>;
}
