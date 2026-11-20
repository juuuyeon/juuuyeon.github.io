import React,{useEffect,useRef} from 'react';
import AssetImage from '../AssetImage';
import {useVisibleMotion} from './motion-hooks';
export function localize(value,lang){
 if(!value||typeof value!=='object')return value;
 if(value.type==='text')return value.value[lang]??value.value.ko??value.value.en??'';
 if(value.type==='image')return {src:'/source-work'+value.src,alt:value.alt?.[lang]||value.alt?.ko||''};
 if(value.type==='list')return value.items.map(x=>localize(x,lang));
 if(Array.isArray(value))return value.map(x=>localize(x,lang));
 return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v,lang)]));
}
export function Media({item,className='',eager=false}){if(!item?.src)return null;return <AssetImage className={className} src={item.src} alt={item.alt} loading={eager?'eager':'lazy'}/>;}
export function Copy({body}){return Array.isArray(body)?body.map((b,i)=><p key={i}>{b.paragraph}</p>):<p>{body}</p>;}
export function Intro({label,title,body}){return <div className="source-intro"><div><span className="source-label">{label}</span>{title&&<h2>{title}</h2>}</div>{body&&<div className="source-prose"><Copy body={body}/></div>}</div>;}
export function Images({items,cols=2,className=''}){return <div className={`source-images cols-${cols} ${className}`}>{items?.map((im,i)=><figure key={i}><Media item={im.image||im}/></figure>)}</div>;}
export function Film({src,poster}){
 const ref=useRef(null),{active}=useVisibleMotion(ref);
 useEffect(()=>{const v=ref.current;if(active){v.muted=true;v.play().catch(()=>{});}else v.pause();},[active]);
 return <video ref={ref} controls muted loop playsInline preload="metadata" poster={poster?.src} src={src?.startsWith('/')?'/source-work'+src:src}/>;
}
export function Palette({items}){return <div className="source-palette">{items?.map((c,i)=><div key={i} style={{background:c.swatch,color:contrast(c.swatch)}}><strong>{c.name}</strong><span>{c.swatch}</span></div>)}</div>;}
function contrast(hex){if(!/^#[a-f\d]{6}$/i.test(hex||''))return '#111';let n=hex.slice(1).match(/../g).map(x=>parseInt(x,16));return n[0]*.299+n[1]*.587+n[2]*.114>150?'#111':'white';}
