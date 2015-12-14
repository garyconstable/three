    
    //this is cool"
    //http://jsfiddle.net/zyAzg/
    
    'use strict';
    
    define([
        'three', 
        'appBase',   
        'orbitControls',
    ], function (THREE, app ) {

        //init / setup
        app.prototype.init = function() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.sceneObjects = {};
        };
        
        //cleanup
        app.prototype.cleanup = function(){
            delete this.camera;
            delete this.renderer;
            delete this.controls;
            delete this.scene;
        };
        
        //create renderer
        app.prototype.createRenderer = function(){  
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize(this.width, this.height);
            document.body.appendChild(this.renderer.domElement);
        };
        
        //create the scene
        app.prototype.createScene = function(){
            this.scene = new THREE.Scene();
        };

        //add camera
        app.prototype.addCamera = function(){  
            this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
            this.camera.position.set( 0, 200, 800 );
        };

        //ambient light
        app.prototype.addAmbientLight = function(){
            this.scene.add( new THREE.AmbientLight( 0x111111 ) );
        };

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
        
        //load grid / floor
        app.prototype.loadGrid = function(){
            var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
                geometry = new THREE.Geometry(),
                floor = -75, step = 25;
            for ( var i = 0; i <= 40; i ++ ) {
                geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
                geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );
                geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
                geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );
            }
            var line = new THREE.Line( geometry, line_material, THREE.LineSegments );
            this.scene.add( line );
        };
        
        // add orbit controls to screen
        app.prototype.addControls = function(){
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.25;
            this.controls.enableZoom = false;
        }

        //renderer
        app.prototype.render = function(){ 
            //this.sceneObjects.centerPoint.rotation.z += 0.01;
            this.controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
            this.renderer.render( this.scene, this.camera ); 
        };

        //animate function
        app.prototype.animate = function(){
            if (typeof App.render === 'function') { 
                App.render();
                App.renderer.render( App.scene, App.camera );
                requestAnimationFrame( App.animate );
            }
        };
        
        
        app.prototype.addVoxel = function(type, row, col, HORIZONTAL_UNIT, VERTICAL_UNIT, ZSIZE, XSIZE) {
            var _this = this;
            var z = (row+1) * HORIZONTAL_UNIT - ZSIZE * 0.5;
            var x = (col+1) * HORIZONTAL_UNIT - XSIZE * 0.5;
            switch(type) {
                case ' ': break;
                case 'S':
                    //spawnPoints.push(new THREE.Vector3(x, 0, z));
                    break;
                case 'X':
                    var geo = new THREE.CubeGeometry(HORIZONTAL_UNIT,
                    VERTICAL_UNIT, HORIZONTAL_UNIT);
                    var material = new THREE.MeshPhongMaterial({
                        color: Math.random() * 0xffffff
                    });
                    var mesh = new THREE.Mesh(geo, material);
                    mesh.position.set(x, VERTICAL_UNIT*0.5, z);
                    _this.scene.add(mesh);
                    break;
            }
        }
        

        //load the world
        app.prototype.loadObjects = function(){    

            var _this = this;

            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            this.addAmbientLight();
            this.loadGrid();
            this.addControls();
            this.sceneObjects = {};

            //hide gui parts
            $('#sidebar, #console').hide();

            var map =   "XXXXXXX  \n" +
                        "X  X     \n" +

                        "X  S  X \n" +
                        "X  X  \n" +
                        "X  S  XXX\n" +
                        "XXX X\n" +
                        " XX S X\n" +
                        " X X\n" +
                        " XXXXXX";
                map = map.split("\n");

                console.log(map)
                
            var HORIZONTAL_UNIT = 100, 
                VERTICAL_UNIT = 500, 
                ZSIZE = map.length * HORIZONTAL_UNIT, XSIZE = map[0].length * HORIZONTAL_UNIT;
            
            for (var i = 0, rows = map.length; i < rows; i++) {
                for (var j = 0, cols = map[i].length; j < cols; j++) {
                    _this.addVoxel(map[i].charAt(j), i, j, HORIZONTAL_UNIT, VERTICAL_UNIT, ZSIZE, XSIZE);
                }
            }

            var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
            pointLight.position.set( 10, 10, 10 );
            this.scene.add( pointLight );

            var sphereSize = 1;
            var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
            this.scene.add( pointLightHelper );
           
        };
        
        //create object and run
        App = new app();
        App.loadObjects();
        App.animate();
        console.log(App);
        
        
    });




    
    
  
    
    
    

    
   


    
 