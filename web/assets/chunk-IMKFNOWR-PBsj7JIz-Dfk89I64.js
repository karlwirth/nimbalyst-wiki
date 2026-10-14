import{d as Zt}from"./chunk-XXDRQBXY-CxfOVPEA-D-5WS1bI.js";import{B as te}from"./chunk-POPQ4Y6H-CKtyeTcq-vpNCrDSz.js";import{_ as d,l as k,c as R,r as ee,u as se,a as ie,b as re,g as ne,s as ae,t as oe,v as le,W as ce,j as z,B as he,A as de}from"./mermaid.core-DLqIxXBf-DUfEkR-M.js";import{k as ue}from"./chunk-F27PBJKO-Hqp77Frg-0Js6AhUL.js";import{a as bt}from"./transform-DR5aOz-7-BPch8-kZ.js";var Dt=(function(){var t=d(function(B,n,r,y){for(r=r||{},y=B.length;y--;r[B[y]]=n);return r},"o"),e=[1,2],a=[1,3],s=[1,4],h=[2,4],c=[1,9],f=[1,11],m=[1,16],o=[1,17],g=[1,18],D=[1,19],$=[1,33],x=[1,20],N=[1,21],u=[1,22],b=[1,23],A=[1,24],L=[1,26],Y=[1,27],E=[1,28],O=[1,29],tt=[1,30],et=[1,31],st=[1,32],it=[1,35],rt=[1,36],nt=[1,37],at=[1,38],M=[1,34],p=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ot=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],Ct=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ft={trace:d(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:d(function(B,n,r,y,S,i,T){var l=i.length-1;switch(S){case 3:return y.setRootDoc(i[l]),i[l];case 4:this.$=[];break;case 5:i[l]!="nl"&&(i[l-1].push(i[l]),this.$=i[l-1]);break;case 6:case 7:this.$=i[l];break;case 8:this.$="nl";break;case 12:this.$=i[l];break;case 13:const V=i[l-1];V.description=y.trimColon(i[l]),this.$=V;break;case 14:this.$={stmt:"relation",state1:i[l-2],state2:i[l]};break;case 15:const gt=y.trimColon(i[l]);this.$={stmt:"relation",state1:i[l-3],state2:i[l-1],description:gt};break;case 19:this.$={stmt:"state",id:i[l-3],type:"default",description:"",doc:i[l-1]};break;case 20:var F=i[l],H=i[l-2].trim();if(i[l].match(":")){var ct=i[l].split(":");F=ct[0],H=[H,ct[1]]}this.$={stmt:"state",id:F,type:"default",description:H};break;case 21:this.$={stmt:"state",id:i[l-3],type:"default",description:i[l-5],doc:i[l-1]};break;case 22:this.$={stmt:"state",id:i[l],type:"fork"};break;case 23:this.$={stmt:"state",id:i[l],type:"join"};break;case 24:this.$={stmt:"state",id:i[l],type:"choice"};break;case 25:this.$={stmt:"state",id:y.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:i[l-1].trim(),note:{position:i[l-2].trim(),text:i[l].trim()}};break;case 29:this.$=i[l].trim(),y.setAccTitle(this.$);break;case 30:case 31:this.$=i[l].trim(),y.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:i[l-3],url:i[l-2],tooltip:i[l-1]};break;case 33:this.$={stmt:"click",id:i[l-3],url:i[l-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:i[l-1].trim(),classes:i[l].trim()};break;case 36:this.$={stmt:"style",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 37:this.$={stmt:"applyClass",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 38:y.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:y.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:y.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:y.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:i[l].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:e,5:a,6:s},{1:[3]},{3:5,4:e,5:a,6:s},{3:6,4:e,5:a,6:s},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],h,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:c,5:f,8:8,9:10,10:12,11:13,12:14,13:15,16:m,17:o,19:g,22:D,24:$,25:x,26:N,27:u,28:b,29:A,32:25,33:L,35:Y,37:E,38:O,41:tt,45:et,48:st,51:it,52:rt,53:nt,54:at,57:M},t(p,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:m,17:o,19:g,22:D,24:$,25:x,26:N,27:u,28:b,29:A,32:25,33:L,35:Y,37:E,38:O,41:tt,45:et,48:st,51:it,52:rt,53:nt,54:at,57:M},t(p,[2,7]),t(p,[2,8]),t(p,[2,9]),t(p,[2,10]),t(p,[2,11]),t(p,[2,12],{14:[1,40],15:[1,41]}),t(p,[2,16]),{18:[1,42]},t(p,[2,18],{20:[1,43]}),{23:[1,44]},t(p,[2,22]),t(p,[2,23]),t(p,[2,24]),t(p,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(p,[2,28]),{34:[1,49]},{36:[1,50]},t(p,[2,31]),{13:51,24:$,57:M},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(ot,[2,44],{58:[1,56]}),t(ot,[2,45],{58:[1,57]}),t(p,[2,38]),t(p,[2,39]),t(p,[2,40]),t(p,[2,41]),t(p,[2,6]),t(p,[2,13]),{13:58,24:$,57:M},t(p,[2,17]),t(Ct,h,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(p,[2,29]),t(p,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(p,[2,14],{14:[1,71]}),{4:c,5:f,8:8,9:10,10:12,11:13,12:14,13:15,16:m,17:o,19:g,21:[1,72],22:D,24:$,25:x,26:N,27:u,28:b,29:A,32:25,33:L,35:Y,37:E,38:O,41:tt,45:et,48:st,51:it,52:rt,53:nt,54:at,57:M},t(p,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(p,[2,34]),t(p,[2,35]),t(p,[2,36]),t(p,[2,37]),t(ot,[2,46]),t(ot,[2,47]),t(p,[2,15]),t(p,[2,19]),t(Ct,h,{7:78}),t(p,[2,26]),t(p,[2,27]),{5:[1,79]},{5:[1,80]},{4:c,5:f,8:8,9:10,10:12,11:13,12:14,13:15,16:m,17:o,19:g,21:[1,81],22:D,24:$,25:x,26:N,27:u,28:b,29:A,32:25,33:L,35:Y,37:E,38:O,41:tt,45:et,48:st,51:it,52:rt,53:nt,54:at,57:M},t(p,[2,32]),t(p,[2,33]),t(p,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:d(function(B,n){if(n.recoverable)this.trace(B);else{var r=new Error(B);throw r.hash=n,r}},"parseError"),parse:d(function(B){var n=this,r=[0],y=[],S=[null],i=[],T=this.table,l="",F=0,H=0,ct=2,V=1,gt=i.slice.call(arguments,1),_=Object.create(this.lexer),j={yy:{}};for(var mt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,mt)&&(j.yy[mt]=this.yy[mt]);_.setInput(B,j.yy),j.yy.lexer=_,j.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var St=_.yylloc;i.push(St);var qt=_.options&&_.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Qt(I){r.length=r.length-2*I,S.length=S.length-I,i.length=i.length-I}d(Qt,"popStack");function vt(){var I;return I=y.pop()||_.lex()||V,typeof I!="number"&&(I instanceof Array&&(y=I,I=y.pop()),I=n.symbols_[I]||I),I}d(vt,"lex");for(var v,G,w,kt,K={},ht,P,Lt,dt;;){if(G=r[r.length-1],this.defaultActions[G]?w=this.defaultActions[G]:((v===null||typeof v>"u")&&(v=vt()),w=T[G]&&T[G][v]),typeof w>"u"||!w.length||!w[0]){var Tt="";dt=[];for(ht in T[G])this.terminals_[ht]&&ht>ct&&dt.push("'"+this.terminals_[ht]+"'");_.showPosition?Tt="Parse error on line "+(F+1)+`:
`+_.showPosition()+`
Expecting `+dt.join(", ")+", got '"+(this.terminals_[v]||v)+"'":Tt="Parse error on line "+(F+1)+": Unexpected "+(v==V?"end of input":"'"+(this.terminals_[v]||v)+"'"),this.parseError(Tt,{text:_.match,token:this.terminals_[v]||v,line:_.yylineno,loc:St,expected:dt})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+G+", token: "+v);switch(w[0]){case 1:r.push(v),S.push(_.yytext),i.push(_.yylloc),r.push(w[1]),v=null,H=_.yyleng,l=_.yytext,F=_.yylineno,St=_.yylloc;break;case 2:if(P=this.productions_[w[1]][1],K.$=S[S.length-P],K._$={first_line:i[i.length-(P||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(P||1)].first_column,last_column:i[i.length-1].last_column},qt&&(K._$.range=[i[i.length-(P||1)].range[0],i[i.length-1].range[1]]),kt=this.performAction.apply(K,[l,H,F,j.yy,w[1],S,i].concat(gt)),typeof kt<"u")return kt;P&&(r=r.slice(0,-1*P*2),S=S.slice(0,-1*P),i=i.slice(0,-1*P)),r.push(this.productions_[w[1]][0]),S.push(K.$),i.push(K._$),Lt=T[r[r.length-2]][r[r.length-1]],r.push(Lt);break;case 3:return!0}}return!0},"parse")},Xt=(function(){var B={EOF:1,parseError:d(function(n,r){if(this.yy.parser)this.yy.parser.parseError(n,r);else throw new Error(n)},"parseError"),setInput:d(function(n,r){return this.yy=r||this.yy||{},this._input=n,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:d(function(){var n=this._input[0];this.yytext+=n,this.yyleng++,this.offset++,this.match+=n,this.matched+=n;var r=n.match(/(?:\r\n?|\n).*/g);return r?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),n},"input"),unput:d(function(n){var r=n.length,y=n.split(/(?:\r\n?|\n)/g);this._input=n+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-r),this.offset-=r;var S=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),y.length-1&&(this.yylineno-=y.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:y?(y.length===S.length?this.yylloc.first_column:0)+S[S.length-y.length].length-y[0].length:this.yylloc.first_column-r},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-r]),this.yyleng=this.yytext.length,this},"unput"),more:d(function(){return this._more=!0,this},"more"),reject:d(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:d(function(n){this.unput(this.match.slice(n))},"less"),pastInput:d(function(){var n=this.matched.substr(0,this.matched.length-this.match.length);return(n.length>20?"...":"")+n.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:d(function(){var n=this.match;return n.length<20&&(n+=this._input.substr(0,20-n.length)),(n.substr(0,20)+(n.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:d(function(){var n=this.pastInput(),r=new Array(n.length+1).join("-");return n+this.upcomingInput()+`
`+r+"^"},"showPosition"),test_match:d(function(n,r){var y,S,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),S=n[0].match(/(?:\r\n?|\n).*/g),S&&(this.yylineno+=S.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:S?S[S.length-1].length-S[S.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+n[0].length},this.yytext+=n[0],this.match+=n[0],this.matches=n,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(n[0].length),this.matched+=n[0],y=this.performAction.call(this,this.yy,this,r,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),y)return y;if(this._backtrack){for(var T in i)this[T]=i[T];return!1}return!1},"test_match"),next:d(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var n,r,y,S;this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),T=0;T<i.length;T++)if(y=this._input.match(this.rules[i[T]]),y&&(!r||y[0].length>r[0].length)){if(r=y,S=T,this.options.backtrack_lexer){if(n=this.test_match(y,i[T]),n!==!1)return n;if(this._backtrack){r=!1;continue}else return!1}else if(!this.options.flex)break}return r?(n=this.test_match(r,i[S]),n!==!1?n:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:d(function(){var n=this.next();return n||this.lex()},"lex"),begin:d(function(n){this.conditionStack.push(n)},"begin"),popState:d(function(){var n=this.conditionStack.length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:d(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:d(function(n){return n=this.conditionStack.length-1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:d(function(n){this.begin(n)},"pushState"),stateStackSize:d(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:d(function(n,r,y,S){function i(){const T=r.yytext.indexOf("%%");if(T===0)return!1;if(T>0){const l=r.yytext.slice(0,T),F=r.yytext.slice(T);F&&n.lexer.unput(F),r.yytext=l}return!0}switch(d(i,"processId"),y){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:return 5;case 9:break;case 10:break;case 11:break;case 12:break;case 13:return this.pushState("SCALE"),17;case 14:return 18;case 15:this.popState();break;case 16:return this.begin("acc_title"),33;case 17:return this.popState(),"acc_title_value";case 18:return this.begin("acc_descr"),35;case 19:return this.popState(),"acc_descr_value";case 20:this.begin("acc_descr_multiline");break;case 21:this.popState();break;case 22:return"acc_descr_multiline_value";case 23:return this.pushState("CLASSDEF"),41;case 24:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 25:return this.popState(),this.pushState("CLASSDEFID"),42;case 26:return this.popState(),43;case 27:return this.pushState("CLASS"),48;case 28:return this.popState(),this.pushState("CLASS_STYLE"),49;case 29:return this.popState(),50;case 30:return this.pushState("STYLE"),45;case 31:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 32:return this.popState(),47;case 33:return this.pushState("SCALE"),17;case 34:return 18;case 35:this.popState();break;case 36:this.pushState("STATE");break;case 37:return this.popState(),r.yytext=r.yytext.slice(0,-8).trim(),25;case 38:return this.popState(),r.yytext=r.yytext.slice(0,-8).trim(),26;case 39:return this.popState(),r.yytext=r.yytext.slice(0,-10).trim(),27;case 40:return this.popState(),r.yytext=r.yytext.slice(0,-8).trim(),25;case 41:return this.popState(),r.yytext=r.yytext.slice(0,-8).trim(),26;case 42:return this.popState(),r.yytext=r.yytext.slice(0,-10).trim(),27;case 43:return 51;case 44:return 52;case 45:return 53;case 46:return 54;case 47:this.pushState("STATE_STRING");break;case 48:return this.pushState("STATE_ID"),"AS";case 49:return i()?(this.popState(),"ID"):void 0;case 50:this.popState();break;case 51:return"STATE_DESCR";case 52:throw new Error('Error: State name must be a single word. Found: "'+r.yytext.trim()+'"');case 53:return 19;case 54:this.popState();break;case 55:return this.popState(),this.pushState("struct"),20;case 56:return this.popState(),21;case 57:break;case 58:return this.begin("NOTE"),29;case 59:return this.popState(),this.pushState("NOTE_ID"),59;case 60:return this.popState(),this.pushState("NOTE_ID"),60;case 61:this.popState(),this.pushState("FLOATING_NOTE");break;case 62:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 63:break;case 64:return"NOTE_TEXT";case 65:return i()?(this.popState(),"ID"):void 0;case 66:return i()?(this.popState(),this.pushState("NOTE_TEXT"),24):void 0;case 67:return this.popState(),r.yytext=r.yytext.substr(2).trim(),31;case 68:return this.popState(),r.yytext=r.yytext.slice(0,-8).trim(),31;case 69:return 6;case 70:return 6;case 71:return 16;case 72:return 57;case 73:return i()?24:void 0;case 74:return r.yytext=r.yytext.trim(),14;case 75:return 15;case 76:return 28;case 77:return 58;case 78:return 5;case 79:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:\w+\s+\w+.*?\{)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?\n\s*end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:(?:[^:\n;]|:[^:\n;])+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[10,11,12],inclusive:!1},struct:{rules:[10,11,12,23,27,30,36,43,44,45,46,56,57,58,72,73,74,75,76,77],inclusive:!1},FLOATING_NOTE_ID:{rules:[65],inclusive:!1},FLOATING_NOTE:{rules:[62,63,64],inclusive:!1},NOTE_TEXT:{rules:[67,68],inclusive:!1},NOTE_ID:{rules:[66],inclusive:!1},NOTE:{rules:[59,60,61],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[32],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[31],inclusive:!1},CLASS_STYLE:{rules:[29],inclusive:!1},CLASS:{rules:[28],inclusive:!1},CLASSDEFID:{rules:[26],inclusive:!1},CLASSDEF:{rules:[24,25],inclusive:!1},acc_descr_multiline:{rules:[21,22],inclusive:!1},acc_descr:{rules:[19],inclusive:!1},acc_title:{rules:[17],inclusive:!1},SCALE:{rules:[14,15,34,35],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[49],inclusive:!1},STATE_STRING:{rules:[50,51],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[10,11,12,37,38,39,40,41,42,47,48,52,53,54,55],inclusive:!1},ID:{rules:[10,11,12],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,11,12,13,16,18,20,23,27,30,33,36,55,58,69,70,71,72,73,74,75,77,78,79],inclusive:!0}}};return B})();ft.lexer=Xt;function lt(){this.yy={}}return d(lt,"Parser"),lt.prototype=ft,ft.Parser=lt,new lt})();Dt.parser=Dt;var ze=Dt,pe="TB",Ft="TB",It="dir",J="state",U="root",$t="relation",ye="classDef",fe="style",ge="applyClass",Q="default",Yt="divider",Pt="fill:none",Wt="fill: #333",jt="c",Gt="markdown",zt="normal",_t="rect",Et="rectWithTitle",me="stateStart",Se="stateEnd",At="divider",wt="roundedWithTitle",ke="note",Te="noteGroup",Z="statediagram",be="state",_e=`${Z}-${be}`,Mt="transition",Ee="note",De="note-edge",$e=`${Mt} ${De}`,xe=`${Z}-${Ee}`,Ce="cluster",ve=`${Z}-${Ce}`,Le="cluster-alt",Ie=`${Z}-${Le}`,Ht="parent",Kt="note",Ae="state",xt="----",we=`${xt}${Kt}`,Nt=`${xt}${Ht}`,Ut=d((t,e=Ft)=>{if(!t.doc)return e;let a=e;for(const s of t.doc)s.stmt==="dir"&&(a=s.value);return a},"getDir"),Ne=d(function(t,e){return e.db.getClasses()},"getClasses"),Re=d(async function(t,e,a,s){k.info("REF0:"),k.info("Drawing state diagram (v2)",e);const{securityLevel:h,state:c,layout:f}=R();s.db.extract(s.db.getRootDocV2());const m=s.db.getData(),o=Zt(e,h);m.type=s.type,m.layoutAlgorithm=f,m.nodeSpacing=c?.nodeSpacing||50,m.rankSpacing=c?.rankSpacing||50,R().look==="neo"?m.markers=["barbNeo"]:m.markers=["barb"],m.diagramId=e,await ee(m,o);const g=8;try{(typeof s.db.getLinks=="function"?s.db.getLinks():new Map).forEach((D,$)=>{const x=typeof $=="string"?$:typeof $?.id=="string"?$.id:"",N=m.nodes.find(E=>E.id===x);if(!x){k.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify($));return}const u=o.node()?.querySelectorAll("g.node, g.rough-node");let b;if(u?.forEach(E=>{const O=E.textContent?.trim();(E.id===N?.domId||O===x)&&(b=E)}),!b){k.warn("⚠️ Could not find node matching text:",x);return}const A=b.parentNode;if(!A){k.warn("⚠️ Node has no parent, cannot wrap:",x);return}const L=document.createElementNS("http://www.w3.org/2000/svg","a"),Y=D.url.replace(/^"+|"+$/g,"");if(L.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",Y),L.setAttribute("target","_blank"),D.tooltip){const E=D.tooltip.replace(/^"+|"+$/g,"");L.setAttribute("title",E),b.setAttribute("title",E)}A.replaceChild(L,b),L.appendChild(b),k.info("🔗 Wrapped node in <a> tag for:",x,D.url)})}catch(D){k.error("❌ Error injecting clickable links:",D)}se.insertTitle(o,"statediagramTitleText",c?.titleTopMargin??25,s.db.getDiagramTitle()),te(o,g,Z,c?.useMaxWidth??!0)},"draw"),Me={getClasses:Ne,draw:Re,getDir:Ut},pt=new Map,W=0;function yt(t="",e=0,a="",s=xt){const h=a!==null&&a.length>0?`${s}${a}`:"";return`${Ae}-${t}${h}-${e}`}d(yt,"stateDomId");var Oe=d((t,e,a,s,h,c,f,m)=>{k.trace("items",e),e.forEach(o=>{switch(o.stmt){case J:q(t,o,a,s,h,c,f,m);break;case Q:q(t,o,a,s,h,c,f,m);break;case $t:{q(t,o.state1,a,s,h,c,f,m),q(t,o.state2,a,s,h,c,f,m);const g=f==="neo",D={id:"edge"+W,start:o.state1.id,end:o.state2.id,arrowhead:"normal",arrowTypeEnd:g?"arrow_barb_neo":"arrow_barb",style:Pt,labelStyle:"",label:z.sanitizeText(o.description??"",R()),arrowheadStyle:Wt,labelpos:jt,labelType:Gt,thickness:zt,classes:Mt,look:f};h.push(D),W++}break}})},"setupDoc"),Rt=d((t,e=Ft)=>{let a=e;if(t.doc)for(const s of t.doc)s.stmt==="dir"&&(a=s.value);return a},"getDir");function X(t,e,a){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(h=>{const c=a.get(h);c&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...c.styles])}));const s=t.find(h=>h.id===e.id);s?Object.assign(s,e):t.push(e)}d(X,"insertOrUpdateNode");function Jt(t){return t?.classes?.join(" ")??""}d(Jt,"getClassesFromDbInfo");function Vt(t){return t?.styles??[]}d(Vt,"getStylesFromDbInfo");var q=d((t,e,a,s,h,c,f,m)=>{const o=e.id,g=a.get(o),D=Jt(g),$=Vt(g),x=R();if(k.info("dataFetcher parsedItem",e,g,$),o!=="root"){let N=_t;e.start===!0?N=me:e.start===!1&&(N=Se),e.type!==Q&&(N=e.type),pt.get(o)||pt.set(o,{id:o,shape:N,description:z.sanitizeText(o,x),cssClasses:`${D} ${_e}`,cssStyles:$});const u=pt.get(o);e.description&&(Array.isArray(u.description)?(u.shape=Et,u.description.push(e.description)):u.description?.length&&u.description.length>0?(u.shape=Et,u.description===o?u.description=[e.description]:u.description=[u.description,e.description]):(u.shape=_t,u.description=e.description),u.description=z.sanitizeTextOrArray(u.description,x)),u.description?.length===1&&u.shape===Et&&(u.type==="group"?u.shape=wt:u.shape=_t),!u.type&&e.doc&&(k.info("Setting cluster for XCX",o,Rt(e)),u.type="group",u.isGroup=!0,u.dir=Rt(e),u.shape=e.type===Yt?At:wt,u.cssClasses=`${u.cssClasses} ${ve} ${c?Ie:""}`);const b={labelStyle:"",shape:u.shape,label:u.description,cssClasses:u.cssClasses,cssCompiledStyles:[],cssStyles:u.cssStyles,id:o,dir:u.dir,domId:yt(o,W),type:u.type,isGroup:u.type==="group",padding:8,rx:10,ry:10,look:f,labelType:"markdown"};if(b.shape===At&&(b.label=""),t&&t.id!=="root"&&(k.trace("Setting node ",o," to be child of its parent ",t.id),b.parentId=t.id),b.centerLabel=!0,e.note){const A={labelStyle:"",shape:ke,label:e.note.text,labelType:"markdown",cssClasses:xe,cssStyles:[],cssCompiledStyles:[],id:o+we+"-"+W,domId:yt(o,W,Kt),type:u.type,isGroup:u.type==="group",padding:x.flowchart?.padding,look:f,position:e.note.position},L=o+Nt,Y={labelStyle:"",shape:Te,label:e.note.text,cssClasses:u.cssClasses,cssStyles:[],id:o+Nt,domId:yt(o,W,Ht),type:"group",isGroup:!0,padding:16,look:f,position:e.note.position};W++,Y.id=L,A.parentId=L,X(s,Y,m),X(s,A,m),X(s,b,m);let E=o,O=A.id;e.note.position==="left of"&&(E=A.id,O=o),h.push({id:E+"-"+O,start:E,end:O,arrowhead:"none",arrowTypeEnd:"",style:Pt,labelStyle:"",classes:$e,arrowheadStyle:Wt,labelpos:jt,labelType:Gt,thickness:zt,look:f})}else X(s,b,m)}e.doc&&(k.trace("Adding nodes children "),Oe(e,e.doc,a,s,h,!c,f,m))},"dataFetcher"),Be=d(()=>{pt.clear(),W=0},"reset"),C={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Ot=d(()=>new Map,"newClassesList"),Bt=d(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),ut=d(t=>JSON.parse(JSON.stringify(t)),"clone"),He=class{constructor(t){this.version=t,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Ot(),this.documents={root:Bt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.funs=[],this.getAccTitle=ie,this.setAccTitle=re,this.getAccDescription=ne,this.setAccDescription=ae,this.setDiagramTitle=oe,this.getDiagramTitle=le,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this),this.bindFunctions=this.bindFunctions.bind(this)}static{d(this,"StateDB")}static{this.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3}}extract(t){this.clear(!0);for(const s of Array.isArray(t)?t:t.doc)switch(s.stmt){case J:this.addState(s.id.trim(),s.type,s.doc,s.description,s.note);break;case $t:this.addRelation(s.state1,s.state2,s.description);break;case ye:this.addStyleClass(s.id.trim(),s.classes);break;case fe:this.handleStyleDef(s);break;case ge:this.setCssClass(s.id.trim(),s.styleClass);break;case"click":this.addLink(s.id,s.url,s.tooltip);break}const e=this.getStates(),a=R();Be(),q(void 0,this.getRootDocV2(),e,this.nodes,this.edges,!0,a.look,this.classes);for(const s of this.nodes)if(Array.isArray(s.label)){if(s.description=s.label.slice(1),s.isGroup&&s.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${s.id}]`);s.label=s.label[0]}}handleStyleDef(t){const e=t.id.trim().split(","),a=t.styleClass.split(",");for(const s of e){let h=this.getState(s);if(!h){const c=s.trim();this.addState(c),h=this.getState(c)}h&&(h.styles=a.map(c=>c.replace(/;/g,"")?.trim()))}}setRootDoc(t){k.info("Setting root doc",t),this.rootDoc=t,this.version===1?this.extract(t):this.extract(this.getRootDocV2())}docTranslator(t,e,a){if(e.stmt===$t){this.docTranslator(t,e.state1,!0),this.docTranslator(t,e.state2,!1);return}if(e.stmt===J&&(e.id===C.START_NODE?(e.id=t.id+(a?"_start":"_end"),e.start=a):e.id=e.id.trim()),e.stmt!==U&&e.stmt!==J||!e.doc)return;const s=[];let h=[];for(const c of e.doc)if(c.type===Yt){const f=ut(c);f.doc=ut(h),s.push(f),h=[]}else h.push(c);if(s.length>0&&h.length>0){const c={stmt:J,id:ce(),type:"divider",doc:ut(h)};s.push(ut(c)),e.doc=s}e.doc.forEach(c=>this.docTranslator(e,c,!0))}getRootDocV2(){return this.docTranslator({id:U,stmt:U},{id:U,stmt:U,doc:this.rootDoc},!0),{id:U,doc:this.rootDoc}}addState(t,e=Q,a=void 0,s=void 0,h=void 0,c=void 0,f=void 0,m=void 0){const o=t?.trim();if(!this.currentDocument.states.has(o))k.info("Adding state ",o,s),this.currentDocument.states.set(o,{stmt:J,id:o,descriptions:[],type:e,doc:a,note:h,classes:[],styles:[],textStyles:[]});else{const g=this.currentDocument.states.get(o);if(!g)throw new Error(`State not found: ${o}`);g.doc||(g.doc=a),g.type||(g.type=e)}if(s&&(k.info("Setting state description",o,s),(Array.isArray(s)?s:[s]).forEach(g=>this.addDescription(o,g.trim()))),h){const g=this.currentDocument.states.get(o);if(!g)throw new Error(`State not found: ${o}`);g.note=h,g.note.text=z.sanitizeText(g.note.text,R())}c&&(k.info("Setting state classes",o,c),(Array.isArray(c)?c:[c]).forEach(g=>this.setCssClass(o,g.trim()))),f&&(k.info("Setting state styles",o,f),(Array.isArray(f)?f:[f]).forEach(g=>this.setStyle(o,g.trim()))),m&&(k.info("Setting state styles",o,f),(Array.isArray(m)?m:[m]).forEach(g=>this.setTextStyle(o,g.trim())))}clear(t){this.nodes=[],this.edges=[],this.funs=[this.setupToolTips.bind(this)],this.documents={root:Bt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Ot(),t||(this.links=new Map,he())}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){k.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(t,e,a){this.links.set(t,{url:e,tooltip:a}),k.warn("Adding link",t,e,a)}getLinks(){return this.links}startIdIfNeeded(t=""){return t===C.START_NODE?(this.startEndCount++,`${C.START_TYPE}${this.startEndCount}`):t}startTypeIfNeeded(t="",e=Q){return t===C.START_NODE?C.START_TYPE:e}endIdIfNeeded(t=""){return t===C.END_NODE?(this.startEndCount++,`${C.END_TYPE}${this.startEndCount}`):t}endTypeIfNeeded(t="",e=Q){return t===C.END_NODE?C.END_TYPE:e}addRelationObjs(t,e,a=""){const s=this.startIdIfNeeded(t.id.trim()),h=this.startTypeIfNeeded(t.id.trim(),t.type),c=this.startIdIfNeeded(e.id.trim()),f=this.startTypeIfNeeded(e.id.trim(),e.type);this.addState(s,h,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(c,f,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.currentDocument.relations.push({id1:s,id2:c,relationTitle:z.sanitizeText(a,R())})}addRelation(t,e,a){if(typeof t=="object"&&typeof e=="object")this.addRelationObjs(t,e,a);else if(typeof t=="string"&&typeof e=="string"){const s=this.startIdIfNeeded(t.trim()),h=this.startTypeIfNeeded(t),c=this.endIdIfNeeded(e.trim()),f=this.endTypeIfNeeded(e);this.addState(s,h),this.addState(c,f),this.currentDocument.relations.push({id1:s,id2:c,relationTitle:a?z.sanitizeText(a,R()):void 0})}}addDescription(t,e){const a=this.currentDocument.states.get(t),s=e.startsWith(":")?e.replace(":","").trim():e;a?.descriptions?.push(z.sanitizeText(s,R()))}cleanupLabel(t){return t.startsWith(":")?t.slice(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(t,e=""){this.classes.has(t)||this.classes.set(t,{id:t,styles:[],textStyles:[]});const a=this.classes.get(t);e&&a&&e.split(C.STYLECLASS_SEP).forEach(s=>{const h=s.replace(/([^;]*);/,"$1").trim();if(RegExp(C.COLOR_KEYWORD).exec(s)){const c=h.replace(C.FILL_KEYWORD,C.BG_FILL).replace(C.COLOR_KEYWORD,C.FILL_KEYWORD);a.textStyles.push(c)}a.styles.push(h)})}getClasses(){return this.classes}setupToolTips(t){const e=ue();bt(t).select("svg").selectAll("g.node, g.rough-node").on("mouseover",a=>{const s=bt(a.currentTarget),h=s.attr("title");if(h===null)return;const c=a.currentTarget?.getBoundingClientRect();e.transition().duration(200).style("opacity",".9"),e.style("left",window.scrollX+c.left+(c.right-c.left)/2+"px").style("top",window.scrollY+c.bottom+"px"),e.html(de.sanitize(h)),s.classed("hover",!0)}).on("mouseout",a=>{e.transition().duration(500).style("opacity",0),bt(a.currentTarget).classed("hover",!1)})}setCssClass(t,e){t.split(",").forEach(a=>{let s=this.getState(a);if(!s){const h=a.trim();this.addState(h),s=this.getState(h)}s?.classes?.push(e)})}setStyle(t,e){this.getState(t)?.styles?.push(e)}setTextStyle(t,e){this.getState(t)?.textStyles?.push(e)}bindFunctions(t){this.funs.forEach(e=>{e(t)})}getDirectionStatement(){return this.rootDoc.find(t=>t.stmt===It)}getDirection(){return this.getDirectionStatement()?.value??pe}setDirection(t){const e=this.getDirectionStatement();e?e.value=t:this.rootDoc.unshift({stmt:It,value:t})}trimColon(t){return t.startsWith(":")?t.slice(1).trim():t.trim()}getData(){const t=R();return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:Ut(this.getRootDocV2())}}getConfig(){return R().state}},Fe=d(t=>`
defs [id$="-barbEnd"] {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: ${t.strokeWidth||1};
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: ${t.strokeWidth||1}px;
}
[id$="-barbEnd"] {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth||1}px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

[id$="-dependencyStart"], [id$="-dependencyEnd"] {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: ${t.strokeWidth||1};
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}

[data-look="neo"].statediagram-cluster rect {
  fill: ${t.mainBkg};
  stroke: ${t.useGradient?"url("+t.svgId+"-gradient)":t.stateBorder||t.nodeBorder};
  stroke-width: ${t.strokeWidth??1};
}
[data-look="neo"].statediagram-cluster rect.outer {
  rx: ${t.radius}px;
  ry: ${t.radius}px;
  filter: ${t.dropShadow?t.dropShadow.replace("url(#drop-shadow)",`url(${t.svgId}-drop-shadow)`):"none"}
}
`,"getStyles"),Ke=Fe;export{He as H,ze as U,Me as j,Ke as z};
