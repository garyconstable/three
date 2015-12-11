    
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
            this.sceneObjects.centerPoint.rotation.z += 0.01;
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
        
        
        

        //load the world
        app.prototype.loadObjects = function(){    

            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            //this.addAmbientLight();
            this.loadGrid();
            this.addControls();
            this.sceneObjects = {};

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
            
            
            
            
            var phongVertex = [
                "varying vec3 vector_Normal;",
                'attribute vec3 position;',
                'uniform projectionMatrix;',
                'uniform modelviewMatrix;',
                "void main()",
                "{",
                    "gl_Position = projectionMatrix * modelviewMatrix * vec4(position, 1.0);",
                    "gl_TexCoord[0] = gl_MultiTexCoord0;",
                    "vector_Normal = gl_NormalMatrix * gl_Normal;",
                "}",
            ].join('\n');
            
            
            var phongFragment = [
                 " varying vec3 vector_Normal;",
                 " uniform vec3 color;",
                 " uniform sampler2D tex;",
                 " void main()",
                 " { ",
                     " vec3 c = texture2D(tex,gl_TexCoord[0].st).rgb;",
                     " vec3 N = normalize(vector_Normal); ",
                     " vec3 L = normalize(gl_LightSource[0].position.xyz); ",
                     " vec3 H = normalize(gl_LightSource[0].halfVector.xyz); ",
                     " vec3 ambient =  gl_FrontMaterial.ambient * gl_LightSource[0].ambient;",
                     " vec3 diffuse =  max(dot(L, N), 0.0) *  gl_FrontMaterial.diffuse * gl_LightSource[0].diffuse;",
                     " vec3 specular = vec3(1.0, 1.0, 1.0) * pow(max(dot(H, N), 0.0), 16.0) * gl_LightSource[0].specular * gl_FrontMaterial.specular * gl_FrontMaterial.shininess;",
                     " gl_FragColor = vec4(ambient + diffuse + specular, 1.0); ",
                "}",
             ].join('\n');
            
            
            //set the caler 100 back from zeo
            this.camera.position.set( 0, 0, 100 );
            
            
            //center obj
            this.sceneObjects.centerPoint = new THREE.Object3D();
            this.scene.add(this.sceneObjects.centerPoint);
            
            
            //planet
            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            var shaderMaterial = new THREE.ShaderMaterial({
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader
            });
            var sphere = new THREE.Mesh( geometry, shaderMaterial );
            sphere.position.x = 0;
            sphere.position.y = 0;
            sphere.position.z = 0;
            this.scene.add(sphere);
            
            
            //satellite
            var shaderMaterial = new THREE.ShaderMaterial({
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader
                //vertexShader:   phongVertex,
                //fragmentShader: phongFragment
            });
            var geometry = new THREE.SphereGeometry( 3, 16, 16 );
            //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var satellite = new THREE.Mesh( geometry,  shaderMaterial );
            satellite.position.x = 20;
            satellite.position.y = 20;
            satellite.position.z = 0;
            this.sceneObjects.centerPoint.add( satellite ); 
            
            
            // add the pointlight
            var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
            pointLight.position.set( -20, -20, 0 );
            this.sceneObjects.centerPoint.add( pointLight );

            var sphereSize = 1;
            var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
            this.sceneObjects.centerPoint.add( pointLightHelper );
            
            
            
           
            
            
            
           
        };
        
        //create object and run
        App = new app();
        App.loadObjects();
        App.animate();
        console.log(App);
        
        
    });




    
    
  
    
    
    

    
   


    
 