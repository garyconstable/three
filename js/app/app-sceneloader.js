

'use strict';
    
var app = app || {};

var App = App || {};

/**
 * 
 * @param {type} obj
 * @param {type} name
 * @param {type} saveData
 * @returns {undefined}
 */
app.prototype.loadGeometry = function( obj, name, saveData ){
    
    switch(obj.type){
        
        case "cylinder" : 
            
            window[name] = new THREE.Mesh(
            
                    new THREE.CylinderGeometry(
                        obj.radiusTop, 
                        obj.radiusBottom, 
                        obj.height, 
                        obj.radiusSegments, 
                        obj.heightSegments, 
                        obj.openEnded), 
                    new THREE.MeshNormalMaterial() 
            );
            
            window[name].overdraw = obj.overdraw;
            
            window[name].position.x = obj.position.x;
            window[name].position.y = obj.position.y;
            window[name].position.z = obj.position.z;
            
            window[name].rotation.x = obj.rotation.x;
            window[name].rotation.y = obj.rotation.y;
            window[name].rotation.z = obj.rotation.z;
            
            window[name].scale.x = obj.scale.x;
            window[name].scale.y = obj.scale.y;
            window[name].scale.z = obj.scale.z;
            
            
            this.sceneObjects[name] = window[name];
            this.scene.add(window[name]);
            
            delete window[name];
            
            //console.log('----> Scene load: ' + name)
            
            break;
            
            
        case "BoxGeometry" : 
            
            window[name] = new THREE.Mesh(
            
                    new THREE.BoxGeometry(
                        obj.width, 
                        obj.height, 
                        obj.depth, 
                        obj.widthSegments, 
                        obj.heightSegments, 
                        obj.depthSegments), 
                    new THREE.MeshNormalMaterial() 
            );
            
            window[name].overdraw = obj.overdraw;
            
            window[name].position.x = obj.position.x;
            window[name].position.y = obj.position.y;
            window[name].position.z = obj.position.z;
            
            window[name].rotation.x = obj.rotation.x;
            window[name].rotation.y = obj.rotation.y;
            window[name].rotation.z = obj.rotation.z;
            
            window[name].scale.x = obj.scale.x;
            window[name].scale.y = obj.scale.y;
            window[name].scale.z = obj.scale.z;
            
            
            this.sceneObjects[name] = window[name];
            this.scene.add(window[name]);
            
            delete window[name];
            
            //console.log('----> Scene load: ' + name)
            
            break;
        
    }
    
    //save in local storage
    if(saveData === true){
        this.setStorageObject(obj, name);
    }
    
    //add to the object select
    this.addObjectToObjectSelect(name);
    
};

