import React,{useEffect,useState,lazy,Suspense} from 'react';
const Refine=lazy(()=>import('./Refine'));
const Chaisa=lazy(()=>import('./Chaisa'));
const YeosuWeb=lazy(()=>import('./YeosuWeb'));
const YeosuBrand=lazy(()=>import('./YeosuBrand'));
import {useScroll} from '../interactions';
import './source-cases.css';
import './source-motion.css';
import './yeosu-source.css';
import './source-media.css';
export default function SourceCasePage({project}){
 useScroll(false);
 const [lang,setLang]=useState('ko');
 useEffect(()=>{document.title=`${project.name} — 박주연 포트폴리오`;if(!window.location.hash)window.scrollTo(0,0);},[project.id]);
 const isYeosu=project.id.startsWith('yeosu-');
 const showGuide=project.id==='yeosu-web'&&!import.meta.env.PROD;
 return <div className="source-page" id="top"><header className="source-header"><a href="/projects">← ALL PROJECTS</a><a href="/">JP.</a>{isYeosu?<span>YEOSU SAEGOMAK</span>:<div className="source-lang" aria-label="본문 언어">{['ko','en'].map(l=><button key={l} aria-pressed={lang===l} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>}</header><nav className="source-nav" aria-label="프로젝트 이동"><a href="/projects/refine">Refine Clinic</a><a href="/projects/chaisa">CHAISA</a><a href="/projects/yeosu-brand">Yeosu · Branding</a><a href="/projects/yeosu-web">Yeosu · Website & CMS</a></nav><main lang={project.id==='yeosu-web'?'ko':isYeosu?'en':lang}><Suspense fallback={<p className="source-section">프로젝트를 불러오고 있습니다.</p>}>{project.id==='refine'?<Refine lang={lang}/>:project.id==='chaisa'?<Chaisa lang={lang}/>:project.id==='yeosu-web'?<YeosuWeb/>:<YeosuBrand/>}</Suspense></main><footer className="source-footer"><a href="/projects">← 모든 프로젝트</a><a href={showGuide?'/resources/yeosu-guide-original.html':'/editions/portfolio-20261106.pdf'} target="_blank" rel="noreferrer">{showGuide?'운영 가이드 보기':'포트폴리오 PDF'} ↗</a><a href="#top">Back to top ↑</a></footer></div>;
}
