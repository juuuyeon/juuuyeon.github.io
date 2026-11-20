import React, {useEffect, useRef, useState} from 'react';
import films from './shortform-films.json';
import {useScroll} from './interactions';
import './case-study.css';
import './shortform.css';

function duration(seconds) {
 return `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2,'0')}`;
}

export default function ShortformPage({project}) {
 useScroll(false);
 const initial = films.findIndex(f => f.id === new URLSearchParams(location.search).get('film'));
 const [index, setIndex] = useState(Math.max(0, initial));
 const [failed, setFailed] = useState(false);
 const video = useRef(null);
 const stage = useRef(null);
 const film = films[index];
 useEffect(() => {
  document.title = `${project.name} — 박주연 포트폴리오`;
  const pauseHidden = () => {if (document.hidden) video.current?.pause();};
  document.addEventListener('visibilitychange', pauseHidden);
  return () => document.removeEventListener('visibilitychange', pauseHidden);
 }, [project.name]);
 function select(next) {
  video.current?.pause();
  setFailed(false);
  setIndex(next);
  const url = new URL(location.href);
  url.searchParams.set('film', films[next].id);
  history.replaceState({}, '', url);
  if (stage.current.getBoundingClientRect().top < -100) {
   stage.current.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
 }
 return <div className="case-page shortform-page" id="top">
  <a className="skip-link" href="#films">숏폼 영상으로 건너뛰기</a>
  <header className="case-header"><a href="/projects?category=Content">← 모든 콘텐츠 작업</a><a href="/" className="case-monogram" aria-label="박주연 홈">JP.</a><span>2026 · Short films</span></header>
  <main>
   <section className="shortform-intro"><p>AI 영상 · 숏폼</p><h1>{project.name}</h1><p>{project.headline}</p></section>
   <section id="films" className="shortform-stage" ref={stage} aria-label="숏폼 감상">
    <div className="shortform-screen">
     <video key={film.id} ref={video} controls playsInline preload="none" poster={film.poster} src={film.src} width="1080" height="1920" aria-label={`${film.title} 영상`} onError={()=>setFailed(true)}>
      <a href={film.src}>영상 파일 열기</a>
     </video>
     {failed&&<p role="alert">영상을 불러오지 못했습니다. <a href={film.src}>영상 파일 열기</a></p>}
    </div>
    <div className="shortform-caption" aria-live="polite">
     <p>{film.genre} · {duration(film.duration)} · 9:16</p>
     <h2>{film.title}</h2><p className="shortform-synopsis">{film.description}</p>
     <div className="shortform-focus"><h3>장면의 포인트</h3><p>{film.focus}</p></div>
     <div className="shortform-controls"><button onClick={()=>select(index-1)} disabled={index===0} aria-label="이전 영상">←</button><span>{String(index+1).padStart(2,'0')} / {String(films.length).padStart(2,'0')}</span><button onClick={()=>select(index+1)} disabled={index===films.length-1} aria-label="다음 영상">→</button></div>
    </div>
   </section>
   <section className="shortform-library" aria-labelledby="film-library-title"><div className="shortform-library-heading"><h2 id="film-library-title">장면을 골라보세요.</h2><p>{films.length}편의 숏폼</p></div><div className="shortform-filmstrip">
    {films.map((f,i)=><button className="shortform-choice" key={f.id} onClick={()=>select(i)} aria-pressed={index===i} aria-label={`${f.title} 선택`}><span className="shortform-poster"><img src={f.poster} width="540" height="960" alt="" loading="lazy"/><span>{duration(f.duration)}</span></span><strong>{f.title}</strong><small>{f.genre}</small></button>)}
   </div></section>
   <section className="shortform-about"><div><h2>짧은 영상 안에,<br/>이어지는 장면을.</h2><p>{project.description}</p></div><div><p>{project.goal}</p><ul>{project.scope.map(item=><li key={item}>{item}</li>)}</ul><p className="shortform-credit">{project.limits}</p></div></section>
  </main>
  <footer className="case-footer"><a href="/">© 2026 JUYEON PARK</a><a href="/projects">다른 프로젝트 보기 ↗</a><a href="#top">맨 위로 ↑</a></footer>
 </div>;
}
