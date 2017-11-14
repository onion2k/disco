require('./disco.css');

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
    spots.forEach((spot,i) => {
        spot.target.position.x += Math.sin(c/100) * 0.1 * spot.motion.x;
        spot.target.position.z += Math.cos(c/100) * 0.1 *  spot.motion.y;
    });
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

const models = [
    { id: 'duck', path: 'duck/', model: 'RubberDuck.obj', material: 'RubberDuck.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'duck2', path: 'duck/', model: 'RubberDuck.obj', material: 'RubberDuck2.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'wizard', path: 'hats/wizard/', model: 'wizard hat.obj', material: 'wizard hat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'pirate', path: 'hats/pirate/', model: 'pirate hat.obj', material: 'pirate hat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'top', path: 'hats/tophat/', model: 'top hat.obj', material: 'top hat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'sheriff', path: 'hats/sheriff/', model: 'SheriffHat.obj', material: 'SheriffHat.mtl', scale: 1, rotation: {x:0, y:0, z:0} },
    { id: 'baseball', path: 'hats/baseball/', model: 'baseball cap.obj', material: 'baseball cap.mtl', scale: 1.37, rotation: {x:0, y:0, z:0} },
    { id: 'football', path: 'hats/football/', model: 'football helmet.obj', material: 'football helmet.mtl', scale: 3.2, rotation: {x:0, y:0, z:0} },
    { id: 'mortar', path: 'hats/mortar/', model: 'CHAHIN_GRADUATION_CAP.obj', material: 'CHAHIN_GRADUATION_CAP.mtl', scale: 2, rotation: {x:0, y:Math.PI/2, z:0} },
    { id: 'shades', path: 'hats/shades/', model: 'model.obj', material: 'materials.mtl', scale: 3, rotation: {x:-Math.PI/16, y:Math.PI, z:0} }
]

pl.load(models).then((result) => {

    modelsArr = {};
    result.map((r) => { modelsArr[r.id] = r.object; });

    init();
    animate();



    let barry = modelsArr.duck.clone();
    barry.position.x -= 30;    
    scene.add(barry);
    
    let th = modelsArr.top.clone();
    barry.add(th);
    th.position.set(0,6.1,1.25);

    let t3 = new TimelineMax({ repeat: -1 });
    t3.add(TweenLite.to(barry.rotation, 1, { y: "+="+Math.PI * 2, delay: 0.2 }));
    t3.add(TweenLite.to(barry.position, 0.5, { x: "+=5", ease: Power2.easeIn }));
    t3.add(TweenLite.to(barry.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 1.6 }));
    t3.add(TweenLite.to(barry.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t3.add(TweenLite.to(barry.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t3.add(TweenLite.to(barry.rotation, 1, { y: "+="+Math.PI * 2 }));
    t3.add(TweenLite.to(barry.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t3.add(TweenLite.to(barry.position, 0.5, { x: "-=5", ease: Power2.easeIn }));
    


    let bill = modelsArr.duck.clone();
    bill.position.x -= 10;
    scene.add(bill);

    let wz = modelsArr.wizard.clone();
    bill.add(wz);
    wz.position.set(0,4.45,1.25);

    let t1 = new TimelineMax({ repeat: -1 });
    t1.add(TweenLite.to(bill.rotation, 1, { y: "+="+Math.PI * -2, delay: 0.4 }));
    t1.add(TweenLite.to(bill.position, 0.5, { x: "+=5", ease: Power2.easeIn }));
    t1.add(TweenLite.to(bill.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 1.4 }));
    t1.add(TweenLite.to(bill.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t1.add(TweenLite.to(bill.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t1.add(TweenLite.to(bill.rotation, 1, { y: "+="+Math.PI * 2 }));
    t1.add(TweenLite.to(bill.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t1.add(TweenLite.to(bill.position, 0.5, { x: "-=5", ease: Power2.easeIn }));



    let bob = modelsArr.duck.clone();
    bob.position.x += 10;
    scene.add(bob);

    let ph = modelsArr.pirate.clone();
    bob.add(ph);
    ph.position.set(0,4.9,1.25);

    let t2 = new TimelineMax({ repeat: -1 });
    t2.add(TweenLite.to(bob.rotation, 1, { y: "+="+Math.PI * 2, delay: 0.6 }));
    t2.add(TweenLite.to(bob.position, 0.5, { x: "+=5", ease: Power2.easeIn }));
    t2.add(TweenLite.to(bob.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 1.2 }));
    t2.add(TweenLite.to(bob.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t2.add(TweenLite.to(bob.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t2.add(TweenLite.to(bob.rotation, 1, { y: "+="+Math.PI * 2 }));
    t2.add(TweenLite.to(bob.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t2.add(TweenLite.to(bob.position, 0.5, { x: "-=5", ease: Power2.easeIn }));




    let benny = modelsArr.duck.clone();
    benny.position.x += 30;    
    scene.add(benny);
    
    let sh = modelsArr.sheriff.clone();
    benny.add(sh);
    sh.position.set(0,5.2,1.25);

    let t4 = new TimelineMax({ repeat: -1 });
    t4.add(TweenLite.to(benny.rotation, 1, { y: "+="+Math.PI * -2, delay: 0.8 }));
    t4.add(TweenLite.to(benny.position, 0.5, { x: "+=5", ease: Power2.easeIn }));
    t4.add(TweenLite.to(benny.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 1.0 }));
    t4.add(TweenLite.to(benny.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t4.add(TweenLite.to(benny.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t4.add(TweenLite.to(benny.rotation, 1, { y: "+="+Math.PI * 2 }));
    t4.add(TweenLite.to(benny.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t4.add(TweenLite.to(benny.position, 0.5, { x: "-=5", ease: Power2.easeIn }));








    let ted = modelsArr.duck.clone();
    ted.position.x -= 30;
    ted.position.z -= 15;
    scene.add(ted);
    
    let baseball = modelsArr.baseball.clone();
    ted.add(baseball);
    baseball.position.set(0.45,5.25,1.75);

    let t5 = new TimelineMax({ repeat: -1 });
    t5.add(TweenLite.to(ted.rotation, 1, { y: "+="+Math.PI * -2, delay: 1.0 }));
    t5.add(TweenLite.to(ted.position, 0.5, { x: "-=5", ease: Power2.easeIn }));
    t5.add(TweenLite.to(ted.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 0.8 }));
    t5.add(TweenLite.to(ted.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t5.add(TweenLite.to(ted.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t5.add(TweenLite.to(ted.rotation, 1, { y: "+="+Math.PI * 2 }));
    t5.add(TweenLite.to(ted.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t5.add(TweenLite.to(ted.position, 0.5, { x: "+=5", ease: Power2.easeIn }));
    


    let terry = modelsArr.duck.clone();
    terry.position.x -= 10;
    terry.position.z -= 15;
    scene.add(terry);

    let football = modelsArr.football.clone();
    terry.add(football);
    football.position.set(0,4.75,1.5);

    let t6 = new TimelineMax({ repeat: -1 });
    t6.add(TweenLite.to(terry.rotation, 1, { y: "+="+Math.PI * 2, delay: 1.2 }));
    t6.add(TweenLite.to(terry.position, 0.5, { x: "-=5", ease: Power2.easeIn }));
    t6.add(TweenLite.to(terry.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 0.6 }));
    t6.add(TweenLite.to(terry.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t6.add(TweenLite.to(terry.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t6.add(TweenLite.to(terry.rotation, 1, { y: "+="+Math.PI * 2 }));
    t6.add(TweenLite.to(terry.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t6.add(TweenLite.to(terry.position, 0.5, { x: "+=5", ease: Power2.easeIn }));



    let tom = modelsArr.duck.clone();
    tom.position.x += 10;
    tom.position.z -= 15;
    scene.add(tom);

    let mortar = modelsArr.mortar.clone();
    tom.add(mortar);
    mortar.position.set(0,5.35,1.25);

    let t7 = new TimelineMax({ repeat: -1 });
    t7.add(TweenLite.to(tom.rotation, 1, { y: "+="+Math.PI * -2, delay: 1.4 }));
    t7.add(TweenLite.to(tom.position, 0.5, { x: "-=5", ease: Power2.easeIn }));
    t7.add(TweenLite.to(tom.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 0.4 }));
    t7.add(TweenLite.to(tom.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t7.add(TweenLite.to(tom.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t7.add(TweenLite.to(tom.rotation, 1, { y: "+="+Math.PI * 2 }));
    t7.add(TweenLite.to(tom.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t7.add(TweenLite.to(tom.position, 0.5, { x: "+=5", ease: Power2.easeIn }));





    let taz = modelsArr.duck.clone();
    taz.position.x += 30;    
    taz.position.z -= 15;
    scene.add(taz);
    
    let shades = modelsArr.shades.clone();
    taz.add(shades);
    shades.position.set(0,5.1,2.0);

    let t8 = new TimelineMax({ repeat: -1 });
    t8.add(TweenLite.to(taz.rotation, 1, { y: "+="+Math.PI * 2, delay: 1.6 }));
    t8.add(TweenLite.to(taz.position, 0.5, { x: "-=5", ease: Power2.easeIn }));
    t8.add(TweenLite.to(taz.position, 0.5, { y: 5, ease: Power2.easeOut, delay: 0.2 }));
    t8.add(TweenLite.to(taz.position, 0.5, { y: 0, ease: Power2.easeIn }));
    t8.add(TweenLite.to(taz.position, 0.5, { z: "+=15", ease: Power2.easeIn }));
    t8.add(TweenLite.to(taz.rotation, 1, { y: "+="+Math.PI * 2 }));
    t8.add(TweenLite.to(taz.position, 0.5, { z: "-=15", ease: Power2.easeIn }));
    t8.add(TweenLite.to(taz.position, 0.5, { x: "+=5", ease: Power2.easeIn }));


});
