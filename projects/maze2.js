
    
    define([
        'three', 
        'appBase',   
        'appConsole',   
        'appGui',
        'pointerLockControls',
        'appPointerLockControls',
        'mapTwo'
    ], function (THREE, app, cs, gui, plc, appPlc, map) {

        //init / setup
        app.prototype.init = function() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.player = null;
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.sceneObjContainer = [];
        };

        //create renderer
        app.prototype.createRenderer = function(){
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(this.width, this.height);
            // this.renderer.shadowMapEnabled.enabled = true;
            // this.renderer.shadowMapSoft = true;
            document.body.appendChild(this.renderer.domElement);
        };

        //create the scene
        app.prototype.createScene = function(){
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog( 0x888888, 1500, 4000 );
        }

        //add camera
        app.prototype.addCamera = function(){
            this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000000);
        };

        //ambient light
        app.prototype.addAmbientLight = function(){
            this.scene.add( new THREE.AmbientLight( 0x111111 ));
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
            _this.controls = new THREE.PointerLockControls( this.camera, _this);       
            _this.controls.speedMod = {
                x: 4,
                y: 0.5,
                z: 5,
                j: 10
            };
            _this.pointerlockInit();
            _this.scene.add( this.controls.getObject() );
            // _this.ray = new THREE.Raycaster();
            // _this.ray.ray.direction.set( 0, -1, 0 );
        };

        //touching the scene objects
        app.prototype.canMoveForward = function(){              
            this.controls.canMoveForward = true;
        };
        
        //load grid / floor
        app.prototype.loadGrid = function(){
            // var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
            //     geometry = new THREE.Geometry(),
            //     floor = -75, step = 25;
            // for ( var i = 0; i <= 40; i ++ ) {
            //     geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
            //     geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );
            //     geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
            //     geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );
            // }
            // var line = new THREE.Line( geometry, line_material, THREE.LineSegments );
            // this.scene.add( line );
        };

        //add voxel
        app.prototype.addVoxel = function(type, row, col, HORIZONTAL_UNIT, VERTICAL_UNIT, ZSIZE, XSIZE) {
            var _this = this;
            var z = (row+1) * HORIZONTAL_UNIT - ZSIZE * 0.5;
            var x = (col+1) * HORIZONTAL_UNIT - XSIZE * 0.5;
            switch(type) {
                case ' ': break;
                case 'S':
                    //spawnPoints.push(new THREE.Vector3(x, 0, z));
                    break;
                case '+':
                case '-':
                    var geo = new THREE.CubeGeometry(HORIZONTAL_UNIT,
                    VERTICAL_UNIT, HORIZONTAL_UNIT);
                    var material = new THREE.MeshPhongMaterial({
                        //color: Math.random() * 0xffffff
                        color: 0x729BA8
                    });
                    var mesh = new THREE.Mesh(geo, material);
                    mesh.position.set(x, (VERTICAL_UNIT*0.5 - 100), z);
                    _this.scene.add(mesh);
                    break;
            }
        }

        //load map
        app.prototype.loadMap = function() {
            var _this = this;
            var Map = new map(this);
            var m = Map.init();
            var newMap = [];

            for(x=0;x<m.length;x++){
                var str = "";
                for(y=0;y<m[x].length;y++){
                    str = str + m[x][y];
                }  
                newMap.push(str);
            }

            var HORIZONTAL_UNIT = 100, 
                VERTICAL_UNIT = 500, 
                ZSIZE = newMap.length * HORIZONTAL_UNIT, XSIZE = newMap[0].length * HORIZONTAL_UNIT;

            for (var i = 0, rows = newMap.length; i < rows; i++) {
                for (var j = 0, cols = newMap[i].length; j < cols; j++) {
                    _this.addVoxel(newMap[i].charAt(j), i, j, HORIZONTAL_UNIT, VERTICAL_UNIT, ZSIZE, XSIZE);
                }
            }

            var flashlight = new THREE.SpotLight(0xffffff, 1.15, 450);
            this.camera.add(flashlight);
            flashlight.position.set(0,0,1);
            flashlight.target = this.camera;
        };

        //load the world
        app.prototype.loadWorld = function(){
            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            this.addAmbientLight();
            this.loadMap();
            this.addControls();
            this.loadGrid();
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
    
    
    
    
    

  