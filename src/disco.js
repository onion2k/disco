import {TweenMax, Power2, TimelineMax} from "gsap";

import { DefaultLoadingManager } from '../node_modules/three/src/loaders/LoadingManager'; 

import { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera';
import { Scene } from '../node_modules/three/src/scenes/Scene';
import { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer';
import { PCFSoftShadowMap } from '../node_modules/three/src/constants';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { AmbientLight } from '../node_modules/three/src/lights/AmbientLight';
import { SpotLight } from '../node_modules/three/src/lights/SpotLight';
import { CameraHelper } from '../node_modules/three/src/helpers/CameraHelper';
import { Object3D } from '../node_modules/three/src/core/Object3D';

import { Mesh } from '../node_modules/three/src/objects/Mesh';
import { PlaneGeometry } from '../node_modules/three/src/geometries/PlaneGeometry';
import { MeshStandardMaterial } from '../node_modules/three/src/materials/MeshStandardMaterial';

import polyLoader from './lib/polyLoader';

let pl = new polyLoader;
let bill, scene, camera, renderer, modelsArr;
let spots = [];
let c = 0;

function init() {

    scene = new Scene();

    const planeGeo = new PlaneGeometry(100, 100);
    const planeMat = new MeshStandardMaterial({ color: 0xffffff });
    const plane = new Mesh(planeGeo, planeMat);
    plane.rotation.set(-Math.PI/2, 0, 0);
    scene.add( plane );
    
    let amblight = new AmbientLight( 0xaaaaaa );
    scene.add( amblight );

    var light = new SpotLight( 0xff4444, 0.75, 0, Math.PI/16, 0.05 );
    light.position.set( 50, 100, -50 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);
    light.target.position.set(5,0,-5);
    scene.add(light.target);
    light.motion = { x: 1, y: 1 }
    spots.push(light);


    var light = new SpotLight( 0x44ff44, 0.75, 0, Math.PI/16, 0.05 );
    light.position.set( -50, 100, -50 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);
    light.target.position.set(-5,0,-5);
    scene.add(light.target);
    light.motion = { x: -1, y: 1 }
    spots.push(light);


    var light = new SpotLight( 0x4444ff, 0.75, 0, Math.PI/16, 0.05 );
    light.position.set( 50, 100, 50 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);
    light.target.position.set(0,0,5);
    scene.add(light.target);
    light.motion = { x: 1, y: -1 }
    spots.push(light);



    camera = new PerspectiveCamera( 70, 800/600, 1, 5000 );
    camera.position.x = 0;
    camera.position.y = 30;
    camera.position.z = 30;
    camera.lookAt(new Vector3(0,5,0));

    renderer = new WebGLRenderer({ alpha: false, antialias: true });
    renderer.setClearColor( 0x000000, 0);
    renderer.setSize(800,600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;    

    let container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

}

function animate() {
    c += 1;
    // spots.forEach((spot,i) => {
    //     spot.target.position.x += Math.sin(c/100) * 0.1 * spot.motion.x;
    //     spot.target.position.z += Math.cos(c/100) * 0.1 *  spot.motion.y;
    // });
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

const models = [
    { id: 'duck', path: 'duck/', model: 'RubberDuck.obj', material: 'RubberDuck.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'duck2', path: 'duck/', model: 'RubberDuck.obj', material: 'RubberDuck2.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'wizard', path: 'hats/wizard/', model: 'wizard hat.obj', material: 'wizard hat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'pirate', path: 'hats/pirate/', model: 'pirate hat.obj', material: 'pirate hat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'top', path: 'hats/tophat/', model: 'top hat.obj', material: 'top hat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'sheriff', path: 'hats/sheriff/', model: 'SheriffHat.obj', material: 'SheriffHat.mtl', scale: 1, rotation: {x:0, y:0, z:0} }
]

pl.load(models).then((result) => {

    modelsArr = {};
    result.map((r) => { modelsArr[r.id] = r.object; });

    init();
    animate();



    let barry = modelsArr.duck.clone();
    barry.position.x -= 15;    
    scene.add(barry);
    
    let th = modelsArr.top.clone();
    barry.add(th);
    th.position.set(0,6.1,1.25);

    let t3 = new TimelineMax({ repeat: -1 });
    t3.add(TweenLite.to(barry.rotation, 1, { y: Math.PI * 2 }));
    t3.add(TweenLite.to(barry.position, 0.5, { y: 5, ease: Power2.easeOut }));
    t3.add(TweenLite.to(barry.position, 0.5, { y: 0, ease: Power2.easeIn }));



    let bill = modelsArr.duck.clone();
    bill.position.x -= 5;
    scene.add(bill);

    let wz = modelsArr.wizard.clone();
    bill.add(wz);
    wz.position.set(0,4.45,1.25);

    let t1 = new TimelineMax({ repeat: -1 });
    t1.add(TweenLite.to(bill.rotation, 1, { y: Math.PI * -2 }));
    t1.add(TweenLite.to(bill.position, 0.5, { y: 5, ease: Power2.easeOut }));
    t1.add(TweenLite.to(bill.position, 0.5, { y: 0, ease: Power2.easeIn }));



    let bob = modelsArr.duck.clone();
    bob.position.x += 5;
    scene.add(bob);

    let ph = modelsArr.pirate.clone();
    bob.add(ph);
    ph.position.set(0,4.9,1.25);

    let t2 = new TimelineMax({ repeat: -1 });
    t2.add(TweenLite.to(bob.rotation, 1, { y: Math.PI * 2 }));
    t2.add(TweenLite.to(bob.position, 0.5, { y: 5, ease: Power2.easeOut }));
    t2.add(TweenLite.to(bob.position, 0.5, { y: 0, ease: Power2.easeIn }));




    let benny = modelsArr.duck.clone();
    benny.position.x += 15;    
    scene.add(benny);
    
    let sh = modelsArr.sheriff.clone();
    benny.add(sh);
    sh.position.set(0,5.2,1.25);

    let t4 = new TimelineMax({ repeat: -1 });
    t4.add(TweenLite.to(benny.rotation, 1, { y: Math.PI * -2 }));
    t4.add(TweenLite.to(benny.position, 0.5, { y: 5, ease: Power2.easeOut }));
    t4.add(TweenLite.to(benny.position, 0.5, { y: 0, ease: Power2.easeIn }));



});
