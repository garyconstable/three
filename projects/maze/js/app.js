
'use strict';

var app = app || {};
var App = App || {};

/**
* Delete existing instances - cleanup
* ==
*/
app.prototype.cleanup = function(){
    delete this.camera;
    delete this.renderer;
    delete this.controls;
    delete this.scene;
};
/**
* init
* ==
*/
app.prototype.init = function()
{
    //scene must haves
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.player = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    //containers
    this.sceneObjContainer = [];
};
/**
* Add the renderer
* ==
*/
app.prototype.createRenderer = function(){
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
    document.body.appendChild(this.renderer.domElement);
};
/**
* Create the scene
* ==
*/
app.prototype.createScene = function(){
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog( 0x000000, 1500, 4000 );
}
/**
* Add a camera
* ==
*/
app.prototype.addCamera = function(){
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000000);

    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x544660} );
    this.sphere = new THREE.Mesh( geometry, material );
    this.scene.add( this.sphere );
    this.camera.add( this.sphere );
    this.sphere.position.set(0,0,-100);

    console.log( this.sphere.geometry )

    geometry = new THREE.SphereGeometry( 5, 32, 32 );
    material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
    this.marker = new THREE.Mesh( geometry, material );
    this.scene.add( this.marker );
};
/**
* Ambient world light
* ==
*/
app.prototype.addAmbientLight = function(){
    var ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);
}
/**
* Dom events
* ==
*/
app.prototype.events = function(){
    window.onresize = function(event) {
        App.width = window.innerWidth;
        App.height = window.innerHeight;
        App.renderer.setSize(App.width, App.height);
        App.camera.aspect = App.width / App.height;
        App.camera.updateProjectionMatrix();
    };
};
/**
* Add some controls
* ==
*/
app.prototype.addControls = function(){

    var _this = this;

    _this.controls = new THREE.PointerLockControls(this.camera, _this);
    //_this.player = new player(this);
    _this.controls.speedMod = {
        x: 8,
        y: 1,
        z: 35,
        j: 10
    };
    _this.pointerlockInit();
    _this.scene.add( this.controls.getObject() );
    _this.ray = new THREE.Raycaster();
    _this.ray.ray.direction.set( 0, -1, 0 );
};
/**
* Add the floor
* ==
*/
app.prototype.addFloor = function(){

    var segments = 1,
        repeat = 200;

    var texture = THREE.ImageUtils.loadTexture('/img/floor_tile_001.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( repeat, repeat );

    var geometry = new THREE.PlaneGeometry(
        this.mazeDimentions.width - this.mazeDimentions.unitSize,
        this.mazeDimentions.depth,
        segments,
        segments
    );

    var material = new THREE.MeshLambertMaterial({
      map: texture,
    });

    var floorObj = new THREE.Mesh(geometry, material);

    floorObj.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    floorObj.receiveShadow = true;
    floorObj.position.set(
        (this.mazeDimentions.width / 2 )-this.mazeDimentions.unitSize,
        0,
        (this.mazeDimentions.depth / 2 )-(this.mazeDimentions.unitSize/2)
    );

    this.scene.add( floorObj );
};
/**
* Add a skybox
* ==
*/
app.prototype.addSkybox = function()
{
    var geometry  = new THREE.SphereGeometry( (500*10), 100, 100)
    var texture = THREE.ImageUtils.loadTexture('/img/starfield.jpg');
        texture.wrapS = THREE.RepeatWrapping;
    var material  = new THREE.MeshLambertMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    var skybox = new THREE.Mesh(geometry, material);
    this.scene.add( skybox );
    //this.sceneObjContainer.push( skybox );
};
/**
* Can we move forwards - are we touching the maze ?
* ==
*/
app.prototype.canMoveForward = function(){

    if ( this.controls )
    {
        var _this = this,
            _playerWidth = 300;

        this.controls.canMoveForward = true;

        var originPoint = this.sphere.position.clone();

        var found = false;

    	for (var vertexIndex = 0; vertexIndex <  this.sphere.geometry.vertices.length; vertexIndex++ )
    	{
    		var localVertex = this.sphere.geometry.vertices[vertexIndex].clone();
    		var globalVertex = localVertex.applyMatrix4( this.sphere.matrix );
            var directionVector = globalVertex.sub( this.sphere.position );
    		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
    		var collisionResults = ray.intersectObjects( this.sceneObjContainer );

        	if ( collisionResults.length > 0  && !found ){
                console.log( collisionResults[0].distance, directionVector.length()  )
                this.marker.position.set(collisionResults[0].point.x,collisionResults[0].point.y, collisionResults[0].point.z);
                found = true;
            }

    		// if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
            //     console.log( collisionResults )
            //
            // }
    	}



        /*
        //  this.ray.setFromCamera(  this.controls.getObject().position, this.camera );

        this.ray.setFromCamera(  new THREE.Vector3(0,0,0) , this.camera );

        var intersections = this.ray.intersectObjects( this.sceneObjContainer );

        if ( intersections.length > 0 )
        {
            console.log(intersections);

            var distance = intersections[ 0 ].distance;
            console.log( intersections.length, distance );

            this.marker.position.set(intersections[0].point.x,intersections[0].point.y, intersections[0].point.z);
        }
        //_this.controls.canMoveForward = false;
        */
    }
};
/**
* load the world ...
* ==
*/
app.prototype.loadWorld = function(){

    //must haves
    this.events();
    this.init();
    this.createRenderer();
    this.createScene();
    this.addCamera();

    //load the world map
    this.loadMap();

    //scene objects
    this.addAmbientLight();
    this.addControls();

    //add the terain
    this.addFloor();
    return this;
};
/**
 * Animate
 * ==
 */
app.prototype.animate = function(){
    if (typeof App.canMoveForward === 'function') {
        App.scene.updateMatrixWorld();
        App.canMoveForward();
        App.controls.update();
        App.renderer.render( App.scene, App.camera );
        requestAnimationFrame( App.animate );
    }
};
/**
 * Instanciate
 * ==
 */
App = new app().loadWorld();
App.animate();
console.log(App);
