import{i as at}from"./chunk-JWPE2WC7-BTohBR_B-CZRycaBS.js";import{g as rt,s as nt,a as it,b as lt,x as ot,v as st,_ as h,l as P,c as ct,K as pt,N as ut,a6 as dt,d as ht,C as gt,L as ft,$ as T,b6 as mt,R as K}from"./index-0in-mCrS-BlnYBuvj.js";import{d as yt}from"./cynefin-OW5HDTMX-DabAS0oa-BUlVyUzz.js";import{h as U}from"./arc-CQpCjPv5-kln2uIlF.js";import{h as xt}from"./ordinal-DLUMsMk_-BQAR3AU-.js";import"./jsx-runtime-CWgzqSMV.js";import"./_virtual_web-console-pinned-excalidraw-B5HegxqT.js";import"./index-SfcU9ojT.js";import"./yjs-j_PLrQSG.js";import"./init-CiHOf38z-NHiL3ND2.js";typeof process>"u"&&(globalThis.process={env:{NODE_ENV:"production"},browser:!0,platform:""});function $t(t,n){return n<t?-1:n>t?1:n>=t?0:NaN}function wt(t){return t}function vt(){var t=wt,n=$t,w=null,c=T(0),p=T(K),C=T(0);function i(e){var r,o=(e=mt(e)).length,g,v,k=0,f=new Array(o),l=new Array(o),A=+c.apply(this,arguments),O=Math.min(K,Math.max(-K,p.apply(this,arguments)-A)),D,N=Math.min(Math.abs(O)/o,C.apply(this,arguments)),u=N*(O<0?-1:1),S;for(r=0;r<o;++r)(S=l[f[r]=r]=+t(e[r],r,e))>0&&(k+=S);for(n!=null?f.sort(function(R,m){return n(l[R],l[m])}):w!=null&&f.sort(function(R,m){return w(e[R],e[m])}),r=0,v=k?(O-o*u)/k:0;r<o;++r,A=D)g=f[r],S=l[g],D=A+(S>0?S*v:0)+u,l[g]={data:e[g],index:r,value:S,startAngle:A,endAngle:D,padAngle:N};return l}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:T(+e),i):t},i.sortValues=function(e){return arguments.length?(n=e,w=null,i):n},i.sort=function(e){return arguments.length?(w=e,n=null,i):w},i.startAngle=function(e){return arguments.length?(c=typeof e=="function"?e:T(+e),i):c},i.endAngle=function(e){return arguments.length?(p=typeof e=="function"?e:T(+e),i):p},i.padAngle=function(e){return arguments.length?(C=typeof e=="function"?e:T(+e),i):C},i}var St=ft.pie,_={sections:new Map,showData:!1},H=_.sections,B=_.showData,bt=structuredClone(St),kt=h(()=>structuredClone(bt),"getConfig"),At=h(()=>{H=new Map,B=_.showData,gt()},"clear"),Tt=h(({label:t,value:n})=>{if(n<0)throw new Error(`"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);H.has(t)||(H.set(t,n),P.debug(`added new section: ${t}, with value: ${n}`))},"addSection"),Ct=h(()=>H,"getSections"),Dt=h(t=>{B=t},"setShowData"),Mt=h(()=>B,"getShowData"),X={getConfig:kt,clear:At,setDiagramTitle:st,getDiagramTitle:ot,setAccTitle:lt,getAccTitle:it,setAccDescription:nt,getAccDescription:rt,addSection:Tt,getSections:Ct,setShowData:Dt,getShowData:Mt},Ot=h((t,n)=>{at(t,n),n.setShowData(t.showData),t.sections.map(n.addSection)},"populateDb"),Rt={parse:h(async t=>{const n=await yt("pie",t);P.debug(n),Ot(n,X)},"parse")},zt=h(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),Nt=zt,Et=h(t=>{const n=[...t.values()].reduce((c,p)=>c+p,0),w=[...t.entries()].map(([c,p])=>({label:c,value:p})).filter(c=>c.value/n*100>=1);return vt().value(c=>c.value).sort(null)(w)},"createPieArcs"),Ft=h((t,n,w,c)=>{P.debug(`rendering pie chart
`+t);const p=c.db,C=ct(),i=pt(p.getConfig(),C.pie),e=40,r=18,o=4,g=450,v=g,k=ut(n),f=k.append("g");f.attr("transform","translate("+v/2+","+g/2+")");const{themeVariables:l}=C;let[A]=dt(l.pieOuterStrokeWidth);A??=2;const O=i.legendPosition,D=i.textPosition,N=i.donutHole>0&&i.donutHole<=.9?i.donutHole:0,u=Math.min(v,g)/2-e,S=U().innerRadius(N*u).outerRadius(u),R=U().innerRadius(u*D).outerRadius(u*D),m=f.append("g");m.append("circle").attr("cx",0).attr("cy",0).attr("r",u+A/2).attr("class","pieOuterCircle");const E=p.getSections(),Y=Et(E),G=[l.pie1,l.pie2,l.pie3,l.pie4,l.pie5,l.pie6,l.pie7,l.pie8,l.pie9,l.pie10,l.pie11,l.pie12];let W=0;E.forEach(a=>{W+=a});const q=Y.filter(a=>(a.data.value/W*100).toFixed(0)!=="0"),I=xt(G).domain([...E.keys()]);m.selectAll("mySlices").data(q).enter().append("path").attr("d",S).attr("fill",a=>I(a.data.label)).attr("class",a=>{let s="pieCircle";return i.highlightSlice==="hover"?s+=" highlightedOnHover":i.highlightSlice===a.data.label&&(s+=" highlighted"),s}),m.selectAll("mySlices").data(q).enter().append("text").text(a=>(a.data.value/W*100).toFixed(0)+"%").attr("transform",a=>"translate("+R.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const Z=f.append("text").text(p.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),z=[...E.entries()].map(([a,s])=>({label:a,value:s})),b=f.selectAll(".legend").data(z).enter().append("g").attr("class","legend");b.append("rect").attr("width",r).attr("height",r).style("fill",a=>I(a.label)).style("stroke",a=>I(a.label)),b.append("text").attr("x",r+o).attr("y",r-o).text(a=>p.getShowData()?`${a.label} [${a.value}]`:a.label);const M=Math.max(...b.selectAll("text").nodes().map(a=>a?.getBoundingClientRect().width??0));let F=g,L=v+e;const d=r+o,V=z.length*d;switch(O){case"center":b.attr("transform",(a,s)=>{const y=d*z.length/2,x=-M/2-(r+o),$=s*d-y;return"translate("+x+","+$+")"});break;case"top":F+=V,b.attr("transform",(a,s)=>{const y=u,x=-M/2-(r+o),$=s*d-y;return`translate(${x}, ${$})`}),m.attr("transform",()=>`translate(0, ${V+d})`);break;case"bottom":F+=V,b.attr("transform",(a,s)=>{const y=-u-d,x=-M/2-(r+o),$=s*d-y;return"translate("+x+","+$+")"});break;case"left":L+=r+o+M,b.attr("transform",(a,s)=>{const y=d*z.length/2,x=-u-(r+o),$=s*d-y;return"translate("+x+","+$+")"}),m.attr("transform",()=>`translate(${M+r+o}, 0)`);break;default:L+=r+o+M,b.attr("transform",(a,s)=>{const y=d*z.length/2,x=12*r,$=s*d-y;return"translate("+x+","+$+")"});break}const j=Z.node()?.getBoundingClientRect().width??0,tt=v/2-j/2,et=v/2+j/2,J=Math.min(0,tt),Q=Math.max(L,et)-J;k.attr("viewBox",`${J} 0 ${Q} ${F}`),ht(k,F,Q,i.useMaxWidth)},"draw"),Ht={draw:Ft},Jt={parser:Rt,db:X,renderer:Ht,styles:Nt};export{Jt as diagram};
