import React from 'react';
import metadata from './image-metadata.json';

export function imageSize(src){return metadata[src]||{};}
export default function AssetImage({src,style,...props}){
 const {width,height}=imageSize(src);
 return <img {...props} src={src} width={width} height={height} decoding="async" style={{'--asset-width':width?`${width}px`:undefined,'--asset-height':height?`${height}px`:undefined,...style}}/>;
}
