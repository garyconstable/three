
'use strict';

function isFloat(n) {
    return n === +n && n !== (n|0);
}

var app = app || {};
var App = App || {};

var mouseVector = new THREE.Vector3();
var onMouseMove = function(evt){
  var x = ( event.clientX / window.innerWidth ) * 2 - 1;
  var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  var z = 0.5;
  y = y * 1000;
  x = x * 1000;
  mouseVector = new THREE.Vector3(x,y,z);
};
document.addEventListener( 'mousemove', onMouseMove, false );

//init / setup
app.prototype.init = function()
{
    this.app_name = "Partcles";
    //this.config_file = "/projects/grid/json/config.json";
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.sceneObjects = {};
};

app.prototype.cleanup = function()
{
    delete this.camera;
    delete this.renderer;
    delete this.controls;
    delete this.scene;
};

//create renderer
app.prototype.createRenderer = function()
{
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.width, this.height);
    document.body.appendChild(this.renderer.domElement);
};

//create the scene
app.prototype.createScene = function()
{
    this.scene = new THREE.Scene();
};

//add camera
app.prototype.addCamera = function()
{
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
    this.camera.position.set( 0, 200, 800 );
};

//ambient light
app.prototype.addAmbientLight = function()
{
    this.scene.add( new THREE.AmbientLight( 0x111111 ) );
};

//dom events
app.prototype.events = function()
{
  window.onresize = function(event) {
    App.width = window.innerWidth;
    App.height = window.innerHeight;
    App.renderer.setSize(App.width, App.height);
    App.camera.aspect = App.width / App.height;
    App.camera.updateProjectionMatrix();
  };
};

/**
* load a floor grid
* ==
*/
app.prototype.loadGrid = function()
{
    var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
        geometry = new THREE.Geometry(),
        floor = -75, step = 25;

    for ( var i = 0; i <= 40; i ++ ) {
        geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
        geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );
    }
    var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
    this.scene.add( line );
};

app.prototype.particles = function(max_particles)
{
    var _this = this;
    var material = new THREE.PointCloudMaterial({
       color: 0xffffff,
       //map: THREE.ImageUtils.loadTexture('filename.png'),
       size: 4,
       blending: THREE.AdditiveBlending,
       depthTest: false,
       transparent: true,
       vertexColors: true,
       sizeAttenuation: true
    });

    _this.pool = [];
    _this.geometry = new THREE.Geometry();
    _this.geometry.dynamic = true;

    for (var i = 0; i<max_particles; i++)
    {
        var p = new particle();
        _this.pool.push(p);
        _this.geometry.vertices.push(p.position)
        _this.geometry.colors.push(p.color)
    }

    _this.system = new THREE.PointCloud(
        _this.geometry,
        material
    );

    _this.system.sort = false;
    _this.system.position.set(0,0,0);
    _this.system.rotation.set(0,0,0);
    _this.scene.add(_this.system);
};

/**
* load the world ...
* ==
*/
app.prototype.loadWorld = function()
{
    var _this = this;
    //defaults
    this.events();
    this.init();
    this.createRenderer();
    this.createScene();
    this.addCamera();
    this.addAmbientLight();
    //app specific
    this.loadGrid();
    this.particles(500);

    // var timer = 0.0001 * Date.now();
    // this.camera.position.x = Math.cos( timer ) * 1000;
    // this.camera.position.z = Math.sin( timer ) * 1000;
    // this.camera.lookAt( this.scene.position );

    return this;
};


app.prototype.render = function(mousePos)
{
    var _this = this;
    var dir = new THREE.Vector3();

    //move the particles
    for( var i = 0; i < _this.pool.length; i++ )
    {
        dir.sub( _this.pool[i].position).normalize().multiplyScalar(0.4);

        //acceleration
        _this.pool[i].force = dir;

        //velocity
        _this.pool[i].velocity.add( _this.pool[i].force );

        //position
        _this.pool[i].position.add( _this.pool[i].velocity );

        /*
        dir.sub( _this.pool[i].position ).normalize()//.multiply(0.1);
        _this.pool[i].force = dir;
        _this.pool[i].velocity.add( _this.pool[i].force );
        _this.pool[i].position.add( _this.pool[i].velocity);
        */
    }

    _this.system.position.x = mousePos.x;
    _this.system.position.z = mousePos.y;

    _this.geometry.verticesNeedUpdate = true;
    _this.geometry.colorsNeedsUpdate = true;

    var timer = 0.0001 * Date.now();
    this.camera.position.x = Math.cos( timer ) * 1000;
    this.camera.position.z = Math.sin( timer ) * 1000;
    this.camera.lookAt( this.scene.position );
};


app.prototype.animate = function()
{
  var _this = this;

  // var vector = mouseVector;
  // vector.unproject( App.camera );
  // var dir = vector.sub( App.camera.position ).normalize();
  // var distance = - App.camera.position.z / dir.z;
  // var mousePos = App.camera.position.clone().add( dir.multiplyScalar( distance ) );

  var mousePos = mouseVector;
  if (typeof App.render == 'function') {
    App.render( mousePos );
    App.renderer.render( App.scene, App.camera );
    requestAnimationFrame( App.animate );
  }
};

//create object and run
App = new app().loadWorld();
App.animate();
console.log(App);
