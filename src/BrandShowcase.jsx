import React from 'react';
import content from './brand-content.json';
import './brand-showcase.css';

const asset=(brand,file)=>`/work/branding/${brand}/${file}`;
const swatchText=hex=>{const [r,g,b]=hex.slice(1).match(/../g).map(v=>parseInt(v,16));return .299*r+.587*g+.114*b>150?'#201814':'#fff';};
function Intro({label,title,children}){
 return <div className="brand-intro"><div><span>{label}</span><h2>{title}</h2></div><p>{children}</p></div>;
}
function Palette({items}){
 return <div className="brand-palette">{items.map(item=><div key={item.name} style={{background:item.swatch,color:swatchText(item.swatch)}}><span>{item.name}</span><code>{item.swatch.toUpperCase()}</code></div>)}</div>;
}
function Film({brand,file,poster,caption}){
 return <figure className="brand-film"><video controls playsInline preload="none" poster={asset(brand,poster)} aria-label={caption}><source src={asset(brand,file)} type="video/mp4"/>브라우저에서 영상을 재생할 수 없습니다.</video><figcaption>{caption}</figcaption></figure>;
}
function Yeosu(){
 return <div className="brand-showcase brand-showcase-yeosu">
  <Intro label="IDENTITY IN MOTION" title={<>하나의 흐름으로,<br/>새로운 인상을.</>}>여수 바다의 흐름을 뜻하는 ‘Flow’. 한 획으로 이어지는 Y 심볼을 중심으로 로고와 색상, 공간과 패키지까지 하나의 인상을 연결했습니다.</Intro>
  <div className="brand-logo-pair"><figure><img src={asset('yeosu','oldlogo.webp')} alt="리뉴얼 이전 여수새고막 로고" loading="lazy"/><figcaption>BEFORE · 기존 로고</figcaption></figure><figure><img src={asset('yeosu','newlogo.webp')} alt="물결 위의 새로운 여수새고막 심볼과 워드마크" loading="lazy"/><figcaption>AFTER · Flow 심볼과 워드마크</figcaption></figure></div>
  <Intro label="FLOW COLOR SYSTEM" title={<>물과 빛의 결을<br/>여섯 개의 톤으로.</>}>밝은 수면에서 깊은 바다로 이어지는 Flow 01–06. 원본 쇼케이스의 색상 체계를 적용 이미지와 함께 보여줍니다.</Intro>
  <Palette items={content.yeosu.palette}/>
  <Film brand="yeosu" file="hero_video.mp4" poster="01_메인.webp" caption="여수새고막 · 브랜드 모션 시안"/>
 </div>;
}
function Refine(){
 return <div className="brand-showcase brand-showcase-refine">
  <Intro label="REFINE ESSENCE" title={<>본연의 아름다움을<br/>Refine하다.</>}>‘가장 나다운 것’에서 출발한 브랜드. 본연, 균형, 정제라는 세 가지 가치를 이미지의 질감과 절제된 화면의 기준으로 연결했습니다.</Intro>
  <div className="brand-values">{content.refine.values.map(value=><div key={value.en}><span>{value.no}</span><h3>{value.en}</h3><p>{value.kr}</p></div>)}</div>
  <figure className="brand-full-image"><img src={asset('refine','moodboard-3split.jpg')} alt="공간의 빛, 피부의 질감, 인물로 이어지는 Refine 비주얼 디렉션" loading="lazy"/></figure>
  <Intro label="WARM NEUTRAL" title={<>밝은 크림에서<br/>깊은 잉크까지.</>}>{content.refine.paletteDescription}</Intro>
  <Palette items={content.refine.palette}/>
  <Intro label="WEBSITE IN MOTION" title={<>브랜드의 인상을<br/>화면의 움직임으로.</>}>실제 제작한 데스크톱 화면과 스크롤 영상. 이미지, 타이포그래피, 라인의 움직임이 이어지는 웹 경험을 확인할 수 있습니다.</Intro>
  <Film brand="refine" file="site-scroll.mp4" poster="screen-desktop.webp" caption="Refine Clinic · 웹 화면 스크롤 영상"/>
  <Intro label="MOBILE EXPERIENCE" title={<>작은 화면에서도<br/>같은 브랜드의 결.</>}>브랜드 가치와 콘텐츠를 세로 흐름으로 이어 읽는 모바일 화면입니다.</Intro>
  <div className="brand-mobile-screens">{[1,2,3,4].map(n=><figure key={n}><img src={asset('refine',`mtall-0${n}.webp`)} alt={`Refine 모바일 디자인 ${n}`} loading="lazy"/><figcaption>MOBILE — 0{n}</figcaption></figure>)}</div>
 </div>;
}
export default function BrandShowcase({project}){
 return project.id==='yeosu-brand'?<Yeosu/>:project.id==='refine'?<Refine/>:null;
}
