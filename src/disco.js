
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

function init() {

    scene = new Scene();

    const planeGeo = new PlaneGeometry(100, 100);
    const planeMat = new MeshStandardMaterial({ color: 0xffffff });
    const plane = new Mesh(planeGeo, planeMat);
    plane.rotation.set(-Math.PI/2, 0, 0);
    scene.add( plane );
    
    let amblight = new AmbientLight( 0x444444 );
    scene.add( amblight );

    var light = new SpotLight( 0xff4444, 1, 250, Math.PI/16, 0.05 );
    light.position.set( 50, 100, -50 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);    
    spots.push(light);


    var light = new SpotLight( 0x44ff44, 1, 250, Math.PI/16, 0.05 );
    light.position.set( -50, 100, -50 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);    
    spots.push(light);


    var light = new SpotLight( 0x4444ff, 1, 250, Math.PI/16, 0.05 );
    light.position.set( 50, 100, 50 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 500;
    light.shadow.camera.far = 4000;
    light.shadow.camera.fov = 30;
    scene.add(light);    
    spots.push(light);



    camera = new PerspectiveCamera( 60, 800/600, 1, 5000 );
    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 50;
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
    modelsArr.bill.rotation.y += 0.01;
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

const models = [
    { id: 'bill', path: 'duck/', model: 'RubberDuck.obj', material: 'RubberDuck.mtl', scale: 1, rotation: {x:0, y:0, z:0} }
]

pl.load(models).then((result) => {

    modelsArr = {};
    result.map((r) => { modelsArr[r.id] = r.object; });

    init();
    animate();

    scene.add(modelsArr.bill);

});
