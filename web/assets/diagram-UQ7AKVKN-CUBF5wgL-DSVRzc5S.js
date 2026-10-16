import{t as E}from"./chunk-JWPE2WC7-BzHt-iNg-DklQLyH0.js";import{s as P,g as F,v as R,t as z,a as D,b as B,_ as c,M as G,B as W,I as w,G as k,K as _,l as b,N as j,d as N}from"./mermaid.core-Buv7T_wa-C7YhboGy.js";import{A as V}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import"./jsx-runtime-CWgzqSMV.js";import"./app-BAJjxBPI.js";import"./jsx-dev-runtime-1uWM5yOA.js";import"./react-datagrid-DVKpinm5.js";import"./index-SfcU9ojT.js";import"./CollaborativeCommentsPanel-Cf27858R-le1o-OHN.js";import"./yjs-j_PLrQSG.js";import"./palette-C_m1aAcU.js";import"./MaterialSymbol-DhY9mq77.js";import"./transform-DR5aOz-7-BPch8-kZ.js";import"./cubic-BmTDSGHG-DFNWYbxG.js";import"./step-OMoZTfr0-k4ZH8UTf.js";var x={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},y=32,M={axes:[],curves:[],options:x},m=structuredClone(M),Z=_.radar,K=c(()=>w({...Z,...k().radar}),"getConfig"),C=c(()=>m.axes,"getAxes"),U=c(()=>m.curves,"getCurves"),X=c(()=>m.options,"getOptions"),q=c(a=>{m.axes=a.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),H=c(a=>{m.curves=a.map(t=>({name:t.name,label:t.label??t.name,entries:J(t.entries)}))},"setCurves"),J=c(a=>{if(a[0].axis==null)return a.map(e=>e.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{const r=a.find(i=>i.axis?.$refText===e.name);if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),Q=c(a=>{const t=a.reduce((e,r)=>(e[r.name]=r,e),{});m.options={showLegend:t.showLegend?.value??x.showLegend,ticks:t.ticks?.value??x.ticks,max:t.max?.value??x.max,min:t.min?.value??x.min,graticule:t.graticule?.value??x.graticule},m.options.ticks>y&&(b.warn(`Radar diagram ticks (${m.options.ticks}) exceeds maximum allowed (${y}). Using ${y} instead.`),m.options.ticks=y)},"setOptions"),Y=c(()=>{W(),m=structuredClone(M)},"clear"),f={getAxes:C,getCurves:U,getOptions:X,setAxes:q,setCurves:H,setOptions:Q,getConfig:K,clear:Y,setAccTitle:B,getAccTitle:D,setDiagramTitle:z,getDiagramTitle:R,getAccDescription:F,setAccDescription:P},tt=c(a=>{E(a,f);const{axes:t,curves:e,options:r}=a;f.setAxes(t),f.setCurves(e),f.setOptions(r)},"populate"),et={parse:c(async a=>{const t=await V("radar",a);b.debug(t),tt(t)},"parse")},at=c((a,t,e,r)=>{const i=r.db,o=i.getAxes(),l=i.getCurves(),s=i.getOptions(),n=i.getConfig(),d=i.getDiagramTitle(),g=G(t),p=rt(g,n),u=s.max??Math.max(...l.map(v=>Math.max(...v.entries))),h=s.min,$=Math.min(n.width,n.height)/2;it(p,o,$,s.ticks,s.graticule),st(p,o,$,n),L(p,o,l,h,u,s.graticule,n),O(p,l,s.showLegend,n),p.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-n.height/2-n.marginTop)},"draw"),rt=c((a,t)=>{const e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return N(a,r,e,t.useMaxWidth??!0),a.attr("viewBox",`0 0 ${e} ${r}`).attr("overflow","visible"),a.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),it=c((a,t,e,r,i)=>{if(i==="circle")for(let o=0;o<r;o++){const l=e*(o+1)/r;a.append("circle").attr("r",l).attr("class","radarGraticule")}else if(i==="polygon"){const o=t.length;for(let l=0;l<r;l++){const s=e*(l+1)/r,n=t.map((d,g)=>{const p=2*g*Math.PI/o-Math.PI/2,u=s*Math.cos(p),h=s*Math.sin(p);return`${u},${h}`}).join(" ");a.append("polygon").attr("points",n).attr("class","radarGraticule")}}},"drawGraticule"),st=c((a,t,e,r)=>{const i=t.length;for(let o=0;o<i;o++){const l=t[o].label,s=2*o*Math.PI/i-Math.PI/2,n=Math.cos(s),d=Math.sin(s);a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*n).attr("y2",e*r.axisScaleFactor*d).attr("class","radarAxisLine");const g=n>.01?"start":n<-.01?"end":"middle",p=d>.01?"hanging":d<-.01?"auto":"central",u=4;a.append("text").text(l).attr("x",e*r.axisLabelFactor*n+u*n).attr("y",e*r.axisLabelFactor*d+u*d).attr("text-anchor",g).attr("dominant-baseline",p).attr("class","radarAxisLabel")}},"drawAxes");function L(a,t,e,r,i,o,l){const s=t.length,n=Math.min(l.width,l.height)/2;e.forEach((d,g)=>{if(d.entries.length!==s)return;const p=d.entries.map((u,h)=>{const $=2*Math.PI*h/s-Math.PI/2,v=A(u,r,i,n),S=v*Math.cos($),I=v*Math.sin($);return{x:S,y:I}});o==="circle"?a.append("path").attr("d",T(p,l.curveTension)).attr("class",`radarCurve-${g}`):o==="polygon"&&a.append("polygon").attr("points",p.map(u=>`${u.x},${u.y}`).join(" ")).attr("class",`radarCurve-${g}`)})}c(L,"drawCurves");function A(a,t,e,r){const i=Math.min(Math.max(a,t),e);return r*(i-t)/(e-t)}c(A,"relativeRadius");function T(a,t){const e=a.length;let r=`M${a[0].x},${a[0].y}`;for(let i=0;i<e;i++){const o=a[(i-1+e)%e],l=a[i],s=a[(i+1)%e],n=a[(i+2)%e],d={x:l.x+(s.x-o.x)*t,y:l.y+(s.y-o.y)*t},g={x:s.x-(n.x-l.x)*t,y:s.y-(n.y-l.y)*t};r+=` C${d.x},${d.y} ${g.x},${g.y} ${s.x},${s.y}`}return`${r} Z`}c(T,"closedRoundCurve");function O(a,t,e,r){if(!e)return;const i=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,l=20;t.forEach((s,n)=>{const d=a.append("g").attr("transform",`translate(${i}, ${o+n*l})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${n}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}c(O,"drawLegend");var nt={draw:at},ot=c((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){const i=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return e},"genIndexStyles"),lt=c(a=>{const t=j(),e=k(),r=w(t,e.themeVariables),i=w(r.radar,a);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),ct=c(({radar:a}={})=>{const{themeVariables:t,radarOptions:e}=lt(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${ot(t,e)}
	`},"styles"),Ct={parser:et,db:f,renderer:nt,styles:ct};export{Ct as diagram};
