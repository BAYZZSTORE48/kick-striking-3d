import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9bc9e2);scene.fog=new THREE.Fog(0x9bc9e2,85,280);
const camera=new THREE.PerspectiveCamera(61,innerWidth/innerHeight,.1,500);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;document.querySelector('#game').prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe5f5ff,0x55402a,2.1));const sun=new THREE.DirectionalLight(0xfff0d8,2.8);sun.position.set(-35,60,28);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-240;scene.add(sun);
const mat=(c,r=.8,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const grass=mat(0x657b4d),earth=mat(0x956943),earthTop=mat(0xa97c50),cream=mat(0xe8d7b7),black=mat(0x17191b),rubber=mat(0x101214),steel=mat(0x9caab1,.32,.7),spokeMat=mat(0x9da8ad,.4,.65);
function mesh(g,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function bar(parent,a,b,r,m){const v=new THREE.Vector3().subVectors(b,a),o=mesh(new THREE.CylinderGeometry(r,r,v.length(),10),m,0,0,0,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return o}
function box(parent,w,h,d,m,x,y,z){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent)}
// Track and shoulders
mesh(new THREE.PlaneGeometry(600,600),grass,0,-.18,-110).rotation.x=-Math.PI/2;
box(scene,13,.28,250,earth,0,-.02,-105);
box(scene,1,.2,250,grass,-7.2,-.01,-105);box(scene,1,.2,250,grass,7.2,-.01,-105);
for(const x of [-6.55,6.55])box(scene,.16,.22,250,cream,x,.12,-105);
function makeRamp(z){const shape=new THREE.Shape();shape.moveTo(-3.1,0);shape.lineTo(3.1,0);shape.lineTo(3.1,.1);shape.quadraticCurveTo(0,2.6,-3.1,.1);shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:5,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.08,bevelThickness:.08});mesh(g,earthTop,0,.12,z)}
for(let z=-18;z>-218;z-=25)makeRamp(z);
for(let z=-12;z>-240;z-=10){for(const x of [-8.1,8.1]){box(scene,.16,1.15,.16,steel,x,.58,z);box(scene,.42,.15,.38,mat(0x344e3b),x,1.22,z)}}
for(let z=-25;z>-230;z-=34){for(const x of [-7.7,7.7]){const rail=box(scene,.13,.7,32,cream,x,.95,z);rail.material=mat(0xd7d0bc)}}
// procedural dirt flecks along track
for(let i=0;i<650;i++){const x=(Math.random()-.5)*12,z=5-Math.random()*245;mesh(new THREE.SphereGeometry(.025+Math.random()*.035,5,4),mat(Math.random()>.5?0x765333:0xb08a5d),x,.145,z)}
// trees with layered foliage
for(let i=0;i<125;i++){const side=Math.random()<.5?-1:1,x=side*(11+Math.random()*43),z=8-Math.random()*270,s=.7+Math.random()*1.1;mesh(new THREE.CylinderGeometry(.13*s,.22*s,2.3*s,7),mat(0x57412c),x,1.15*s,z);for(let j=0;j<3;j++)mesh(new THREE.ConeGeometry((1.25-j*.22)*s,2.1*s,7),mat([0x315b3d,0x3d7047,0x284d36][j]),x,(2.2+j*.72)*s,z)}
// BMX model with detailed wheels, spokes, frame, pedals, rider
function makeBike(color=0xffa51d){
 const root=new THREE.Group(),frame=mat(color,.35,.25),jersey=mat(0x173958),pants=mat(0x20252b),skin=mat(0xb77e5a),helmet=mat(0xe9edf0,.35),visor=mat(0x252b30,.3),grip=mat(0x17191b);
 const wheels=[];
 for(const x of [-.58,.58]){const wheel=new THREE.Group();wheel.position.set(x,.53,0);root.add(wheel);mesh(new THREE.TorusGeometry(.46,.075,12,36),rubber,0,0,0,wheel).rotation.y=Math.PI/2;mesh(new THREE.TorusGeometry(.36,.018,6,32),steel,0,0,0,wheel).rotation.y=Math.PI/2;mesh(new THREE.CylinderGeometry(.065,.065,.19,16),steel,0,0,0,wheel).rotation.z=Math.PI/2;
 for(let k=0;k<14;k++){const a=k*Math.PI*2/14;bar(wheel,new THREE.Vector3(0,0,0),new THREE.Vector3(0,Math.sin(a)*.36,Math.cos(a)*.36),.009,spokeMat)}
 wheels.push(wheel)}
 const rear=new THREE.Vector3(-.58,.53,0),front=new THREE.Vector3(.58,.53,0),crank=new THREE.Vector3(-.04,.58,0),seat=new THREE.Vector3(-.31,1.12,0),head=new THREE.Vector3(.38,1.1,0),stem=new THREE.Vector3(.52,1.29,0);
 [[rear,crank],[crank,front],[rear,seat],[seat,head],[head,front],[crank,seat],[head,stem]].forEach(([a,b])=>bar(root,a,b,.045,frame));
 bar(root,new THREE.Vector3(-.42,1.1,0),new THREE.Vector3(-.12,1.1,0),.055,grip);bar(root,front,new THREE.Vector3(.61,1.26,0),.035,steel);bar(root,new THREE.Vector3(.39,1.29,0),new THREE.Vector3(.68,1.29,0),.045,grip);
 // crank and pedals
 const crankGroup=new THREE.Group();crankGroup.position.copy(crank);root.add(crankGroup);bar(crankGroup,new THREE.Vector3(-.25,0,0),new THREE.Vector3(.25,0,0),.035,steel);box(crankGroup,.22,.06,.12,grip,-.27,.0,0);box(crankGroup,.22,.06,.12,grip,.27,.0,0);
 // rider torso, head, helmet, limbs
 const torso=mesh(new THREE.CapsuleGeometry(.24,.48,6,10),jersey,-.02,1.57,0,root);torso.rotation.z=-.35;
 mesh(new THREE.SphereGeometry(.19,18,14),skin,.17,1.99,0,root);
 mesh(new THREE.SphereGeometry(.225,18,12,0,Math.PI*2,0,Math.PI*.62),helmet,.17,2.08,0,root);
 mesh(new THREE.BoxGeometry(.22,.055,.24),visor,.2,2.02,.12,root);
 const limbs=[];
 limbs.push(bar(root,new THREE.Vector3(.08,1.73,0),new THREE.Vector3(.5,1.29,0),.085,jersey));
 limbs.push(bar(root,new THREE.Vector3(-.13,1.38,0),new THREE.Vector3(-.43,.67,0),.095,pants));
 limbs.push(bar(root,new THREE.Vector3(-.43,.67,0),new THREE.Vector3(-.58,.53,0),.07,skin));
 limbs.push(bar(root,new THREE.Vector3(.0,1.38,0),new THREE.Vector3(.37,.68,0),.095,pants));
 limbs.push(bar(root,new THREE.Vector3(.37,.68,0),new THREE.Vector3(.58,.53,0),.07,skin));
 // shoes
 box(root,.23,.12,.18,black,-.58,.51,.02);box(root,.23,.12,.18,black,.58,.51,.02);
 root.userData={wheels,crankGroup};return root;
}
const player=makeBike(0xffa51d);scene.add(player);player.position.set(0,0,5);
const colors=[0x23a8d1,0xe34d3d,0x9a64c7,0x4eaa65,0xe6ca35],bots=[];
for(let i=0;i<5;i++){const b=makeBike(colors[i]);scene.add(b);bots.push({mesh:b,z:-3-i*1.2,lane:(i-2)*1.95,base:14+Math.random()*3,phase:Math.random()*6})}
const keys={gas:false,brake:false,left:false,right:false,jump:false};function bind(id,key){const el=document.getElementById(id),on=e=>{e.preventDefault();keys[key]=true},off=e=>{e.preventDefault();keys[key]=false};el.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(t=>el.addEventListener(t,off))}
['gas','brake','left','right','jump'].forEach(k=>bind(k,k));
const ui={speed:document.querySelector('#speed'),position:document.querySelector('#position'),timer:document.querySelector('#timer'),message:document.querySelector('#message'),start:document.querySelector('#startScreen'),finish:document.querySelector('#finishScreen')};
let running=false,speed=0,elapsed=0,playerZ=5,jumpY=0,jumpV=0,steer=0,last=performance.now(),countdown=0;
const fmt=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function start(){ui.start.classList.add('hidden');ui.finish.classList.add('hidden');running=true;speed=0;elapsed=0;playerZ=5;jumpY=0;player.position.set(0,0,5);bots.forEach((b,i)=>{b.z=-3-i*1.2;b.mesh.position.set(b.lane,0,b.z)});countdown=3;ui.message.textContent='3'}
document.querySelector('#start').onclick=start;document.querySelector('#restart').onclick=start;
function finish(){running=false;const rank=1+bots.filter(b=>b.z<playerZ).length;document.querySelector('#resultTitle').textContent=rank===1?'JUARA 1!':`POSISI ${rank}`;document.querySelector('#resultText').textContent=`Waktu ${fmt(elapsed)}. ${rank===1?'Kamu memenangkan balapan!':'Coba lagi untuk meraih juara pertama.'}`;ui.finish.classList.remove('hidden')}
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;
 if(running){if(countdown>0){countdown-=dt;ui.message.textContent=countdown>2?'3':countdown>1?'2':countdown>.1?'1':'GO!';if(countdown<=0)ui.message.textContent=''}
 else{elapsed+=dt;speed=THREE.MathUtils.damp(speed,keys.gas?27:0,keys.gas?1.4:1.8,dt);if(keys.brake)speed=Math.max(0,speed-24*dt);
 steer=(keys.left?-1:0)+(keys.right?1:0);player.position.x=THREE.MathUtils.clamp(player.position.x+steer*5.2*dt,-4.7,4.7);player.rotation.z=THREE.MathUtils.damp(player.rotation.z,-steer*.13,6,dt);
 playerZ-=speed*dt*.48;player.position.z=playerZ;
 if(keys.jump&&jumpY<.02)jumpV=7.1;jumpV-=17*dt;jumpY=Math.max(0,jumpY+jumpV*dt);if(jumpY===0)jumpV=0;player.position.y=jumpY;
 player.userData.wheels.forEach(w=>w.rotation.x-=speed*dt*1.5);player.userData.crankGroup.rotation.x+=speed*dt*.22;
 bots.forEach(b=>{b.z-=b.base*dt*.48;b.mesh.position.set(b.lane+Math.sin(elapsed+b.phase)*.16,Math.max(0,Math.sin(elapsed*2+b.phase))*.035,b.z);b.mesh.userData.wheels.forEach(w=>w.rotation.x-=b.base*dt*.7)});
 const rank=1+bots.filter(b=>b.z<playerZ).length;ui.position.textContent=`${rank} / 6`;ui.speed.textContent=Math.round(speed*3.6);ui.timer.textContent=fmt(elapsed);if(playerZ<-225)finish();
 }}
 const camTarget=new THREE.Vector3(player.position.x*.38,3.45,player.position.z+7.2);camera.position.lerp(camTarget,1-Math.pow(.001,dt));camera.lookAt(player.position.x,1.25,player.position.z-8);renderer.render(scene,camera)}
requestAnimationFrame(animate);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
