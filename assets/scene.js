import * as THREE from './three.module.min.js';

// Sculpted, continuous Naiwa silhouette with a cloth apron and articulated arms.
export function createNaiwaScene(canvas,game){
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
const scene=new THREE.Scene();scene.background=new THREE.Color('#dce3ce');
const camera=new THREE.OrthographicCamera(-2,2,2.35,-2.35,.1,40);camera.position.set(.15,3.25,9);camera.lookAt(0,2.0,0);
scene.add(new THREE.HemisphereLight(0xfff9e7,0xa3b59a,2.1));
const sunlight=new THREE.DirectionalLight(0xffefd4,3.1);sunlight.position.set(-3.4,6,5);sunlight.castShadow=true;sunlight.shadow.mapSize.set(1024,1024);sunlight.shadow.camera.left=-4;sunlight.shadow.camera.right=4;sunlight.shadow.camera.top=5;sunlight.shadow.camera.bottom=-3;sunlight.shadow.normalBias=.018;sunlight.shadow.bias=-.00025;sunlight.shadow.radius=3;scene.add(sunlight);
const bounce=new THREE.DirectionalLight(0xe8f7e6,.65);bounce.position.set(3,2,-2);scene.add(bounce);
const mat=(color,roughness=.7,extra={})=>new THREE.MeshStandardMaterial({color,roughness,...extra});
const materials={skin:new THREE.MeshPhysicalMaterial({color:0xe6bb43,roughness:.52,clearcoat:.12,clearcoatRoughness:.65}),cream:mat(0xf0e3bc,.9),cloth:mat(0xf3edda,.96),strap:mat(0x729879,.94),hands:mat(0x6a5d39,.68),eye:new THREE.MeshPhysicalMaterial({color:0x111b09,roughness:.13,clearcoat:1,clearcoatRoughness:.08}),iris:mat(0x7c9860,.48),wall:mat(0x8bad8a,.9),trim:mat(0xd5b787,.8),ivory:mat(0xf1e5cb,.84),white:mat(0xfff8e7,.7),green:mat(0x346956,.75),metal:mat(0xc6b481,.3,{metalness:.4})};
const sphereGeo=new THREE.SphereGeometry(1,32,24);
function mesh(geo,material,parent=scene){const o=new THREE.Mesh(geo,material);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function ellipsoid(parent,material,x,y,z,sx,sy,sz){const o=mesh(sphereGeo,material,parent);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o;}
function box(parent,material,x,y,z,w,h,d){const o=mesh(new THREE.BoxGeometry(w,h,d),material,parent);o.position.set(x,y,z);return o;}
function roundedBox(parent,material,x,y,z,w,h,d,r=.06){const shape=new THREE.Shape();const a=-w/2,b=-h/2;shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);const geo=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:Math.min(r/3,.02),bevelThickness:.015,curveSegments:8});geo.translate(0,0,-d/2);const o=mesh(geo,material,parent);o.position.set(x,y,z);return o;}
function cylinder(parent,material,x,y,z,top,bottom,height){const o=mesh(new THREE.CylinderGeometry(top,bottom,height,36),material,parent);o.position.set(x,y,z);return o;}
function tube(parent,material,points,r=.018){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,r,10,false),material,parent);}
function textTexture(lines,bg,fg,ratio,size=512){const c=document.createElement('canvas');c.width=size;c.height=Math.round(size/ratio);const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;lines.forEach((l,i)=>{const font=Math.min(c.height/lines.length*(i===0?.6:.42),size/Math.max(l.length,1)*.84);ctx.font=(i===0?'bold ':'')+font+'px "Microsoft YaHei",sans-serif';ctx.fillText(l,size/2,(i+.5)*c.height/lines.length);});const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function label(parent,lines,bg,fg,x,y,z,w,h){const t=textTexture(lines,bg,fg,w/h);const o=mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}),parent);o.position.set(x,y,z);o.castShadow=false;return o;}
function woodTexture(){const c=document.createElement('canvas');c.width=256;c.height=256;const ctx=c.getContext('2d'),im=ctx.createImageData(256,256);for(let y=0;y<256;y++)for(let x=0;x<256;x++){const grain=Math.sin(y*.45+Math.sin(x*.02)*3)*3+Math.sin(y*.105+x*.003)*5+Math.sin(x*7+y*19)*1.5;const k=(y*256+x)*4;im.data[k]=185+grain;im.data[k+1]=139+grain;im.data[k+2]=88+grain;im.data[k+3]=255;}ctx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,1);t.colorSpace=THREE.SRGBColorSpace;return t;}
const wood=mat(0xffffff,.76,{map:woodTexture()}),darkWood=mat(0x9a7048,.8);
const room=new THREE.Group();scene.add(room);
box(room,materials.ivory,0,2,-1.5,5,4.5,.18);const wall=box(room,materials.wall,0,.98,-1.36,5,1.93,.12);for(let i=-5;i<=5;i++)box(room,mat(0x779b79,.92),i*.46,.98,-1.28,.017,1.86,.03);box(room,wood,0,1.95,-1.23,5,.07,.13);box(room,materials.trim,0,.12,-1.21,5,.13,.16);
// Sunlit window with a generated miniature-neighborhood landscape.
const windowFrame=new THREE.Group();windowFrame.position.set(1.45,2.88,-1.23);room.add(windowFrame);
box(windowFrame,materials.green,0,0,-.04,1.39,1.71,.08);
const outsideMaterial=new THREE.MeshBasicMaterial({color:0xd8eaca});const outside=mesh(new THREE.PlaneGeometry(1.22,1.52),outsideMaterial,windowFrame);outside.position.z=.025;outside.castShadow=false;
new THREE.TextureLoader().load(new URL('./window-garden.jpg',import.meta.url).href,t=>{t.colorSpace=THREE.SRGBColorSpace;outsideMaterial.map=t;outsideMaterial.color.set(0xffffff);outsideMaterial.needsUpdate=true;});
for(const x of [-.67,0,.67])box(windowFrame,materials.ivory,x,0,.08,.055,1.7,.1);for(const y of [-.82,0,.82])box(windowFrame,materials.ivory,0,y,.08,1.4,.055,.1);box(windowFrame,wood,0,-.88,.12,1.55,.095,.35);
// Linen curtains fold instead of being flat UI layers.
const curtainMaterial=mat(0xece4c7,.96,{side:THREE.DoubleSide});for(const side of [-1,1]){const geo=new THREE.PlaneGeometry(.23,1.48,16,20),a=geo.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),yy=a.getY(i);a.setZ(i,Math.cos(xx*90)*.036+.018*Math.sin(yy*3));}geo.computeVertexNormals();const curtain=mesh(geo,curtainMaterial,windowFrame);curtain.position.set(side*.76,.04,.13);}
tube(windowFrame,wood,[[-.89,.92,.15],[.89,.92,.15]],.027);
// Oak shelves, labeled tea jars, recipe books and a chalkboard menu.
function jar(parent,x,y,z,color,name){cylinder(parent,mat(0xd3d5b1,.28,{transparent:true,opacity:.47}),x,y,z,.105,.105,.27);cylinder(parent,mat(color,.85),x,y-.025,z,.088,.088,.2);cylinder(parent,wood,x,y+.15,z,.116,.116,.035);label(parent,[name],'#eae3c9','#506651',x,y,z+.107,.14,.08);}
for(const y of [2.32,3.12]){box(room,wood,-1.48,y,-1.08,1.05,.07,.37);for(const x of [-1.86,-1.09])tube(room,darkWood,[[x,y-.23,-1.3],[x,y-.2,-.96],[x,y,-.94]],.017);}
jar(room,-1.79,2.49,-1.04,0x9b7041,'茶');jar(room,-1.48,2.49,-1.04,0x818849,'叶');jar(room,-1.15,2.49,-1.04,0xae7b55,'糖');
const bookColors=[0x5b856a,0xd19d72,0xe4c794];for(let i=0;i<3;i++){const b=roundedBox(room,mat(bookColors[i]),-1.82+i*.15,3.35,-1.02,.105,.35,.21,.015);b.rotation.z=(i-1)*.06;box(b,materials.ivory,0,.1,.112,.065,.012,.005);}jar(room,-1.16,3.28,-1.04,0x658b54,'春');
const board=roundedBox(room,wood,-1.55,1.5,-1.09,.92,.81,.07,.035);roundedBox(board,materials.green,0,0,.044,.8,.69,.014,.022);label(board,['今日好茶','珍珠 28 · 芋泥 38','草莓奶茶 45'],'#346956','#f4e9cc',0,0,.06,.74,.62);
const sign=roundedBox(room,wood,0,3.84,-1.02,2.58,.53,.12,.085);label(sign,['奶娃奶茶铺'],'#f0e6c8','#35634c',0,0,.076,2.4,.4);for(const x of [-.85,.85])tube(room,darkWood,[[x,4.25,-1.1],[x,4.05,-1.02]],.012);
// A small striped canvas canopy and brass pendant lamps frame the scene.
for(let i=0;i<12;i++){const c=i%2?mat(0xf1e8ce):mat(0x789874);box(room,c,-2.2+i*.4,4.43,-.75,.4,.1,1.0);ellipsoid(room,c,-2.2+i*.4,4.33,-.2,.2,.13,.05);}
for(const x of [-1.16,1.1]){tube(room,materials.hands,[[x,4.18,-.2],[x,3.67,-.2]],.009);cylinder(room,materials.metal,x,3.64,-.2,.1,.19,.12);ellipsoid(room,mat(0xffebaa,.25,{emissive:0xffd581,emissiveIntensity:.35}),x,3.59,-.2,.12,.025,.12);}

// A smooth profile joins belly, shoulders, neck and head into one sculpted surface.
const profile=[[.1,.25],[.27,.54],[.58,.81],[.95,.95],[1.3,.98],[1.66,.87],[1.95,.68],[2.22,.53],[2.5,.47],[2.75,.45],[2.92,.36],[3.04,.23],[3.1,.08],[3.11,0]];
function radius(y){let j=0;while(j<profile.length-2&&y>profile[j+1][0])j++;const [ya,a]=profile[j],[yb,b]=profile[j+1],prev=profile[Math.max(0,j-1)],next=profile[Math.min(profile.length-1,j+2)];const t=THREE.MathUtils.clamp((y-ya)/(yb-ya),0,1),h=yb-ya,ma=(b-prev[1])/(yb-prev[0]),mb=(next[1]-a)/(next[0]-ya);return Math.max(0,(2*t**3-3*t*t+1)*a+(t**3-2*t*t+t)*h*ma+(-2*t**3+3*t*t)*b+(t**3-t*t)*h*mb);}
const curvePoints=[];for(let i=0;i<=128;i++){const y=.1+i/128*3.01;curvePoints.push(new THREE.Vector2(radius(y),y));}
const bodyGeo=new THREE.LatheGeometry(curvePoints,96);bodyGeo.scale(1,1,.72);bodyGeo.computeVertexNormals();
function surfacePatch(y0,y1,widthFn,offset=.025){const p=[],uv=[],idx=[],U=40,V=48;for(let j=0;j<=V;j++){const v=j/V,y=THREE.MathUtils.lerp(y0,y1,v),r=radius(y),width=Math.min(r*.92,widthFn(v));for(let i=0;i<=U;i++){const u=i/U,x=(u*2-1)*width,z=Math.sqrt(Math.max(0,r*r-x*x))*.72+offset+.005*Math.sin(u*18+v*2);p.push(x,y,z);uv.push(u,v);}}for(let j=0;j<V;j++)for(let i=0;i<U;i++){const a=j*(U+1)+i,b=a+U+1;idx.push(a,a+1,b,b,a+1,b+1);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return geo;}
const apronGeo=surfacePatch(.35,1.83,v=>.66-(v>.58?(v-.58)*.5:0),.042);
function armMesh(parent,side,skin){const group=new THREE.Group();group.position.set(side*.7,1.8,.02);parent.add(group);const points=[[0,0,0],[side*.2,-.25,.08],[side*.24,-.57,.27],[side*.05,-.79,.52],[-side*.19,-.72,.74]],curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),N=48,R=24,frames=curve.computeFrenetFrames(N,false),p=[],idx=[];for(let i=0;i<=N;i++){const t=i/N,c=curve.getPoint(t),rad=.24+.095*Math.sin(t*Math.PI)-.12*t*t;for(let j=0;j<=R;j++){const a=j/R*Math.PI*2,q=c.clone().addScaledVector(frames.normals[i],Math.cos(a)*rad).addScaledVector(frames.binormals[i],Math.sin(a)*rad);p.push(...q.toArray());}}for(let i=0;i<N;i++)for(let j=0;j<R;j++){let a=i*(R+1)+j,b=a+R+1;idx.push(a,a+1,b,b,a+1,b+1);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setIndex(idx);geo.computeVertexNormals();mesh(geo,skin,group);const hand=new THREE.Group();hand.position.copy(curve.getPoint(1));group.add(hand);ellipsoid(hand,materials.hands,0,0,0,.15,.16,.115);for(let i=0;i<4;i++)ellipsoid(hand,materials.hands,side*.09,.09-i*.056,.048,.083,.037,.085);ellipsoid(hand,materials.hands,-side*.07,.085,.066,.07,.075,.06);return group;}
function naiWa(isGuest=false){const root=new THREE.Group();const skin=isGuest?materials.skin.clone():materials.skin;if(isGuest)skin.color.set(0xe0be62);mesh(bodyGeo,skin,root);
mesh(surfacePatch(.45,1.7,v=>Math.sin(v*Math.PI)*.7,.014),materials.cream,root);
const cloth=isGuest?mat(0x8fae9f,.92):materials.cloth;mesh(apronGeo,cloth,root);
for(const side of [-1,1]){tube(root,isGuest?cloth:materials.strap,[[side*.46,1.82,.5],[side*.42,2.02,.41],[side*.44,2.17,.14],[side*.52,2.08,-.22]],.027);ellipsoid(root,materials.metal,side*.45,1.86,.505,.034,.036,.013);}
const pocket=mesh(surfacePatch(.91,1.2,v=>.23,.06),cloth,root);tube(root,isGuest?materials.green:materials.strap,[[-.21,1.2,.733],[0,1.2,.756],[.21,1.2,.733]],.006);
ellipsoid(root,materials.strap,0,1.52,.697,.104,.073,.012);ellipsoid(root,materials.cream,0,1.52,.714,.079,.05,.01);for(const x of [-.022,.022])ellipsoid(root,materials.hands,x,1.53,.726,.008,.009,.004);
const eyelids=[];for(const side of [-1,1]){const eyeRoot=new THREE.Group();eyeRoot.position.set(side*.272,2.72,.307);eyeRoot.rotation.y=side*.24;root.add(eyeRoot);ellipsoid(eyeRoot,materials.iris,0,0,0,.115,.13,.065);const iris=ellipsoid(eyeRoot,materials.eye,-side*.012,-.006,.05,.071,.087,.042);ellipsoid(eyeRoot,new THREE.MeshBasicMaterial({color:0xfffce8}),-.019,.027,.085,.013,.018,.007);eyelids.push(eyeRoot);}
const lips=new THREE.Group();root.add(lips);tube(lips,materials.hands,[[-.15,2.465,.326],[-.065,2.445,.364],[0,2.439,.371],[.065,2.445,.364],[.15,2.465,.326]],.008);
const happyMouth=new THREE.Group();happyMouth.visible=false;root.add(happyMouth);ellipsoid(happyMouth,materials.hands,0,2.45,.367,.135,.045,.018);ellipsoid(happyMouth,materials.white,0,2.472,.383,.09,.014,.006);
const left=armMesh(root,-1,skin),right=armMesh(root,1,skin);for(const arm of [left,right])ellipsoid(arm,skin,0,-.13,.015,.29,.35,.27);
for(const side of [-1,1]){ellipsoid(root,skin,side*.53,.3,.04,.35,.3,.34);ellipsoid(root,materials.hands,side*.53,.11,.19,.36,.11,.32);}
return {root,left,right,eyelids,lips,happyMouth,pocket,cloth};}
const nai=naiWa();nai.root.position.set(-.26,.05,.02);scene.add(nai.root);const guest=naiWa(true);guest.root.scale.setScalar(.76);guest.root.position.set(1.19,.32,-.31);guest.root.rotation.y=-.38;scene.add(guest.root);

// Beveled oak worktop and front panels create real depth and soft contact shadows.
const counter=new THREE.Group();scene.add(counter);roundedBox(counter,wood,0,.98,1.0,4.8,.14,1.4,.035);box(counter,darkWood,0,.47,1.22,4.7,.87,.96);for(let i=0;i<14;i++){roundedBox(counter,wood,-2.24+i*.345,.48,1.731,.318,.79,.025,.025);}box(counter,materials.trim,0,.1,1.76,4.75,.09,.04);
for(const x of [-1.9,-1.58]){cylinder(counter,materials.ivory,x,1.17,.69,.085,.071,.22);for(let i=0;i<3;i++)tube(counter,materials.green,[[x+(i-1)*.036,1.25,.69],[x+(i-1)*.04,1.54,.7]],.006);}
const tray=cylinder(counter,wood,.66,1.072,1.1,.36,.36,.025);tray.scale.z=.75;
const dispenser=new THREE.Group();dispenser.position.set(-1.75,1.06,-.35);counter.add(dispenser);cylinder(dispenser,materials.green,0,.31,0,.18,.18,.56);cylinder(dispenser,materials.metal,0,.6,0,.19,.19,.04);label(dispenser,['好茶'],'#f0e4bb','#315b43',0,.34,.181,.21,.14);tube(dispenser,materials.metal,[[.12,.2,.04],[.25,.2,.04],[.25,.13,.04]],.014);
const cups=new THREE.Group();cups.position.set(-1.2,1.15,-.37);counter.add(cups);for(let i=0;i<4;i++)cylinder(cups,materials.ivory,0,i*.042,0,.115+i*.006,.09+i*.006,.085);
// Colored tea in a transparent cup, with a lid, straw and actual boba pearls.
function makeCup(){const g=new THREE.Group();const drinkMat=mat(0xb68a52,.45);cylinder(g,drinkMat,0,.21,0,.142,.113,.37);const glass=cylinder(g,new THREE.MeshPhysicalMaterial({color:0xfff9e6,roughness:.18,transparent:true,opacity:.23,depthWrite:false}),0,.22,0,.15,.12,.43);cylinder(g,materials.white,0,.446,0,.158,.158,.025);tube(g,materials.white,[[.038,.44,0],[.038,.66,0]],.007);for(let i=0;i<12;i++){const a=i*2.4,r=.073+(i%2)*.02;ellipsoid(g,materials.hands,Math.sin(a)*r,.047+(i%3)*.021,Math.cos(a)*r,.027,.027,.027);}label(g,['奶娃'],'#f6eedb','#568066',0,.22,.144,.13,.11);return {root:g,drinkMat};}
const tea=makeCup();tea.root.visible=false;scene.add(tea.root);const shaker=makeCup();shaker.root.scale.setScalar(.9);shaker.root.visible=false;nai.root.add(shaker.root);
const additions=new THREE.Group();scene.add(additions);
function plant(){const g=new THREE.Group();cylinder(g,mat(0x9f5f3d),0,.13,0,.16,.12,.26);cylinder(g,materials.hands,0,.264,0,.145,.145,.012);for(let i=0;i<7;i++){const a=i*2.4,x=Math.sin(a)*.14,z=Math.cos(a)*.11;const leaf=ellipsoid(g,mat(i%2?0x538767:0x729952),x,.38+(i%3)*.08,z,.14,.085,.06);leaf.rotation.z=x*3;tube(g,materials.green,[[0,.24,0],[x,.38+(i%3)*.08,z]],.009);}g.position.set(-1.32,1.055,1.1);return g;}
function flowers(){const g=new THREE.Group();ellipsoid(g,mat(0x9cbcb2,.25),0,.16,0,.14,.19,.14);for(let i=0;i<3;i++){const x=(i-1)*.105,y=.45+i*.045;tube(g,materials.green,[[0,.24,0],[x,y,0]],.008);for(let j=0;j<7;j++){const a=j/7*Math.PI*2;ellipsoid(g,mat(0xf4d677),x+Math.sin(a)*.068,y+Math.cos(a)*.068,.005,.044,.044,.023);}ellipsoid(g,mat(0xc99843),x,y,.033,.032,.032,.019);}g.position.set(1.52,1.055,1.15);return g;}
const plantObj=plant(),flowerObj=flowers();additions.add(plantObj,flowerObj);
const lights=new THREE.Group();room.add(lights);const cord=[];for(let i=0;i<=18;i++)cord.push([-2.2+i/18*4.4,3.58-.13*Math.sin(i/18*Math.PI),-.65]);tube(lights,materials.hands,cord,.004);for(let i=0;i<12;i++){const x=-2.08+i*.38,y=3.57-.13*Math.sin(i/11*Math.PI);ellipsoid(lights,mat(0xffe7a9,.25,{emissive:0xffc34d,emissiveIntensity:.7}),x,y-.042,-.65,.025,.04,.025);}
let last=0,lastEquipped=null,lastServed=-1;const reduce=game.reduced;
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);const ar=w/h;camera.left=-2.35*ar;camera.right=2.35*ar;camera.top=2.35;camera.bottom=-2.35;camera.updateProjectionMatrix();}resize();const ro=new ResizeObserver(resize);ro.observe(canvas);
function frame(ms){requestAnimationFrame(frame);if(document.hidden||ms-last<30)return;last=ms;const s=game.getState(),e=game.elapsed(),t=ms/1000,working=!!s.order&&e>=1200&&e<6000,greeting=!!s.order&&e<1200;
nai.root.position.y=.05+(reduce?0:Math.sin(t*1.7)*.012);nai.root.rotation.y=reduce?0:Math.sin(t*.8)*.018;
nai.left.rotation.z=greeting&&!reduce?-2.1+Math.sin(t*9)*.12:working?.5+(reduce?0:Math.sin(t*13)*.08):-.015;nai.right.rotation.z=working?-.5-(reduce?0:Math.sin(t*13)*.08):.015;
const blink=reduce?1:(Math.sin(t*.6)>.998?.09:1);for(const eye of nai.eyelids)eye.scale.y=blink;
nai.happyMouth.visible=!!s.order&&e>5700;nai.lips.visible=!nai.happyMouth.visible;
shaker.root.visible=working;shaker.root.position.set(0,1.18+(reduce?0:Math.sin(t*13)*.09),.92);shaker.root.rotation.z=reduce?0:Math.sin(t*13)*.12;
guest.root.visible=s.served<s.target;guest.root.position.y=.32+(reduce?0:Math.sin(t*1.5+1)*.012);
if(s.served!==lastServed){lastServed=s.served;guest.cloth.color.set([0x93b29e,0xc0a4ba,0xcfa58d][s.served%3]);}
const k=s.equipped.join('|');if(k!==lastEquipped){lastEquipped=k;plantObj.visible=s.equipped.includes('plant');flowerObj.visible=s.equipped.includes('flowers');lights.visible=s.equipped.includes('lights');wall.material.color.set(s.equipped.includes('pink')?0xc6a39d:s.equipped.includes('blue')?0x98b7c0:0x8bad8a);}
tea.root.visible=!!s.order&&e>=5700||!s.order&&s.served>0;if(tea.root.visible){tea.root.position.set(s.order?THREE.MathUtils.lerp(-.1,.67,THREE.MathUtils.clamp((e-5700)/2400,0,1)):.67,1.067,1.1);tea.drinkMat.color.set([0xb68a52,0xb59fbd,0xd6a0a3][s.order?s.order.drink:(s.day+s.served-2)%3]);}
renderer.render(scene,camera);}
requestAnimationFrame(frame);game.ready();
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();game.error();});
window.naiwaScene={renderer,scene,camera,naiwa:nai,guest,resize};
return {dispose(){ro.disconnect();renderer.dispose();}};
}
