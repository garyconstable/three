    
    
    'use strict';
    
  
    define([
        'three', 
        'appBase',   
        'appConsole',   
        'appGui',
        'appStorage',
        'appSceneLoader',
        'appFunction'
    ], function (THREE, app, cs, gui, storage, sceneloader, functions) {
        
        //    'use strict';
        //    
        //    var app = app || {};
        //    
        //	var App = App || {};
        
        //    var app = function(){
        //
        //        try {
        //            //add the change events for GUI elemenets (sliders etc..)
        //            this.bindings();
        //
        //            //delet ethe existong screne and camer etc.. start new objects
        //            this.cleanup();
        //        }
        //        catch(err) {
        //            console.log(err)
        //        }
        //
        //        this.version = 1;  
        //        return this;  
        //    };
        //
        //    var App = App || {};
        
        
        //init / setup
        app.prototype.init = function() {
            this.app_name = "Grid";  
            this.config_file = "/projects/json/grid-config.json";  
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
        
        //floor / grid
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
    
            var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
            this.scene.add( line );
        };
    
        //load world
        app.prototype.loadWorld = function(){
            
            //defaults
            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            this.addAmbientLight();
            
            //app specific
            this.loadGrid();
            
            //load scene objects from storage
            this.loadSceneObjectsFromStorage();
    
            //return
            return this;
        };
        
        //render
        app.prototype.render = function(){ 
            var timer = 0.0001 * Date.now();
            this.camera.position.x = Math.cos( timer ) * 1000;
            this.camera.position.z = Math.sin( timer ) * 1000;
            this.camera.lookAt( this.scene.position );
        };
       
        //animate 
        app.prototype.animate = function(){
            var _this = this;
            if (typeof App.render === 'function') { 
                App.render();
                App.renderer.render( App.scene, App.camera );
                requestAnimationFrame( App.animate );
            }
        };
    
        //create object and run
        App = new app().loadWorld();
        App.animate();
    
        //A info - world / app obj
        console.log(App);     
    
    });