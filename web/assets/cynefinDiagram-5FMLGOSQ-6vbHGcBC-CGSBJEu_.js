import{i as $t}from"./chunk-JWPE2WC7-BTohBR_B-CZRycaBS.js";import{s as gt,g as ut,x as bt,v as wt,a as Ct,b as kt,_ as i,l as G,N as Dt,d as Bt,C as At,K as X,L as Tt,H as Z,a3 as rt}from"./index-0in-mCrS-BlnYBuvj.js";import{d as St}from"./cynefin-OW5HDTMX-DabAS0oa-BUlVyUzz.js";import"./jsx-runtime-CWgzqSMV.js";import"./_virtual_web-console-pinned-excalidraw-B5HegxqT.js";import"./index-SfcU9ojT.js";import"./yjs-j_PLrQSG.js";typeof process>"u"&&(globalThis.process={env:{NODE_ENV:"production"},browser:!0,platform:""});var ot=i(()=>({domains:new Map,transitions:[]}),"createDefaultData"),O=ot(),Mt=i(()=>O.domains,"getDomains"),vt=i(()=>O.transitions,"getTransitions"),zt=i(t=>{if(t)for(const e of t){const n=e.domain,a=(e.items??[]).map(c=>({label:c.label}));O.domains.set(n,{name:n,items:a})}},"setDomains"),Lt=i(t=>{t&&(O.transitions=t.filter(e=>e.from===e.to?(G.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`),!1):!0).map(e=>({from:e.from,to:e.to,label:e.label||void 0})))},"setTransitions"),Pt=i(()=>X({...Tt.cynefin,...Z().cynefin}),"getConfig"),It=i(()=>{At(),O=ot()},"clear"),j={getDomains:Mt,getTransitions:vt,setDomains:zt,setTransitions:Lt,getConfig:Pt,clear:It,setAccTitle:kt,getAccTitle:Ct,setDiagramTitle:wt,getDiagramTitle:bt,getAccDescription:ut,setAccDescription:gt},Et=i(t=>{$t(t,j),j.setDomains(t.domains),j.setTransitions(t.transitions)},"populate"),Ft={parse:i(async t=>{const e=await St("cynefin",t);G.debug(e),Et(e)},"parse")};function _(t){let e=t+1831565813|0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}i(_,"seededRandom");function it(t){let e=0;for(let n=0;n<t.length;n++){const a=t.charCodeAt(n);e=(e<<5)-e+a,e|=0}return e}i(it,"hashString");function st(t,e){return typeof t=="number"&&Number.isFinite(t)&&t!==0?t:it(e)}i(st,"resolveSeed");function ct(t,e,n,a){const c=t/2,p=a??t*.015,k=7,E=e/k,d=[];for(let r=0;r<=k;r++){const m=_(n+r*17)*p*2-p;d.push({x:c+m,y:r*E})}let D=`M${d[0].x},${d[0].y}`;for(let r=0;r<d.length-1;r++){const m=d[r],s=d[r+1],f=(m.y+s.y)/2,b=r%2===0?1:-1,h=p*1.5*b*_(n+r*31+7),F=m.x+h,R=f,W=s.x-h;D+=` C${F},${R} ${W},${f} ${s.x},${s.y}`}return D}i(ct,"generateFoldPath");function lt(t,e,n,a){const c=e/2,p=a??e*.015,k=7,E=t/k,d=[];for(let r=0;r<=k;r++){const m=_(n+r*23)*p*2-p;d.push({x:r*E,y:c+m})}let D=`M${d[0].x},${d[0].y}`;for(let r=0;r<d.length-1;r++){const m=d[r],s=d[r+1],f=(m.x+s.x)/2,b=r%2===0?1:-1,h=p*1.5*b*_(n+r*37+11),F=f,R=m.y+h,W=f,N=s.y-h;D+=` C${F},${R} ${W},${N} ${s.x},${s.y}`}return D}i(lt,"generateHorizontalBoundary");function dt(t,e){const n=t/2,a=e*.5,c=e,p=t*.03;return[`M${n},${a}`,`C${n+p},${a+(c-a)*.2}`,`${n-p*1.5},${a+(c-a)*.55}`,`${n+p*.5},${a+(c-a)*.75}`,`C${n-p},${a+(c-a)*.85}`,`${n+p*.3},${a+(c-a)*.95}`,`${n},${c}`].join(" ")}i(dt,"generateCliffPath");function ft(t,e,n,a){return[`M${t-n},${e}`,`A${n},${a} 0 1,1 ${t+n},${e}`,`A${n},${a} 0 1,1 ${t-n},${e}`,"Z"].join(" ")}i(ft,"generateConfusionPath");var at={complex:{model:"Probe → Sense → Respond",practice:"Emergent Practices"},complicated:{model:"Sense → Analyse → Respond",practice:"Good Practices"},clear:{model:"Sense → Categorise → Respond",practice:"Best Practices"},chaotic:{model:"Act → Sense → Respond",practice:"Novel Practices"},confusion:{model:"",practice:"Disorder"}},Rt=i((t,e)=>{const n=t/2,a=e/2;return{complex:{cx:n/2,cy:a/2,x:0,y:0,w:n,h:a},complicated:{cx:n+n/2,cy:a/2,x:n,y:0,w:n,h:a},chaotic:{cx:n/2,cy:a+a/2,x:0,y:a,w:n,h:a},clear:{cx:n+n/2,cy:a+a/2,x:n,y:a,w:n,h:a},confusion:{cx:n,cy:a,x:n*.7,y:a*.7,w:n*.6,h:a*.6}}},"getDomainLayouts"),Wt=i(()=>{const t=rt(),e=Z();return X(t,e.themeVariables).cynefin},"getCynefinDomainColors"),Q=3,Nt=i((t,e,n,a)=>{const c=a.db,p=c.getDomains(),k=c.getTransitions(),E=c.getDiagramTitle(),d=c.getAccTitle(),D=c.getAccDescription(),r=c.getConfig(),m=Wt();G.debug("Rendering Cynefin diagram");const s=r.width,f=r.height,b=r.padding,h=r.showDomainDescriptions,F=r.boundaryAmplitude,R=s+b*2,W=f+b*2,N={complex:m.complexBg,complicated:m.complicatedBg,clear:m.clearBg,chaotic:m.chaoticBg,confusion:m.confusionBg},B=Dt(e);Bt(B,W,R,r.useMaxWidth??!0),B.attr("viewBox",`0 0 ${R} ${W}`),d&&B.append("title").text(d),D&&B.append("desc").text(D);const A=B.append("g").attr("transform",`translate(${b}, ${b})`),H=Rt(s,f),J=st(r.seed,e),pt=A.append("g").attr("class","cynefin-backgrounds"),K=["complex","complicated","chaotic","clear"];for(const l of K){const o=H[l];pt.append("rect").attr("class","cynefinDomain").attr("x",o.x).attr("y",o.y).attr("width",o.w).attr("height",o.h).attr("fill",N[l]).attr("fill-opacity",.4).attr("stroke","none")}const q=A.append("g").attr("class","cynefin-boundaries");q.append("path").attr("class","cynefinBoundary").attr("d",ct(s,f,J,F)).attr("fill","none"),q.append("path").attr("class","cynefinBoundary").attr("d",lt(s,f,J+100,F)).attr("fill","none"),q.append("path").attr("class","cynefinCliff").attr("d",dt(s,f)).attr("fill","none");const mt=s*.15,yt=f*.15;A.append("path").attr("class","cynefinConfusion").attr("d",ft(s/2,f/2,mt,yt)).attr("fill",N.confusion).attr("fill-opacity",.5);const U=A.append("g").attr("class","cynefin-labels");for(const l of K){const o=H[l];U.append("text").attr("class","cynefinDomainLabel").attr("x",o.cx).attr("y",h?o.cy-30:o.cy).attr("text-anchor","middle").attr("dominant-baseline","middle").text(l.charAt(0).toUpperCase()+l.slice(1))}if(U.append("text").attr("class","cynefinDomainLabel").attr("x",s/2).attr("y",h?f/2-10:f/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text("Confusion"),h){const l=A.append("g").attr("class","cynefin-subtitles");for(const o of K){const x=H[o],y=at[o];l.append("text").attr("class","cynefinSubtitle").attr("x",x.cx).attr("y",x.cy-10).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.model),l.append("text").attr("class","cynefinSubtitle").attr("x",x.cx).attr("y",x.cy+5).attr("text-anchor","middle").attr("dominant-baseline","middle").text(y.practice)}l.append("text").attr("class","cynefinSubtitle").attr("x",s/2).attr("y",f/2+8).attr("text-anchor","middle").attr("dominant-baseline","middle").text(at.confusion.practice)}const Y=A.append("g").attr("class","cynefin-items"),T=26,tt=10,xt=["complex","complicated","chaotic","clear","confusion"];for(const l of xt){const o=p.get(l);if(!o||o.items.length===0)continue;const x=H[l],y=l==="confusion";let z=o.items,L=0;y&&o.items.length>Q&&(L=o.items.length-Q,z=o.items.slice(0,Q));let S;if(y){const g=h?22:14;S=x.cy+g}else S=x.cy+(h?25:15);if([...z].forEach((g,M)=>{const w=S+M*(T+4),v=Y.append("g"),P=v.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(g.label);let u=g.label.length*7;const $=P.node();if($&&typeof $.getBBox=="function"){const V=$.getBBox();V.width>0&&(u=V.width)}const C=u+tt*2,I=x.cx-C/2;v.attr("transform",`translate(${I}, ${w})`),v.insert("rect","text").attr("class","cynefinItem").attr("x",0).attr("y",0).attr("width",C).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",N[l]).attr("fill-opacity",.95),P.attr("x",C/2).attr("y",T/2)}),L>0){const g=S+z.length*(T+4),M=`+${L} more`,w=Y.append("g"),v=w.append("text").attr("class","cynefinItemText").attr("x",0).attr("y",T/2).attr("text-anchor","middle").attr("dominant-baseline","central").text(M);let P=M.length*7;const u=v.node();if(u&&typeof u.getBBox=="function"){const I=u.getBBox();I.width>0&&(P=I.width)}const $=P+tt*2,C=x.cx-$/2;w.attr("transform",`translate(${C}, ${g})`),w.insert("rect","text").attr("class","cynefinItemOverflow").attr("x",0).attr("y",0).attr("width",$).attr("height",T).attr("rx",4).attr("ry",4).attr("fill",N[l]).attr("fill-opacity",.6),v.attr("x",$/2).attr("y",T/2)}}if(k.length>0){const l=B.select("defs").empty()?B.append("defs"):B.select("defs"),o=`cynefin-arrow-${e}`;l.append("marker").attr("id",o).attr("viewBox","0 0 10 10").attr("refX",9).attr("refY",5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto-start-reverse").append("path").attr("d","M 0 0 L 10 5 L 0 10 z").attr("class","cynefinArrowHead");const x=A.append("g").attr("class","cynefin-arrows");k.forEach(y=>{const z=H[y.from],L=H[y.to];if(!z||!L)return;if(y.from===y.to){G.warn(`Cynefin renderer: skipping self-loop on domain "${y.from}"`);return}const S=z.cx,g=z.cy,M=L.cx,w=L.cy,v=(S+M)/2,P=(g+w)/2,u=M-S,$=w-g,C=Math.sqrt(u*u+$*$),I=C*.15,V=-$/C,ht=u/C,et=v+V*I,nt=P+ht*I;x.append("path").attr("class","cynefinArrowLine").attr("d",`M${S},${g} Q${et},${nt} ${M},${w}`).attr("fill","none").attr("marker-end",`url(#${o})`),y.label&&x.append("text").attr("class","cynefinArrowLabel").attr("x",et).attr("y",nt-6).attr("text-anchor","middle").attr("dominant-baseline","auto").text(y.label)})}E&&A.append("text").attr("class","cynefinTitle").attr("x",s/2).attr("y",-b/2).attr("text-anchor","middle").attr("dominant-baseline","middle").text(E)},"draw"),Ht={draw:Nt},_t=i(()=>{const t=rt(),e=Z();return X(t,e.themeVariables).cynefin},"getCynefinTheme"),Ot=i(()=>{const t=_t();return`
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
	`},"styles"),Vt=Ot,Jt={parser:Ft,db:j,renderer:Ht,styles:Vt};export{Jt as diagram};
