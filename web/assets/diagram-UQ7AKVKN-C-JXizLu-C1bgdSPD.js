import{t as E}from"./chunk-JWPE2WC7-vsrcfD-k-DOCY7ZPb.js";import{ac as P,ad as D,at as F,as as R,ae as z,af as B,u as c,aH as G,au as W,aD as w,aB as k,aE as j,P as b,aJ as V,ag as Z}from"./mermaid.core-B_7u-4u6-CLEC9s9X.js";import{A as _}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import"./index--VxRUqh6.js";import"./step-OMoZTfr0-oBM7tmSJ.js";var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},v=32,M={axes:[],curves:[],options:h},x=structuredClone(M),H=j.radar,J=c(()=>w({...H,...k().radar}),"getConfig"),C=c(()=>x.axes,"getAxes"),N=c(()=>x.curves,"getCurves"),U=c(()=>x.options,"getOptions"),X=c(a=>{x.axes=a.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),q=c(a=>{x.curves=a.map(t=>({name:t.name,label:t.label??t.name,entries:K(t.entries)}))},"setCurves"),K=c(a=>{if(a[0].axis==null)return a.map(e=>e.value);const t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{const r=a.find(s=>s.axis?.$refText===e.name);if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),Q=c(a=>{const t=a.reduce((e,r)=>(e[r.name]=r,e),{});x.options={showLegend:t.showLegend?.value??h.showLegend,ticks:t.ticks?.value??h.ticks,max:t.max?.value??h.max,min:t.min?.value??h.min,graticule:t.graticule?.value??h.graticule},x.options.ticks>v&&(b.warn(`Radar diagram ticks (${x.options.ticks}) exceeds maximum allowed (${v}). Using ${v} instead.`),x.options.ticks=v)},"setOptions"),Y=c(()=>{W(),x=structuredClone(M)},"clear"),f={getAxes:C,getCurves:N,getOptions:U,setAxes:X,setCurves:q,setOptions:Q,getConfig:J,clear:Y,setAccTitle:B,getAccTitle:z,setDiagramTitle:R,getDiagramTitle:F,getAccDescription:D,setAccDescription:P},tt=c(a=>{E(a,f);const{axes:t,curves:e,options:r}=a;f.setAxes(t),f.setCurves(e),f.setOptions(r)},"populate"),et={parse:c(async a=>{const t=await _("radar",a);b.debug(t),tt(t)},"parse")},at=c((a,t,e,r)=>{const s=r.db,o=s.getAxes(),l=s.getCurves(),i=s.getOptions(),n=s.getConfig(),d=s.getDiagramTitle(),u=G(t),g=rt(u,n),p=i.max??Math.max(...l.map(y=>Math.max(...y.entries))),m=i.min,$=Math.min(n.width,n.height)/2;st(g,o,$,i.ticks,i.graticule),it(g,o,$,n),L(g,o,l,m,p,i.graticule,n),O(g,l,i.showLegend,n),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-n.height/2-n.marginTop)},"draw"),rt=c((a,t)=>{const e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,s={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return Z(a,r,e,t.useMaxWidth??!0),a.attr("viewBox",`0 0 ${e} ${r}`).attr("overflow","visible"),a.append("g").attr("transform",`translate(${s.x}, ${s.y})`)},"drawFrame"),st=c((a,t,e,r,s)=>{if(s==="circle")for(let o=0;o<r;o++){const l=e*(o+1)/r;a.append("circle").attr("r",l).attr("class","radarGraticule")}else if(s==="polygon"){const o=t.length;for(let l=0;l<r;l++){const i=e*(l+1)/r,n=t.map((d,u)=>{const g=2*u*Math.PI/o-Math.PI/2,p=i*Math.cos(g),m=i*Math.sin(g);return`${p},${m}`}).join(" ");a.append("polygon").attr("points",n).attr("class","radarGraticule")}}},"drawGraticule"),it=c((a,t,e,r)=>{const s=t.length;for(let o=0;o<s;o++){const l=t[o].label,i=2*o*Math.PI/s-Math.PI/2,n=Math.cos(i),d=Math.sin(i);a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*n).attr("y2",e*r.axisScaleFactor*d).attr("class","radarAxisLine");const u=n>.01?"start":n<-.01?"end":"middle",g=d>.01?"hanging":d<-.01?"auto":"central",p=4;a.append("text").text(l).attr("x",e*r.axisLabelFactor*n+p*n).attr("y",e*r.axisLabelFactor*d+p*d).attr("text-anchor",u).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function L(a,t,e,r,s,o,l){const i=t.length,n=Math.min(l.width,l.height)/2;e.forEach((d,u)=>{if(d.entries.length!==i)return;const g=d.entries.map((p,m)=>{const $=2*Math.PI*m/i-Math.PI/2,y=A(p,r,s,n),S=y*Math.cos($),I=y*Math.sin($);return{x:S,y:I}});o==="circle"?a.append("path").attr("d",T(g,l.curveTension)).attr("class",`radarCurve-${u}`):o==="polygon"&&a.append("polygon").attr("points",g.map(p=>`${p.x},${p.y}`).join(" ")).attr("class",`radarCurve-${u}`)})}c(L,"drawCurves");function A(a,t,e,r){const s=Math.min(Math.max(a,t),e);return r*(s-t)/(e-t)}c(A,"relativeRadius");function T(a,t){const e=a.length;let r=`M${a[0].x},${a[0].y}`;for(let s=0;s<e;s++){const o=a[(s-1+e)%e],l=a[s],i=a[(s+1)%e],n=a[(s+2)%e],d={x:l.x+(i.x-o.x)*t,y:l.y+(i.y-o.y)*t},u={x:i.x-(n.x-l.x)*t,y:i.y-(n.y-l.y)*t};r+=` C${d.x},${d.y} ${u.x},${u.y} ${i.x},${i.y}`}return`${r} Z`}c(T,"closedRoundCurve");function O(a,t,e,r){if(!e)return;const s=(r.width/2+r.marginRight)*3/4,o=-(r.height/2+r.marginTop)*3/4,l=20;t.forEach((i,n)=>{const d=a.append("g").attr("transform",`translate(${s}, ${o+n*l})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${n}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(i.label)})}c(O,"drawLegend");var nt={draw:at},ot=c((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){const s=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${s};
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
		}
		`}return e},"genIndexStyles"),lt=c(a=>{const t=V(),e=k(),r=w(t,e.themeVariables),s=w(r.radar,a);return{themeVariables:r,radarOptions:s}},"buildRadarStyleOptions"),ct=c(({radar:a}={})=>{const{themeVariables:t,radarOptions:e}=lt(a);return`
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
	`},"styles"),ht={parser:et,db:f,renderer:nt,styles:ct};export{ht as diagram};
