
    
    define([
        'three', 
        'appBase',   
        'pointerLockControls',
        'appPointerLockControls',
        'mapThree'
    ], function (THREE, app, plc, aplc, map) {
        

        //app / level / scene settings
        app.prototype.settings = function(){
            
            this.Map = new map( 2, this, 500, 400 );
            //this.Map = new map( 0, this, 500, 400 );

            this.settings = {
                
                scene: {
                   fog: {
                       //color: 0x23292B,
                       color: 0x010101,
                       near: 1500,
                       far: 2500
                   } 
                }, 
                
                lights: {
                    ambient: {
                        color:  0x111111
                    }
                }, 

                controls: {
                    speed: {
                        x: 4,
                        y: 0.5,
                        z: 10,
                        j: 10
                    }
                }            
            };
        };

        //add controls
        app.prototype.addControls = function(){
            var _this = this;
            _this.controls = new THREE.PointerLockControls( _this.camera, _this);       
            _this.controls.speedMod = this.settings.controls.speed;
            _this.pointerlockInit();
            _this.scene.add( this.controls.getObject() );
        };

        //touching the scene objects
        app.prototype.canMoveForward = function(){              
            this.controls.canMoveForward = true;
        };
      
        //load map + floor
        app.prototype.loadMap = function() {
            this.Map.loadMap();
            this.Map.loadFloor( 0x8C4D38 );
            this.Map.loadRoof( 0x704C40 );
            var flashlight = new THREE.SpotLight(0xffffff, 1.5, 1000);
            this.camera.add(flashlight);
            flashlight.position.set(0,0,1);
            flashlight.target = this.camera;
        };

        //create the game
        app.prototype.createGame = function(){
            this.settings();
            this.events();
            this.init();
            this.createRenderer();
            this.createScene( 
                this.settings.scene.fog.color,
                this.settings.scene.fog.near,
                this.settings.scene.fog.far
            );
            this.addCamera();
            this.addAmbientLight( this.settings.lights.ambient.color );
            this.loadMap();
            this.addControls();
            // this.renderer.shadowMapEnabled.enabled = true;
            // this.renderer.shadowMapSoft = true;
            var _this = this;


            // var loader = new THREE.ObjectLoader();
            // loader.load( '/assets/js/models/lamp.json', function ( object ) {
            //     object.scale.set(100,100,100)
            //     object.position.set(0,0,-100)
            //     console.log(object);
            //     _this.scene.add( object );
            // } );

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
        App = new app();
        App.createGame();
        App.animate();
        console.log(App);
    });
    
    
    
    
    

  