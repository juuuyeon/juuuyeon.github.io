import React from 'react';
import {useCaseMotion} from './motion-hooks';
import {MotionHero} from './MotionVisuals';
import raw from './refine-clinic.json';
import {localize,Media,Copy,Intro,Images,Film,Palette} from './primitives';
import OrbitField from './OrbitField';
import FlowLines from './FlowLines';
export default function Refine({lang}){
 const motionRef=useCaseMotion(lang);
 const d=localize(raw,lang);const g=n=>d[`refine_${n}_1`];
 const hero=g('hero'),overview=g('overview'),process=g('process'),mood=g('moodboard'),identity=g('identity'),gradient=g('gradient'),ui=g('ui'),type=g('type'),signature=g('signature'),solution=g('solution'),showcase=g('showcase'),i18n=g('i18n'),mobile=g('mobile'),sub=g('subpages'),cms=g('cms'),closing=g('closing'),credits=g('credits');
 return <div ref={motionRef} className="source-refine">
 <section id="refine_hero_1" className="source-hero"><MotionHero item={hero.image} title="Refine Clinic" kind="refine"/></section>
 <section id="refine_overview_1" className="source-section"><Intro {...overview}/><dl className="source-facts">{overview.facts.map((f,i)=><div key={i}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}</dl></section>
 <section id="refine_process_1" className="source-section source-tinted"><Intro {...process}/><div className="source-grid four">{process.steps.map(s=><div key={s.no}><span className="source-number">{s.no}</span><h3>{s.en}</h3>{s.points.map((p,i)=><p key={i}>{p.point}</p>)}</div>)}</div></section>
 <section id="refine_moodboard_1" className="source-section"><Intro {...mood}/><Images items={mood.images}/><div className="source-tags">{mood.tags.map((t,i)=><span key={i}>{typeof t==='string'?t:Object.values(t).join(' ')}</span>)}</div></section>
 <section id="refine_identity_1" className="source-section"><Intro {...identity}/><Media item={identity.image} className="source-wide"/><span className="source-label">{identity.valuesLabel}</span><div className="source-grid three">{identity.values.map(v=><div key={v.no}><span>{v.no}</span><h3>{v.en}</h3><h4>{v.kr}</h4><p>{v.desc}</p></div>)}</div></section>
 <section id="refine_gradient_1" className="source-section source-tinted"><Intro {...gradient}/>{gradient.rows.map((r,i)=><div className="gradient-row" key={i}><h3>{r.name}</h3><Images items={r.images} cols={5}/></div>)}</section>
 <section id="refine_ui_1" className="source-section"><Intro {...ui}/><div className="source-track">{ui.track.map((t,i)=><span key={i}>{t.label}</span>)}</div><Palette items={ui.palette}/></section>
 <section id="refine_type_1" className="source-section"><Intro label={type.label}/><div className="source-grid two">{type.fonts.map(f=><div key={f.cap}><span>{f.cap}</span><h2>{f.name}</h2></div>)}</div>{type.weights.map(w=><div className="source-type" key={w.name}><span>{w.name}</span>{w.samples.map((s,i)=><div key={i} style={{fontWeight:w.weight}}><h3>{s.sample}</h3><p>{s.sub}</p></div>)}</div>)}</section>
 <section id="refine_signature_1" className="source-section source-dark"><Intro label={signature.label} title={signature.title}/><div className="source-intro"><h3>{signature.directionLabel}</h3><p>{signature.direction}</p></div><div className="orbit-demo"><OrbitField/><span>Symbol → Orbit → Motion</span></div><div className="source-grid three">{signature.cards.map(c=><div key={c.tag}><span>{c.tag}</span><h3>{c.caption}</h3><p>{c.desc}</p></div>)}</div>{signature.items.map((it,i)=><div className="signature-item" key={it.no}><span>{it.no}</span><h3>{it.en}</h3><h4>{it.kr}</h4><p>{it.desc}</p>{i===1&&<div className="source-grid four skin-layers">{signature.layers.map((l,j)=><figure key={l.en}><Media item={l.image}/><FlowLines index={j}/><figcaption>{l.kr}<br/><small>{l.en}</small></figcaption></figure>)}</div>}</div>)}</section>
 <section id="refine_solution_1" className="source-section"><Intro {...solution}/><Images items={solution.images}/></section>
 <section id="refine_showcase_1" className="source-section source-tinted"><Intro label={showcase.label} body={showcase.lead}/><Film src={showcase.video} poster={showcase.poster}/><Media item={showcase.mobile} className="source-mobile-single"/></section>
 <section id="refine_i18n_1" className="source-section"><Intro {...i18n}/><div className="source-i18n-layout"><Media item={i18n.navImage} className="source-wide"/><div><h3>{i18n.langCap}</h3><div className="source-grid two">{i18n.langs.map((l,i)=><div key={i}>{Object.values(l).map((v,j)=><p key={j}>{v}</p>)}</div>)}</div><p>{i18n.note}</p></div></div></section>
 <section id="refine_mobile_1" className="source-section source-mobile" style={{backgroundImage:`url('${mobile.bgImage?.src||i18n.bgImage?.src}')`}}><Images items={mobile.images} cols={4} className="mobile-parallax"/></section>
 <section id="refine_subpages_1" className="source-section"><Intro {...sub}/><p className="source-url">{sub.url}</p><Film src={sub.video} poster={sub.poster}/></section>
 <section id="refine_cms_1" className="source-section source-tinted"><Intro {...cms}/><p className="source-url">{cms.url}</p><Media item={cms.image} className="source-wide"/><div className="source-grid three">{cms.features.map(f=><div key={f.no}><span>{f.no}</span><h3>{f.t}</h3><p>{f.d}</p></div>)}</div></section>
 <section id="refine_closing_1" className="source-section source-closing"><Media item={closing.logo}/><h2>{closing.line}</h2><p>{closing.caption}</p></section>
 <section id="refine_credits_1" className="source-section source-dark">{credits.spine.map(s=><div className="source-spine" key={s.no}><h2>{s.word}</h2><span>{s.no}</span><span>{s.mid}</span><span>{s.cat}</span></div>)}<p>{credits.studio}</p><div className="source-grid two">{credits.credits.map((c,i)=><div key={i}><h3>{c.role}</h3>{c.names.map(n=><p key={n.name}>{n.name}</p>)}</div>)}</div></section>
 </div>;
}
