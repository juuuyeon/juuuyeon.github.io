import React,{useEffect,useRef,useState} from 'react';

import AssetImage,{imageSize} from './AssetImage';

function Node({node:n}){
 const box={left:n.x,top:n.y,width:n.w,height:n.h};
 if(n.type==='text')return <div className="scene-node scene-text" style={{...box,fontSize:n.size,fontWeight:n.weight,color:n.fill,lineHeight:`${n.lineHeight}px`}}>{n.text}</div>;
 if(n.type==='image'){
  const original=imageSize(n.path);const factor=Math.min(1,(original.width||n.w)/n.w,(original.height||n.h)/n.h);
  const fit={left:n.x+(n.w-n.w*factor)/2,top:n.y+(n.h-n.h*factor)/2,width:n.w*factor,height:n.h*factor};
  return <AssetImage className="scene-node" style={fit} src={n.path} alt="" loading="lazy"/>;
 }
 if(n.type==='rect'||n.type==='ellipse')return <div className="scene-node" aria-hidden="true" style={{...box,background:n.fill,borderRadius:n.type==='ellipse'?'50%':n.radius,border:n.stroke?`1px solid ${n.stroke}`:undefined}}/>;
 if(n.type==='path')return <svg className="scene-lines" viewBox="0 0 1920 1080" aria-hidden="true"><polyline points={n.points.map(p=>p.join(',')).join(' ')} fill="none" stroke={n.stroke} strokeWidth={n.strokeWidth||2} strokeDasharray={n.dash}/></svg>;
 if(n.type==='stack')return <div className="scene-node scene-stack" style={{...box,background:n.fill,padding:n.padding,gap:n.gap,flexDirection:n.direction==='HORIZONTAL'?'row':'column'}}>{n.children.map((c,i)=><div key={i} style={{fontSize:c.size,fontWeight:c.weight,color:c.fill,lineHeight:1.4,whiteSpace:'pre-wrap'}}>{c.text}</div>)}</div>;
 return null;
}
export default function LandscapeScene({scene}){
 const ref=useRef(null),[width,setWidth]=useState(1440);
 useEffect(()=>{const ro=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));ro.observe(ref.current);return()=>ro.disconnect();},[]);
 return <section className="landscape-scene" aria-label={scene.title.replace(/\n/g,' ')}>
  <div className="scene-mobile-caption"><span>DESIGN STORY</span><h3>{scene.title}</h3><p>가로형 장표를 좌우로 움직여 자세히 볼 수 있습니다. ↔</p></div>
  <div className="scene-scroll" tabIndex={0} role="region" aria-label={`${scene.title.replace(/\n/g,' ')} 가로형 장표`}>
   <div className="scene-frame" ref={ref} style={{aspectRatio:'16 / 9',background:scene.bg}}>
    <div className="scene-canvas" style={{transform:`scale(${width/1920})`,background:scene.bg}}>{scene.nodes.map((n,i)=><Node node={n} key={i}/>)}</div>
   </div>
  </div>
 </section>;
}
