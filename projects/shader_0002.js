    
    //this is cool"
    //http://jsfiddle.net/zyAzg/
    
    
    'use strict';
    
    define([
        'three', 
        'appBase',   
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

            var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
            this.scene.add( line );
        };
        
        
        //load the world
        app.prototype.loadWorld = function(){
            
            
            //defaults
            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            this.addAmbientLight();
            this.loadGrid();
            
            //hide gui parts
            $('#sidebar, #console').hide();
             
            //create basic vertex shader
            var vertexShader = [
                '// create a shared variable for the',
                '// VS and FS containing the normal',
                'varying vec3 vNormal;',
                'void main() {',
                '// set the vNormal value with',
                '// the attribute value passed',
                '// in by Three.js',
                'vNormal = normal;',
                'gl_Position = projectionMatrix *',
                'modelViewMatrix *',
                'vec4(position, 1.0);',
                '}',
            ].join('\n');
            
             //create  basic fragment shader
            var fragmentShader = [
                '// same name and type as VS',
                'varying vec3 vNormal;',
                'void main() {',
                '   // calc the dot product and clamp',
                '   // 0 -> 1 rather than -1 -> 1',
                '   vec3 light = vec3(0.5, 0.2, 1.0);',
                '   // ensure its normalized',
                '   light = normalize(light);',
                '   // calculate the dot product of',
                '   // the light to the vertex normal',
                '   float dProd = max(0.0,',
                '   dot(vNormal, light));',
                '   // feed into our frag colour',
                '   gl_FragColor = vec4(',
                '       dProd, // R',
                '       dProd, // G',
                '       dProd, // B',
                '       1.0);  // A',
                '}',
            ].join('\n');
            
            
            //set the caler 100 back from zeo
            this.camera.position.set( 0, 0, 100 );
            
            //create the spehere
            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            
            //create a basic material
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            
            //create the shader materal
            var shaderMaterial = new THREE.ShaderMaterial({
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader
            });
            
            //create the sphere from the geometry and the material
            var sphere = new THREE.Mesh( geometry, shaderMaterial );
            
            //set the psoition of the sphere, in the center
            sphere.position.x = 0;
            sphere.position.y = 0;
            sphere.position.z = 0;
            
            //add the sphere to the scene
            this.scene.add( sphere );    
            
            //render the scene.
            this.renderer.render( this.scene, this.camera );       
        };
        
        
        
        
        
        
        
        
        
        
        
        
        
        
       
        
        
        
        

        //create object and run
        App = new app();
        App.loadWorld();
        console.log(App);
    });




    
    
  
    
    
    

    
   


    
 