export class UI{constructor(){this.el=id=>document.getElementById(id);this.toastEl=this.el('toast');this.minimap=this.el('minimap');this.ctx=this.minimap.getContext('2d');this.toastTimer=0}
show(id,on=true){this.el(id).classList.toggle('hidden',!on)}
setMission(t,o,p){this.el('mission-title').textContent=t;this.el('mission-objective').textContent=o;this.el('mission-progress').textContent=p}
setCredits(v){this.el('credits').textContent='₹'+v.toLocaleString('en-IN')}
setClock(t){this.el('clock').textContent=t}
prompt(x){const p=this.el('prompt');if(!x){p.classList.add('hidden');return}p.textContent=x;p.classList.remove('hidden')}
toast(x){this.toastEl.textContent=x;this.toastEl.classList.remove('hidden');this.toastEl.style.opacity='1';this.toastTimer=2.6}
update(dt){if(this.toastTimer>0){this.toastTimer-=dt;if(this.toastTimer<=0){this.toastEl.style.opacity='0';setTimeout(()=>this.toastEl.classList.add('hidden'),300)}}}
drawMinimap(player,vehicle,missions,citySize){const c=this.ctx,S=180,sc=S/(citySize+40);c.clearRect(0,0,S,S);c.fillStyle='rgba(8,12,20,.85)';c.fillRect(0,0,S,S);c.strokeStyle='rgba(120,180,255,.28)';c.lineWidth=3;const tm=(x,z)=>[S/2+x*sc,S/2+z*sc];
for(let i=-2;i<=2;i++){const p=i*60;const[x1]=tm(p,-160),[,y1]=tm(-160,p),[x2]=tm(p,160),[,y2]=tm(160,p);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.beginPath();c.moveTo(y1,x1);c.lineTo(y2,x2);c.stroke()}
if(missions.marker.visible){const[mx,my]=tm(missions.target.x,missions.target.z);c.fillStyle='#4fd1ff';c.beginPath();c.arc(mx,my,5,0,7);c.fill()}
const[vx,vy]=tm(vehicle.pos.x,vehicle.pos.z);c.fillStyle='#ffb454';c.fillRect(vx-3,vy-3,6,6);
const[px,py]=tm(player.pos.x,player.pos.z);c.save();c.translate(px,py);c.rotate(-player.yaw);c.fillStyle='#fff';c.beginPath();c.moveTo(0,-7);c.lineTo(5,6);c.lineTo(-5,6);c.closePath();c.fill();c.restore()}}
