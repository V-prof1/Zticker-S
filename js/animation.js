'use strict';
const BASE_POSE={lean:0,crouch:0,headX:0,armF:[.045,.04,.085,.085],armB:[-.04,.045,-.075,.09],legF:[.035,.07,.07,.145],legB:[-.035,.07,-.07,.145],arc:0};
const k=(t,p={})=>({t,...BASE_POSE,...p});
const MOVESET={
  jab:{name:'FLASH JAB',btn:'m1',duration:230,cancelAt:.52,active:[.30,.48],reach:.060,damage:5.5,kb:.00135,stun:95,fx:'snap',frames:[k(0),k(.22,{lean:.008,armF:[.025,.03,.045,.07],armB:[-.03,.035,-.06,.075]}),k(.38,{lean:.028,headX:.008,armF:[.055,.01,.135,.018],armB:[-.025,.035,-.055,.08],legF:[.045,.065,.075,.14]}),k(.58,{lean:.016,armF:[.07,.02,.105,.035]}),k(1)]},
  cross:{name:'METEOR CROSS',btn:'m1',duration:250,cancelAt:.54,active:[.32,.52],reach:.071,damage:6.3,kb:.00155,stun:108,fx:'snap',frames:[k(0),k(.20,{lean:-.012,armF:[.015,.03,.03,.07],armB:[-.035,.03,-.02,.07]}),k(.42,{lean:.034,headX:.012,armF:[.07,.018,.15,.02],armB:[-.02,.03,-.055,.07],legB:[-.025,.065,-.065,.14]}),k(.62,{lean:.02,armF:[.075,.025,.115,.04]}),k(1)]},
  hook:{name:'PHANTOM HOOK',btn:'m1',duration:285,cancelAt:.58,active:[.34,.56],reach:.076,damage:7.2,kb:.00185,stun:125,fx:'arc',frames:[k(0),k(.18,{lean:-.018,armF:[.01,.01,-.035,.035],armB:[-.02,.03,-.05,.07]}),k(.43,{lean:.025,headX:.012,armF:[.055,-.008,.12,.05],armB:[-.01,.02,-.04,.055],legF:[.05,.06,.08,.135],arc:1}),k(.67,{lean:.02,armF:[.07,.025,.09,.06]}),k(1)]},
  breaker:{name:'DRAGON BREAKER',btn:'m1',duration:390,cancelAt:.68,active:[.36,.58],reach:.082,damage:10.5,kb:.00265,stun:185,lift:.00028,fx:'burst',frames:[k(0),k(.18,{crouch:.025,lean:-.02,armF:[.02,.05,.045,.09],legF:[.025,.085,.055,.145],legB:[-.02,.085,-.06,.145]}),k(.43,{crouch:-.008,lean:.038,headX:.012,armF:[.06,-.035,.10,-.11],armB:[-.02,.015,-.045,.055],legF:[.04,.055,.07,.125],arc:1}),k(.70,{lean:.02,armF:[.06,-.01,.08,.02]}),k(1)]},
  lowKick:{name:'LOW COMET',btn:'m2',duration:310,cancelAt:.58,active:[.35,.56],reach:.084,damage:8.4,kb:.00215,stun:150,fx:'sweep',frames:[k(0),k(.20,{crouch:.018,lean:-.012,legF:[.015,.075,.03,.14]}),k(.44,{crouch:.015,lean:.012,legF:[.06,.04,.145,.105],legB:[-.03,.08,-.055,.145],armF:[.035,.03,.07,.07],arc:1}),k(.68,{legF:[.07,.055,.09,.135]}),k(1)]},
  roundhouse:{name:'CYCLONE KICK',btn:'m2',duration:355,cancelAt:.61,active:[.36,.59],reach:.105,damage:9.6,kb:.00255,stun:170,fx:'arc',frames:[k(0),k(.18,{lean:-.025,legF:[.02,.06,.015,.135],armF:[-.015,.02,-.06,.055]}),k(.46,{lean:-.01,headX:.005,legF:[.055,.02,.155,.025],legB:[-.015,.075,-.045,.145],armF:[.05,.01,.085,.055],armB:[-.04,.0,-.08,.045],arc:1}),k(.70,{lean:.012,legF:[.075,.045,.10,.12]}),k(1)]},
  axe:{name:'HEAVEN AXE',btn:'m2',duration:420,cancelAt:.70,active:[.42,.64],reach:.092,damage:12.2,kb:.00275,stun:215,lift:-.00006,fx:'burst',frames:[k(0),k(.20,{lean:-.015,legF:[.02,.02,.055,-.055],armF:[.02,.01,.055,.045]}),k(.47,{lean:.018,legF:[.04,-.02,.09,-.13],armB:[-.045,.01,-.08,.04]}),k(.60,{crouch:.01,lean:.035,legF:[.065,.05,.12,.105],arc:1}),k(1)]},
  spin:{name:'NOVA SPIN',btn:'m2',duration:455,cancelAt:.72,active:[.34,.66],reach:.115,damage:13,kb:.0031,stun:225,fx:'arc',multi:2,frames:[k(0),k(.20,{lean:-.02,armF:[-.03,.01,-.08,.05],legF:[.02,.06,.04,.135]}),k(.42,{lean:.015,headX:-.012,armF:[-.07,.0,-.12,.035],armB:[.05,.01,.09,.06],legF:[.065,.025,.15,.045],arc:1}),k(.62,{lean:.02,headX:.01,armF:[.065,.0,.115,.04],armB:[-.055,.01,-.10,.055],legF:[-.045,.03,-.13,.055],arc:1}),k(1)]},
  mixPalm:{name:'CURSED PALM',btn:'m1',duration:330,cancelAt:.60,active:[.34,.56],reach:.092,damage:9.2,kb:.00225,stun:165,fx:'burst',frames:[k(0),k(.18,{crouch:.015,armF:[.02,.035,.035,.07]}),k(.44,{lean:.045,headX:.01,armF:[.06,.02,.14,.045],armB:[-.02,.025,-.045,.055],arc:1}),k(.72,{lean:.018,armF:[.08,.035,.105,.055]}),k(1)]},
  knee:{name:'THUNDER KNEE',btn:'m2',duration:360,cancelAt:.64,active:[.38,.58],reach:.078,damage:10.7,kb:.00245,stun:185,lift:.00024,fx:'burst',frames:[k(0),k(.18,{crouch:.025,lean:-.015,legF:[.015,.08,.03,.14]}),k(.46,{crouch:-.01,lean:.035,legF:[.065,.015,.095,.045],armF:[.045,.005,.085,.04],arc:1}),k(.72,{lean:.018,legF:[.055,.045,.07,.12]}),k(1)]},
  airM1:{name:'SKY ELBOW',btn:'m1',duration:300,cancelAt:.66,active:[.34,.56],reach:.074,damage:8,kb:.0021,stun:145,lift:.00012,fx:'snap',frames:[k(0,{legF:[.02,.04,.05,.09],legB:[-.02,.04,-.05,.09]}),k(.42,{lean:.035,armF:[.055,.025,.115,.075],armB:[-.03,.0,-.06,.03],legF:[.035,.035,.07,.085]}),k(1,{legF:[.02,.04,.05,.09],legB:[-.02,.04,-.05,.09]})]},
  airM2:{name:'DIVE STAR',btn:'m2',duration:370,cancelAt:.76,active:[.38,.66],reach:.105,damage:11.5,kb:.0029,stun:205,lift:-.00005,fx:'arc',frames:[k(0,{legF:[.02,.04,.05,.09],legB:[-.02,.04,-.05,.09]}),k(.45,{lean:.04,legF:[.065,.015,.155,.08],legB:[-.02,.03,-.055,.085],armF:[-.02,.0,-.055,.04],arc:1}),k(1,{legF:[.025,.045,.06,.095],legB:[-.02,.04,-.05,.09]})]},
  counterM1:{name:'ZERO FRAME COUNTER',btn:'m1',duration:315,cancelAt:.62,active:[.24,.48],reach:.09,damage:11,kb:.0026,stun:210,fx:'burst',counter:true,frames:[k(0,{crouch:.025,armF:[.015,-.005,.045,.025],armB:[.02,.015,.045,.05]}),k(.27,{lean:.055,headX:.015,armF:[.07,.0,.155,.012],armB:[-.01,.015,-.035,.05],arc:1}),k(.62,{lean:.025,armF:[.07,.02,.11,.04]}),k(1)]},
  counterM2:{name:'REVERSAL KICK',btn:'m2',duration:390,cancelAt:.70,active:[.28,.54],reach:.118,damage:14,kb:.0034,stun:245,fx:'arc',counter:true,frames:[k(0,{crouch:.03,lean:-.02,legF:[.01,.08,.03,.14]}),k(.36,{lean:-.01,legF:[.06,.01,.165,.015],armF:[.045,.0,.08,.04],armB:[-.04,.0,-.08,.04],arc:1}),k(.72,{lean:.02,legF:[.075,.04,.10,.115]}),k(1)]}
};
function mix(a,b,t){return a+(b-a)*t}
function mixArr(a,b,t){return a.map((v,i)=>mix(v,b[i],t))}
function sampleFrames(frames,p){let a=frames[0],b=frames[frames.length-1];for(let i=0;i<frames.length-1;i++){if(p>=frames[i].t&&p<=frames[i+1].t){a=frames[i];b=frames[i+1];break}}const span=Math.max(.0001,b.t-a.t),t=clamp((p-a.t)/span,0,1),s=t*t*(3-2*t);return {lean:mix(a.lean,b.lean,s),crouch:mix(a.crouch,b.crouch,s),headX:mix(a.headX,b.headX,s),armF:mixArr(a.armF,b.armF,s),armB:mixArr(a.armB,b.armB,s),legF:mixArr(a.legF,b.legF,s),legB:mixArr(a.legB,b.legB,s),arc:mix(a.arc,b.arc,s)}}
function getAnimatedPose(f){
  const t=performance.now()*.001;
  if(f.currentMove){const p=clamp(f.moveTime/f.currentMove.duration,0,1);return sampleFrames(f.currentMove.frames,p)}
  if(f.block){return {...BASE_POSE,crouch:.025,lean:-.012,armF:[.02,-.018,.055,.015],armB:[.035,.005,.07,.045],legF:[.025,.085,.055,.145],legB:[-.025,.085,-.055,.145]}}
  if(f.state==='ko')return {...BASE_POSE,lean:-.08,headX:-.025,armF:[.02,.08,.08,.13],armB:[-.025,.075,-.08,.13],legF:[.05,.05,.12,.10],legB:[-.05,.05,-.12,.10]}
  if(!f.grounded())return {...BASE_POSE,lean:clamp(f.vx/(W*.003),-.04,.04),armF:[.04,.015,.075,.06],armB:[-.04,.015,-.075,.06],legF:[.025,.035,.055,.095],legB:[-.025,.035,-.055,.095]}
  const speed=clamp(Math.abs(f.vx)/(W*.0015),0,1),walk=Math.sin(f.animClock*.018)*speed;
  return {...BASE_POSE,lean:clamp(f.vx/(W*.006),-.025,.025),crouch:Math.sin(t*3.2+f.side)*.003,armF:[.04,-walk*.018,.08,.08-walk*.025],armB:[-.04,walk*.018,-.08,.08+walk*.025],legF:[.035+walk*.025,.07,.07+walk*.06,.145],legB:[-.035-walk*.025,.07,-.07-walk*.06,.145]}
}
function chooseComboMove(f,btn){
  if(!f.grounded())return btn==='m1'?MOVESET.airM1:MOVESET.airM2;
  if(f.counterWindow>0)return btn==='m1'?MOVESET.counterM1:MOVESET.counterM2;
  const seq=[...f.chain,btn].slice(-4).join('');
  const exact={
    'm1m1m1m1':MOVESET.breaker,
    'm2m2m2':MOVESET.spin,
    'm1m1m2':MOVESET.knee,
    'm1m2m1':MOVESET.mixPalm,
    'm2m1m2':MOVESET.axe
  };
  if(exact[seq])return exact[seq];
  if(btn==='m1'){const n=f.chain.filter(x=>x==='m1').length%3;return [MOVESET.jab,MOVESET.cross,MOVESET.hook][n]}
  const n=f.chain.filter(x=>x==='m2').length%2;return [MOVESET.lowKick,MOVESET.roundhouse][n]
}
