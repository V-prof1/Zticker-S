'use strict';
class Fighter{
 constructor(x,data,side){
  this.data=data;this.side=side;this.spawn=x;this.x=x;this.y=ground;this.vx=0;this.vy=0;this.face=side?-1:1;this.hp=100;this.guard=100;this.meter=0;
  this.state='idle';this.stateTime=0;this.stun=0;this.block=false;this.dead=false;this.inv=0;this.hitId=0;this.combo=0;this.comboDamage=0;this.comboClock=0;
  this.dashCd=0;this.dashTime=0;this.dashRemaining=0;this.dashDir=0;this.aiClock=0;this.airAttacked=false;this.scale=1;
  this.currentMove=null;this.moveTime=0;this.queuedAttack=null;this.queueClock=0;this.chain=[];this.chainClock=0;this.counterWindow=0;this.perfectGuard=0;
  this.animClock=0;this.locoPhase=0;this.locomotion='idle';this.moveDir=0;this.moveHold=0;this.lastMoveDir=0;this.landTime=0;
  this.hitReactTime=0;this.hitReactMax=0;this.hitReactType='light';this.knockdownPending=false;this.knockdownTime=0;this.knockdownMax=520;this.getupTime=0;this.getupMax=330;
  this.poseBlendFrom=null;this.poseBlendTime=0;this.afterimages=[];
 }
 reset(){Object.assign(this,{x:this.spawn,y:ground,vx:0,vy:0,hp:100,guard:100,meter:0,state:'idle',stateTime:0,stun:0,block:false,dead:false,inv:0,hitId:0,combo:0,comboDamage:0,comboClock:0,dashCd:0,dashTime:0,dashRemaining:0,dashDir:0,aiClock:0,airAttacked:false,currentMove:null,moveTime:0,queuedAttack:null,queueClock:0,chain:[],chainClock:0,counterWindow:0,perfectGuard:0,locomotion:'idle',moveDir:0,moveHold:0,lastMoveDir:0,locoPhase:0,landTime:0,hitReactTime:0,hitReactMax:0,hitReactType:'light',knockdownPending:false,knockdownTime:0,getupTime:0,poseBlendFrom:null,poseBlendTime:0,afterimages:[]})}
 grounded(){return Math.abs(this.y-ground)<3}
 setState(s,t=0){this.state=s;this.stateTime=t}
 canAct(){return !this.dead&&this.stun<=0&&hitstop<=0&&this.knockdownTime<=0&&this.getupTime<=0}
 input(c,dt){
  if(!this.canAct()){this.moveDir=0;this.locomotion='idle';return}
  const wantsBlock=!!c.block&&this.grounded()&&!this.currentMove&&this.state!=='special'&&this.state!=='super'&&this.dashTime<=0;
  if(wantsBlock&&!this.block)this.perfectGuard=150;this.block=wantsBlock;
  const dir=(c.right?1:0)-(c.left?1:0);
  if(!this.block&&!this.currentMove&&this.state!=='special'&&this.state!=='super'&&this.dashTime<=0){
   if(dir!==0){
    if(dir===this.lastMoveDir)this.moveHold+=dt;else this.moveHold=0;
    this.lastMoveDir=dir;this.moveDir=dir;this.locomotion=this.moveHold>310?'run':'walk';
    const maxSpeed=W*(this.locomotion==='run'?.00042:.00027)*this.data.speed;
    const target=dir*maxSpeed,follow=1-Math.pow(.00065,dt/1000);this.vx=lerp(this.vx,target,follow);
   }else{this.moveDir=0;this.moveHold=0;this.lastMoveDir=0;this.locomotion='idle'}
   if(c.jump&&this.grounded()&&this.landTime<95){this.vy=-H*.00108;this.landTime=0;this.locomotion='idle';this.setState('jump',260);tone(180,.04,'triangle',.015,80)}
   if(c.dash&&this.dashCd<=0){
    this.dashDir=dir||this.face;this.dashTime=135;this.dashRemaining=W*.072;this.dashCd=430;this.inv=82;this.vx=0;this.locomotion='idle';this.afterimageBurst(8);trailBurst(this,8);tone(120,.055,'sawtooth',.018,120);
   }
  }else if(!this.currentMove){this.moveDir=0;this.locomotion='idle'}
  if(c.m1)this.attack('m1');if(c.m2)this.attack('m2');if(c.special)this.attack('special');if(c.super)this.attack('super')
 }
 attack(type){
  if(this.dead||this.stun>0||this.block||this.knockdownTime>0||this.getupTime>0)return;
  if(type==='m1'||type==='m2'){
   if(this.currentMove){this.queuedAttack=type;this.queueClock=300;return}
   if(this.state==='special'||this.state==='super'||this.dashTime>0)return;this.startMove(type);return
  }
  if(this.currentMove||this.state==='special'||this.state==='super'||this.dashTime>0)return;
  if(type==='special'&&this.meter<35)return;if(type==='super'&&this.meter<100)return;if(!this.grounded()&&this.airAttacked)return;
  if(type==='special')this.meter-=35;if(type==='super')this.meter=0;const times={special:520,super:820};this.setState(type,times[type]);this.stateTime=times[type];this.hitId++;this.moveDir=0;this.locomotion='idle';
  if(!this.grounded())this.airAttacked=true;if(type==='special')this.triggerSpecial();if(type==='super'){flash=1;shake=18;tone(70,.18,'sawtooth',.035,260);setTimeout(()=>this.triggerSuper(),120)}
 }
 startMove(btn,carryPose=null){
  const from=carryPose||getBaseMotionPose(this),move=chooseComboMove(this,btn);this.currentMove=move;this.moveTime=0;this.state='attack';this.stateTime=move.duration;this.hitId++;this.queuedAttack=null;this.queueClock=0;
  this.poseBlendFrom=from;this.poseBlendTime=72;this.moveDir=0;this.locomotion='idle';
  if(move.counter){this.counterWindow=0;this.inv=Math.max(this.inv,120);flash=Math.max(flash,.12);tone(760,.04,'triangle',.02,-260)}
  this.chain.push(btn);if(this.chain.length>4)this.chain.shift();this.chainClock=650;this.airAttacked=!this.grounded();
  if(move.fx==='burst')tone(150,.045,'square',.018,120);else tone(210,.03,'triangle',.012,80);announceMove(this,move.name)
 }
 triggerSpecial(){
  const sp=this.data.special;
  if(sp==='blink'){this.inv=150;this.x=clamp(this.x+this.face*W*.06,W*.045,W*.955);this.afterimageBurst(12);trailBurst(this,12)}
  else if(sp==='orb'){projectiles.push({owner:this,x:this.x+this.face*W*.05,y:this.y-H*.14,vx:this.face*W*.00055,life:1100,r:W*.018,color:this.data.color,damage:14,type:'orb',hit:false})}
  else if(sp==='quake'){setTimeout(()=>{if(this.state==='special'&&!this.dead){shake=16;for(let i=0;i<22;i++)particles.push(makeParticle(this.x+this.face*W*.07,ground-H*.01,'#f7b84b',1.5));projectiles.push({owner:this,x:this.x,y:ground-H*.01,vx:this.face*W*.00038,life:650,r:W*.05,color:this.data.color,damage:18,type:'wave',hit:false})}},130)}
  else if(sp==='slash'){this.vx=this.face*W*.00046;this.afterimageBurst(10);trailBurst(this,12)}
 }
 triggerSuper(){projectiles.push({owner:this,x:this.x+this.face*W*.04,y:this.y-H*.13,vx:this.face*W*.00072,life:850,r:W*.045,color:this.data.accent,damage:27,type:'super',hit:false})}
 afterimageBurst(n=5){for(let i=0;i<n;i++)this.afterimages.push({x:this.x-this.face*i*W*.006,y:this.y,life:180-i*12,max:180})}
 receiveHitReaction(stun,heavy=false,knockdown=false){
  this.block=false;this.currentMove=null;this.queuedAttack=null;this.dashTime=0;this.dashRemaining=0;this.moveDir=0;this.locomotion='idle';this.hitReactType=heavy?'heavy':'light';this.hitReactMax=Math.max(110,Math.min(280,stun));this.hitReactTime=this.hitReactMax;
  if(knockdown){if(this.grounded()&&Math.abs(this.vy)<.0001){this.knockdownTime=this.knockdownMax;this.hitReactTime=0}else this.knockdownPending=true}
 }
 update(dt,opp){
  this.animClock+=dt;this.face=opp.x>this.x?1:-1;this.dashCd=Math.max(0,this.dashCd-dt);this.stun=Math.max(0,this.stun-dt);this.inv=Math.max(0,this.inv-dt);this.stateTime=Math.max(0,this.stateTime-dt);this.comboClock=Math.max(0,this.comboClock-dt);this.chainClock=Math.max(0,this.chainClock-dt);this.queueClock=Math.max(0,this.queueClock-dt);this.counterWindow=Math.max(0,this.counterWindow-dt);this.perfectGuard=Math.max(0,this.perfectGuard-dt);this.landTime=Math.max(0,this.landTime-dt);this.hitReactTime=Math.max(0,this.hitReactTime-dt);this.poseBlendTime=Math.max(0,this.poseBlendTime-dt);
  if(this.knockdownTime>0){this.knockdownTime=Math.max(0,this.knockdownTime-dt);if(this.knockdownTime===0&&!this.dead){this.getupTime=this.getupMax;this.inv=Math.max(this.inv,180)}}else if(this.getupTime>0)this.getupTime=Math.max(0,this.getupTime-dt);
  if(this.comboClock<=0){this.combo=0;this.comboDamage=0}if(this.chainClock<=0&&!this.currentMove)this.chain=[];if(this.queueClock<=0)this.queuedAttack=null;
  if(this.currentMove){
   this.moveTime+=dt;const p=this.moveTime/this.currentMove.duration;
   if(this.queuedAttack&&p>=this.currentMove.cancelAt){const q=this.queuedAttack,carry=getAnimatedPose(this);this.currentMove=null;this.startMove(q,carry)}
   else if(this.moveTime>=this.currentMove.duration){this.currentMove=null;this.moveTime=0;this.poseBlendFrom=null;if(this.queuedAttack){const q=this.queuedAttack;this.startMove(q)}else this.state=this.grounded()?'idle':'jump'}
  }else if(this.stateTime<=0&&!this.dead&&!this.block&&(this.state==='special'||this.state==='super'))this.state=this.grounded()?'idle':'jump';
  if(this.locomotion==='walk')this.locoPhase+=dt*.0105*this.data.speed;else if(this.locomotion==='run')this.locoPhase+=dt*.0175*this.data.speed;
  const wasAirborne=this.y<ground-2;
  this.vy+=H*.00000315*dt;
  if(this.dashTime>0){
   const speed=W*.00056*this.data.speed,step=Math.min(this.dashRemaining,speed*dt);this.x+=this.dashDir*step;this.dashRemaining-=step;this.dashTime=Math.max(0,this.dashTime-dt);if(this.dashRemaining<=.5||this.dashTime<=0){this.dashTime=0;this.dashRemaining=0;this.vx=this.dashDir*W*.00012*this.data.speed}
  }else this.x+=this.vx*dt;
  this.y+=this.vy*dt;
  if(this.moveDir===0||!this.canAct()||this.currentMove)this.vx*=Math.pow(.0009,dt/1000);else this.vx*=Math.pow(.22,dt/1000);
  if(this.y>=ground){
   const landingSpeed=this.vy;this.y=ground;this.vy=0;this.airAttacked=false;
   if(wasAirborne&&landingSpeed>H*.00022){
    if(this.knockdownPending&&!this.dead){this.knockdownPending=false;this.knockdownTime=this.knockdownMax;this.hitReactTime=0;this.stun=Math.max(this.stun,180);shake=Math.max(shake,5)}
    else if(!this.dead&&this.knockdownTime<=0)this.landTime=145;
   }
   if(this.state==='jump')this.state='idle'
  }
  this.x=clamp(this.x,W*.045,W*.955);if(!this.block)this.guard=Math.min(100,this.guard+dt*.018);
  this.afterimages.forEach(a=>a.life-=dt);this.afterimages=this.afterimages.filter(a=>a.life>0);
  if(this.hp<=0&&!this.dead){this.hp=0;this.dead=true;this.currentMove=null;this.queuedAttack=null;this.knockdownTime=0;this.getupTime=0;this.hitReactTime=0;this.setState('ko',1600);this.vx=-this.face*W*.00042;this.vy=-H*.00072;shake=15;flash=.55;impactSound(2)}
 }
 attackWindow(){
  if(this.currentMove){const p=this.moveTime/this.currentMove.duration;if(p>=this.currentMove.active[0]&&p<=this.currentMove.active[1])return {reach:this.currentMove.reach,damage:this.currentMove.damage,kb:this.currentMove.kb,stun:this.currentMove.stun,lift:this.currentMove.lift||0,type:'combo',move:this.currentMove}}
  const t=this.stateTime;if(this.state==='special'&&this.data.special!=='orb'&&this.data.special!=='quake'&&t<300&&t>130)return {reach:.09,damage:14,kb:.00038,stun:230,lift:.0001,type:'special'};return null
 }
 draw(){drawFighter(this)}
}
