import{i as C}from"./chunk-JWPE2WC7-BqjNIUEV-Byu1l-aV.js";import{_ as f,K as m,N as v,d as P,l as w,b as E,a as z,v as F,x as S,g as T,s as W,L as D,H as A,C as K}from"./index-CJPWMXau-B-URthjG.js";import{d as H}from"./cynefin-OW5HDTMX-DabAS0oa-BUlVyUzz.js";import"./jsx-runtime-CWgzqSMV.js";import"./_virtual_web-console-pinned-excalidraw-DM-bw93Y.js";import"./index-SfcU9ojT.js";import"./yjs-j_PLrQSG.js";typeof process>"u"&&(globalThis.process={env:{NODE_ENV:"production"},browser:!0,platform:""});var L=D.packet,u,y=(u=class{constructor(){this.packet=[],this.setAccTitle=E,this.getAccTitle=z,this.setDiagramTitle=F,this.getDiagramTitle=S,this.getAccDescription=T,this.setAccDescription=W}getConfig(){const t=m({...L,...A().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){K(),this.packet=[]}},f(u,"PacketDB"),u),M=1e4,N=f((t,e)=>{C(t,e);let r=-1,o=[],l=1;const{bitsPerRow:n}=e.getConfig();for(let{start:a,end:i,bits:d,label:c}of t.blocks){if(a!==void 0&&i!==void 0&&i<a)throw new Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${i??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i??=a+(d??1)-1,d??=i-a+1,r=i,w.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=n+1&&e.getPacket().length<M;){const[p,s]=Y({start:a,end:i,bits:d,label:c},l,n);if(o.push(p),p.end+1===l*n&&(e.pushWord(o),o=[],l++),!s)break;({start:a,end:i,bits:d,label:c}=s)}}e.pushWord(o)},"populate"),Y=f((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const o=e*r-1,l=e*r;return[{start:t.start,end:o,label:t.label,bits:o-t.start},{start:l,end:t.end,label:t.label,bits:t.end-l}]},"getNextFittingBlock"),x={parser:{yy:void 0},parse:f(async t=>{const e=await H("packet",t),r=x.parser?.yy;if(!(r instanceof y))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(e),N(e,r)},"parse")},I=f((t,e,r,o)=>{const l=o.db,n=l.getConfig(),{rowHeight:a,paddingY:i,bitWidth:d,bitsPerRow:c}=n,p=l.getPacket(),s=l.getDiagramTitle(),h=a+i,k=h*(p.length+1)-(s?0:a),b=d*c+2,g=v(e);g.attr("viewBox",`0 0 ${b} ${k}`),P(g,k,b,n.useMaxWidth);for(const[$,B]of p.entries())O(g,B,$,n);g.append("text").text(s).attr("x",b/2).attr("y",k-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),O=f((t,e,r,{rowHeight:o,paddingX:l,paddingY:n,bitWidth:a,bitsPerRow:i,showBits:d})=>{const c=t.append("g"),p=r*(o+n)+n;for(const s of e){const h=s.start%i*a+1,k=(s.end-s.start+1)*a-l;if(c.append("rect").attr("x",h).attr("y",p).attr("width",k).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",h+k/2).attr("y",p+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(s.label),!d)continue;const b=s.end===s.start,g=p-2;c.append("text").attr("x",h+(b?k/2:0)).attr("y",g).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(s.start),b||c.append("text").attr("x",h+k).attr("y",g).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(s.end)}},"drawWord"),R={draw:I},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},X=f(({packet:t}={})=>{const e=m(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),Z={parser:x,get db(){return new y},renderer:R,styles:X};export{Z as diagram};
