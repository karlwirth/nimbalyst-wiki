import{t as at}from"./chunk-JWPE2WC7-tf-Ao10f-DkhC9xkv.js";import{g as rt,s as it,a as nt,b as lt,v as ot,t as st,_ as h,l as V,c as ct,I as pt,M as ut,Q as dt,d as ht,B as gt,K as mt}from"./mermaid.core-DbKl9Oxi-DAMScVoz.js";import{A as ft}from"./cynefin-OW5HDTMX-DoaSA3m0-D33yzyv2.js";import{h as q}from"./arc-D2Xma3JN-DeUSwnZQ.js";import{d as xt}from"./ordinal-CyQy4o9e-DSrvl6Fg.js";import{y as C,o as yt,b as _}from"./step-OMoZTfr0-k4ZH8UTf.js";import"./jsx-runtime-CWgzqSMV.js";import"./app-CHo8aVFq.js";import"./jsx-dev-runtime-1uWM5yOA.js";import"./react-datagrid-DVKpinm5.js";import"./index-SfcU9ojT.js";import"./CollaborativeCommentsPanel-Cf27858R-le1o-OHN.js";import"./yjs-j_PLrQSG.js";import"./palette-C_m1aAcU.js";import"./MaterialSymbol-DhY9mq77.js";import"./transform-DR5aOz-7-BPch8-kZ.js";import"./cubic-BmTDSGHG-DFNWYbxG.js";import"./init-DxzjmxYy-KazIMvGC.js";function $t(t,i){return i<t?-1:i>t?1:i>=t?0:NaN}function wt(t){return t}function St(){var t=wt,i=$t,w=null,c=C(0),p=C(_),D=C(0);function n(e){var r,o=(e=yt(e)).length,g,S,k=0,m=new Array(o),l=new Array(o),A=+c.apply(this,arguments),O=Math.min(_,Math.max(-_,p.apply(this,arguments)-A)),T,F=Math.min(Math.abs(O)/o,D.apply(this,arguments)),u=F*(O<0?-1:1),v;for(r=0;r<o;++r)(v=l[m[r]=r]=+t(e[r],r,e))>0&&(k+=v);for(i!=null?m.sort(function(z,f){return i(l[z],l[f])}):w!=null&&m.sort(function(z,f){return w(e[z],e[f])}),r=0,S=k?(O-o*u)/k:0;r<o;++r,A=T)g=m[r],v=l[g],T=A+(v>0?v*S:0)+u,l[g]={data:e[g],index:r,value:v,startAngle:A,endAngle:T,padAngle:F};return l}return n.value=function(e){return arguments.length?(t=typeof e=="function"?e:C(+e),n):t},n.sortValues=function(e){return arguments.length?(i=e,w=null,n):i},n.sort=function(e){return arguments.length?(w=e,i=null,n):w},n.startAngle=function(e){return arguments.length?(c=typeof e=="function"?e:C(+e),n):c},n.endAngle=function(e){return arguments.length?(p=typeof e=="function"?e:C(+e),n):p},n.padAngle=function(e){return arguments.length?(D=typeof e=="function"?e:C(+e),n):D},n}var vt=mt.pie,j={sections:new Map,showData:!1},E=j.sections,I=j.showData,bt=structuredClone(vt),kt=h(()=>structuredClone(bt),"getConfig"),At=h(()=>{E=new Map,I=j.showData,gt()},"clear"),Ct=h(({label:t,value:i})=>{if(i<0)throw new Error(`"${t}" has invalid value: ${i}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);E.has(t)||(E.set(t,i),V.debug(`added new section: ${t}, with value: ${i}`))},"addSection"),Dt=h(()=>E,"getSections"),Tt=h(t=>{I=t},"setShowData"),Mt=h(()=>I,"getShowData"),J={getConfig:kt,clear:At,setDiagramTitle:st,getDiagramTitle:ot,setAccTitle:lt,getAccTitle:nt,setAccDescription:it,getAccDescription:rt,addSection:Ct,getSections:Dt,setShowData:Tt,getShowData:Mt},Ot=h((t,i)=>{at(t,i),i.setShowData(t.showData),t.sections.map(i.addSection)},"populateDb"),zt={parse:h(async t=>{const i=await ft("pie",t);V.debug(i),Ot(i,J)},"parse")},Rt=h(t=>`
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
`,"getStyles"),Ft=Rt,Ht=h(t=>{const i=[...t.values()].reduce((c,p)=>c+p,0),w=[...t.entries()].map(([c,p])=>({label:c,value:p})).filter(c=>c.value/i*100>=1);return St().value(c=>c.value).sort(null)(w)},"createPieArcs"),Wt=h((t,i,w,c)=>{V.debug(`rendering pie chart
`+t);const p=c.db,D=ct(),n=pt(p.getConfig(),D.pie),e=40,r=18,o=4,g=450,S=g,k=ut(i),m=k.append("g");m.attr("transform","translate("+S/2+","+g/2+")");const{themeVariables:l}=D;let[A]=dt(l.pieOuterStrokeWidth);A??=2;const O=n.legendPosition,T=n.textPosition,F=n.donutHole>0&&n.donutHole<=.9?n.donutHole:0,u=Math.min(S,g)/2-e,v=q().innerRadius(F*u).outerRadius(u),z=q().innerRadius(u*T).outerRadius(u*T),f=m.append("g");f.append("circle").attr("cx",0).attr("cy",0).attr("r",u+A/2).attr("class","pieOuterCircle");const H=p.getSections(),Y=Ht(H),G=[l.pie1,l.pie2,l.pie3,l.pie4,l.pie5,l.pie6,l.pie7,l.pie8,l.pie9,l.pie10,l.pie11,l.pie12];let L=0;H.forEach(a=>{L+=a});const K=Y.filter(a=>(a.data.value/L*100).toFixed(0)!=="0"),N=xt(G).domain([...H.keys()]);f.selectAll("mySlices").data(K).enter().append("path").attr("d",v).attr("fill",a=>N(a.data.label)).attr("class",a=>{let s="pieCircle";return n.highlightSlice==="hover"?s+=" highlightedOnHover":n.highlightSlice===a.data.label&&(s+=" highlighted"),s}),f.selectAll("mySlices").data(K).enter().append("text").text(a=>(a.data.value/L*100).toFixed(0)+"%").attr("transform",a=>"translate("+z.centroid(a)+")").style("text-anchor","middle").attr("class","slice");const X=m.append("text").text(p.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText"),R=[...H.entries()].map(([a,s])=>({label:a,value:s})),b=m.selectAll(".legend").data(R).enter().append("g").attr("class","legend");b.append("rect").attr("width",r).attr("height",r).style("fill",a=>N(a.label)).style("stroke",a=>N(a.label)),b.append("text").attr("x",r+o).attr("y",r-o).text(a=>p.getShowData()?`${a.label} [${a.value}]`:a.label);const M=Math.max(...b.selectAll("text").nodes().map(a=>a?.getBoundingClientRect().width??0));let W=g,P=S+e;const d=r+o,B=R.length*d;switch(O){case"center":b.attr("transform",(a,s)=>{const x=d*R.length/2,y=-M/2-(r+o),$=s*d-x;return"translate("+y+","+$+")"});break;case"top":W+=B,b.attr("transform",(a,s)=>{const x=u,y=-M/2-(r+o),$=s*d-x;return`translate(${y}, ${$})`}),f.attr("transform",()=>`translate(0, ${B+d})`);break;case"bottom":W+=B,b.attr("transform",(a,s)=>{const x=-u-d,y=-M/2-(r+o),$=s*d-x;return"translate("+y+","+$+")"});break;case"left":P+=r+o+M,b.attr("transform",(a,s)=>{const x=d*R.length/2,y=-u-(r+o),$=s*d-x;return"translate("+y+","+$+")"}),f.attr("transform",()=>`translate(${M+r+o}, 0)`);break;default:P+=r+o+M,b.attr("transform",(a,s)=>{const x=d*R.length/2,y=12*r,$=s*d-x;return"translate("+y+","+$+")"});break}const Q=X.node()?.getBoundingClientRect().width??0,tt=S/2-Q/2,et=S/2+Q/2,U=Math.min(0,tt),Z=Math.max(P,et)-U;k.attr("viewBox",`${U} 0 ${Z} ${W}`),ht(k,W,Z,n.useMaxWidth)},"draw"),Et={draw:Wt},ee={parser:zt,db:J,renderer:Et,styles:Ft};export{ee as diagram};
