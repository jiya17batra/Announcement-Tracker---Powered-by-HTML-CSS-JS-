// https://discourse.threejs.org/t/infinite-marquee-across-a-dynamic-perspective-is-it-possible-in-three/74646/11
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

console.clear();

class Marquee extends THREE.Mesh{
  constructor(){
    super();
    let scale = 1 / Math.sqrt(2);
    let g = new THREE.CylinderGeometry(1, 1, 1, 4, 1, true)
      .rotateY(Math.PI * 0.25)
      .scale(scale, 1, 2 * scale)
      .translate(0, 0, -1 * scale)
      .scale(2, 1, 2);
    
      let texture = (() => {
      let dimQuant = 512;
      let c = document.createElement("canvas");
      c.width = dimQuant * 8;
      c.height = dimQuant;
      let unit = c.height * 0.01;
      let u = val => val * unit;
      let ctx = c.getContext("2d");
      ctx.lineCap = "round";
      for(let i = 0; i < 8; i++){
        ctx.save();
          ctx.translate(dimQuant * i, 0);
          ctx.strokeStyle = "hsl(0, 0%, 50%, 1)";
          ctx.lineWidth = u(3);
          ctx.strokeRect(u(10), u(10), u(80), u(80));
          ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 75%, 1)`;
          ctx.fillRect(u(10), u(10), u(80), u(80));
          ctx.beginPath();
          for(let j = 0; j < 20; j++){
            ctx.moveTo(u(15 + Math.random() * 70), u(15 + Math.random() * 70));
            ctx.lineTo(u(15 + Math.random() * 70), u(15 + Math.random() * 70));
          }
          let lw = 1.5;
          let lc = Math.random() * 360;
          ctx.lineWidth = u(lw + 0.5);
          ctx.strokeStyle = `hsl(${lc}, 100%, 25%)`;
          ctx.stroke();
          ctx.lineWidth = u(lw);
          ctx.strokeStyle = `hsl(${lc}, 750%, 75%)`;
          ctx.stroke();
        ctx.restore();
      }
      
      let tex = new THREE.CanvasTexture(c);
      tex.colorSpace = "srgb";
      tex.anisitropy = renderer.capabilities.getMaxAnisotropy();
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 1);
      return tex;
    })();
    let m = new THREE.MeshBasicMaterial({
      side: THREE.BackSide, 
      map: texture, 
      wireframe: false,
      transparent: true
    });
    
    this.geometry = g;
    this.material = m;
    
    let frontPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2).translate(0, 0, -4 * scale - 0.75),
      new THREE.MeshBasicMaterial({
        map: (() => {
          let c = document.createElement("canvas");
          c.width = c.height = 1024;
          let unit = c.height * 0.01;
          let u = val => val * unit;
          let ctx = c.getContext("2d");
          
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, c.width, c.height);
          
          ctx.font = `${u(15)}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "hsl(300, 75%, 50%)";
          ctx.strokeStyle = "hsl(300, 100%, 25%)";
          ctx.lineWidth = u(1.5);
          ctx.lineJoin = "round";
          ctx.strokeText("Laudato Si", u(50), u(10));
          ctx.fillText("Laudato Si", u(50), u(10));
          
          ctx.strokeText("Ad Astra", u(50), u(90));
          ctx.fillText("Ad Astra", u(50), u(90));
          
          let tex = new THREE.CanvasTexture(c);
          tex.colorSpace = "srgb";
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          return tex;
        })()
      })
    )
    this.add(frontPlane);
    
    // "lids"
    this.lids = Array.from({length: 2}, (lid, lidIdx) => {
      let g = new THREE.PlaneGeometry(2, 4);
      let lidDir = lidIdx < 0.5 ? -1 : 1;
      g.rotateX(lidDir * Math.PI * 0.5);
      g.translate(0, lidDir, 4 * scale * -0.5);
      let m = new THREE.MeshBasicMaterial({
        map: (() => {
          
          let c = document.createElement("canvas");
          c.width = 1024;
          c.height = 1024;
          let ctx = c.getContext("2d");
          let unit = c.height * 0.01;
          let u = val => val * unit;
          
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, c.width, c.height);
          
          let fs = 7.5;
          ctx.font = `${u(fs)}px Arial`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillStyle = "#828";
          "Lacrimosa dies illa|Qua resurget ex favilla|Judicandus homo reus.|Huic ergo parce, Deus:|Pie Jesu Domine,|Dona eis requiem. Amen.".split("|").forEach((line, lineIdx, lineArr) => {
            ctx.fillText(line, u(2), u(fs) * lineIdx);
          });
          
          let tex = new THREE.CanvasTexture(c);
          tex.colorSpace = "srgb";
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(1, 2);
          return tex;
        })()
      });
      let o = new THREE.Mesh(g, m);
      o.userData = {
        lidDir: lidDir
      }
      return o;
    });
    this.add(...this.lids);
  }
  
  move(t){
    this.material.map.offset.x = t * 0.025;
    this.lids.forEach(lid => {
      lid.material.map.offset.y = -t * 0.1 * lid.userData.lidDir;
    })
  }
}

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.01, 1000);
camera.position.set(0, 0, 0.1);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

//let controls = new OrbitControls(camera, renderer.domElement);
//controls.enableDamping = true;

let marquee = new Marquee();
scene.add(marquee);

let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  t += dt;
  //controls.update();
  
  marquee.move(t);
  
  camera.rotation.z = Math.sin(t) * 0.02;
  
  renderer.render(scene, camera);
});
