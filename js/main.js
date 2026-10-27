import*as THREE from'three';import{Input}from'./input.js';import{buildWorld}from'./world.js';import{Player}from'./player.js';import{Vehicle}from'./vehicle.js';import{Missions}from'./missions.js';import{UI}from'./ui.js';import{GameAudio}from'./audio.js';
const SAVE_KEY='project-nexus-save-v1';
class Game{constructor(){this.canvas=document.getElementById('game');this.ui=new UI();this.input=new Input(this.canvas);this.audio=new GameAudio();this.settings={quality:'high',sensitivity:1.4,sound:true};this.state='loading';this.clock=new THREE.Clock();this.camYaw=0;this.camPitch=.28;this.camDist=7.5;this.load();this.initRenderer();this.bindUI();this.buildScene();this.animate=this.animate.bind(this);requestAnimationFrame(this.animate)}
load(){try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const s=JSON.parse(raw);Object.assign(this.settings,s.settings||{});this.saved=s}}catch(e){console.warn('Save load failed',e)}}
save(extra={}){try{localStorage.setItem(SAVE_KEY,JSON.stringify({settings:this.settings,credits:this.missions?.credits??0,...extra}))}catch(e){console.warn('Save failed',e)}}
initRenderer(){this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:this.settings.quality==='high'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.settings.quality==='high'?1.75:1));this.renderer.setSize(innerWidth,innerHeight);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;this.renderer.shadowMap.enabled=this.settings.quality==='high';this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
addEventListener('resize',()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight)})}
bindUI(){const $=id=>document.getElementById(id);
$('btn-play').onclick=()=>this.startGame(false);$('btn-continue').onclick=()=>this.startGame(true);$('btn-settings-title').onclick=()=>this.openSettings('title');$('btn-settings-pause').onclick=()=>this.openSettings('pause');$('btn-settings-close').onclick=()=>this.closeSettings();$('btn-resume').onclick=()=>this.resume();$('btn-restart').onclick=()=>{this.missions.start(Math.min(this.missions.index,2));this.resume()};
$('quality').onchange=e=>{this.settings.quality=e.target.value;this.save();location.reload()};$('sensitivity').oninput=e=>{this.settings.sensitivity=+e.target.value;this.input.sensitivity=this.settings.sensitivity;this.save()};$('sound').onchange=e=>{this.settings.sound=e.target.checked;this.audio.setEnabled(this.settings.sound);this.save()};
$('quality').value=this.settings.quality;$('sensitivity').value=this.settings.sensitivity;$('sound').checked=this.settings.sound;this.input.sensitivity=this.settings.sensitivity;
addEventListener('keydown',e=>{if(e.code==='Escape'&&this.state==='playing')this.pause();else if(e.code==='Escape'&&this.state==='paused')this.resume()})}
openSettings(from){this.settingsFrom=from;this.ui.show('settings')}
closeSettings(){this.ui.show('settings',false);if(this.settingsFrom==='pause')this.ui.show('pause')}
startGame(cont){this.audio.init();this.audio.setEnabled(this.settings.sound);this.ui.show('title',false);this.ui.show('loading');
setTimeout(()=>{this.ui.show('loading',false);this.ui.show('hud');this.state='playing';
if(cont&&this.saved&&typeof this.saved.credits==='number'){this.missions.credits=this.saved.credits;this.ui.setCredits(this.saved.credits);this.missions.start(Math.min((this.saved.completedMission??-1)+1,2))}else this.missions.start(0);
this.missions.hud(this.ui);this.input.requestLock(this.canvas)},450)}
pause(){this.state='paused';this.ui.show('pause');this.input.releaseLock()}
resume(){this.ui.show('pause',false);this.state='playing';this.input.requestLock(this.canvas)}
buildScene(){const bar=document.getElementById('loading-bar'),status=document.getElementById('loading-status');bar.style.width='20%';status.textContent='Creating renderer';
this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,600);bar.style.width='45%';status.textContent='Generating Neo-Kaveri City';
this.world=buildWorld(this.scene,this.settings.quality);bar.style.width='70%';status.textContent='Spawning citizen and vehicle';
this.player=new Player(this.scene);this.vehicle=new Vehicle(this.scene,10,34);this.missions=new Missions(this.scene,()=>this.save({completedMission:this.missions.index}));this.ui.setCredits(this.missions.credits);
bar.style.width='100%';status.textContent='Ready';this.ui.show('loading',false);this.ui.show('title');if(this.saved)document.getElementById('btn-continue').classList.remove('hidden')}
updateCamera(dt){const m=this.input.consumeMouse();this.camYaw-=m.dx*.0022*this.input.sensitivity;this.camPitch=THREE.MathUtils.clamp(this.camPitch+m.dy*.0018*this.input.sensitivity,-.25,1.05);
const target=this.vehicle.driver?this.vehicle.pos:this.player.pos;const dist=this.vehicle.driver?10.5:this.camDist,height=this.vehicle.driver?4.2:2.6;
const desired=new THREE.Vector3(target.x+Math.sin(this.camYaw)*Math.cos(this.camPitch)*dist,target.y+height+Math.sin(this.camPitch)*dist,target.z+Math.cos(this.camYaw)*Math.cos(this.camPitch)*dist);
this.camera.position.lerp(desired,1-Math.pow(.001,dt));this.camera.lookAt(target.x,target.y+(this.vehicle.driver?1.4:1.5),target.z)}
animate(){requestAnimationFrame(this.animate);const dt=Math.min(this.clock.getDelta(),.05);this.ui.update(dt);
if(this.state!=='playing'){this.renderer.render(this.scene,this.camera);this.input.endFrame();return}
const nearVehicle=this.player.pos.distanceTo(this.vehicle.pos)<3.4;
if(!this.vehicle.driver&&nearVehicle)this.ui.prompt('Press E to enter vehicle');else if(this.vehicle.driver)this.ui.prompt('Press E to exit vehicle');else this.ui.prompt('');
if(this.input.justPressed('KeyE')){if(this.vehicle.driver){this.player=this.vehicle.exit();this.ui.toast('Exited vehicle')}else if(nearVehicle){this.vehicle.enter(this.player);this.ui.toast('Vehicle acquired')}}
if(this.vehicle.driver){const speed=this.vehicle.update(dt,this.input,this.world.colliders);this.player.pos.copy(this.vehicle.pos);this.audio.setEngine(speed,true)}else{this.vehicle.update(dt,this.input,this.world.colliders);this.player.update(dt,this.input,this.camYaw,this.world.colliders);this.audio.setEngine(0,false)}
this.missions.update(dt,this.vehicle.driver?this.vehicle.pos:this.player.pos,this.ui);this.missions.hud(this.ui);this.updateCamera(dt);
const hour=(20+(performance.now()/60000)%24)%24;this.ui.setClock(`${String(Math.floor(hour)).padStart(2,'0')}:${String(Math.floor((hour%1)*60)).padStart(2,'0')}`);
this.ui.drawMinimap(this.player,this.vehicle,this.missions,this.world.citySize);this.renderer.render(this.scene,this.camera);this.input.endFrame()}}
try{new Game()}catch(err){console.error(err);document.getElementById('loading-status').textContent='Error: '+err.message}
