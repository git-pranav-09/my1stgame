export class GameAudio{constructor(){this.ready=false;this.enabled=true}
init(){if(this.ready)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.35;this.master.connect(this.ctx.destination);
const len=this.ctx.sampleRate*2,buf=this.ctx.createBuffer(1,len,this.ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*.25;
const src=this.ctx.createBufferSource();src.buffer=buf;src.loop=true;const f=this.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=320;const g=this.ctx.createGain();g.gain.value=.12;src.connect(f).connect(g).connect(this.master);src.start();
this.osc=this.ctx.createOscillator();this.osc.type='sawtooth';this.osc.frequency.value=60;this.engineGain=this.ctx.createGain();this.engineGain.gain.value=0;this.osc.connect(this.engineGain).connect(this.master);this.osc.start();this.ready=true}catch(e){console.warn('Audio unavailable:',e)}}
setEngine(speed,driving){if(!this.ready||!this.enabled)return;const t=driving?Math.min(.12,.02+Math.abs(speed)*.004):0;this.engineGain.gain.setTargetAtTime(t,this.ctx.currentTime,.1);this.osc.frequency.setTargetAtTime(55+Math.abs(speed)*7,this.ctx.currentTime,.1)}
setEnabled(v){this.enabled=v;if(this.ready)this.master.gain.value=v?.35:0}}
