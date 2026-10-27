import*as THREE from'three';
const BLOCK=46,ROAD=14,GRID=5,CITY=GRID*BLOCK+(GRID+1)*ROAD,HALF=CITY/2;
function windowTexture(){const c=document.createElement('canvas');c.width=128;c.height=256;const x=c.getContext('2d');x.fillStyle='#101823';x.fillRect(0,0,128,256);for(let j=8;j<250;j+=18)for(let i=8;i<120;i+=16){const lit=Math.random()<.42;x.fillStyle=lit?(Math.random()<.2?'#ffd489':'#9fd8ff'):'#182532';x.globalAlpha=lit?.55+Math.random()*.45:1;x.fillRect(i,j,9,11)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
function roadTexture(){const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');x.fillStyle='#191d24';x.fillRect(0,0,128,128);x.strokeStyle='#e8e2c8';x.lineWidth=3;x.setLineDash([16,18]);x.beginPath();x.moveTo(64,0);x.lineTo(64,128);x.stroke();const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t}
export function buildWorld(scene,quality){const colliders=[];const addBox=(x,y,z,w,h,d)=>colliders.push(new THREE.Box3(new THREE.Vector3(x-w/2,y,z-d/2),new THREE.Vector3(x+w/2,y+h,z+d/2)));
scene.background=new THREE.Color('#0a1020');scene.fog=new THREE.Fog('#0d1526',70,260);
scene.add(new THREE.HemisphereLight('#8fb6ff','#1a1d26',.85));
const sun=new THREE.DirectionalLight('#ffe3b0',1.15);sun.position.set(70,110,40);
if(quality==='high'){sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-140;sun.shadow.camera.right=140;sun.shadow.camera.top=140;sun.shadow.camera.bottom=-140;sun.shadow.camera.far=350}
scene.add(sun);scene.add(new THREE.AmbientLight('#31415e',.45));
const ground=new THREE.Mesh(new THREE.PlaneGeometry(CITY+120,CITY+120),new THREE.MeshStandardMaterial({color:'#151a22',roughness:.95}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=quality==='high';scene.add(ground);
const rt=roadTexture();rt.repeat.set(2,GRID+1);const roadMat=new THREE.MeshStandardMaterial({map:rt,roughness:.85});const roadGeo=new THREE.PlaneGeometry(ROAD,CITY);
for(let i=0;i<=GRID;i++){const p=-HALF+ROAD/2+i*(BLOCK+ROAD);for(const rot of[0,Math.PI/2]){const r=new THREE.Mesh(roadGeo,roadMat);r.rotation.x=-Math.PI/2;r.rotation.z=rot;r.position.set(rot?0:p,.02,rot?p:0);r.receiveShadow=quality==='high';scene.add(r)}}
const facade=windowTexture();const bGeo=new THREE.BoxGeometry(1,1,1);const bMat=new THREE.MeshStandardMaterial({map:facade,roughness:.7,metalness:.1});
const inst=new THREE.InstancedMesh(bGeo,bMat,GRID*GRID*3);inst.castShadow=inst.receiveShadow=quality==='high';
const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3();let n=0;
const palette=['#2a3242','#33302c','#26333a','#3a2f33','#2c2a38'];
for(let gx=0;gx<GRID;gx++)for(let gz=0;gz<GRID;gz++){const cx=-HALF+ROAD+BLOCK/2+gx*(BLOCK+ROAD),cz=-HALF+ROAD+BLOCK/2+gz*(BLOCK+ROAD);const count=2+((gx*7+gz*3)%2);
for(let k=0;k<count&&n<inst.count;k++){const w=10+Math.random()*10,d=10+Math.random()*10,h=10+Math.random()*34;const ox=(Math.random()-.5)*(BLOCK-w-6),oz=(Math.random()-.5)*(BLOCK-d-6);p.set(cx+ox,h/2,cz+oz);s.set(w,h,d);m.compose(p,q,s);inst.setMatrixAt(n,m);inst.setColorAt(n,new THREE.Color(palette[n%palette.length]));addBox(cx+ox,0,cz+oz,w,h,d);n++}}
inst.count=n;inst.instanceMatrix.needsUpdate=true;scene.add(inst);
const poleGeo=new THREE.CylinderGeometry(.12,.16,7,6),poleMat=new THREE.MeshStandardMaterial({color:'#2b313c'}),lampGeo=new THREE.SphereGeometry(.35,8,8),lampMat=new THREE.MeshStandardMaterial({color:'#fff2cc',emissive:'#ffcf7a',emissiveIntensity:2});
const poles=new THREE.InstancedMesh(poleGeo,poleMat,80),lamps=new THREE.InstancedMesh(lampGeo,lampMat,80);let li=0;
for(let i=0;i<=GRID&&li<80;i++)for(let j=0;j<GRID&&li<80;j++){const x=-HALF+ROAD/2+i*(BLOCK+ROAD),z=-HALF+ROAD+BLOCK/2+j*(BLOCK+ROAD)+(j%2?14:-14);m.compose(p.set(x,3.5,z),q,s.set(1,1,1));poles.setMatrixAt(li,m);m.compose(p.set(x,7.1,z),q,s.set(1,1,1));lamps.setMatrixAt(li,m);li++}
poles.count=lamps.count=li;scene.add(poles,lamps);
const tower=new THREE.Mesh(new THREE.CylinderGeometry(6,9,60,12),new THREE.MeshStandardMaterial({color:'#1d2735',roughness:.4,metalness:.5,emissive:'#123',emissiveIntensity:.4}));tower.position.set(0,30,0);tower.castShadow=quality==='high';scene.add(tower);addBox(0,0,0,14,60,14);
const beacon=new THREE.Mesh(new THREE.SphereGeometry(1.6,12,12),new THREE.MeshStandardMaterial({color:'#fff',emissive:'#4fd1ff',emissiveIntensity:3}));beacon.position.set(0,61,0);scene.add(beacon);
return{colliders,citySize:CITY,landmark:new THREE.Vector3()}}
