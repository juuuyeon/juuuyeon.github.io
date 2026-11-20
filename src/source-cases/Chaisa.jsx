import React from 'react';
import './chaisa-layout.css';
import {useCaseMotion} from './motion-hooks';
import {MotionHero,ColorPromise,ClosingVisual} from './MotionVisuals';
import BeforeAfter from './BeforeAfter';
import CharacterCarousel from './CharacterCarousel';
import raw from './chaisa.json';
import {localize,Media,Intro,Images,Palette} from './primitives';
export default function Chaisa({lang}){
 const motionRef=useCaseMotion(lang);
 const d=localize(raw,lang);const g=n=>d[`chaisa_${n}_1`];const overview=g('overview'),strategy=g('strategy'),mood=g('moodboard'),logo=g('logo'),character=g('character'),color=g('colortypo'),footer=g('footer');
 return <div ref={motionRef} className="source-chaisa">
 <section id="chaisa_hero_1" className="source-hero"><MotionHero title={g('hero').heading} item={g('hero').image} kind="chaisa"/></section>
 <section id="chaisa_overview_1" className="source-section"><Intro label={overview.eyebrow} title={overview.intro} body={overview.body}/></section>
 <section id="chaisa_cover_1" className="source-section source-tinted"><BeforeAfter pairs={g('cover').pairs}/></section>
 <section id="chaisa_strategy_1" className="source-section"><Intro label={strategy.eyebrow} title={strategy.title}/><div className="source-grid four strategy-pairs">{strategy.pairs.map(p=><div key={p.no}><span>{p.no} / Challenge</span><h3>{p.cTitle}</h3><p>{p.cDesc}</p><span className="strategy-arrow">↓</span><span>UX STRATEGY</span><h3>{p.sTitle}</h3><p>{p.sDesc}</p></div>)}</div></section>
 <section id="chaisa_moodboard_1" className="source-section source-dark"><Intro label={mood.eyebrow} title={mood.title} body={mood.body}/><div className="source-grid four">{mood.tiles.map((t,i)=><figure key={i}><Media item={t.image}/><figcaption><h3>{t.name}</h3><p>{t.desc}</p></figcaption></figure>)}</div></section>
 <section id="chaisa_logo_1" className="source-section"><Intro label={logo.eyebrow} title={logo.title} body={logo.body}/><Media item={logo.logoImage} className="source-wide chaisa-construction"/><Images items={[logo.chromeImage,logo.cardImage]}/><h3>{logo.specLabel}</h3><p>{logo.caption}</p><Media item={logo.motionImage} className="source-wide"/></section>
 <section id="chaisa_character_1" className="source-section source-blue"><Intro label={character.eyebrow} title={character.title} body={character.body}/><p className="character-bubble">{character.bubble}</p><Media item={character.heroImage} className="source-wide character-hero"/><CharacterCarousel image={character.heroImage}/></section>
 <section id="chaisa_colortypo_1" className="source-section"><Intro label={color.eyebrow} title={color.title} body={color.body}/><Palette items={color.colors}/><div className="source-type"><h2>Ab가</h2><div><h3>{color.fontName}</h3><p>{color.fontUsage}</p><p>{color.fontWeights}</p></div></div></section>
 <section id="chaisa_uidesign_1" className="source-section source-dark"><h2>UI DESIGN</h2><div className="chaisa-ui-grid">{g('uidesign').steps.map(s=><div className="chaisa-ui-step" key={s.no}><div><span>{s.no} / {s.name}</span><h3>{s.sub}</h3><p>{s.desc}</p></div><Media item={s.image}/></div>)}</div></section>
 <section id="chaisa_uisocial_1" className="source-section source-tinted"><Images items={g('uisocial').images} cols={1}/></section>
 <section id="chaisa_brandapps_1" className="source-section"><Images items={g('brandapps').images} cols={3}/></section>
 <section id="chaisa_mockup_1" className="source-section source-dark"><Images items={g('mockup').images} className="chaisa-mockups"/></section>
 <section id="chaisa_promise_1" className="source-section source-closing"><h2>{g('promise').line}</h2><ColorPromise item={g('promise').image}/></section>
 <section id="chaisa_closing_1" className="source-chaisa-closing"><ClosingVisual item={g('closing').image} colors={g('closing').colors}/></section>
 <section id="chaisa_footer_1" className="source-section source-dark"><dl className="source-facts">{footer.credits.map((c,i)=><div key={i}><dt>{c.label}</dt><dd>{c.value}</dd></div>)}</dl><Media item={footer.logo} className="source-logo"/><h2>{footer.slogan}</h2><p>{footer.copyright}</p></section>
 </div>;
}
