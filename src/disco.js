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

import { MTLLoader } from "./lib/MTLLoader";
import { OBJLoader2 } from "./lib/OBJLoader2";

let mtlLoader = new MTLLoader(DefaultLoadingManager);
let loader = new OBJLoader2(DefaultLoadingManager);

let bill, scene, camera, renderer;

function init() {

    scene = new Scene();

    let amblight = new AmbientLight( 0xffffff );
    scene.add( amblight );

    var light = new SpotLight( 0xffffff );
    light.position.set( 400, -400, -800 );    
    scene.add(light);

    camera = new PerspectiveCamera( 60, 800/600, 1, 5000 );
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;
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
    renderer.render( scene, camera );    
    requestAnimationFrame( animate );
}

function loadModel(model) {
    
        return new Promise((resolve, reject) => {
            mtlLoader.setPath(model.path);
            mtlLoader.load(model.material, function(materials) {
                materials.preload();
                loader.setMaterials(materials.materials);
                loader.setPath(model.path);
                loader.load(model.model, (obj) => {
                    obj.scale.set(model.scale, model.scale, model.scale);
                    obj.rotation.set(model.rotation.x, model.rotation.y, model.rotation.z);
                    resolve({ id: model.id, object: obj });
                }, (xhr) => {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                }, (error) => {
                    console.log( 'An error happened', error );
                    reject();
                });
            });
        });
    
    }
    
    const models = [
        { id: 'bill', path: 'duck/', model: 'RubberDuck.obj', material: 'RubberDuck.mtl', scale: 1, rotation: {x:0, y:0, z:0} }
    ]
    
    //need to understand this better
    const concat = list => Array.prototype.concat.bind(list);
    const promiseConcat = f => x => f().then(concat(x));
    const promiseReduce = (acc, x) => acc.then(promiseConcat(x));
    const serial = funcs => funcs.reduce(promiseReduce, Promise.resolve([]));
    const funcs = models.map(model => () => loadModel(model));
    
    serial(funcs).then((result) => {
    
        bill = result[0].object;
        
        init();
        animate();

        scene.add(bill);

    });
    