    
    
    'use strict';
    
    define([
        'three', 
        'appBase'
    ], function (THREE, app) {
        
        $('#console, #sidebar').hide();
        
        //		var vertexShader  = "";
        //            vertexShader += "void main() "
        //            vertexShader += "{ ";
        //			vertexShader += "gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); ";
        //            vertexShader += " } ";

        var vertexShader = "varying vec3 vNormal; void main() { vNormal = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
        
        //        var fragmentShader = "";
        //            fragmentShader += "void main() ";
        //            fragmentShader += "{ ";
        //            fragmentShader += "gl_FragColor 	= vec4(1.0,0.0,1.0,1.0); ";
        //            fragmentShader += "} ";        
        
        
        var fragmentShader =" varying vec3 vNormal; void main() { vec3 light = vec3(0.5, 0.2, 1.0); light = normalize(light); float dProd = max(0.0, dot(vNormal, light));gl_FragColor = vec4(dProd,dProd,dProd, 1.0); } ";
    
        
        //init / setup
        app.prototype.init = function() {
            this.app_name = "Shader 0001";  
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.VIEW_ANGLE = 45,
            this.ASPECT = this.width / this.height,
            this.NEAR = 0.1,
            this.FAR = 10000;
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.sceneObjects = {};
        };
        
        app.prototype.bindings = function(){};
        
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
            this.camera.position.set( 0, 200, 200 );
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

        //load the world
        app.prototype.loadWorld = function()
        {   
            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            return this;
        }
        
        
        
        
        
        
        
        
        
        
        
        app.prototype.addObject = function()
        {
            // create the sphere's material
            var shaderMaterial = new THREE.ShaderMaterial({
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader
            });
            
            // set up the sphere vars
            //var shaderMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            
            //create sphere
            var sphere = new THREE.Mesh( 
                    new THREE.SphereGeometry(10, 32, 32),
                    shaderMaterial
            );
    
            //add sphere
            this.scene.add(sphere);
            
            //camera position
            this.camera.position.set( 0, 0, 60 );
            
            //add amb light
            this.scene.add( new THREE.AmbientLight( 0x111111 ) );
            
            
            //render
            this.renderer.render(this.scene, this.camera);
        };
        
        
        
        
        //create object and run
        App = new app().loadWorld();
        App.addObject();
        console.log(App);
    });




    
    
  
    
    
    

    
   


    
 