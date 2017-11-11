
import { DefaultLoadingManager } from '../../node_modules/three/src/loaders/LoadingManager';

import { MTLLoader } from "./MTLLoader";
import { OBJLoader2 } from "./OBJLoader2";

let mtlLoader = new MTLLoader(DefaultLoadingManager);
let loader = new OBJLoader2(DefaultLoadingManager);

export default class polyLoader {

    loadModel(model) {
    
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

    load(models) {

        const concat = list => Array.prototype.concat.bind(list);
        const promiseConcat = f => x => f().then(concat(x));
        const promiseReduce = (acc, x) => acc.then(promiseConcat(x));
        const serial = funcs => funcs.reduce(promiseReduce, Promise.resolve([]));
        const funcs = models.map(model => () => this.loadModel(model));

        return serial(funcs);
        
    }

}
