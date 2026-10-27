import*as THREE from'three';
export class Vehicle{constructor(scene,x,z){this.pos=new THREE.Vector3(x,0,z);this.heading=0;this.speed=0;this.driver=null;
const g=new THREE.Group();const paint=new THREE.MeshStandardMaterial({color:'#d8dee8',roughness:.35,metalness:.55});const glass=new THREE.MeshStandardMaterial({color:'#0e1a26',roughness:.15,metalness:.7});
const body=new THREE.Mesh(new THREE.BoxGeometry(2.1,.75,4.5),paint);body.position.y=.75;body.castShadow=true;
const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.8,.65,2.2),glass);cabin.position.set(0,1.35,-.15);cabin.castShadow=true;g.add(body,cabin);
const wheelGeo=new THREE.CylinderGeometry(.38,.38,.28,12),wheelMat=new THREE.MeshStandardMaterial({color:'#111',roughness:.9});this.wheels=[];
for(const[wx,wz]of[[-.95,1.45],[.95,1.45],[-.95,-1.45],[.95,-1.45]]){const w=new THREE.Mesh(wheelGeo,wheelMat);w.rotation.z=Math.PI/2;w.position.set(wx,.38,wz);g.add(w);this.wheels.push(w)}
const light=new THREE.Mesh(new THREE.BoxGeometry(1.7,.18,.1),new THREE.MeshStandardMaterial({color:'#fff',emissive:'#fff3c4',emissiveIntensity:2}));light.position.set(0,.72,2.26);g.add(light);this.mesh=g;scene.add(g)}
enter(p){this.driver=p;p.mesh.visible=false}
exit(){if(!this.driver)return null;const p=this.driver;p.mesh.visible=true;p.pos.set(this.pos.x+Math.cos(this.heading)*2.6,0,this.pos.z-Math.sin(this.heading)*2.6);p.vel.set(0,0,0);this.driver=null;this.speed*=.3;return p}
update(dt,input,colliders){if(!this.driver)this.speed*=.98;else{const accel=input.down('KeyW')?16:input.down('KeyS')?(this.speed>.5?-22:-8):0;this.speed+=accel*dt;if(input.down('Space'))this.speed*=(1-3.2*dt);this.speed=THREE.MathUtils.clamp(this.speed,-9,26);
const steer=(input.down('KeyA')?1:0)-(input.down('KeyD')?1:0);this.heading+=steer*1.9*dt*Math.min(1,Math.abs(this.speed)/8)*Math.sign(this.speed||1)}
const dx=Math.sin(this.heading)*this.speed*dt,dz=Math.cos(this.heading)*this.speed*dt;const nx=this.pos.x+dx,nz=this.pos.z+dz;
const box=new THREE.Box3(new THREE.Vector3(nx-1.15,.1,nz-2.35),new THREE.Vector3(nx+1.15,1.7,nz+2.35));let hit=false;
for(const c of colliders)if(box.intersectsBox(c)){hit=true;break}
if(hit)this.speed*=-.18;else{this.pos.x=nx;this.pos.z=nz}
this.mesh.position.copy(this.pos);this.mesh.rotation.y=this.heading;for(const w of this.wheels)w.rotation.x+=this.speed*dt*2.4;return Math.abs(this.speed)}}
