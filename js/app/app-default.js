

    'use strict';

    var app = app || {};

	var App = App || {};


    //init / setup
    app.prototype.init = function() {

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

    //create renderer
    app.prototype.createRenderer = function(){
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
        document.body.appendChild(this.renderer.domElement);
    };

    //create the scene
    app.prototype.createScene = function(){
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0x000000, 1500, 4000 );
    }

    //add camera
    app.prototype.addCamera = function(){
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000000);
    };

    //ambient light
    app.prototype.addAmbientLight = function(){
        var ambientLight = new THREE.AmbientLight();
        this.scene.add(ambientLight);
    }

    //dom events
    app.prototype.events = function(){
        window.onresize = function(event) {
            App.width = window.innerWidth;
            App.height = window.innerHeight;
            App.renderer.setSize(App.width, App.height);
            App.camera.aspect = App.width / App.height;
            App.camera.updateProjectionMatrix();
        };
    };

    //add controls
    app.prototype.addControls = function(){

        var _this = this;

        _this.controls = new THREE.PointerLockControls(this.camera, _this);
        _this.player = new player(this);
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

    //add a floor
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

    //sky box
    app.prototype.addSkybox = function(){

        // create the geometry sphere
        var geometry  = new THREE.SphereGeometry( (500*10), 100, 100)

        var texture = THREE.ImageUtils.loadTexture('/img/starfield.jpg');
            texture.wrapS = THREE.RepeatWrapping;

        var material  = new THREE.MeshLambertMaterial({
          map: texture,
          side: THREE.BackSide,
        });

        var skybox = new THREE.Mesh(geometry, material);
        this.scene.add( skybox );
        this.sceneObjContainer.push( skybox );
    };

    //touching the scene objects
    app.prototype.canMoveForward = function(){

        var _this = this,
            _playerWidth = 300;

        this.controls.canMoveForward = true;
        this.ray.ray.origin.copy( this.controls.getObject().position );

        var intersections = this.ray.intersectObjects( this.sceneObjContainer, true );

        if ( intersections.length > 0 ) {

            var distance = intersections[ 0 ].distance;

            if ( distance > - _playerWidth && distance < _playerWidth ) {
            	_this.controls.canMoveForward = false;
            }
        }
    };

    /**
     * load the world ...
     * @returns {app.prototype}
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
        //this.addFloor();
        this.addSkybox()

        return this;
    };




    //annim loop
    var animate = function(){
        App.scene.updateMatrixWorld();
        App.canMoveForward();
        App.controls.update();
        App.renderer.render( App.scene, App.camera );
        requestAnimationFrame( animate );
    };

    //create object and run
    App = new app().loadWorld();

    //A info - world / app obj
    console.log(App);

    //render loop
    animate();
