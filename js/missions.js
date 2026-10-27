import*as THREE from'three';
const MISSIONS=[{id:'courier',title:'COURIER RUN',reward:500,brief:'Deliver a sealed package across three districts.',points:[[30,-60],[-70,30],[60,70]]},{id:'night',title:'NIGHT SHIFT',reward:800,brief:'Reach three pickup beacons.',points:[[-80,-80],[80,-40],[0,100]]},{id:'sweep',title:'CITY SWEEP',reward:1200,brief:'Inspect four landmark zones.',points:[[0,0],[-100,0],[100,0],[0,-110]]}];
export class Missions{constructor(scene,onSave){this.scene=scene;this.onSave=onSave;this.index=0;this.step=0;this.active=false;this.credits=0;this.awaitingStart=false;
this.marker=new THREE.Mesh(new THREE.TorusGeometry(2.4,.22,8,28),new THREE.MeshStandardMaterial({color:'#4fd1ff',emissive:'#4fd1ff',emissiveIntensity:2.2}));this.marker.rotation.x=Math.PI/2;this.marker.visible=false;scene.add(this.marker);this.target=new THREE.Vector3()}
get current(){return MISSIONS[this.index]}
start(i=0){this.index=i;this.step=0;this.active=true;this.setTarget(this.current.points[0]);return this.current}
setTarget([x,z]){this.target.set(x,0,z);this.marker.position.set(x,1.1,z);this.marker.visible=true}
update(dt,pos,ui){this.marker.rotation.z+=dt*1.6;this.marker.position.y=1.1+Math.sin(performance.now()*.003)*.18;if(!this.active)return;
if(pos.distanceTo(this.target)<3.2){this.step++;
if(this.step>=this.current.points.length){this.credits+=this.current.reward;this.active=false;this.marker.visible=false;ui.toast(`MISSION COMPLETE — +₹${this.current.reward}`);this.onSave();
const next=this.index+1;if(next<MISSIONS.length){ui.setMission('NEXT: '+MISSIONS[next].title,'Return to the blue beacon to begin.','');this.setTarget(MISSIONS[next].points[0]);this.awaitingStart=true}else ui.setMission('ALL MISSIONS COMPLETE','Free roam unlocked.','')}
else{this.setTarget(this.current.points[this.step]);ui.toast(`Checkpoint ${this.step}/${this.current.points.length}`)}}
if(this.awaitingStart&&pos.distanceTo(this.target)<3.2){this.awaitingStart=false;this.start(Math.min(this.index+1,MISSIONS.length-1));ui.setMission(this.current.title,this.current.brief,`Checkpoint 1/${this.current.points.length}`)}}
hud(ui){if(!this.active)return;ui.setMission(this.current.title,this.current.brief,`Checkpoint ${Math.min(this.step+1,this.current.points.length)}/${this.current.points.length}`)}}
