import{g as xe,s as ve,v as Te,t as $e,a as we,b as _e,_ as u,c as lt,d as De,aU as X,l as it,j as Se,n as Ce,B as Me,u as Ee}from"./mermaid.core-DLqIxXBf-DUfEkR-M.js";import{aC as _t}from"./app-CABZXuGD.js";import{a as pt}from"./transform-DR5aOz-7-BPch8-kZ.js";import{l as Ye,b as Ae,c as Oe,o as Le,e as jt,w as Qt,u as Ie,y as Fe,z as We,V as Pe,R as Ne,P as ze,t as Be,G as Zt,D as Jt,U as Kt,q as te,n as ee}from"./time-DVtAVeB4-BcyqA2An.js";import{Z as He}from"./linear-DFFW0b8c-BVHeDMJu.js";import"./jsx-runtime-CWgzqSMV.js";import"./step-OMoZTfr0-k4ZH8UTf.js";import"./jsx-dev-runtime-1uWM5yOA.js";import"./react-datagrid-DVKpinm5.js";import"./index-SfcU9ojT.js";import"./CollaborativeCommentsPanel-Cf27858R-le1o-OHN.js";import"./yjs-j_PLrQSG.js";import"./palette-C_m1aAcU.js";import"./MaterialSymbol-DhY9mq77.js";import"./cubic-BmTDSGHG-DFNWYbxG.js";import"./init-DxzjmxYy-KazIMvGC.js";import"./value-D9xxusK6-CW9x9dRr.js";import"./defaultLocale-fsnNr2ez-D2Rzj0sG.js";function Re(t){return t}var xt=1,St=2,Mt=3,bt=4,ne=1e-6;function Ge(t){return"translate("+t+",0)"}function Ve(t){return"translate(0,"+t+")"}function qe(t){return e=>+t(e)}function Ue(t,e){return e=Math.max(0,t.bandwidth()-e*2)/2,t.round()&&(e=Math.round(e)),r=>+t(r)+e}function Xe(){return!this.__axis}function ue(t,e){var r=[],n=null,a=null,d=6,p=6,D=3,Y=typeof window<"u"&&window.devicePixelRatio>1?0:.5,S=t===xt||t===bt?-1:1,E=t===bt||t===St?"x":"y",z=t===xt||t===Mt?Ge:Ve;function $(_){var G=n??(e.ticks?e.ticks.apply(e,r):e.domain()),H=a??(e.tickFormat?e.tickFormat.apply(e,r):Re),k=Math.max(d,0)+D,C=e.range(),F=+C[0]+Y,L=+C[C.length-1]+Y,R=(e.bandwidth?Ue:qe)(e.copy(),Y),B=_.selection?_.selection():_,A=B.selectAll(".domain").data([null]),b=B.selectAll(".tick").data(G,e).order(),m=b.exit(),M=b.enter().append("g").attr("class","tick"),f=b.select("line"),x=b.select("text");A=A.merge(A.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),b=b.merge(M),f=f.merge(M.append("line").attr("stroke","currentColor").attr(E+"2",S*d)),x=x.merge(M.append("text").attr("fill","currentColor").attr(E,S*k).attr("dy",t===xt?"0em":t===Mt?"0.71em":"0.32em")),_!==B&&(A=A.transition(_),b=b.transition(_),f=f.transition(_),x=x.transition(_),m=m.transition(_).attr("opacity",ne).attr("transform",function(g){return isFinite(g=R(g))?z(g+Y):this.getAttribute("transform")}),M.attr("opacity",ne).attr("transform",function(g){var y=this.parentNode.__axis;return z((y&&isFinite(y=y(g))?y:R(g))+Y)})),m.remove(),A.attr("d",t===bt||t===St?p?"M"+S*p+","+F+"H"+Y+"V"+L+"H"+S*p:"M"+Y+","+F+"V"+L:p?"M"+F+","+S*p+"V"+Y+"H"+L+"V"+S*p:"M"+F+","+Y+"H"+L),b.attr("opacity",1).attr("transform",function(g){return z(R(g)+Y)}),f.attr(E+"2",S*d),x.attr(E,S*k).text(H),B.filter(Xe).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===St?"start":t===bt?"end":"middle"),B.each(function(){this.__axis=R})}return $.scale=function(_){return arguments.length?(e=_,$):e},$.ticks=function(){return r=Array.from(arguments),$},$.tickArguments=function(_){return arguments.length?(r=_==null?[]:Array.from(_),$):r.slice()},$.tickValues=function(_){return arguments.length?(n=_==null?null:Array.from(_),$):n&&n.slice()},$.tickFormat=function(_){return arguments.length?(a=_,$):a},$.tickSize=function(_){return arguments.length?(d=p=+_,$):d},$.tickSizeInner=function(_){return arguments.length?(d=+_,$):d},$.tickSizeOuter=function(_){return arguments.length?(p=+_,$):p},$.tickPadding=function(_){return arguments.length?(D=+_,$):D},$.offset=function(_){return arguments.length?(Y=+_,$):Y},$}function je(t){return ue(xt,t)}function Qe(t){return ue(Mt,t)}var Et={exports:{}},Ze=Et.exports,se;function Je(){return se||(se=1,(function(t,e){(function(r,n){t.exports=n()})(Ze,(function(){var r="day";return function(n,a,d){var p=function(S){return S.add(4-S.isoWeekday(),r)},D=a.prototype;D.isoWeekYear=function(){return p(this).year()},D.isoWeek=function(S){if(!this.$utils().u(S))return this.add(7*(S-this.isoWeek()),r);var E,z,$,_,G=p(this),H=(E=this.isoWeekYear(),z=this.$u,$=(z?d.utc:d)().year(E).startOf("year"),_=4-$.isoWeekday(),$.isoWeekday()>4&&(_+=7),$.add(_,r));return G.diff(H,"week")+1},D.isoWeekday=function(S){return this.$utils().u(S)?this.day()||7:this.day(this.day()%7?S:S-7)};var Y=D.startOf;D.startOf=function(S,E){var z=this.$utils(),$=!!z.u(E)||E;return z.p(S)==="isoweek"?$?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):Y.bind(this)(S,E)}}}))})(Et)),Et.exports}var Ke=Je();const tn=_t(Ke);var Yt={exports:{}},en=Yt.exports,re;function nn(){return re||(re=1,(function(t,e){(function(r,n){t.exports=n()})(en,(function(){var r={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},n=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,a=/\d/,d=/\d\d/,p=/\d\d?/,D=/\d*[^-_:/,()\s\d]+/,Y={},S=function(k){return(k=+k)+(k>68?1900:2e3)},E=function(k){return function(C){this[k]=+C}},z=[/[+-]\d\d:?(\d\d)?|Z/,function(k){(this.zone||(this.zone={})).offset=(function(C){if(!C||C==="Z")return 0;var F=C.match(/([+-]|\d\d)/g),L=60*F[1]+(+F[2]||0);return L===0?0:F[0]==="+"?-L:L})(k)}],$=function(k){var C=Y[k];return C&&(C.indexOf?C:C.s.concat(C.f))},_=function(k,C){var F,L=Y.meridiem;if(L){for(var R=1;R<=24;R+=1)if(k.indexOf(L(R,0,C))>-1){F=R>12;break}}else F=k===(C?"pm":"PM");return F},G={A:[D,function(k){this.afternoon=_(k,!1)}],a:[D,function(k){this.afternoon=_(k,!0)}],Q:[a,function(k){this.month=3*(k-1)+1}],S:[a,function(k){this.milliseconds=100*+k}],SS:[d,function(k){this.milliseconds=10*+k}],SSS:[/\d{3}/,function(k){this.milliseconds=+k}],s:[p,E("seconds")],ss:[p,E("seconds")],m:[p,E("minutes")],mm:[p,E("minutes")],H:[p,E("hours")],h:[p,E("hours")],HH:[p,E("hours")],hh:[p,E("hours")],D:[p,E("day")],DD:[d,E("day")],Do:[D,function(k){var C=Y.ordinal,F=k.match(/\d+/);if(this.day=F[0],C)for(var L=1;L<=31;L+=1)C(L).replace(/\[|\]/g,"")===k&&(this.day=L)}],w:[p,E("week")],ww:[d,E("week")],M:[p,E("month")],MM:[d,E("month")],MMM:[D,function(k){var C=$("months"),F=($("monthsShort")||C.map((function(L){return L.slice(0,3)}))).indexOf(k)+1;if(F<1)throw new Error;this.month=F%12||F}],MMMM:[D,function(k){var C=$("months").indexOf(k)+1;if(C<1)throw new Error;this.month=C%12||C}],Y:[/[+-]?\d+/,E("year")],YY:[d,function(k){this.year=S(k)}],YYYY:[/\d{4}/,E("year")],Z:z,ZZ:z};function H(k){var C,F;C=k,F=Y&&Y.formats;for(var L=(k=C.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(f,x,g){var y=g&&g.toUpperCase();return x||F[g]||r[g]||F[y].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(i,h,l){return h||l.slice(1)}))}))).match(n),R=L.length,B=0;B<R;B+=1){var A=L[B],b=G[A],m=b&&b[0],M=b&&b[1];L[B]=M?{regex:m,parser:M}:A.replace(/^\[|\]$/g,"")}return function(f){for(var x={},g=0,y=0;g<R;g+=1){var i=L[g];if(typeof i=="string")y+=i.length;else{var h=i.regex,l=i.parser,v=f.slice(y),s=h.exec(v)[0];l.call(x,s),f=f.replace(s,"")}}return(function(T){var c=T.afternoon;if(c!==void 0){var o=T.hours;c?o<12&&(T.hours+=12):o===12&&(T.hours=0),delete T.afternoon}})(x),x}}return function(k,C,F){F.p.customParseFormat=!0,k&&k.parseTwoDigitYear&&(S=k.parseTwoDigitYear);var L=C.prototype,R=L.parse;L.parse=function(B){var A=B.date,b=B.utc,m=B.args;this.$u=b;var M=m[1];if(typeof M=="string"){var f=m[2]===!0,x=m[3]===!0,g=f||x,y=m[2];x&&(y=m[2]),Y=this.$locale(),!f&&y&&(Y=F.Ls[y]),this.$d=(function(v,s,T,c){try{if(["x","X"].indexOf(s)>-1)return new Date((s==="X"?1e3:1)*v);var o=H(s)(v),w=o.year,O=o.month,I=o.day,W=o.hours,P=o.minutes,N=o.seconds,st=o.milliseconds,et=o.zone,yt=o.week,mt=new Date,ot=I||(w||O?1:mt.getDate()),q=w||mt.getFullYear(),Z=0;w&&!O||(Z=O>0?O-1:mt.getMonth());var U,rt=W||0,J=P||0,nt=N||0,j=st||0;return et?new Date(Date.UTC(q,Z,ot,rt,J,nt,j+60*et.offset*1e3)):T?new Date(Date.UTC(q,Z,ot,rt,J,nt,j)):(U=new Date(q,Z,ot,rt,J,nt,j),yt&&(U=c(U).week(yt).toDate()),U)}catch{return new Date("")}})(A,M,b,F),this.init(),y&&y!==!0&&(this.$L=this.locale(y).$L),g&&A!=this.format(M)&&(this.$d=new Date("")),Y={}}else if(M instanceof Array)for(var i=M.length,h=1;h<=i;h+=1){m[1]=M[h-1];var l=F.apply(this,m);if(l.isValid()){this.$d=l.$d,this.$L=l.$L,this.init();break}h===i&&(this.$d=new Date(""))}else R.call(this,B)}}}))})(Yt)),Yt.exports}var sn=nn();const rn=_t(sn);var At={exports:{}},an=At.exports,ie;function on(){return ie||(ie=1,(function(t,e){(function(r,n){t.exports=n()})(an,(function(){return function(r,n){var a=n.prototype,d=a.format;a.format=function(p){var D=this,Y=this.$locale();if(!this.isValid())return d.bind(this)(p);var S=this.$utils(),E=(p||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(z){switch(z){case"Q":return Math.ceil((D.$M+1)/3);case"Do":return Y.ordinal(D.$D);case"gggg":return D.weekYear();case"GGGG":return D.isoWeekYear();case"wo":return Y.ordinal(D.week(),"W");case"w":case"ww":return S.s(D.week(),z==="w"?1:2,"0");case"W":case"WW":return S.s(D.isoWeek(),z==="W"?1:2,"0");case"k":case"kk":return S.s(String(D.$H===0?24:D.$H),z==="k"?1:2,"0");case"X":return Math.floor(D.$d.getTime()/1e3);case"x":return D.$d.getTime();case"z":return"["+D.offsetName()+"]";case"zzz":return"["+D.offsetName("long")+"]";default:return z}}));return d.bind(this)(E)}}}))})(At)),At.exports}var cn=on();const ln=_t(cn);var Ot={exports:{}},un=Ot.exports,ae;function dn(){return ae||(ae=1,(function(t,e){(function(r,n){t.exports=n()})(un,(function(){var r,n,a=1e3,d=6e4,p=36e5,D=864e5,Y=31536e6,S=2628e6,E=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,z=/\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g,$={years:Y,months:S,days:D,hours:p,minutes:d,seconds:a,milliseconds:1,weeks:6048e5},_=function(A){return A instanceof R},G=function(A,b,m){return new R(A,m,b.$l)},H=function(A){return n.p(A)+"s"},k=function(A){return A<0},C=function(A){return k(A)?Math.ceil(A):Math.floor(A)},F=function(A){return Math.abs(A)},L=function(A,b){return A?k(A)?{negative:!0,format:""+F(A)+b}:{negative:!1,format:""+A+b}:{negative:!1,format:""}},R=(function(){function A(m,M,f){var x=this;if(this.$d={},this.$l=f,m===void 0&&(this.$ms=0,this.parseFromMilliseconds()),M)return G(m*$[H(M)],this);if(typeof m=="number")return this.$ms=m,this.parseFromMilliseconds(),this;if(typeof m=="object")return Object.keys(m).forEach((function(i){x.$d[H(i)]=m[i]})),this.calMilliseconds(),this;if(typeof m=="string"){var g=m.match(E);if(g){var y=g.slice(2).map((function(i){return i!=null?Number(i):0}));return this.$d.years=y[0],this.$d.months=y[1],this.$d.weeks=y[2],this.$d.days=y[3],this.$d.hours=y[4],this.$d.minutes=y[5],this.$d.seconds=y[6],this.calMilliseconds(),this}}return this}var b=A.prototype;return b.calMilliseconds=function(){var m=this;this.$ms=Object.keys(this.$d).reduce((function(M,f){return M+(m.$d[f]||0)*$[f]}),0)},b.parseFromMilliseconds=function(){var m=this.$ms;this.$d.years=C(m/Y),m%=Y,this.$d.months=C(m/S),m%=S,this.$d.days=C(m/D),m%=D,this.$d.hours=C(m/p),m%=p,this.$d.minutes=C(m/d),m%=d,this.$d.seconds=C(m/a),m%=a,this.$d.milliseconds=m},b.toISOString=function(){var m=L(this.$d.years,"Y"),M=L(this.$d.months,"M"),f=+this.$d.days||0;this.$d.weeks&&(f+=7*this.$d.weeks);var x=L(f,"D"),g=L(this.$d.hours,"H"),y=L(this.$d.minutes,"M"),i=this.$d.seconds||0;this.$d.milliseconds&&(i+=this.$d.milliseconds/1e3,i=Math.round(1e3*i)/1e3);var h=L(i,"S"),l=m.negative||M.negative||x.negative||g.negative||y.negative||h.negative,v=g.format||y.format||h.format?"T":"",s=(l?"-":"")+"P"+m.format+M.format+x.format+v+g.format+y.format+h.format;return s==="P"||s==="-P"?"P0D":s},b.toJSON=function(){return this.toISOString()},b.format=function(m){var M=m||"YYYY-MM-DDTHH:mm:ss",f={Y:this.$d.years,YY:n.s(this.$d.years,2,"0"),YYYY:n.s(this.$d.years,4,"0"),M:this.$d.months,MM:n.s(this.$d.months,2,"0"),D:this.$d.days,DD:n.s(this.$d.days,2,"0"),H:this.$d.hours,HH:n.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:n.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:n.s(this.$d.seconds,2,"0"),SSS:n.s(this.$d.milliseconds,3,"0")};return M.replace(z,(function(x,g){return g||String(f[x])}))},b.as=function(m){return this.$ms/$[H(m)]},b.get=function(m){var M=this.$ms,f=H(m);return f==="milliseconds"?M%=1e3:M=f==="weeks"?C(M/$[f]):this.$d[f],M||0},b.add=function(m,M,f){var x;return x=M?m*$[H(M)]:_(m)?m.$ms:G(m,this).$ms,G(this.$ms+x*(f?-1:1),this)},b.subtract=function(m,M){return this.add(m,M,!0)},b.locale=function(m){var M=this.clone();return M.$l=m,M},b.clone=function(){return G(this.$ms,this)},b.humanize=function(m){return r().add(this.$ms,"ms").locale(this.$l).fromNow(!m)},b.valueOf=function(){return this.asMilliseconds()},b.milliseconds=function(){return this.get("milliseconds")},b.asMilliseconds=function(){return this.as("milliseconds")},b.seconds=function(){return this.get("seconds")},b.asSeconds=function(){return this.as("seconds")},b.minutes=function(){return this.get("minutes")},b.asMinutes=function(){return this.as("minutes")},b.hours=function(){return this.get("hours")},b.asHours=function(){return this.as("hours")},b.days=function(){return this.get("days")},b.asDays=function(){return this.as("days")},b.weeks=function(){return this.get("weeks")},b.asWeeks=function(){return this.as("weeks")},b.months=function(){return this.get("months")},b.asMonths=function(){return this.as("months")},b.years=function(){return this.get("years")},b.asYears=function(){return this.as("years")},A})(),B=function(A,b,m){return A.add(b.years()*m,"y").add(b.months()*m,"M").add(b.days()*m,"d").add(b.hours()*m,"h").add(b.minutes()*m,"m").add(b.seconds()*m,"s").add(b.milliseconds()*m,"ms")};return function(A,b,m){r=m,n=m().$utils(),m.duration=function(x,g){var y=m.locale();return G(x,{$l:y},g)},m.isDuration=_;var M=b.prototype.add,f=b.prototype.subtract;b.prototype.add=function(x,g){return _(x)?B(this,x,1):M.bind(this)(x,g)},b.prototype.subtract=function(x,g){return _(x)?B(this,x,-1):f.bind(this)(x,g)}}}))})(Ot)),Ot.exports}var hn=dn();const fn=_t(hn);var Lt=(function(){var t=u(function(y,i,h,l){for(h=h||{},l=y.length;l--;h[y[l]]=i);return h},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],n=[1,27],a=[1,28],d=[1,29],p=[1,30],D=[1,31],Y=[1,32],S=[1,33],E=[1,34],z=[1,9],$=[1,10],_=[1,11],G=[1,12],H=[1,13],k=[1,14],C=[1,15],F=[1,16],L=[1,19],R=[1,20],B=[1,21],A=[1,22],b=[1,23],m=[1,25],M=[1,35],f={trace:u(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:u(function(y,i,h,l,v,s,T){var c=s.length-1;switch(v){case 1:return s[c-1];case 2:this.$=[];break;case 3:s[c-1].push(s[c]),this.$=s[c-1];break;case 4:case 5:this.$=s[c];break;case 6:case 7:this.$=[];break;case 8:l.setWeekday("monday");break;case 9:l.setWeekday("tuesday");break;case 10:l.setWeekday("wednesday");break;case 11:l.setWeekday("thursday");break;case 12:l.setWeekday("friday");break;case 13:l.setWeekday("saturday");break;case 14:l.setWeekday("sunday");break;case 15:l.setWeekend("friday");break;case 16:l.setWeekend("saturday");break;case 17:l.setDateFormat(s[c].substr(11)),this.$=s[c].substr(11);break;case 18:l.enableInclusiveEndDates(),this.$=s[c].substr(18);break;case 19:l.TopAxis(),this.$=s[c].substr(8);break;case 20:l.setAxisFormat(s[c].substr(11)),this.$=s[c].substr(11);break;case 21:l.setTickInterval(s[c].substr(13)),this.$=s[c].substr(13);break;case 22:l.setExcludes(s[c].substr(9)),this.$=s[c].substr(9);break;case 23:l.setIncludes(s[c].substr(9)),this.$=s[c].substr(9);break;case 24:l.setTodayMarker(s[c].substr(12)),this.$=s[c].substr(12);break;case 27:l.setDiagramTitle(s[c].substr(6)),this.$=s[c].substr(6);break;case 28:this.$=s[c].trim(),l.setAccTitle(this.$);break;case 29:case 30:this.$=s[c].trim(),l.setAccDescription(this.$);break;case 31:l.addSection(s[c].substr(8)),this.$=s[c].substr(8);break;case 33:l.addTask(s[c-1],s[c]),this.$="task";break;case 34:this.$=s[c-1],l.setClickEvent(s[c-1],s[c],null);break;case 35:this.$=s[c-2],l.setClickEvent(s[c-2],s[c-1],s[c]);break;case 36:this.$=s[c-2],l.setClickEvent(s[c-2],s[c-1],null),l.setLink(s[c-2],s[c]);break;case 37:this.$=s[c-3],l.setClickEvent(s[c-3],s[c-2],s[c-1]),l.setLink(s[c-3],s[c]);break;case 38:this.$=s[c-2],l.setClickEvent(s[c-2],s[c],null),l.setLink(s[c-2],s[c-1]);break;case 39:this.$=s[c-3],l.setClickEvent(s[c-3],s[c-1],s[c]),l.setLink(s[c-3],s[c-2]);break;case 40:this.$=s[c-1],l.setLink(s[c-1],s[c]);break;case 41:case 47:this.$=s[c-1]+" "+s[c];break;case 42:case 43:case 45:this.$=s[c-2]+" "+s[c-1]+" "+s[c];break;case 44:case 46:this.$=s[c-3]+" "+s[c-2]+" "+s[c-1]+" "+s[c];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:n,14:a,15:d,16:p,17:D,18:Y,19:18,20:S,21:E,22:z,23:$,24:_,25:G,26:H,27:k,28:C,29:F,30:L,31:R,33:B,35:A,36:b,37:24,38:m,40:M},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:r,13:n,14:a,15:d,16:p,17:D,18:Y,19:18,20:S,21:E,22:z,23:$,24:_,25:G,26:H,27:k,28:C,29:F,30:L,31:R,33:B,35:A,36:b,37:24,38:m,40:M},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:u(function(y,i){if(i.recoverable)this.trace(y);else{var h=new Error(y);throw h.hash=i,h}},"parseError"),parse:u(function(y){var i=this,h=[0],l=[],v=[null],s=[],T=this.table,c="",o=0,w=0,O=2,I=1,W=s.slice.call(arguments,1),P=Object.create(this.lexer),N={yy:{}};for(var st in this.yy)Object.prototype.hasOwnProperty.call(this.yy,st)&&(N.yy[st]=this.yy[st]);P.setInput(y,N.yy),N.yy.lexer=P,N.yy.parser=this,typeof P.yylloc>"u"&&(P.yylloc={});var et=P.yylloc;s.push(et);var yt=P.options&&P.options.ranges;typeof N.yy.parseError=="function"?this.parseError=N.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function mt(Q){h.length=h.length-2*Q,v.length=v.length-Q,s.length=s.length-Q}u(mt,"popStack");function ot(){var Q;return Q=l.pop()||P.lex()||I,typeof Q!="number"&&(Q instanceof Array&&(l=Q,Q=l.pop()),Q=i.symbols_[Q]||Q),Q}u(ot,"lex");for(var q,Z,U,rt,J={},nt,j,Xt,gt;;){if(Z=h[h.length-1],this.defaultActions[Z]?U=this.defaultActions[Z]:((q===null||typeof q>"u")&&(q=ot()),U=T[Z]&&T[Z][q]),typeof U>"u"||!U.length||!U[0]){var Dt="";gt=[];for(nt in T[Z])this.terminals_[nt]&&nt>O&&gt.push("'"+this.terminals_[nt]+"'");P.showPosition?Dt="Parse error on line "+(o+1)+`:
`+P.showPosition()+`
Expecting `+gt.join(", ")+", got '"+(this.terminals_[q]||q)+"'":Dt="Parse error on line "+(o+1)+": Unexpected "+(q==I?"end of input":"'"+(this.terminals_[q]||q)+"'"),this.parseError(Dt,{text:P.match,token:this.terminals_[q]||q,line:P.yylineno,loc:et,expected:gt})}if(U[0]instanceof Array&&U.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Z+", token: "+q);switch(U[0]){case 1:h.push(q),v.push(P.yytext),s.push(P.yylloc),h.push(U[1]),q=null,w=P.yyleng,c=P.yytext,o=P.yylineno,et=P.yylloc;break;case 2:if(j=this.productions_[U[1]][1],J.$=v[v.length-j],J._$={first_line:s[s.length-(j||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(j||1)].first_column,last_column:s[s.length-1].last_column},yt&&(J._$.range=[s[s.length-(j||1)].range[0],s[s.length-1].range[1]]),rt=this.performAction.apply(J,[c,w,o,N.yy,U[1],v,s].concat(W)),typeof rt<"u")return rt;j&&(h=h.slice(0,-1*j*2),v=v.slice(0,-1*j),s=s.slice(0,-1*j)),h.push(this.productions_[U[1]][0]),v.push(J.$),s.push(J._$),Xt=T[h[h.length-2]][h[h.length-1]],h.push(Xt);break;case 3:return!0}}return!0},"parse")},x=(function(){var y={EOF:1,parseError:u(function(i,h){if(this.yy.parser)this.yy.parser.parseError(i,h);else throw new Error(i)},"parseError"),setInput:u(function(i,h){return this.yy=h||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:u(function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var h=i.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),i},"input"),unput:u(function(i){var h=i.length,l=i.split(/(?:\r\n?|\n)/g);this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),l.length-1&&(this.yylineno-=l.length-1);var s=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:l?(l.length===v.length?this.yylloc.first_column:0)+v[v.length-l.length].length-l[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[s[0],s[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},"unput"),more:u(function(){return this._more=!0,this},"more"),reject:u(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:u(function(i){this.unput(this.match.slice(i))},"less"),pastInput:u(function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:u(function(){var i=this.match;return i.length<20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:u(function(){var i=this.pastInput(),h=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+h+"^"},"showPosition"),test_match:u(function(i,h){var l,v,s;if(this.options.backtrack_lexer&&(s={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(s.yylloc.range=this.yylloc.range.slice(0))),v=i[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],l=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),l)return l;if(this._backtrack){for(var T in s)this[T]=s[T];return!1}return!1},"test_match"),next:u(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var i,h,l,v;this._more||(this.yytext="",this.match="");for(var s=this._currentRules(),T=0;T<s.length;T++)if(l=this._input.match(this.rules[s[T]]),l&&(!h||l[0].length>h[0].length)){if(h=l,v=T,this.options.backtrack_lexer){if(i=this.test_match(l,s[T]),i!==!1)return i;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(i=this.test_match(h,s[v]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:u(function(){var i=this.next();return i||this.lex()},"lex"),begin:u(function(i){this.conditionStack.push(i)},"begin"),popState:u(function(){var i=this.conditionStack.length-1;return i>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:u(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:u(function(i){return i=this.conditionStack.length-1-Math.abs(i||0),i>=0?this.conditionStack[i]:"INITIAL"},"topState"),pushState:u(function(i){this.begin(i)},"pushState"),stateStackSize:u(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:u(function(i,h,l,v){switch(l){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return y})();f.lexer=x;function g(){this.yy={}}return u(g,"Parser"),g.prototype=f,f.Parser=g,new g})();Lt.parser=Lt;var mn=Lt;X.extend(tn);X.extend(rn);X.extend(ln);var oe={friday:5,saturday:6},K="",Pt="",Nt=void 0,zt="",dt=[],ht=[],Bt=new Map,Ht=[],$t=[],ft="",Rt="",de=["active","done","crit","milestone","vert"],Gt=[],ct="",kt=!1,Vt=!1,qt="sunday",wt="saturday",It=0,kn=u(function(){Ht=[],$t=[],ft="",Gt=[],vt=0,Wt=void 0,Tt=void 0,V=[],K="",Pt="",Rt="",Nt=void 0,zt="",dt=[],ht=[],kt=!1,Vt=!1,It=0,Bt=new Map,ct="",Me(),qt="sunday",wt="saturday"},"clear"),yn=u(function(t){ct=t},"setDiagramId"),gn=u(function(t){Pt=t},"setAxisFormat"),pn=u(function(){return Pt},"getAxisFormat"),bn=u(function(t){Nt=t},"setTickInterval"),xn=u(function(){return Nt},"getTickInterval"),vn=u(function(t){zt=t},"setTodayMarker"),Tn=u(function(){return zt},"getTodayMarker"),$n=u(function(t){K=t},"setDateFormat"),wn=u(function(){kt=!0},"enableInclusiveEndDates"),_n=u(function(){return kt},"endDatesAreInclusive"),Dn=u(function(){Vt=!0},"enableTopAxis"),Sn=u(function(){return Vt},"topAxisEnabled"),Cn=u(function(t){Rt=t},"setDisplayMode"),Mn=u(function(){return Rt},"getDisplayMode"),En=u(function(){return K},"getDateFormat"),he=u((t,e)=>{const r=e.toLowerCase().split(/[\s,]+/).filter(n=>n!=="");return[...new Set([...t,...r])]},"mergeTokens"),Yn=u(function(t){dt=he(dt,t)},"setIncludes"),An=u(function(){return dt},"getIncludes"),On=u(function(t){ht=he(ht,t)},"setExcludes"),Ln=u(function(){return ht},"getExcludes"),In=u(function(){return Bt},"getLinks"),Fn=u(function(t){ft=t,Ht.push(t)},"addSection"),Wn=u(function(){return Ht},"getSections"),Pn=u(function(){let t=ce();const e=10;let r=0;for(;!t&&r<e;)t=ce(),r++;return $t=V,$t},"getTasks"),fe=u(function(t,e,r,n){const a=t.format(e.trim()),d=t.format("YYYY-MM-DD");return n.includes(a)||n.includes(d)?!1:r.includes("weekends")&&(t.isoWeekday()===oe[wt]||t.isoWeekday()===oe[wt]+1)||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(a)||r.includes(d)},"isInvalidDate"),Nn=u(function(t){qt=t},"setWeekday"),zn=u(function(){return qt},"getWeekday"),Bn=u(function(t){wt=t},"setWeekend"),me=u(function(t,e,r,n){if(!r.length||t.manualEndTime)return;let a;t.startTime instanceof Date?a=X(t.startTime):a=X(t.startTime,e,!0),a=a.add(1,"d");let d;t.endTime instanceof Date?d=X(t.endTime):d=X(t.endTime,e,!0);const[p,D]=Hn(a,d,e,r,n);t.endTime=p.toDate(),t.renderEndTime=D},"checkTaskDates"),Hn=u(function(t,e,r,n,a){let d=!1,p=null;const D=e.add(1e4,"d");for(;t<=e;){if(d||(p=e.toDate()),d=fe(t,r,n,a),d&&(e=e.add(1,"d"),e>D))throw new Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");t=t.add(1,"d")}return[e,p]},"fixTaskDates"),Ft=u(function(t,e,r){if(r=r.trim(),u(d=>{const p=d.trim();return p==="x"||p==="X"},"isTimestampFormat")(e)&&/^\d+$/.test(r))return new Date(Number(r));const n=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(n!==null){let d=null;for(const D of n.groups.ids.split(" ")){let Y=at(D);Y!==void 0&&(!d||Y.endTime>d.endTime)&&(d=Y)}if(d)return d.endTime;const p=new Date;return p.setHours(0,0,0,0),p}let a=X(r,e.trim(),!0);if(a.isValid())return a.toDate();{it.debug("Invalid date:"+r),it.debug("With date format:"+e.trim());const d=new Date(r);if(d===void 0||isNaN(d.getTime())||d.getFullYear()<-1e4||d.getFullYear()>1e4)throw new Error("Invalid date:"+r);return d}},"getStartDate"),ke=u(function(t){const e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return e!==null?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),ye=u(function(t,e,r,n=!1){r=r.trim();const a=/^until\s+(?<ids>[\d\w- ]+)/.exec(r);if(a!==null){let S=null;for(const z of a.groups.ids.split(" ")){let $=at(z);$!==void 0&&(!S||$.startTime<S.startTime)&&(S=$)}if(S)return S.startTime;const E=new Date;return E.setHours(0,0,0,0),E}let d=X(r,e.trim(),!0);if(d.isValid())return n&&(d=d.add(1,"d")),d.toDate();let p=X(t);const[D,Y]=ke(r);if(!Number.isNaN(D)){const S=p.add(D,Y);S.isValid()&&(p=S)}return p.toDate()},"getEndDate"),vt=0,ut=u(function(t){return t===void 0?(vt=vt+1,"task"+vt):t},"parseId"),Rn=u(function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const n=r.split(","),a={};Ut(n,a,de);for(let p=0;p<n.length;p++)n[p]=n[p].trim();let d="";switch(n.length){case 1:a.id=ut(),a.startTime=t.endTime,d=n[0];break;case 2:a.id=ut(),a.startTime=Ft(void 0,K,n[0]),d=n[1];break;case 3:a.id=ut(n[0]),a.startTime=Ft(void 0,K,n[1]),d=n[2];break}return d&&(a.endTime=ye(a.startTime,K,d,kt),a.manualEndTime=X(d,"YYYY-MM-DD",!0).isValid(),me(a,K,ht,dt)),a},"compileData"),Gn=u(function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const n=r.split(","),a={};Ut(n,a,de);for(let d=0;d<n.length;d++)n[d]=n[d].trim();switch(n.length){case 1:a.id=ut(),a.startTime={type:"prevTaskEnd",id:t},a.endTime={data:n[0]};break;case 2:a.id=ut(),a.startTime={type:"getStartDate",startData:n[0]},a.endTime={data:n[1]};break;case 3:a.id=ut(n[0]),a.startTime={type:"getStartDate",startData:n[1]},a.endTime={data:n[2]};break}return a},"parseData"),Wt,Tt,V=[],ge={},Vn=u(function(t,e){const r={section:ft,type:ft,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},n=Gn(Tt,e);r.raw.startTime=n.startTime,r.raw.endTime=n.endTime,r.id=n.id,r.prevTaskId=Tt,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,r.vert=n.vert,r.vert?r.order=-1:(r.order=It,It++);const a=V.push(r);Tt=r.id,ge[r.id]=a-1},"addTask"),at=u(function(t){const e=ge[t];return V[e]},"findTaskById"),qn=u(function(t,e){const r={section:ft,type:ft,description:t,task:t,classes:[]},n=Rn(Wt,e);r.startTime=n.startTime,r.endTime=n.endTime,r.id=n.id,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,r.vert=n.vert,Wt=r,$t.push(r)},"addTaskOrg"),ce=u(function(){const t=u(function(r){const n=V[r];let a="";switch(V[r].raw.startTime.type){case"prevTaskEnd":{const d=at(n.prevTaskId);n.startTime=d.endTime;break}case"getStartDate":a=Ft(void 0,K,V[r].raw.startTime.startData),a&&(V[r].startTime=a);break}return V[r].startTime&&(V[r].endTime=ye(V[r].startTime,K,V[r].raw.endTime.data,kt),V[r].endTime&&(V[r].processed=!0,V[r].manualEndTime=X(V[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),me(V[r],K,ht,dt))),V[r].processed},"compileTask");let e=!0;for(const[r,n]of V.entries())t(r),e=e&&n.processed;return e},"compileTasks"),Un=u(function(t,e){let r=e;lt().securityLevel!=="loose"&&(r=Ce.sanitizeUrl(e)),t.split(",").forEach(function(n){at(n)!==void 0&&(be(n,()=>{window.open(r,"_self")}),Bt.set(n,r))}),pe(t,"clickable")},"setLink"),pe=u(function(t,e){t.split(",").forEach(function(r){let n=at(r);n!==void 0&&n.classes.push(e)})},"setClass"),Xn=u(function(t,e,r){if(lt().securityLevel!=="loose"||e===void 0)return;let n=[];if(typeof r=="string"){n=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let a=0;a<n.length;a++){let d=n[a].trim();d.startsWith('"')&&d.endsWith('"')&&(d=d.substr(1,d.length-2)),n[a]=d}}n.length===0&&n.push(t),at(t)!==void 0&&be(t,()=>{Ee.runFunc(e,...n)})},"setClickFun"),be=u(function(t,e){Gt.push(function(){const r=ct?`${ct}-${t}`:t,n=document.querySelector(`[id="${r}"]`);n!==null&&n.addEventListener("click",function(){e()})},function(){const r=ct?`${ct}-${t}`:t,n=document.querySelector(`[id="${r}-text"]`);n!==null&&n.addEventListener("click",function(){e()})})},"pushFun"),jn=u(function(t,e,r){t.split(",").forEach(function(n){Xn(n,e,r)}),pe(t,"clickable")},"setClickEvent"),Qn=u(function(t){Gt.forEach(function(e){e(t)})},"bindFunctions"),Zn={getConfig:u(()=>lt().gantt,"getConfig"),clear:kn,setDateFormat:$n,getDateFormat:En,enableInclusiveEndDates:wn,endDatesAreInclusive:_n,enableTopAxis:Dn,topAxisEnabled:Sn,setAxisFormat:gn,getAxisFormat:pn,setTickInterval:bn,getTickInterval:xn,setTodayMarker:vn,getTodayMarker:Tn,setAccTitle:_e,getAccTitle:we,setDiagramTitle:$e,getDiagramTitle:Te,setDiagramId:yn,setDisplayMode:Cn,getDisplayMode:Mn,setAccDescription:ve,getAccDescription:xe,addSection:Fn,getSections:Wn,getTasks:Pn,addTask:Vn,findTaskById:at,addTaskOrg:qn,setIncludes:Yn,getIncludes:An,setExcludes:On,getExcludes:Ln,setClickEvent:jn,setLink:Un,getLinks:In,bindFunctions:Qn,parseDuration:ke,isInvalidDate:fe,setWeekday:Nn,getWeekday:zn,setWeekend:Bn};function Ut(t,e,r){let n=!0;for(;n;)n=!1,r.forEach(function(a){const d="^\\s*"+a+"\\s*$",p=new RegExp(d);t[0].match(p)&&(e[a]=!0,t.shift(1),n=!0)})}u(Ut,"getTaskTags");X.extend(fn);var Jn=u(function(){it.debug("Something is calling, setConf, remove the call")},"setConf"),le={monday:Be,tuesday:ze,wednesday:Ne,thursday:Pe,friday:We,saturday:Fe,sunday:Ie},Kn=u((t,e)=>{let r=[...t].map(()=>-1/0),n=[...t].sort((d,p)=>d.startTime-p.startTime||d.order-p.order),a=0;for(const d of n)for(let p=0;p<r.length;p++)if(d.startTime>=r[p]){r[p]=d.endTime,d.order=p+e,p>a&&(a=p);break}return a},"getMaxIntersections"),tt,Ct=1e4,ts=u(function(t,e,r,n){const a=lt().gantt;n.db.setDiagramId(e);const d=lt().securityLevel;let p;d==="sandbox"&&(p=pt("#i"+e));const D=d==="sandbox"?pt(p.nodes()[0].contentDocument.body):pt("body"),Y=d==="sandbox"?p.nodes()[0].contentDocument:document,S=Y.getElementById(e);tt=S.parentElement.offsetWidth,tt===void 0&&(tt=1200),a.useWidth!==void 0&&(tt=a.useWidth);const E=n.db.getTasks(),z=E.filter(f=>!f.vert);let $=[];for(const f of z)$.push(f.type);$=M($);const _={};let G=2*a.topPadding;if(n.db.getDisplayMode()==="compact"||a.displayMode==="compact"){const f={};for(const g of z)f[g.section]===void 0?f[g.section]=[g]:f[g.section].push(g);let x=0;for(const g of Object.keys(f)){const y=Kn(f[g],x)+1;x+=y,G+=y*(a.barHeight+a.barGap),_[g]=y}}else{G+=z.length*(a.barHeight+a.barGap);for(const f of $)_[f]=z.filter(x=>x.type===f).length}S.setAttribute("viewBox","0 0 "+tt+" "+G);const H=D.select(`[id="${e}"]`),k=Ye().domain([Ae(E,function(f){return f.startTime}),Oe(E,function(f){return f.endTime})]).rangeRound([0,tt-a.leftPadding-a.rightPadding]);function C(f,x){const g=f.startTime,y=x.startTime;let i=0;return g>y?i=1:g<y&&(i=-1),i}u(C,"taskCompare"),E.sort(C),F(E,tt,G),De(H,G,tt,a.useMaxWidth),H.append("text").text(n.db.getDiagramTitle()).attr("x",tt/2).attr("y",a.titleTopMargin).attr("class","titleText");function F(f,x,g){const y=a.barHeight,i=y+a.barGap,h=a.topPadding,l=a.leftPadding,v=He().domain([0,$.length]).range(["#00B9FA","#F95002"]).interpolate(Le);R(i,h,l,x,g,f,n.db.getExcludes(),n.db.getIncludes()),A(l,h,x,g),L(f,i,h,l,y,v,x),b(i,h),m(l,h,x,g)}u(F,"makeGantt");function L(f,x,g,y,i,h,l){f.sort((o,w)=>o.vert===w.vert?0:o.vert?1:-1);const v=f.filter(o=>!o.vert),s=[...new Set(v.map(o=>o.order))].map(o=>v.find(w=>w.order===o));H.append("g").selectAll("rect").data(s).enter().append("rect").attr("x",0).attr("y",function(o,w){return w=o.order,w*x+g-2}).attr("width",function(){return l-a.rightPadding/2}).attr("height",x).attr("class",function(o){for(const[w,O]of $.entries())if(o.type===O)return"section section"+w%a.numberSectionStyles;return"section section0"}).enter();const T=H.append("g").selectAll("rect").data(f).enter(),c=n.db.getLinks();if(T.append("rect").attr("id",function(o){return e+"-"+o.id}).attr("rx",3).attr("ry",3).attr("x",function(o){return o.milestone?k(o.startTime)+y+.5*(k(o.endTime)-k(o.startTime))-.5*i:k(o.startTime)+y}).attr("y",function(o,w){return w=o.order,o.vert?a.gridLineStartPadding:w*x+g}).attr("width",function(o){return o.milestone?i:o.vert?.08*i:k(o.renderEndTime||o.endTime)-k(o.startTime)}).attr("height",function(o){return o.vert?v.length*(a.barHeight+a.barGap)+a.barHeight*2:i}).attr("transform-origin",function(o,w){return w=o.order,(k(o.startTime)+y+.5*(k(o.endTime)-k(o.startTime))).toString()+"px "+(w*x+g+.5*i).toString()+"px"}).attr("class",function(o){const w="task";let O="";o.classes.length>0&&(O=o.classes.join(" "));let I=0;for(const[P,N]of $.entries())o.type===N&&(I=P%a.numberSectionStyles);let W="";return o.active?o.crit?W+=" activeCrit":W=" active":o.done?o.crit?W=" doneCrit":W=" done":o.crit&&(W+=" crit"),W.length===0&&(W=" task"),o.milestone&&(W=" milestone "+W),o.vert&&(W=" vert "+W),W+=I,W+=" "+O,w+W}),T.append("text").attr("id",function(o){return e+"-"+o.id+"-text"}).text(function(o){return o.task}).attr("font-size",a.fontSize).attr("x",function(o){let w=k(o.startTime),O=k(o.renderEndTime||o.endTime);if(o.milestone&&(w+=.5*(k(o.endTime)-k(o.startTime))-.5*i,O=w+i),o.vert)return k(o.startTime)+y;const I=this.getBBox().width;return I>O-w?O+I+1.5*a.leftPadding>l?w+y-5:O+y+5:(O-w)/2+w+y}).attr("y",function(o,w){return o.vert?a.gridLineStartPadding+v.length*(a.barHeight+a.barGap)+60:(w=o.order,w*x+a.barHeight/2+(a.fontSize/2-2)+g)}).attr("text-height",i).attr("class",function(o){const w=k(o.startTime);let O=k(o.endTime);o.milestone&&(O=w+i);const I=this.getBBox().width;let W="";o.classes.length>0&&(W=o.classes.join(" "));let P=0;for(const[st,et]of $.entries())o.type===et&&(P=st%a.numberSectionStyles);let N="";return o.active&&(o.crit?N="activeCritText"+P:N="activeText"+P),o.done?o.crit?N=N+" doneCritText"+P:N=N+" doneText"+P:o.crit&&(N=N+" critText"+P),o.milestone&&(N+=" milestoneText"),o.vert&&(N+=" vertText"),I>O-w?O+I+1.5*a.leftPadding>l?W+" taskTextOutsideLeft taskTextOutside"+P+" "+N:W+" taskTextOutsideRight taskTextOutside"+P+" "+N+" width-"+I:W+" taskText taskText"+P+" "+N+" width-"+I}),lt().securityLevel==="sandbox"){let o;o=pt("#i"+e);const w=o.nodes()[0].contentDocument;T.filter(function(O){return c.has(O.id)}).each(function(O){var I=w.querySelector("#"+CSS.escape(e+"-"+O.id)),W=w.querySelector("#"+CSS.escape(e+"-"+O.id+"-text"));const P=I.parentNode;var N=w.createElement("a");N.setAttribute("xlink:href",c.get(O.id)),N.setAttribute("target","_top"),P.appendChild(N),N.appendChild(I),N.appendChild(W)})}}u(L,"drawRects");function R(f,x,g,y,i,h,l,v){if(l.length===0&&v.length===0)return;let s,T;for(const{startTime:I,endTime:W}of h)(s===void 0||I<s)&&(s=I),(T===void 0||W>T)&&(T=W);if(!s||!T)return;if(X(T).diff(X(s),"year")>5){it.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const c=n.db.getDateFormat(),o=[];let w=null,O=X(s);for(;O.valueOf()<=T;)n.db.isInvalidDate(O,c,l,v)?w?w.end=O:w={start:O,end:O}:w&&(o.push(w),w=null),O=O.add(1,"d");H.append("g").selectAll("rect").data(o).enter().append("rect").attr("id",I=>e+"-exclude-"+I.start.format("YYYY-MM-DD")).attr("x",I=>k(I.start.startOf("day"))+g).attr("y",a.gridLineStartPadding).attr("width",I=>k(I.end.endOf("day"))-k(I.start.startOf("day"))).attr("height",i-x-a.gridLineStartPadding).attr("transform-origin",function(I,W){return(k(I.start)+g+.5*(k(I.end)-k(I.start))).toString()+"px "+(W*f+.5*i).toString()+"px"}).attr("class","exclude-range")}u(R,"drawExcludeDays");function B(f,x,g,y){if(g<=0||f>x)return 1/0;const i=x-f,h=X.duration({[y??"day"]:g}).asMilliseconds();return h<=0?1/0:Math.ceil(i/h)}u(B,"getEstimatedTickCount");function A(f,x,g,y){const i=n.db.getDateFormat(),h=n.db.getAxisFormat();let l;h?l=h:i==="D"?l="%d":l=a.axisFormat??"%Y-%m-%d";let v=Qe(k).tickSize(-y+x+a.gridLineStartPadding).tickFormat(jt(l));const s=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(n.db.getTickInterval()||a.tickInterval);if(s!==null){const T=parseInt(s[1],10);if(isNaN(T)||T<=0)it.warn(`Invalid tick interval value: "${s[1]}". Skipping custom tick interval.`);else{const c=s[2],o=n.db.getWeekday()||a.weekday,w=k.domain(),O=w[0],I=w[1],W=B(O,I,T,c);if(W>Ct)it.warn(`The tick interval "${T}${c}" would generate ${W} ticks, which exceeds the maximum allowed (${Ct}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(c){case"millisecond":v.ticks(ee.every(T));break;case"second":v.ticks(te.every(T));break;case"minute":v.ticks(Kt.every(T));break;case"hour":v.ticks(Jt.every(T));break;case"day":v.ticks(Zt.every(T));break;case"week":v.ticks(le[o].every(T));break;case"month":v.ticks(Qt.every(T));break}}}if(H.append("g").attr("class","grid").attr("transform","translate("+f+", "+(y-50)+")").call(v).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),n.db.topAxisEnabled()||a.topAxis){let T=je(k).tickSize(-y+x+a.gridLineStartPadding).tickFormat(jt(l));if(s!==null){const c=parseInt(s[1],10);if(isNaN(c)||c<=0)it.warn(`Invalid tick interval value: "${s[1]}". Skipping custom tick interval.`);else{const o=s[2],w=n.db.getWeekday()||a.weekday,O=k.domain(),I=O[0],W=O[1];if(B(I,W,c,o)<=Ct)switch(o){case"millisecond":T.ticks(ee.every(c));break;case"second":T.ticks(te.every(c));break;case"minute":T.ticks(Kt.every(c));break;case"hour":T.ticks(Jt.every(c));break;case"day":T.ticks(Zt.every(c));break;case"week":T.ticks(le[w].every(c));break;case"month":T.ticks(Qt.every(c));break}}}H.append("g").attr("class","grid").attr("transform","translate("+f+", "+x+")").call(T).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}u(A,"makeGrid");function b(f,x){let g=0;const y=Object.keys(_).map(i=>[i,_[i]]);H.append("g").selectAll("text").data(y).enter().append(function(i){const h=i[0].split(Se.lineBreakRegex),l=-(h.length-1)/2,v=Y.createElementNS("http://www.w3.org/2000/svg","text");v.setAttribute("dy",l+"em");for(const[s,T]of h.entries()){const c=Y.createElementNS("http://www.w3.org/2000/svg","tspan");c.setAttribute("alignment-baseline","central"),c.setAttribute("x","10"),s>0&&c.setAttribute("dy","1em"),c.textContent=T,v.appendChild(c)}return v}).attr("x",10).attr("y",function(i,h){if(h>0)for(let l=0;l<h;l++)return g+=y[h-1][1],i[1]*f/2+g*f+x;else return i[1]*f/2+x}).attr("font-size",a.sectionFontSize).attr("class",function(i){for(const[h,l]of $.entries())if(i[0]===l)return"sectionTitle sectionTitle"+h%a.numberSectionStyles;return"sectionTitle"})}u(b,"vertLabels");function m(f,x,g,y){const i=n.db.getTodayMarker();if(i==="off")return;const h=H.append("g").attr("class","today"),l=new Date,v=h.append("line");v.attr("x1",k(l)+f).attr("x2",k(l)+f).attr("y1",a.titleTopMargin).attr("y2",y-a.titleTopMargin).attr("class","today"),i!==""&&v.attr("style",i.replace(/,/g,";"))}u(m,"drawToday");function M(f){const x={},g=[];for(let y=0,i=f.length;y<i;++y)Object.prototype.hasOwnProperty.call(x,f[y])||(x[f[y]]=!0,g.push(f[y]));return g}u(M,"checkUnique")},"draw"),es={setConf:Jn,draw:ts},ns=u(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  /* Done-crit task text outside the bar — same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${t.taskTextOutsideColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles"),ss=ns,Ts={parser:mn,db:Zn,renderer:es,styles:ss};export{Ts as diagram};
