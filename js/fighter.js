class Fighter{
 constructor(x,data,side){this.data=data;this.side=side;this.spawn=x;this.x=x;this.y=ground;this.vx=0;this.vy=0;this.face=side? -1:1;this.hp=100;this.meter=0;this.state='idle';this.stateTime=0;this.cool=0;this.stun=0;this.block=false;this.dead=false;this.inv=0;this.hitId=0;this.combo=0;this.comboDamage=0;this.comboClock=0;this.dashCd=0;this.aiClock=0;this.airAttacked=false;this.scale=1;}
 reset(){Object.assign(this,{x:this.spawn,y:ground,vx:0,vy:0,hp:100,meter:0,state:'idle',stateTime:0,cool:0,stun:0,block:false,dead:false,inv:0,hitId:0,combo:0,comboDamage:0,comboClock:0,dashCd:0,aiClock:0,airAttacked:false})}
 grounded(){return Math.abs(this.y-ground)<3}
 setState(s,t){this.state=s;this.stateTime=t}
 input(c,dt){if(this.dead||this.stun>0||hitstop>0)return;this.block=!!c.block&&this.grounded()&&this.state!=='attack';const accel=W*.00000315*this.data.speed*dt;
   if(!this.block&&this.cool<=40){if(c.left)this.vx-=accel;if(c.right)this.vx+=accel}
   if(c.jump&&this.grounded()&&!this.block){this.vy=-H*.00105;this.setState('jump',260);tone(180,.04,'triangle',.015,80)}
   if(c.dash&&this.dashCd<=0&&!this.block){this.vx+=this.face*W*.012*this.data.speed;this.dashCd=430;this.inv=90;trailBurst(this,6);tone(120,.05,'sawtooth',.018,120)}
   if(c.punch)this.attack('punch');if(c.kick)this.attack('kick');if(c.special)this.attack('special');if(c.super)this.attack('super');
 }
 attack(type){if(this.cool>0||this.block||this.dead)return;if(type==='special'&&this.meter<35)return;if(type==='super'&&this.meter<100)return;if(!this.grounded()&&this.airAttacked)return;
   if(type==='special')this.meter-=35;if(type==='super')this.meter=0;const times={punch:210,kick:330,special:520,super:820};this.setState(type,times[type]);this.cool=times[type]+(type==='punch'?45:80);this.hitId++;if(!this.grounded())this.airAttacked=true;
   if(type==='special')this.triggerSpecial();if(type==='super'){flash=1;shake=18;tone(70,.18,'sawtooth',.035,260);setTimeout(()=>this.triggerSuper(),120)}
 }
 triggerSpecial(){const sp=this.data.special;if(sp==='blink'){this.inv=140;this.x+=this.face*W*.07;trailBurst(this,10)}else if(sp==='orb'){projectiles.push({owner:this,x:this.x+this.face*W*.05,y:this.y-H*.14,vx:this.face*W*.00055,life:1100,r:W*.018,color:this.data.color,damage:14,type:'orb',hit:false})}else if(sp==='quake'){setTimeout(()=>{if(this.state==='special'&&!this.dead){shake=16;for(let i=0;i<22;i++)particles.push(makeParticle(this.x+this.face*W*.07,ground-H*.01,'#f7b84b',1.5));projectiles.push({owner:this,x:this.x,y:ground-H*.01,vx:this.face*W*.00038,life:650,r:W*.05,color:this.data.color,damage:18,type:'wave',hit:false})}},130)}else if(sp==='slash'){this.vx+=this.face*W*.009;trailBurst(this,12)}}
 triggerSuper(){projectiles.push({owner:this,x:this.x+this.face*W*.04,y:this.y-H*.13,vx:this.face*W*.00072,life:850,r:W*.045,color:this.data.accent,damage:27,type:'super',hit:false})}
 update(dt,opp){this.face=opp.x>this.x?1:-1;this.cool=Math.max(0,this.cool-dt);this.dashCd=Math.max(0,this.dashCd-dt);this.stun=Math.max(0,this.stun-dt);this.inv=Math.max(0,this.inv-dt);this.stateTime=Math.max(0,this.stateTime-dt);this.comboClock=Math.max(0,this.comboClock-dt);if(this.comboClock<=0){this.combo=0;this.comboDamage=0}if(this.stateTime<=0&&!this.dead&&!this.block)this.state=this.grounded()?'idle':'jump';
   this.vy+=H*.00000315*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.vx*=Math.pow(.00025,dt/1000);if(this.y>=ground){this.y=ground;this.vy=0;this.airAttacked=false;if(this.state==='jump')this.state='idle'}this.x=clamp(this.x,W*.045,W*.955);
   if(this.hp<=0&&!this.dead){this.hp=0;this.dead=true;this.setState('ko',1600);this.vx=-this.face*W*.0038;this.vy=-H*.00072;shake=15;flash=.55;impactSound(2)}
 }
 attackWindow(){const t=this.stateTime;if(this.state==='punch'&&t<145&&t>80)return {reach:.045,damage:7,kb:.0018,stun:130};if(this.state==='kick'&&t<215&&t>120)return {reach:.07,damage:11,kb:.0028,stun:180};if(this.state==='special'&&this.data.special!=='orb'&&this.data.special!=='quake'&&t<300&&t>130)return {reach:.09,damage:14,kb:.0035,stun:230};return null}
 draw(){drawFighter(this)}
}
