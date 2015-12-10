
 	
    define([
        'three', 
        'appBase',   
        'appConsole',   
        'appGui',
        'pointerLockControls',
        'appPointerLockControls',
        'mapTwo'
    ], function (THREE, app, cs, gui, plc, appPlc, map) {
    
        //        'use strict';
        //
        //        var app = app || {};
        //
        //        var App = App || {};
        
        
        //cleanup
        app.prototype.cleanup = function(){
            delete this.camera;
            delete this.renderer;
            delete this.controls;
            delete this.scene;
        };

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

            if ( this.controls ){

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
            }
        };
        
        //set start pos
        app.prototype.setStartPosition = function( m, x, z ){		
            //		var s = new THREE.Vector3( 1, 1, 1 );
            //		this.camera.position.set( s );
            //		this.startPosition = s;
            this.camera.position.y = m.wallHeight/2;
            this.camera.position.z = m.unitSize;
        };
        
        //add cube
        app.prototype.addCube = function( m, x, z, mat ){

           var box = new THREE.Mesh( m.cube, m.materials[mat] );

               box.position.x = x * m.unitSize;
               box.position.y = m.wallHeight/2;
               box.position.z = z * m.unitSize;

           this.scene.add(box);
           this.sceneObjContainer.push( box );
        };
        
        //load map
        app.prototype.loadMap = function() {


            var Map = new map(this);

            var m = Map.init();

                this.maze = m;

                this.mazeDimentions = {
                    width: 		Map.unitSize*(m.length+1),
                    depth: 		Map.unitSize*(m[0].length+0),
                    unitSize:   Map.unitSize * Map.units, 
                };

            var c = 0;

            for( var x=0; x<m.length; x++){

                for(var y=0; y<m[x].length; y++){

                    var current = m[x][y];

                    if (current) {

                        switch(current){

                            case '+':
                                this.addCube( Map, x, y, 0);
                                break;

                            case ' ':
                                if(c===0){
                                    this.setStartPosition( Map, x, y );
                                    c++;
                                }	
                                break;

                            case '-':
                                this.addCube( Map, x, y, 0);
                                break;	

                            case '|':
                                this.addCube( Map, x, y, 0);
                                break;
                        }
                    }
                }
            }
        };

        //load the world
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

            return this;
        };
        
        //animate
        app.prototype.animate = function(){

            if (typeof App.canMoveForward === 'function') { 
                App.scene.updateMatrixWorld();
                App.canMoveForward();
                App.controls.update();
                App.renderer.render( App.scene, App.camera );
                requestAnimationFrame( App.animate );
            }
        };

        //create object and run
        App = new app().loadWorld();
        App.animate();
        console.log(App);
    });
    
    
    
    
    

  