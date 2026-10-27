import*as THREE from'three';
export class Player{constructor(scene){this.pos=new THREE.Vector3(6,0,24);this.vel=new THREE.Vector3();this.yaw=0;this.onGround=true;this.radius=.45;this.height=1.75;this.speed=5.2;this.runSpeed=9;
const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.85,4,10),new THREE.MeshStandardMaterial({color:'#2f6df0',roughness:.6}));body.position.y=.95;body.castShadow=true;
const head=new THREE.Mesh(new THREE.SphereGeometry(.26,12,12),new THREE.MeshStandardMaterial({color:'#e8b98d',roughness:.7}));head.position.y=1.62;head.castShadow=true;g.add(body,head);this.mesh=g;scene.add(g)}
update(dt,input,camYaw,colliders){let fx=0,fz=0;if(input.down('KeyW'))fz-=1;if(input.down('KeyS'))fz+=1;if(input.down('KeyA'))fx-=1;if(input.down('KeyD'))fx+=1;
const moving=fx||fz;const speed=input.down('ShiftLeft')?this.runSpeed:this.speed;
if(moving){const len=Math.hypot(fx,fz);fx/=len;fz/=len;const sin=Math.sin(camYaw),cos=Math.cos(camYaw);const wx=fx*cos-fz*sin,wz=fx*sin+fz*cos;this.vel.x=wx*speed;this.vel.z=wz*speed;this.yaw=Math.atan2(wx,wz)}else{this.vel.x*=.8;this.vel.z*=.8}
if(input.justPressed('Space')&&this.onGround){this.vel.y=6.4;this.onGround=false}
this.vel.y-=18*dt;this.moveAxis('x',this.vel.x*dt,colliders);this.moveAxis('z',this.vel.z*dt,colliders);this.pos.y+=this.vel.y*dt;
if(this.pos.y<=0){this.pos.y=0;this.vel.y=0;this.onGround=true}
this.mesh.position.copy(this.pos);if(moving)this.mesh.rotation.y=this.yaw}
moveAxis(axis,delta,colliders){if(!delta)return;const next=this.pos.clone();next[axis]+=delta;const box=new THREE.Box3(new THREE.Vector3(next.x-this.radius,next.y+.1,next.z-this.radius),new THREE.Vector3(next.x+this.radius,next.y+this.height,next.z+this.radius));
for(const c of colliders)if(box.intersectsBox(c))return;this.pos[axis]=next[axis]}}
