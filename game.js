import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8bc5e8);
scene.fog = new THREE.Fog(0x8bc5e8, 65, 230);
const camera = new THREE.PerspectiveCamera(65, innerWidth/innerHeight, .1, 400);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
document.querySelector('#game').prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdff3ff,0x596044,2));
const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.position.set(-25,45,35);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
const mat=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
const groundMat=mat(0x6c7950), dirt=mat(0x9a7046), dark=mat(0x252a2d), tire=mat(0x17191b), metal=mat(0xb9c4ca,.35);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
function box(w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
function cylinderBetween(a,b,r,m){const v=new THREE.Vector3().subVectors(b,a);const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),10),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());o.castShadow=true;scene.add(o);return o}
function ramp(z){const shape=new THREE.Shape();shape.moveTo(-3,0);shape.lineTo(3,0);shape.lineTo(3,.1);shape.quadraticCurveTo(0,2.3,-3,.1);shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:5,bevelEnabled:false});const mesh=new THREE.Mesh(geo,dirt);mesh.rotation.y=0;mesh.position.set(0,0,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh)}
// Long straight dirt course
box(11,.18,240,dirt,0,0,-95);
for(let x of [-5.8,5.8]){box(.35,.25,240,mat(0xe6d6b5),x,.1,-95)}
for(let z of [-18,-43,-68,-93,-118,-143])ramp(z);
for(let z=-15;z>-215;z-=18){for(let x of [-10,10]){const post=box(.18,1.4,.18,mat(0xddd6c8),x,.7,z);box(.45,.15,.45,mat(0x3d5d3e),x,1.5,z)}}
for(let z of [-30,-80,-130,-180]){box(8,.12,.7,mat(0xf5f5f5),0,.2,z);}
// distant scenery trees
for(let i=0;i<90;i++){const x=(Math.random()<.5?-1:1)*(12+Math.random()*45),z=-Math.random()*240;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.15,.22,2,6),mat(0x59412d));trunk.position.set(x,1,z);scene.add(trunk);const crown=new THREE.Mesh(new THREE.ConeGeometry(1.3,4,7),mat(0x315b39));crown.position.set(x,3.5,z);crown.castShadow=true;scene.add(crown)}
// Bike builder: rider + recognizable BMX frame and two wheels
function makeBike(color=0xffa51d){
 const root=new THREE.Group();const frame=mat(color,.45), riderMat=mat(0x263d59), helmet=mat(0xf2f2f2), skin=mat(0xb9825c);
 const wheelGeo=new THREE.TorusGeometry(.43,.065,10,28);
 for(const x of [-.48,.48]){const wh=new THREE.Mesh(wheelGeo,tire);wh.rotation.y=Math.PI/2;wh.position.set(x,.48,0);root.add(wh);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.18,12),metal);hub.rotation.z=Math.PI/2;hub.position.set(x,.48,0);root.add(hub);
  for(let k=0;k<10;k++){const a=k*Math.PI/5;const sp=cylinderBetweenLocal(new THREE.Vector3(x,.48,0),new THREE.Vector3(x,.48+Math.sin(a)*.39,Math.cos(a)*.39),.009,metal);root.add(sp)}
 }
 const rear=new THREE.Vector3(-.48,.48,0), front=new THREE.Vector3(.48,.48,0), crank=new THREE.Vector3(-.02,.55,0), seat=new THREE.Vector3(-.22,1.02,0), head=new THREE.Vector3(.34,1.02,0), handle=new THREE.Vector3(.48,1.2,0);
 [[rear,crank],[crank,front],[rear,seat],[seat,head],[head,front],[crank,seat],[head,handle]].forEach(([a,b])=>root.add(localBar(a,b,.045,frame)));
 root.add(localBar(new THREE.Vector3(-.35,1.04,0),new THREE.Vector3(-.1,1.04,0),.055,dark));
 // fork and handle
 root.add(localBar(front,new THREE.Vector3(.52,1.17,0),.035,metal));
 root.add(localBar(new THREE.Vector3(.38,1.2,0),new THREE.Vector3(.62,1.2,0),.045,dark));
 // rider body/head/arms
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.22,.48,5,8),riderMat);body.position.set(-.03,1.48,0);body.rotation.z=-.45;root.add(body);
 const headMesh=new THREE.Mesh(new THREE.SphereGeometry(.19,14,12),skin);headMesh.position.set(.16,1.92,0);root.add(headMesh);
 const helm=new THREE.Mesh(new THREE.SphereGeometry(.22,14,10,0,Math.PI*2,0,Math.PI*.58),helmet);helm.position.set(.16,2.0,0);root.add(helm);
 root.add(localBar(new THREE.Vector3(.08,1.65,0),new THREE.Vector3(.48,1.2,0),.075,riderMat));
 root.add(localBar(new THREE.Vector3(-.15,1.35,0),new THREE.Vector3(-.45,.62,0),.09,riderMat));
 root.position.y=0;return root;
}
function cylinderBetweenLocal(a,b,r,m){return localBar(a,b,r,m)}
function localBar(a,b,r,m){const v=new THREE.Vector3().subVectors(b,a);const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,v.length(),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return o}
const player=makeBike(0xffa51d);scene.add(player);player.position.set(0,0,5);
const bots=[];
const botColors=[0x29b6d2,0xe74c3c,0x9b59b6,0x55b86b,0xf0df32];
for(let i=0;i<5;i++){const b=makeBike(botColors[i]);scene.add(b);b.position.set((i-2)*1.65,0,3+Math.random()*-2);bots.push({mesh:b,z:3,base:13+Math.random()*5,lane:(i-2)*1.65,phase:Math.random()*6})}
const keys={gas:false,brake:false,left:false,right:false,jump:false};
function bind(id,key){const el=document.getElementById(id);const on=e=>{e.preventDefault();keys[key]=true};const off=e=>{e.preventDefault();keys[key]=false};el.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(t=>el.addEventListener(t,off))}
bind('gas','gas');bind('brake','brake');bind('left','left');bind('right','right');bind('jump','jump');
const ui={speed:document.querySelector('#speed'),position:document.querySelector('#position'),timer:document.querySelector('#timer'),message:document.querySelector('#message'),start:document.querySelector('#startScreen'),finish:document.querySelector('#finishScreen')};
let running=false,finished=false,speed=0,elapsed=0,playerZ=5,jumpY=0,jumpV=0,steer=0,last=performance.now(),countdown=0;
function start(){ui.start.classList.add('hidden');ui.finish.classList.add('hidden');running=true;finished=false;speed=0;elapsed=0;playerZ=5;player.position.set(0,0,playerZ);bots.forEach((b,i)=>{b.z=3-i*.8;b.mesh.position.set(b.lane,0,b.z)});countdown=3;ui.message.textContent='3';}
document.querySelector('#start').onclick=start;document.querySelector('#restart').onclick=start;
function finish(){running=false;finished=true;const place=1+bots.filter(b=>b.z<playerZ).length;document.querySelector('#resultTitle').textContent=place===1?'JUARA 1!':`POSISI ${place}`;document.querySelector('#resultText').textContent=`Waktu kamu ${formatTime(elapsed)}. ${place===1?'Luar biasa, kamu memenangkan balapan!':'Coba lagi untuk merebut posisi pertama.'}`;ui.finish.classList.remove('hidden');}
function formatTime(t){const m=Math.floor(t/60),s=Math.floor(t%60);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;
 if(running){
  if(countdown>0){countdown-=dt;ui.message.textContent=countdown>2?'3':countdown>1?'2':countdown>.1?'1':'GO!';if(countdown<=0)ui.message.textContent='';}
  else{
   elapsed+=dt;
   const target=keys.gas?25:0;speed=THREE.MathUtils.damp(speed,target,keys.gas?1.2:1.6,dt);if(keys.brake)speed=Math.max(0,speed-22*dt);
   steer=(keys.left?-1:0)+(keys.right?1:0);player.position.x=THREE.MathUtils.clamp(player.position.x+steer*5*dt,-4.4,4.4);
   player.rotation.z=THREE.MathUtils.damp(player.rotation.z,-steer*.16,7,dt);
   playerZ-=speed*dt*.42;player.position.z=playerZ;
   if(keys.jump&&jumpY<=0.01)jumpV=6.5;
   jumpV-=16*dt;jumpY=Math.max(0,jumpY+jumpV*dt);if(jumpY===0)jumpV=0;player.position.y=jumpY;
   const obstacle= Math.abs(((playerZ%25)+25)%25-12.5);
   player.rotation.x=THREE.MathUtils.damp(player.rotation.x, jumpY>0?.12:0,4,dt);
   bots.forEach(b=>{b.z-=b.base*dt*.42;b.mesh.position.z=b.z;b.mesh.position.x=b.lane+Math.sin(elapsed*.8+b.phase)*.18;b.mesh.rotation.z=Math.sin(elapsed+b.phase)*.035});
   const place=1+bots.filter(b=>b.z<playerZ).length;ui.position.textContent=`${place} / 6`;ui.speed.textContent=Math.round(speed*3.6);ui.timer.textContent=formatTime(elapsed);
   if(playerZ < -205)finish();
  }
 }
 const desired=new THREE.Vector3(player.position.x*.45,4.1,player.position.z+8.5);
 camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(player.position.x,1.0,player.position.z-7);
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
