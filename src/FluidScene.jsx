import {useEffect,useRef} from 'react';
const vertex=`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision highp float;
uniform vec2 resolution;uniform vec2 pointer;uniform float time;uniform float activity;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.;float a=.5;for(int i=0;i<4;i++){s+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=.5;}return s;}
float field(vec2 p){vec2 q=vec2(fbm(p+time*.045),fbm(p+vec2(4.7,1.3)-time*.035));return fbm(p+3.9*q+vec2(time*.025,0.));}
void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*3.2;
vec2 m=(pointer-.5)*vec2(resolution.x/resolution.y,1.)*3.2;float near=exp(-dot(p-m,p-m)*2.2)*activity;
p+=.12*near*vec2(sin(p.y*7.+time),cos(p.x*7.-time));float f=field(p);
float band=sin(f*13.+p.x*.35);float silver=pow(.5+.5*band,17.);float sheen=pow(.5+.5*sin(f*13.+.45),5.)*.18;
float v=.013+silver*.72+sheen;vec3 c=vec3(v*.91,v*.96,v);
float fringe=sin(f*30.+near*7.);vec3 rainbow=.5+.5*cos(vec3(0.,2.,4.)+fringe*2.5);
c=mix(c,c*rainbow*1.65,near*.65);c*=.75+.25*smoothstep(1.2,.1,length(uv-.5));gl_FragColor=vec4(c,1.);}`;
export default function FluidScene(){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,gl=canvas.getContext('webgl',{alpha:false,antialias:false});if(!gl)return;
  const shaders=[];function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));shaders.push(s);return s;}
  let program;try{program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Fluid shader link failed');}catch(e){console.warn(e);return;}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const at=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
  const uniforms=Object.fromEntries(['resolution','pointer','time','activity'].map(k=>[k,gl.getUniformLocation(program,k)]));
  const media=matchMedia('(prefers-reduced-motion: reduce)');let target=[.5,.5],mouse=[.5,.5],energy=0,last=0,raf=0;
  const resize=()=>{const ratio=Math.min(devicePixelRatio,1.2);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);gl.viewport(0,0,canvas.width,canvas.height);render(0);};
  const move=e=>{target=[e.clientX/innerWidth,1-e.clientY/innerHeight];energy=1;};
  function render(t){mouse=mouse.map((v,i)=>v+(target[i]-v)*.07);energy*=.985;gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform2f(uniforms.pointer,...mouse);gl.uniform1f(uniforms.time,t*.001);gl.uniform1f(uniforms.activity,media.matches?0:energy);gl.drawArrays(gl.TRIANGLES,0,6);}
  function loop(t){raf=requestAnimationFrame(loop);if(document.hidden||media.matches||t-last<32)return;last=t;render(t);}
  resize();raf=requestAnimationFrame(loop);window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));};
 },[]);
 return <div className="fluid-scene" aria-hidden="true"><canvas ref={ref}/></div>;
}
