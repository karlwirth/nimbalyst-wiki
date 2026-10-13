import{t as $t}from"./chunk-JWPE2WC7-vsrcfD-k-DOCY7ZPb.js";import{ac as gt,ad as ut,at as bt,as as wt,ae as Ct,af as kt,u as i,P as O,aH as Dt,ag as At,au as Bt,aD as J,aB as Q,aE as Tt,aJ as rt}from"./mermaid.core-B_7u-4u6-CLEC9s9X.js";import{A as St}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import"./index--VxRUqh6.js";import"./step-OMoZTfr0-oBM7tmSJ.js";var ot=i(()=>({domains:new Map,transitions:[]}),"createDefaultData"),_=ot(),Mt=i(()=>_.domains,"getDomains"),zt=i(()=>_.transitions,"getTransitions"),Pt=i(t=>{if(t)for(const e of t){const a=e.domain,n=(e.items??[]).map(c=>({label:c.label}));_.domains.set(a,{name:a,items:n})}},"setDomains"),vt=i(t=>{t&&(_.transitions=t.filter(e=>e.from===e.to?(O.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`),!1):!0).map(e=>({from:e.from,to:e.to,label:e.label||void 0})))},"setTransitions"),Lt=i(()=>J({...Tt.cynefin,...Q().cynefin}),"getConfig"),Ft=i(()=>{Bt(),_=ot()},"clear"),G={getDomains:Mt,getTransitions:zt,setDomains:Pt,setTransitions:vt,getConfig:Lt,clear:Ft,setAccTitle:kt,getAccTitle:Ct,setDiagramTitle:wt,getDiagramTitle:bt,getAccDescription:ut,setAccDescription:gt},It=i(t=>{$t(t,G),G.setDomains(t.domains),G.setTransitions(t.transitions)},"populate"),Rt={parse:i(async t=>{const e=await St("cynefin",t);O.debug(e),It(e)},"parse")};function j(t){let e=t+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}i(j,"seededRandom");function it(t){let e=0;for(let a=0;a<t.length;a++){const n=t.charCodeAt(a);e=(e<<5)-e+n,e|=0}return e}i(it,"hashString");function st(t,e){return typeof t=="number"&&Number.isFinite(t)&&t!==0?t:it(e)}i(st,"resolveSeed");function ct(t,e,a,n){const c=t/2,p=n??t*.015,k=7,I=e/k,d=[];for(let r=0;r<=k;r++){const m=j(a+r*17)*p*2-p;d.push({x:c+m,y:r*I})}let D=`M${d[0].x},${d[0].y}`;for(let r=0;r<d.length-1;r++){const m=d[r],s=d[r+1],f=(m.y+s.y)/2,b=r%2===0?1:-1,h=p*1.5*b*j(a+r*31+7),R=m.x+h,W=f,H=s.x-h;D+=` C${R},${W} ${H},${f} ${s.x},${s.y}`}return D}i(ct,"generateFoldPath");function lt(t,e,a,n){const c=e/2,p=n??e*.015,k=7,I=t/k,d=[];for(let r=0;r<=k;r++){const m=j(a+r*23)*p*2-p;d.push({x:r*I,y:c+m})}let D=`M${d[0].x},${d[0].y}`;for(let r=0;r<d.length-1;r++){const m=d[r],s=d[r+1],f=(m.x+s.x)/2,b=r%2===0?1:-1,h=p*1.5*b*j(a+r*37+11),R=f,W=m.y+h,H=f,E=s.y-h;D+=` C${R},${W} ${H},${E} ${s.x},${s.y}`}return D}i(lt,"generateHorizontalBoundary");function dt(t,e){const a=t/2,n=e*.5,c=e,p=t*.03;return[`M${a},${n}`,`C${a+p},${n+(c-n)*.2}`,`${a-p*1.5},${n+(c-n)*.55}`,`${a+p*.5},${n+(c-n)*.75}`,`C${a-p},${n+(c-n)*.85}`,`${a+p*.3},${n+(c-n)*.95}`,`${a},${c}`].join(" ")}i(dt,"generateCliffPath");function ft(t,e,a,n){return[`M${t-a},${e}`,`A${a},${n} 0 1,1 ${t+a},${e}`,`A${a},${n} 0 1,1 ${t-a},${e}`,"Z"].join(" ")}i(ft,"generateConfusionPath");var nt={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},Wt=i((t,e)=>{const a=t/2,n=e/2;return{complex:{cx:a/2,cy:n/2,x:0,y:0,w:a,h:n},complicated:{cx:a+a/2,cy:n/2,x:a,y:0,w:a,h:n},chaotic:{cx:a/2,cy:n+n/2,x:0,y:n,w:a,h:n},clear:{cx:a+a/2,cy:n+n/2,x:a,y:n,w:a,h:n},confusion:{cx:a,cy:n,x:a*.7,y:n*.7,w:a*.6,h:n*.6}}},"getDomainLayouts"),Ht=i(()=>{const t=rt(),e=Q();return J(t,e.themeVariables).cynefin},"getCynefinDomainColors"),q=3,Et=i((t,e,a,n)=>{const c=n.db,p=c.getDomains(),k=c.getTransitions(),I=c.getDiagramTitle(),d=c.getAccTitle(),D=c.getAccDescription(),r=c.getConfig(),m=Ht();O.debug("Rendering Cynefin diagram");const s=r.width,f=r.height,b=r.padding,h=r.showDomainDescriptions,R=r.boundaryAmplitude,W=s+b*2,H=f+b*2,E={complex:m.complexBg,complicated:m.complicatedBg,clear:m.clearBg,chaotic:m.chaoticBg,confusion:m.confusionBg},A=Dt(e);At(A,H,W,r.useMaxWidth??!0),A.attr("viewBox",`0 0 ${W} ${H}`),d&&A.append("title").text(d),D&&A.append("desc").text(D);const B=A.append("g").attr("transform",`translate(${b}, ${b})`),N=Wt(s,f),Y=st(r.seed,e),pt=B.append("g").attr("class","cynefin-backgrounds"),X=["complex","complicated","chaotic","clear"];for(const l of X){const o=N[l];pt.append("rect").attr("class","cynefinDomain").attr("x",o.x).attr("y",o.y).attr("width",o.w).attr("height",o.h).attr("fill",E[l]).attr("fill-opacity",.4).attr("stroke","none")}const Z=B.append("g").attr("class","cynefin-boundaries");Z.append("path").attr("class","cynefinBoundary").attr("d",ct(s,f,Y,R)).attr("fill","none"),Z.append("path").attr("class","cynefinBoundary").attr("d",lt(s,f,Y+100,R)).attr("fill","none"),Z.append("path").attr("class","cynefinCliff").attr("d",dt(s,f)).attr("fill","none");const mt=s*.15,yt=f*.15;B.append("path").attr("class","cynefinConfusion").attr("d",ft(s/2,f/2,mt,yt)).attr("fill",E.confusion).attr("fill-opacity",.5);const U=B.append("g").attr("class","cynefin-labels");for(const l of X){const o=N[l];U.append("text").attr("class","cynefinDomainLabel").attr("x",o.cx).attr("y",h?o.cy-30:o.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(l.charAt(0).toUpperCase()+l.slice(1))}if(U.append("text").attr("class","cynefinDomainLabel").attr("x",s/2).attr("y",h?f/2-10:f/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),h){const l=B.append("g").attr("class","cynefin-subtitles");for(const o of X){const x=N[o],y=nt[o];l.append("text").attr("class","cynefinSubtitle").attr("x",x.cx).attr("y",x.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.model),l.append("text").attr("class","cynefinSubtitle").attr("x",x.cx).attr("y",x.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.practice)}l.append("text").attr("class","cynefinSubtitle").attr("x",s/2).attr("y",f/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(nt.confusion.practice)}const K=B.append("g").attr("class","cynefin-items"),T=26,tt=10,xt=["complex","complicated","chaotic","clear","confusion"];for(const l of xt){const o=p.get(l);if(!o||o.items.length===0)continue;const x=N[l],y=l==="confusion";let P=o.items,v=0;y&&o.items.length>q&&(v=o.items.length-q,P=o.items.slice(0,q));let S;if(y){const g=h?22:14;S=x.cy+g}else S=x.cy+(h?25:15);if([...P].forEach((g,M)=>{const w=S+M*(T+4),z=K.append("g"),L=z.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(g.label);let u=g.label.length*7;const $=L.node();if($&&typeof $.getBBox=="function"){const V=$.getBBox();V.width>0&&(u=V.width)}const C=u+tt*2,F=x.cx-C/2;z.attr("transform",`translate(${F}, ${w})`),z.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",C).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",E[l]).attr("fill-opacity",.95),L.attr("x",C/2).attr("y",T/2)}),v>0){const g=S+P.length*(T+4),M=`+${v} more`,w=K.append("g"),z=w.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(M);let L=M.length*7;const u=z.node();if(u&&typeof u.getBBox=="function"){const F=u.getBBox();F.width>0&&(L=F.width)}const $=L+tt*2,C=x.cx-$/2;w.attr("transform",`translate(${C}, ${g})`),w.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",$).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",E[l]).attr("fill-opacity",.6),z.attr("x",$/2).attr("y",T/2)}}if(k.length>0){const l=A.select("defs").empty()?A.append("defs"):A.select("defs"),o=`cynefin-arrow-${e}`;l.append("marker").attr("id",o).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");const x=B.append("g").attr("class","cynefin-arrows");k.forEach(y=>{const P=N[y.from],v=N[y.to];if(!P||!v)return;if(y.from===y.to){O.warn(`Cynefin renderer: skipping self-loop on domain "${y.from}"`);return}const S=P.cx,g=P.cy,M=v.cx,w=v.cy,z=(S+M)/2,L=(g+w)/2,u=M-S,$=w-g,C=Math.sqrt(u*u+$*$),F=C*.15,V=-$/C,ht=u/C,et=z+V*F,at=L+ht*F;x.append("path").attr("class","cynefinArrowLine").attr("d",`M${S},${g} Q${et},${at} ${M},${w}`).attr("fill","none").attr("marker-end",`url(#${o})`),y.label&&x.append("text").attr("class","cynefinArrowLabel").attr("x",et).attr("y",at-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(y.label)})}I&&B.append("text").attr("class","cynefinTitle").attr("x",s/2).attr("y",-b/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(I)},"draw"),Nt={draw:Et},jt=i(()=>{const t=rt(),e=Q();return J(t,e.themeVariables).cynefin},"getCynefinTheme"),_t=i(()=>{const t=jt();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${t.domainFontSize}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${t.itemFontSize}px;
		fill: ${t.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${t.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${t.boundaryColor};
		stroke-width: ${t.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${t.cliffColor};
		stroke-width: ${t.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${t.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${t.arrowColor};
		stroke-width: ${t.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${t.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${t.itemFontSize-1}px;
		fill: ${t.textColor};
	}
	.cynefinTitle {
		font-size: ${t.domainFontSize+2}px;
		font-weight: bold;
		fill: ${t.labelColor};
	}
	`},"styles"),Vt=_t,Jt={parser:Rt,db:G,renderer:Nt,styles:Vt};export{Jt as diagram};
