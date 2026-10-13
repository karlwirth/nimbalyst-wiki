import{t as $t}from"./chunk-JWPE2WC7-vsrcfD-k-D2zuW6Xv.js";import{s as gt,g as ut,v as bt,t as wt,a as Ct,b as kt,_ as i,l as O,M as Dt,d as At,B as Bt,I as Q,G as Y,K as Tt,N as rt}from"./mermaid.core-B_7u-4u6-e9XjVAn1.js";import{A as St}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import"./jsx-runtime-CWgzqSMV.js";import"./app-BfLLvfUh.js";import"./jsx-dev-runtime-1uWM5yOA.js";import"./react-datagrid-DVKpinm5.js";import"./index-SfcU9ojT.js";import"./CollaborativeCommentsPanel-Cf27858R-le1o-OHN.js";import"./yjs-j_PLrQSG.js";import"./palette-C_m1aAcU.js";import"./MaterialSymbol-DhY9mq77.js";import"./transform-DR5aOz-7-BPch8-kZ.js";import"./cubic-BmTDSGHG-DFNWYbxG.js";import"./step-OMoZTfr0-k4ZH8UTf.js";var ot=i(()=>({domains:new Map,transitions:[]}),"createDefaultData"),j=ot(),Mt=i(()=>j.domains,"getDomains"),zt=i(()=>j.transitions,"getTransitions"),vt=i(t=>{if(t)for(const e of t){const n=e.domain,a=(e.items??[]).map(c=>({label:c.label}));j.domains.set(n,{name:n,items:a})}},"setDomains"),Pt=i(t=>{t&&(j.transitions=t.filter(e=>e.from===e.to?(O.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`),!1):!0).map(e=>({from:e.from,to:e.to,label:e.label||void 0})))},"setTransitions"),Lt=i(()=>Q({...Tt.cynefin,...Y().cynefin}),"getConfig"),It=i(()=>{Bt(),j=ot()},"clear"),V={getDomains:Mt,getTransitions:zt,setDomains:vt,setTransitions:Pt,getConfig:Lt,clear:It,setAccTitle:kt,getAccTitle:Ct,setDiagramTitle:wt,getDiagramTitle:bt,getAccDescription:ut,setAccDescription:gt},Ft=i(t=>{$t(t,V),V.setDomains(t.domains),V.setTransitions(t.transitions)},"populate"),Rt={parse:i(async t=>{const e=await St("cynefin",t);O.debug(e),Ft(e)},"parse")};function _(t){let e=t+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}i(_,"seededRandom");function it(t){let e=0;for(let n=0;n<t.length;n++){const a=t.charCodeAt(n);e=(e<<5)-e+a,e|=0}return e}i(it,"hashString");function st(t,e){return typeof t=="number"&&Number.isFinite(t)&&t!==0?t:it(e)}i(st,"resolveSeed");function ct(t,e,n,a){const c=t/2,p=a??t*.015,k=7,F=e/k,d=[];for(let r=0;r<=k;r++){const m=_(n+r*17)*p*2-p;d.push({x:c+m,y:r*F})}let D=`M${d[0].x},${d[0].y}`;for(let r=0;r<d.length-1;r++){const m=d[r],s=d[r+1],f=(m.y+s.y)/2,b=r%2===0?1:-1,h=p*1.5*b*_(n+r*31+7),R=m.x+h,W=f,H=s.x-h;D+=` C${R},${W} ${H},${f} ${s.x},${s.y}`}return D}i(ct,"generateFoldPath");function lt(t,e,n,a){const c=e/2,p=a??e*.015,k=7,F=t/k,d=[];for(let r=0;r<=k;r++){const m=_(n+r*23)*p*2-p;d.push({x:r*F,y:c+m})}let D=`M${d[0].x},${d[0].y}`;for(let r=0;r<d.length-1;r++){const m=d[r],s=d[r+1],f=(m.x+s.x)/2,b=r%2===0?1:-1,h=p*1.5*b*_(n+r*37+11),R=f,W=m.y+h,H=f,N=s.y-h;D+=` C${R},${W} ${H},${N} ${s.x},${s.y}`}return D}i(lt,"generateHorizontalBoundary");function dt(t,e){const n=t/2,a=e*.5,c=e,p=t*.03;return[`M${n},${a}`,`C${n+p},${a+(c-a)*.2}`,`${n-p*1.5},${a+(c-a)*.55}`,`${n+p*.5},${a+(c-a)*.75}`,`C${n-p},${a+(c-a)*.85}`,`${n+p*.3},${a+(c-a)*.95}`,`${n},${c}`].join(" ")}i(dt,"generateCliffPath");function ft(t,e,n,a){return[`M${t-n},${e}`,`A${n},${a} 0 1,1 ${t+n},${e}`,`A${n},${a} 0 1,1 ${t-n},${e}`,"Z"].join(" ")}i(ft,"generateConfusionPath");var at={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},Wt=i((t,e)=>{const n=t/2,a=e/2;return{complex:{cx:n/2,cy:a/2,x:0,y:0,w:n,h:a},complicated:{cx:n+n/2,cy:a/2,x:n,y:0,w:n,h:a},chaotic:{cx:n/2,cy:a+a/2,x:0,y:a,w:n,h:a},clear:{cx:n+n/2,cy:a+a/2,x:n,y:a,w:n,h:a},confusion:{cx:n,cy:a,x:n*.7,y:a*.7,w:n*.6,h:a*.6}}},"getDomainLayouts"),Ht=i(()=>{const t=rt(),e=Y();return Q(t,e.themeVariables).cynefin},"getCynefinDomainColors"),q=3,Nt=i((t,e,n,a)=>{const c=a.db,p=c.getDomains(),k=c.getTransitions(),F=c.getDiagramTitle(),d=c.getAccTitle(),D=c.getAccDescription(),r=c.getConfig(),m=Ht();O.debug("Rendering Cynefin diagram");const s=r.width,f=r.height,b=r.padding,h=r.showDomainDescriptions,R=r.boundaryAmplitude,W=s+b*2,H=f+b*2,N={complex:m.complexBg,complicated:m.complicatedBg,clear:m.clearBg,chaotic:m.chaoticBg,confusion:m.confusionBg},A=Dt(e);At(A,H,W,r.useMaxWidth??!0),A.attr("viewBox",`0 0 ${W} ${H}`),d&&A.append("title").text(d),D&&A.append("desc").text(D);const B=A.append("g").attr("transform",`translate(${b}, ${b})`),E=Wt(s,f),J=st(r.seed,e),pt=B.append("g").attr("class","cynefin-backgrounds"),X=["complex","complicated","chaotic","clear"];for(const l of X){const o=E[l];pt.append("rect").attr("class","cynefinDomain").attr("x",o.x).attr("y",o.y).attr("width",o.w).attr("height",o.h).attr("fill",N[l]).attr("fill-opacity",.4).attr("stroke","none")}const Z=B.append("g").attr("class","cynefin-boundaries");Z.append("path").attr("class","cynefinBoundary").attr("d",ct(s,f,J,R)).attr("fill","none"),Z.append("path").attr("class","cynefinBoundary").attr("d",lt(s,f,J+100,R)).attr("fill","none"),Z.append("path").attr("class","cynefinCliff").attr("d",dt(s,f)).attr("fill","none");const mt=s*.15,yt=f*.15;B.append("path").attr("class","cynefinConfusion").attr("d",ft(s/2,f/2,mt,yt)).attr("fill",N.confusion).attr("fill-opacity",.5);const K=B.append("g").attr("class","cynefin-labels");for(const l of X){const o=E[l];K.append("text").attr("class","cynefinDomainLabel").attr("x",o.cx).attr("y",h?o.cy-30:o.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(l.charAt(0).toUpperCase()+l.slice(1))}if(K.append("text").attr("class","cynefinDomainLabel").attr("x",s/2).attr("y",h?f/2-10:f/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),h){const l=B.append("g").attr("class","cynefin-subtitles");for(const o of X){const x=E[o],y=at[o];l.append("text").attr("class","cynefinSubtitle").attr("x",x.cx).attr("y",x.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.model),l.append("text").attr("class","cynefinSubtitle").attr("x",x.cx).attr("y",x.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.practice)}l.append("text").attr("class","cynefinSubtitle").attr("x",s/2).attr("y",f/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(at.confusion.practice)}const U=B.append("g").attr("class","cynefin-items"),T=26,tt=10,xt=["complex","complicated","chaotic","clear","confusion"];for(const l of xt){const o=p.get(l);if(!o||o.items.length===0)continue;const x=E[l],y=l==="confusion";let v=o.items,P=0;y&&o.items.length>q&&(P=o.items.length-q,v=o.items.slice(0,q));let S;if(y){const g=h?22:14;S=x.cy+g}else S=x.cy+(h?25:15);if([...v].forEach((g,M)=>{const w=S+M*(T+4),z=U.append("g"),L=z.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(g.label);let u=g.label.length*7;const $=L.node();if($&&typeof $.getBBox=="function"){const G=$.getBBox();G.width>0&&(u=G.width)}const C=u+tt*2,I=x.cx-C/2;z.attr("transform",`translate(${I}, ${w})`),z.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",C).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",N[l]).attr("fill-opacity",.95),L.attr("x",C/2).attr("y",T/2)}),P>0){const g=S+v.length*(T+4),M=`+${P} more`,w=U.append("g"),z=w.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(M);let L=M.length*7;const u=z.node();if(u&&typeof u.getBBox=="function"){const I=u.getBBox();I.width>0&&(L=I.width)}const $=L+tt*2,C=x.cx-$/2;w.attr("transform",`translate(${C}, ${g})`),w.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",$).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",N[l]).attr("fill-opacity",.6),z.attr("x",$/2).attr("y",T/2)}}if(k.length>0){const l=A.select("defs").empty()?A.append("defs"):A.select("defs"),o=`cynefin-arrow-${e}`;l.append("marker").attr("id",o).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");const x=B.append("g").attr("class","cynefin-arrows");k.forEach(y=>{const v=E[y.from],P=E[y.to];if(!v||!P)return;if(y.from===y.to){O.warn(`Cynefin renderer: skipping self-loop on domain "${y.from}"`);return}const S=v.cx,g=v.cy,M=P.cx,w=P.cy,z=(S+M)/2,L=(g+w)/2,u=M-S,$=w-g,C=Math.sqrt(u*u+$*$),I=C*.15,G=-$/C,ht=u/C,et=z+G*I,nt=L+ht*I;x.append("path").attr("class","cynefinArrowLine").attr("d",`M${S},${g} Q${et},${nt} ${M},${w}`).attr("fill","none").attr("marker-end",`url(#${o})`),y.label&&x.append("text").attr("class","cynefinArrowLabel").attr("x",et).attr("y",nt-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(y.label)})}F&&B.append("text").attr("class","cynefinTitle").attr("x",s/2).attr("y",-b/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(F)},"draw"),Et={draw:Nt},_t=i(()=>{const t=rt(),e=Y();return Q(t,e.themeVariables).cynefin},"getCynefinTheme"),jt=i(()=>{const t=_t();return`
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
	`},"styles"),Gt=jt,oe={parser:Rt,db:V,renderer:Et,styles:Gt};export{oe as diagram};
