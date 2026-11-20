import React,{useEffect,useRef} from 'react';
import X from 'lucide-react/dist/esm/icons/x.mjs';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs';
import AssetImage from './AssetImage';
import projects from './projects.json';
import CardnewsShowcase from './CardnewsShowcase';
export function Picture({project, className='', priority=false}){
 if(project.showcaseCovers)return <div className={`cardnews-covers ${className}`} aria-label="정보형·퀴즈형·영상 소개형 카드뉴스"><>{project.showcaseCovers.map((src,i)=><AssetImage key={src} src={src} alt={['정보형 카드뉴스 표지','퀴즈형 카드뉴스 표지','영상 소개형 카드뉴스 표지'][i]} loading={priority?'eager':'lazy'} width="1080" height="1350"/>)}</></div>;
 if(!project.cover)return <div className={`measurement-art ${className}`} aria-label="관찰에서 판단으로 이어지는 측정 설계"><span>Observe</span><i/><span>Understand</span><i/><strong>Decide ↗</strong><small>MEASUREMENT DESIGN</small></div>;
 return <AssetImage className={className} src={project.cover} alt={`${project.name} — ${project.headline}`} loading={priority?'eager':'lazy'} width="1600" height="1000"/>;
}
export function ProjectDetail({project,onClose,onOpen}){
 const ref=useRef(null);
 useEffect(()=>{if(project){if(!ref.current.open)ref.current.showModal();ref.current.querySelector('.detail-scroll').scrollTop=0;document.body.style.overflow='hidden';}return()=>{document.body.style.overflow='';};},[project]);
 if(!project)return null;
 return <dialog ref={ref} className="project-dialog" aria-labelledby="detail-title" onKeyDown={e=>{if(e.key!=='Tab')return;const items=[...ref.current.querySelectorAll('button,a[href]')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus();}}} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="detail-bar"><span>{project.category} / {project.edition}</span><button autoFocus onClick={onClose} aria-label="프로젝트 닫기"><X size={22}/></button></div>
  <div className="detail-scroll"><div className="detail-intro"><p className="eyebrow">PROJECT — {project.source}</p><h2 id="detail-title">{project.name}</h2><p className="detail-headline">{project.headline}</p></div>
  <div className={`detail-cover ${project.id}`}><Picture project={project} priority/></div>
  <div className="detail-copy"><h3>{project.description}</h3><div><p>{project.goal}</p><h4>다룬 범위</h4><ul>{project.scope.map(x=><li key={x}>{x}</li>)}</ul>{project.figma&&<a className="text-link" href={project.figma} target="_blank" rel="noreferrer">Figma에서 보기 <ArrowUpRight size={18}/></a>}</div></div>
  {project.collections&&<CardnewsShowcase project={project}/>}
  <div className="detail-gallery">{project.gallery.map((src,i)=><figure key={src}><AssetImage src={src} alt={`${project.name} 작업 상세 ${i+1}`} loading="lazy" width="1200" height="900"/></figure>)}</div>
  <div className="case-versions"><span>이어서 보기</span><a href="/editions/portfolio-20261104.pdf" target="_blank" rel="noreferrer">전체 포트폴리오 <ArrowUpRight size={16}/></a>{projects.filter(p=>p.id===project.related||p.related===project.id).map(p=><button key={p.id} onClick={()=>onOpen(p)}>{p.name} <ArrowUpRight size={16}/></button>)}</div><div className="case-note"><span>작업에 관하여</span><p>{project.limits}</p></div>
  <button className="detail-end" onClick={onClose}>다른 작업 살펴보기 <ArrowUpRight/></button></div>
 </dialog>;
}
