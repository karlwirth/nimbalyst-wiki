import{t as at}from"./chunk-JWPE2WC7-vsrcfD-k-DOCY7ZPb.js";import{ad as rt,ac as nt,ae as it,af as lt,at as ot,as as st,u as h,P as _,O as ct,aD as ut,aH as pt,aI as dt,ag as ht,au as gt,aE as ft}from"./mermaid.core-B_7u-4u6-CLEC9s9X.js";import{A as mt}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import{h as K}from"./arc-D2Xma3JN-DYYb7otn.js";import{d as xt}from"./ordinal-CyQy4o9e-DSrvl6Fg.js";import{c as D,o as yt,d as V}from"./step-OMoZTfr0-oBM7tmSJ.js";import"./index--VxRUqh6.js";import"./init-DxzjmxYy-KazIMvGC.js";function $t(t,n){return n<t?-1:n>t?1:n>=t?0:NaN}function wt(t){return t}function St(){var t=wt,n=$t,w=null,c=D(0),u=D(V),C=D(0);function i(e){var r,o=(e=yt(e)).length,g,S,k=0,f=new Array(o),l=new Array(o),A=+c.apply(this,arguments),O=Math.min(V,Math.max(-V,u.apply(this,arguments)-A)),T,F=Math.min(Math.abs(O)/o,C.apply(this,arguments)),p=F*(O<0?-1:1),v;for(r=0;r<o;++r)(v=l[f[r]=r]=+t(e[r],r,e))>0&&(k+=v);for(n!=null?f.sort(function(z,m){return n(l[z],l[m])}):w!=null&&f.sort(function(z,m){return w(e[z],e[m])}),r=0,S=k?(O-o*p)/k:0;r<o;++r,A=T)g=f[r],v=l[g],T=A+(v>0?v*S:0)+p,l[g]={data:e[g],index:r,value:v,startAngle:A,endAngle:T,padAngle:F};return l}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:D(+e),i):t},i.sortValues=function(e){return arguments.length?(n=e,w=null,i):n},i.sort=function(e){return arguments.length?(w=e,n=null,i):w},i.startAngle=function(e){return arguments.length?(c=typeof e=="function"?e:D(+e),i):c},i.endAngle=function(e){return arguments.length?(u=typeof e=="function"?e:D(+e),i):u},i.padAngle=function(e){return arguments.length?(C=typeof e=="function"?e:D(+e),i):C},i}var vt=ft.pie,j={sections:new Map,showData:!1},W=j.sections,I=j.showData,bt=structuredClone(vt),kt=h(()=>structuredClone(bt),"getConfig"),At=h(()=>{W=new Map,I=j.showData,gt()},"clear"),Dt=h(({label:t,value:n})=>{if(n<0)throw new Error(`"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);W.has(t)||(W.set(t,n),_.debug(`added new section: ${t}, with value: ${n}`))},"addSection"),Ct=h(()=>W,"getSections"),Tt=h(t=>{I=t},"setShowData"),Mt=h(()=>I,"getShowData"),Q={getConfig:kt,clear:At,setDiagramTitle:st,getDiagramTitle:ot,setAccTitle:lt,getAccTitle:it,setAccDescription:nt,getAccDescription:rt,addSection:Dt,getSections:Ct,setShowData:Tt,getShowData:Mt},Ot=h((t,n)=>{at(t,n),n.setShowData(t.showData),t.sections.map(n.addSection)},"populateDb"),zt={parse:h(async t=>{const n=await mt("pie",t);_.debug(n),Ot(n,Q)},"parse")},Rt=h(t=>`
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
`,"getStyles"),Ft=Rt,Ht=h(t=>{const n=[...t.values()].reduce((c,u)=>c+u,0),w=[...t.entries()].map(([c,u])=>({label:c,value:u})).filter(c=>c.value/n*100>=1);return St().value(c=>c.value).sort(null)(w)},"createPieArcs"),Et=h((t,n,w,c)=>{_.debug(`rendering pie chart
`+t);const u=c.db,C=ct(),i=ut(u.getConfig(),C.pie),e=40,r=18,o=4,g=450,S=g,k=pt(n),f=k.append("g");f.attr("transform","translate("+S/2+","+g/2+")");const{themeVariables:l}=C;let[A]=dt(l.pieOuterStrokeWidth);A??=2;const O=i.legendPosition,T=i.textPosition,F=i.donutHole>0&&i.donutHole<=.9?i.donutHole:0,p=Math.min(S,g)/2-e,v=K().innerRadius(F*p).outerRadius(p),z=K().innerRadius(p*T).outerRadius(p*T),m=f.append("g");m.append("circle").attr("cx",0).attr("cy",0).attr("r",p+A/2).attr("class","pieOuterCircle");const H=u.getSections(),Y=Ht(H),G=[l.pie1,l.pie2,l.pie3,l.pie4,l.pie5,l.pie6,l.pie7,l.pie8,l.pie9,l.pie10,l.pie11,l.pie12];let L=0;H.forEach(a=>{L+=a});const U=Y.filter(a=>(a.data.value/L*100).toFixed(0)!=="0"),N=xt(G).domain([...H.keys()]);m.selectAll("mySlices").data(U).enter().append("path").attr("d",v).attr("fill",a=>N(a.data.label)).attr("class",a=>{let s="pieCircle";return i.highlightSlice==="hover"?s+=" highlightedOnHover":i.highlightSlice===a.data.label&&(s+=" highlighted"),s}),m.selectAll("mySlices").data(U).enter().append("text").text(a=>(a.data.value/L*100).toFixed(0)+"%").attr("transform",a=>"translate("+z.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const X=f.append("text").text(u.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),R=[...H.entries()].map(([a,s])=>({label:a,value:s})),b=f.selectAll(".legend").data(R).enter().append("g").attr("class","legend");b.append("rect").attr("width",r).attr("height",r).style("fill",a=>N(a.label)).style("stroke",a=>N(a.label)),b.append("text").attr("x",r+o).attr("y",r-o).text(a=>u.getShowData()?`${a.label} [${a.value}]`:a.label);const M=Math.max(...b.selectAll("text").nodes().map(a=>a?.getBoundingClientRect().width??0));let E=g,P=S+e;const d=r+o,B=R.length*d;switch(O){case"center":b.attr("transform",(a,s)=>{const x=d*R.length/2,y=-M/2-(r+o),$=s*d-x;return"translate("+y+","+$+")"});break;case"top":E+=B,b.attr("transform",(a,s)=>{const x=p,y=-M/2-(r+o),$=s*d-x;return`translate(${y}, ${$})`}),m.attr("transform",()=>`translate(0, ${B+d})`);break;case"bottom":E+=B,b.attr("transform",(a,s)=>{const x=-p-d,y=-M/2-(r+o),$=s*d-x;return"translate("+y+","+$+")"});break;case"left":P+=r+o+M,b.attr("transform",(a,s)=>{const x=d*R.length/2,y=-p-(r+o),$=s*d-x;return"translate("+y+","+$+")"}),m.attr("transform",()=>`translate(${M+r+o}, 0)`);break;default:P+=r+o+M,b.attr("transform",(a,s)=>{const x=d*R.length/2,y=12*r,$=s*d-x;return"translate("+y+","+$+")"});break}const Z=X.node()?.getBoundingClientRect().width??0,tt=S/2-Z/2,et=S/2+Z/2,q=Math.min(0,tt),J=Math.max(P,et)-q;k.attr("viewBox",`${q} 0 ${J} ${E}`),ht(k,E,J,i.useMaxWidth)},"draw"),Wt={draw:Et},Ut={parser:zt,db:Q,renderer:Wt,styles:Ft};export{Ut as diagram};
