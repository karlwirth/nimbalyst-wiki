import{t as B}from"./chunk-JWPE2WC7-BzHt-iNg-DklQLyH0.js";import{_ as f,I as m,M as C,d as v,l as u,b as P,a as z,t as S,v as E,g as F,s as W,G as D,K as T,B as A}from"./mermaid.core-Buv7T_wa-C7YhboGy.js";import{A as M}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import"./jsx-runtime-CWgzqSMV.js";import"./app-BAJjxBPI.js";import"./jsx-dev-runtime-1uWM5yOA.js";import"./react-datagrid-DVKpinm5.js";import"./index-SfcU9ojT.js";import"./CollaborativeCommentsPanel-Cf27858R-le1o-OHN.js";import"./yjs-j_PLrQSG.js";import"./palette-C_m1aAcU.js";import"./MaterialSymbol-DhY9mq77.js";import"./transform-DR5aOz-7-BPch8-kZ.js";import"./cubic-BmTDSGHG-DFNWYbxG.js";import"./step-OMoZTfr0-k4ZH8UTf.js";var Y=T.packet,w=class{constructor(){this.packet=[],this.setAccTitle=P,this.getAccTitle=z,this.setDiagramTitle=S,this.getDiagramTitle=E,this.getAccDescription=F,this.setAccDescription=W}static{f(this,"PacketDB")}getConfig(){const t=m({...Y,...D().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){A(),this.packet=[]}},j=1e4,I=f((t,e)=>{B(t,e);let r=-1,o=[],l=1;const{bitsPerRow:n}=e.getConfig();for(let{start:a,end:s,bits:d,label:c}of t.blocks){if(a!==void 0&&s!==void 0&&s<a)throw new Error(`Packet block ${a} - ${s} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${s??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(s??=a+(d??1)-1,d??=s-a+1,r=s,u.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=n+1&&e.getPacket().length<j;){const[p,i]=L({start:a,end:s,bits:d,label:c},l,n);if(o.push(p),p.end+1===l*n&&(e.pushWord(o),o=[],l++),!i)break;({start:a,end:s,bits:d,label:c}=i)}}e.pushWord(o)},"populate"),L=f((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const o=e*r-1,l=e*r;return[{start:t.start,end:o,label:t.label,bits:o-t.start},{start:l,end:t.end,label:t.label,bits:t.end-l}]},"getNextFittingBlock"),y={parser:{yy:void 0},parse:f(async t=>{const e=await M("packet",t),r=y.parser?.yy;if(!(r instanceof w))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");u.debug(e),I(e,r)},"parse")},N=f((t,e,r,o)=>{const l=o.db,n=l.getConfig(),{rowHeight:a,paddingY:s,bitWidth:d,bitsPerRow:c}=n,p=l.getPacket(),i=l.getDiagramTitle(),h=a+s,k=h*(p.length+1)-(i?0:a),b=d*c+2,g=C(e);g.attr("viewBox",`0 0 ${b} ${k}`),v(g,k,b,n.useMaxWidth);for(const[x,$]of p.entries())R(g,$,x,n);g.append("text").text(i).attr("x",b/2).attr("y",k-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),R=f((t,e,r,{rowHeight:o,paddingX:l,paddingY:n,bitWidth:a,bitsPerRow:s,showBits:d})=>{const c=t.append("g"),p=r*(o+n)+n;for(const i of e){const h=i.start%s*a+1,k=(i.end-i.start+1)*a-l;if(c.append("rect").attr("x",h).attr("y",p).attr("width",k).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",h+k/2).attr("y",p+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!d)continue;const b=i.end===i.start,g=p-2;c.append("text").attr("x",h+(b?k/2:0)).attr("y",g).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(i.start),b||c.append("text").attr("x",h+k).attr("y",g).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),X={draw:N},G={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},H=f(({packet:t}={})=>{const e=m(G,t);return`
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
	`},"styles"),st={parser:y,get db(){return new w},renderer:X,styles:H};export{st as diagram};
