import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs';
import Search from 'lucide-react/dist/esm/icons/search.mjs';
import List from 'lucide-react/dist/esm/icons/list.mjs';
import LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid.mjs';
import projects from './projects.json';
import {Picture} from './ProjectDetail';
import FluidScene from './FluidScene';
import {Menu,Reveal,RollLink,useScroll,CursorGlow} from './interactions';
import './style.css';
import './detail.css';
import './media-layout.css';
import CaseStudyPage from './CaseStudyPage';
import ShortformPage from './ShortformPage';
import SourceCasePage from './source-cases/SourceCasePage';
const categories=['All','Product','Brand','Web','System','Content'];
const params=new URLSearchParams(location.search);
function setUrl(key,value){const u=new URL(location.href);value?u.searchParams.set(key,value):u.searchParams.delete(key);history.replaceState({},'',u);}
function ProjectCard({project:p,index}){
 return <Reveal as="article" className={`project ${p.id}`} delay={(index%3)*70}><a className="project-button" href={`/projects/${p.id}`} aria-label={`${p.name} 프로젝트 보기`}><div className="project-visual"><Picture project={p} className="cover-image"/><span className="image-shade"/>{p.gallery[0]&&<img className="hover-image" src={p.hover||p.gallery[0]} alt="" loading="lazy"/>}<span className="view-label">VIEW PROJECT ↗</span></div><div className="project-title"><h3>{p.name}</h3><span>P / {String(projects.indexOf(p)+1).padStart(2,'0')}</span></div><p>{p.headline}</p></a></Reveal>;
}
function Archive(){return <section id="archive" className="archive surface section-space"><Reveal><h2 className="section-title">THE ARCHIVE</h2><p className="archive-intro">지금의 작업부터, 이전의 기록까지.<br/>각기 다른 시점의 포트폴리오를 모았습니다.</p></Reveal><div className="archive-rows">{[['케이스 스터디','2026.11.06 / 66 pages','/editions/portfolio-20261106.pdf'],['전체 포트폴리오','2026.11 / 179 pages','/editions/portfolio-20261104.pdf'],['시각화와 과정 기록','2026.11 / 36 pages','/editions/portfolio-20261103.pdf'],['이전 포트폴리오','2026.09 / 20 pages','/editions/portfolio-202609.pdf'],['위드랜드 디자인 시스템','2023 / 9 pages','/resources/withland-design-system.html'],['JNJ · 게임 아이템 거래 앱','2024 / 10 pages','/resources/jnj-game.html'],['AROK · 해외송금 서비스','2024 / 11 pages','/resources/arok-original.html'],['WITHLAND · 반려생활 플랫폼','2023 / 9 pages','/resources/withland-original.html']].map(([name,date,href])=><Reveal key={name}>{href?<a href={href} target={href.endsWith('.pdf')?'_blank':undefined} rel="noreferrer"><h3>{name}</h3><span>{date}</span><ArrowUpRight/></a>:<div className="archive-pending"><h3>{name}</h3><span>{date}</span></div>}</Reveal>)}</div></section>;}
function Disciplines(){return <section className="disciplines" aria-label="작업 분야"><div className="surface disciplines-title"><Reveal><h2 className="section-title">WHAT I DO</h2></Reveal></div>{[['PRODUCT DESIGN','업무의 맥락을 읽고, 복잡한 흐름을 이해할 수 있는 경험으로 만듭니다.'],['BRAND EXPERIENCE','브랜드가 전하려는 인상을 형태와 색, 다양한 접점의 기준으로 연결합니다.'],['WEB & DIGITAL','첫 화면에서 시작한 기대가 탐색과 다음 행동으로 이어지도록 설계합니다.'],['DESIGN SYSTEMS','토큰과 컴포넌트, 상태와 검수 기준을 팀이 함께 쓰는 언어로 만듭니다.'],['CREATIVE TOOLS','반복 제작의 입력과 결과를 분리하고, 검수와 재시도까지 설계합니다.']].map(([title,body])=><div className="discipline-row" tabIndex={0} key={title}><Reveal as="h3">{title}</Reveal><p>{body}</p></div>)}</section>;}
function App(){
 const all=location.pathname==='/projects';
 const [menu,setMenu]=useState(false);
 const [category,setCategory]=useState(categories.includes(params.get('category'))?params.get('category'):'All'),[query,setQuery]=useState(params.get('q')||''),[layout,setLayout]=useState('grid');
 const shown=all?projects.filter(p=>(category==='All'||category===p.category)&&`${p.name} ${p.headline} ${p.category}`.toLowerCase().includes(query.toLowerCase())):[projects[0],projects[2],projects[1],projects[3],projects[5],projects[6],projects.find(p=>p.id==='shortform')];
 useScroll(menu);
 useEffect(()=>{document.title=all?'Projects — 박주연 포트폴리오':'박주연 — Product, Brand & Digital';},[all]);
 return <><FluidScene/><a className="skip-link" href="#work">작업 목록으로 건너뛰기</a><header className="site-header"><a href="/#top" aria-label="박주연 홈">JP.</a><button className={`menu-toggle ${menu?'active':''}`} onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label={menu?'메뉴 닫기':'메뉴 열기'}><i/><i/><i/></button></header><Menu open={menu} onClose={()=>setMenu(false)}/><div className={`page-content ${menu?'menu-behind':''}`} inert={menu}>
 <main id="top">{!all&&<><section className="hero" aria-label="박주연 포트폴리오"><div className="hero-caption"><p>Designing experiences.<br/>Connecting the dots.</p><span>박주연<br/>Product · Brand · Digital</span></div><h1 className="hero-wordmark" aria-label="Juyeon Park">JUYEON.PARK</h1><a href="#about" className="hero-scroll" aria-label="소개로 스크롤">SCROLL TO EXPLORE <span>↓</span></a></section><section id="about" className="intro surface section-space"><Reveal as="p" className="intro-copy">안녕하세요, 디자이너 박주연입니다. 제품의 작은 행동부터 브랜드의 첫인상까지, 생각이 실제로 쓰이는 장면을 만듭니다. 문제를 발견하고, 기준을 세우고, 결과를 확인하는 과정. 디자인과 구현을 연결하며 더 명확하고 일관된 경험을 설계합니다.</Reveal><Reveal className="section-cta"><RollLink href="/editions/portfolio-20261106.pdf" target="_blank" rel="noreferrer">MORE ABOUT MY WORK</RollLink></Reveal></section></>}
 <section id="work" className={`work-section surface section-space ${all?'all-work':''}`}><Reveal><h2 className="section-title">{all?'ALL PROJECTS':'SELECTED WORK'}{all&&<sup>{projects.length}</sup>}</h2></Reveal>{all&&<div className="work-tools"><div className="filters" role="group" aria-label="프로젝트 분류">{categories.map(c=><button key={c} onClick={()=>{setCategory(c);setUrl('category',c==='All'?'':c);}} aria-pressed={category===c}>{c}</button>)}</div><div className="view-tools"><label><Search size={16}/><input aria-label="작업 검색" placeholder="작업 검색" value={query} onChange={e=>{setQuery(e.target.value);setUrl('q',e.target.value);}}/></label><button aria-label="그리드로 보기" aria-pressed={layout==='grid'} onClick={()=>setLayout('grid')}><LayoutGrid size={20}/></button><button aria-label="목록으로 보기" aria-pressed={layout==='list'} onClick={()=>setLayout('list')}><List size={20}/></button></div></div>}<div className={`project-grid ${layout}`} aria-live="polite">{shown.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}</div>{!shown.length&&<div className="empty"><p>일치하는 작업이 없습니다.</p><button onClick={()=>{setQuery('');setCategory('All');setUrl('q','');setUrl('category','');}}>모든 작업 보기</button></div>}{!all&&<Reveal className="section-cta"><RollLink href="/projects">GO TO ALL PROJECTS</RollLink></Reveal>}</section>
 {!all&&<Disciplines/>}<Archive/></main>
 <footer className="site-footer"><div className="footer-top"><p>계속 질문하고,<br/>다음 장면을 만듭니다.</p><RollLink href="/projects">EXPLORE MY WORK</RollLink></div><div className="footer-wordmark" aria-hidden="true">JUYEON.PARK</div><div className="footer-bottom"><span>© 2026 JUYEON PARK</span><span>SEOUL, KR</span><nav aria-label="하단 메뉴"><a href="/projects">Projects</a><a href="/#about">About</a><a href="/#archive">Archive</a><a href="#top">Back to top ↑</a></nav></div></footer></div></>;
}
const caseId=location.pathname.startsWith('/projects/')?location.pathname.split('/')[2]:params.get('project');
const caseProject=projects.find(p=>p.id===caseId);
if(caseProject&&params.has('project'))history.replaceState({},'',`/projects/${caseProject.id}`);
const page=caseProject?(caseProject.id==='shortform'?<ShortformPage project={caseProject}/>:['refine','chaisa','yeosu-brand','yeosu-web'].includes(caseProject.id)?<SourceCasePage project={caseProject}/>:<CaseStudyPage project={caseProject}/>):<App/>;
createRoot(document.getElementById('root')).render(<><CursorGlow/>{page}</>);
