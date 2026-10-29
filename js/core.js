'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, rnd=(a,b)=>Math.random()*(b-a)+a;
const wrap=$('#gameWrap'), canvas=$('#game'), ctx=canvas.getContext('2d',{alpha:false});
let W=1280,H=720,DPR=1,ground=560,last=performance.now(),running=false,paused=false,mode='cpu',round=1,timer=60,roundWins=[0,0],ending=false,hitstop=0,shake=0,flash=0,arenaIndex=0,cpuDifficulty=1,particles=[],trails=[],projectiles=[],floatTexts=[],audioReady=false,orientationBlocked=false;
let cam={x:0,y:0,zoom:1,targetZoom:1};
const keys={},touch={};
const roster=[
 {id:'volt',name:'VOLT',style:'Flash Rush',color:'#55d7ff',accent:'#9ff0ff',speed:1.12,power:.92,def:.92,special:'blink',desc:'Passos instantâneos, pressão e sequências rápidas.'},
 {id:'rift',name:'RIFT',style:'Cursed Control',color:'#ff536d',accent:'#ff9aaa',speed:1,power:1,def:1,special:'orb',desc:'Controle de espaço, impacto pesado e mix de alcance.'},
 {id:'titan',name:'TITAN',style:'Saiyan Heavy',color:'#f7b84b',accent:'#ffe2a0',speed:.84,power:1.28,def:1.18,special:'quake',desc:'Golpes explosivos, launchers e dano brutal.'},
 {id:'wraith',name:'WRAITH',style:'Shinobi Trickster',color:'#9d65ff',accent:'#d5bdff',speed:1.18,power:.88,def:.87,special:'slash',desc:'Dash fantasma, trocas rápidas e rotas longas.'}
];
const arenas=[
 {name:'NEON ROOFTOP',sub:'Chuva · megacidade · reflexos',type:'city'},
 {name:'VOID TEMPLE',sub:'Eclipse · ruínas · energia',type:'temple'},
 {name:'CORE REACTOR',sub:'Industrial · pulsos · calor',type:'reactor'}
];
let picks=[0,1],selectStep=0;
function resize(){const r=wrap.getBoundingClientRect();DPR=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(640,Math.floor(r.width*DPR));canvas.height=Math.max(360,Math.floor(r.height*DPR));W=canvas.width;H=canvas.height;ground=H*.79;if(typeof p1!=='undefined'&&p1&&!running){p1.x=W*.27;p2.x=W*.73}}addEventListener('resize',resize);resize();
function checkOrientation(){orientationBlocked=matchMedia('(orientation: portrait)').matches;document.documentElement.classList.toggle('portraitBlocked',orientationBlocked);const lock=$('#rotateLock');if(lock)lock.classList.toggle('show',orientationBlocked)}
addEventListener('resize',checkOrientation);addEventListener('orientationchange',()=>setTimeout(checkOrientation,120));checkOrientation();
async function tryLandscapeLock(){try{if(screen.orientation?.lock){if(!document.fullscreenElement&&wrap.requestFullscreen)await wrap.requestFullscreen();await screen.orientation.lock('landscape')}}catch(e){}checkOrientation()}
function showScreen(id){$$('.screen').forEach(s=>s.classList.add('hidden'));$(id).classList.remove('hidden')}
function buildRoster(){const box=$('#fighters');box.innerHTML='';roster.forEach((f,i)=>{const d=document.createElement('div');d.className='fighterCard';d.dataset.i=i;d.style.setProperty('--c',f.color);d.innerHTML=`<div class="fighterAura"></div><div class="fighterGlyph"><span></span></div><div class="fighterName">${f.name}</div><div class="fighterStyle">${f.style}</div><p>${f.desc}</p><div class="statsMini"><label>SPD<div class="miniBar"><i style="--v:${f.speed*66}%"></i></div></label><label>POW<div class="miniBar"><i style="--v:${f.power*66}%"></i></div></label><label>DEF<div class="miniBar"><i style="--v:${f.def*66}%"></i></div></label></div>`;d.onclick=()=>{picks[selectStep]=i;paintRoster();uiSound()};box.appendChild(d)});paintRoster()}
function paintRoster(){$$('.fighterCard').forEach((d,i)=>d.classList.toggle('selected',i===picks[selectStep]));$('#selectSub').textContent=selectStep===0?'PLAYER 1 // escolha seu estilo.':(mode==='pvp'?'PLAYER 2 // escolha o rival.':'CPU // escolha seu adversário.')}
function buildArenas(){const box=$('#arenaGrid');box.innerHTML='';arenas.forEach((a,i)=>{const d=document.createElement('div');d.className='arenaCard'+(i===arenaIndex?' selected':'');d.innerHTML=`<div class="arenaPreview" data-type="${a.type}"><span>${String(i+1).padStart(2,'0')}</span></div><div class="arenaInfo"><b>${a.name}</b><span>${a.sub}</span></div>`;d.onclick=()=>{arenaIndex=i;buildArenas();uiSound()};box.appendChild(d)});$$('.arenaPreview').forEach((el,i)=>paintArenaPreview(el,arenas[i].type))}
function paintArenaPreview(el,type){if(type==='city')el.style.background='linear-gradient(160deg,#172744 0,#592a63 48%,#0a0f17 49%),linear-gradient(#0000,#000)';if(type==='temple')el.style.background='radial-gradient(circle at 50% 30%,#f56868 0 11%,#241b3d 12% 35%,#080a10 70%)';if(type==='reactor')el.style.background='radial-gradient(circle at 50% 55%,#50e9ff 0 8%,#173b48 9% 22%,#081017 50%)'}
buildRoster();buildArenas();$('#bestCombo').textContent=localStorage.getItem('ztickerS_bestCombo')||0;
$('#arcadeBtn').onclick=()=>openSelect('cpu');$('#versusBtn').onclick=()=>openSelect('pvp');$('#trainingBtn').onclick=()=>openSelect('training');
function openSelect(m){mode=m;selectStep=0;picks=[0,1];paintRoster();showScreen('#selectScreen');uiSound()}
$('#selectBack').onclick=()=>{if(selectStep===1){selectStep=0;paintRoster()}else showScreen('#mainMenu')};
$('#selectNext').onclick=()=>{if(selectStep===0){selectStep=1;paintRoster()}else showScreen('#arenaScreen');uiSound()};
$('#arenaBack').onclick=()=>showScreen('#selectScreen');
$$('.chipBtn').forEach(b=>b.onclick=()=>{$$('.chipBtn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cpuDifficulty=+b.dataset.diff;uiSound()});
$('#fightBtn').onclick=()=>startFight();
function initAudio(){if(audioReady)return;audioReady=true;try{const Ctx=window.AudioContext||window.webkitAudioContext;window.AC=new Ctx()}catch(e){audioReady=false}}
function tone(freq=220,dur=.06,type='sine',gain=.04,slide=0){if(!audioReady||!AC)return;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(freq,AC.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),AC.currentTime+dur);g.gain.setValueAtTime(gain,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+dur);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+dur)}
function impactSound(power=1){tone(90+power*35,.07,'square',.025+power*.015,-40);tone(260+power*80,.045,'triangle',.018,120)}
function uiSound(){tone(360,.05,'sine',.025,90)}
document.addEventListener('pointerdown',initAudio,{once:true});
