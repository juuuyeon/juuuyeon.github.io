import React,{useState} from 'react';
import {Intro,Media} from './primitives';
import inventory from './yeosu-figma.json';
const menu=[['회사소개','회사개요','CEO 인사말','회사 연혁','조직·브랜드 구조','품질·신뢰','생산공정','수출 실적·거래처'],['브랜드·제품','엄지네포장마차 → 제품 5종','칠산꽃게장 → 제품 3종 + 출시예정 1','여수올림 → 제품 3종','전체 제품','신제품 예고'],['수출정보','카탈로그','수출국 현황','인증·규격','OEM/ODM 안내'],['뉴스·IR','공지사항','보도자료','전시회·박람회'],['문의','바이어 문의','국내 거래처 문의','OEM/ODM 문의','상담 문의','오시는 길'],['공통','KO / EN','GNB 2Depth','제품 상세 3Depth','시스템·정책']];
const isPublicBuild=import.meta.env.PROD;
const groups=isPublicBuild?{KO:'yeosu-web-ko',EN:'yeosu-web-en'}:{KO:'yeosu-web-ko',EN:'yeosu-web-en',Admin:'yeosu-admin-original','Guide PDF':'yeosu-guide-original'};
const filters=isPublicBuild?['전체','KO','EN','Docs']:['전체','KO','EN','Admin','Guide PDF','Docs'];
const resources=[...inventory].sort((a,b)=>Number(a.y)-Number(b.y)||Number(a.x)-Number(b.x)).flatMap(r=>{
 const category=r.name.split(' / ')[0],slug=groups[category]||(r.id==='2001:23620'?'yeosu-ia-original':null);
 return slug?[{name:r.name,category:groups[category]?category:'Docs',href:`/resources/${slug}.html#${r.id.replace(':','-')}`}]:[];
});
function SourceIndex(){
 const [filter,setFilter]=useState('전체'),[query,setQuery]=useState(''),[limit,setLimit]=useState(18);
 const rows=resources.filter(x=>(filter==='전체'||x.category===filter)&&x.name.toLowerCase().includes(query.toLowerCase()));
 return <section className="source-section source-index" id="source-index">
  <Intro label="PROJECT LIBRARY" title="화면과 문서를 한곳에서." body={isPublicBuild?'국문·영문 웹 화면 90개와 정보구조를 사이트 안에서 직접 살펴볼 수 있습니다. 공개된 웹 디자인과 탐색 구조를 중심으로 정리했습니다.':'국문·영문 웹 화면 90개, 어드민 화면 13개, 운영 가이드 28쪽과 정보구조를 사이트 안에서 직접 살펴볼 수 있습니다. 각 자료는 PDF로도 내려받을 수 있습니다.'}/>
  <div className="source-filter">{filters.map(f=><button key={f} aria-pressed={f===filter} onClick={()=>{setFilter(f);setLimit(18);}}>{f}</button>)}<input value={query} onChange={e=>{setQuery(e.target.value);setLimit(18);}} placeholder="화면·문서 이름 검색" aria-label="화면·문서 이름 검색"/></div>
  <p>{rows.length}개 화면·문서</p><div className="source-index-grid">{rows.slice(0,limit).map(r=><a key={r.href} href={r.href}><span>{r.name}</span><span>보기 →</span></a>)}</div>
  {rows.length>limit&&<div className="source-filter source-index-more"><button onClick={()=>setLimit(limit+18)}>화면 더 보기 ({Math.min(limit,rows.length)} / {rows.length})</button></div>}
  {!rows.length&&<p>일치하는 자료가 없습니다.</p>}
 </section>;
}
function Document({id,title}){
 return <div className="source-document"><h3>{title}</h3><div className="document-links"><a href={`/resources/yeosu-${id}.html`}>내용 읽기 →</a><a href={`/resources/yeosu-${id}.pdf`} download>PDF 다운로드 ↓</a></div></div>;
}
export default function YeosuWeb(){return <div className="source-yeosu-web">
 <section className="source-hero"><Media item={{src:'/work/p090-1.png',alt:'여수새고막 웹사이트 디자인'}} eager/></section>
 <section className="source-section"><Intro label="YEOSU SAEGOMAK · WEBSITE & CMS" title="브랜드의 첫인상부터,
운영자의 다음 작업까지." body={isPublicBuild?'여수새고막의 브랜드·제품·수출 정보를 탐색하고 문의로 이어지는 웹사이트입니다. 웹 화면, 정보구조, 콘텐츠 관리와 운영 규칙을 하나의 프로젝트로 연결했습니다.':'여수새고막의 브랜드·제품·수출 정보를 탐색하고 문의로 이어지는 웹사이트입니다. 웹 화면, 정보구조, 콘텐츠 관리와 운영 가이드를 하나의 프로젝트로 연결했습니다.'}/><div className="source-track"><a href="#landing">Website ↓</a><a href="#ia">IA ↓</a><a href="#admin">Admin ↓</a><a href="#guide">Guide ↓</a></div></section>
 <section className="source-section source-tinted" id="landing"><Intro label="WEBSITE" title="청정 해역,
그대로 식탁까지" body="바다에서 식탁까지, 정직하게 담은 가치. 청정 해역의 신선함을 한결같은 정성으로 전합니다."/><Media item={{src:'/resources/yeosu-web-ko/2001-786.jpg',alt:'여수새고막 국문 홈페이지 전체 디자인'}} className="source-wide"/><div className="source-grid two">{[['BRAND','바다의 가치를 브랜드에 담다.','여수새고막의 3가지 브랜드가 다양한 가치를 제안합니다.'],['BRAND VALUE','깨끗한 바다 · 안전한 제조','청정 해역의 신선한 수산물만 사용합니다. HACCP 인증 시설에서 위생적으로 생산합니다.'],['EXPORT','세계로 향하는 여수새고막.','미국·일본·중국 등 다양한 국가에 수출하고 있습니다.'],['BRAND FILM','정성이 흐르는 바다의 시간.','채취부터 식탁까지, 여수새고막의 하루를 영상으로 만나보세요.'],['NOTICE','미래를 향한 희망찬 소식을 안내합니다','바이어 문의 · 국내 거래처 문의 · OEM/ODM 문의'],['INSTAGRAM','청정 바다의 오늘을 전합니다.','청정 해역의 일상과 제품 이야기를 인스타그램에서 만나보세요.']].map(([tag,title,body])=><div key={tag}><span>{tag}</span><h3>{title}</h3><p>{body}</p></div>)}</div><a className="source-large-link" href="/resources/yeosu-web-ko.html" target="_blank" rel="noreferrer">국문 웹 화면 45개 보기 ↗</a></section>
 <section className="source-section" id="ia"><Intro label="INFORMATION ARCHITECTURE" title="제품 목록에서,
브랜드 중심의 탐색으로." body="IA v2.0은 브랜드 안에 제품을 배치하고, 브랜드·제품이 늘어날 때의 표시 규칙을 정의합니다. 아래 구조는 2026년 7월 10일 ‘검토중’ 문서를 기준으로 옮겼습니다."/><div className="source-ia">{menu.map(([title,...items])=><div key={title}><h3>{title}</h3>{items.map(t=><p key={t}>{t}</p>)}</div>)}</div><div className="source-grid three"><div><h3>브랜드 → 라인업 → 제품</h3><p>GNB는 2Depth까지. 개별 제품은 브랜드 라인업에서 3Depth로 진입합니다.</p></div><div><h3>4장 이하 / 5장 이상</h3><p>제품 4장 이하는 그리드, 5장 이상은 슬라이더로 전환하는 표시 규칙을 정했습니다.</p></div><div><h3>확장 시나리오</h3><p>브랜드 추가와 제품 증가에 따라 탭·메뉴·크로스 링크가 바뀌는 조건을 문서로 연결했습니다.</p></div></div><Document id="ia" title="정보구조 IA · v2.0 전체" name="여수새고막_IA.md" node="2001:23620"/></section>
 <section className="source-section source-tinted" id="admin"><Intro label="CUSTOM CMS" title="공개 화면과 운영 작업을
같은 맥락에서." body={isPublicBuild?'운영자가 미리보기를 보며 콘텐츠를 편집하고, 브랜드·제품·뉴스·미디어·문의·다국어를 관리하는 화면입니다. 주요 편집 화면과 저장 방식, 역할별 접근 조건을 정리했습니다.':'운영자가 미리보기를 보며 콘텐츠를 편집하고, 브랜드·제품·뉴스·미디어·문의·다국어를 관리하는 화면입니다. 실제 저장 방식과 역할별 접근 범위는 운영 가이드의 조건을 함께 제공합니다.'}/><div className="source-screen-grid">{[['/resources/yeosu-admin-original/2001-20906.jpg','콘텐츠 편집·운영 화면'],['/resources/yeosu-admin-original/2001-21873.jpg','브랜드·제품 관리 화면']].map(([src,title])=><figure key={src}><Media item={{src,alt:title}}/><figcaption>{title} · 원본 화면</figcaption></figure>)}</div><div className="source-grid three"><div><h3>미리보기 → 편집 → 저장</h3><p>PC·모바일 미리보기를 보며 블록을 수정합니다. 메인 페이지의 순서는 드래그 종료 시 자동 저장됩니다.</p></div><div><h3>역할에 맞는 접근</h3><p>어드민은 모든 메뉴에 접근합니다. 편집자는 문의 관리와 설정을 제외한 콘텐츠 운영 메뉴를 사용합니다.</p></div><div><h3>실제 구현 범위</h3><p>가이드 기준으로 GA4 리포트와 외부 API 연동은 준비 단계입니다. 키 보관과 실제 서비스 연결을 구분합니다.</p></div></div>{!isPublicBuild&&<a className="source-large-link" href="/resources/yeosu-admin-original.html" target="_blank" rel="noreferrer">어드민 화면 13개 보기 ↗</a>}</section>
 <section className="source-section" id="guide"><Intro label="OPERATION GUIDE" title="디자인 다음의 운영까지." body={isPublicBuild?'비개발자 운영 담당자가 로그인, 콘텐츠 수정, 브랜드·제품 관리, 문의 처리, 통계, 권한과 복구 방법을 이해할 수 있도록 안내 자료를 설계했습니다.':'비개발자 운영 담당자를 위한 안내 자료입니다. 로그인, 콘텐츠 수정, 브랜드·제품 관리, 문의 처리, 통계, 권한과 복구 방법을 원문과 함께 제공합니다.'}/>{!isPublicBuild&&<><Document id="guide" title="어드민 운영 가이드 · 전체 원문" name="여수새고막_어드민_가이드.md" node="2001:12433"/><Document id="demo" title="어드민 시연 플로우 · 전체 원문" name="여수새고막_어드민_시연플로우.md" node="2001:13732"/><div className="source-guide-links"><h3>운영 가이드 원본 · 28쪽</h3><p>원래 장표의 화면과 설명을 그대로 담았습니다. 한 쪽씩 읽거나 전체 PDF를 내려받으세요.</p><div><a href="/resources/yeosu-guide-original.html">가이드 읽기 →</a><a href="/resources/yeosu-guide-original.pdf" target="_blank" rel="noreferrer">PDF 보기 ↗</a><a href="/resources/yeosu-guide-original.pdf" download>PDF 다운로드 ↓</a></div></div></>}</section>
 <SourceIndex/>
 </div>;}
