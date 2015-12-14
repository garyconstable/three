    
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
        
        
        

        //load the world
        app.prototype.loadObjects = function(){    

            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
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
            
            
            
            
          
            
            
            
            var blinn_phong_vs = [
                "attribute vec3 aVertexPosition;",
                "attribute vec3 aVertexNormal;",
                "uniform mat4 mVMatrix;",
                "uniform mat4 pMatrix;",
                "uniform mat4 nMatrix;",
                "varying vec3 transformedNormal;",
                "varying vec3 vertexPos;",
                "void main(void) {",
                "    vec4 vertexPos4 =  mVMatrix * vec4(aVertexPosition, 1.0);",
                "    vertexPos = vertexPos4.xyz;",
                "    transformedNormal = vec3(nMatrix * vec4(aVertexNormal,1.0));",
                "    gl_Position= pMatrix *vertexPos4;",
                "}",
            ].join("\n");


            var blinn_phong_fs = [
                "precision mediump float;",
                "varying vec3 transformedNormal;",
                "varying vec3 vertexPos;",
                "uniform vec3 uAmbientColor;",
                "uniform vec3 uLightingPosition;",
                "uniform vec3 uDirectionalColor;",
                "uniform vec3 uSpecularColor;",
                "uniform vec3 materialDiffuseColor;",
                "uniform vec3 materialAmbientColor;",
                "uniform vec3 materialSpecularColor;",
                "void main(void)  {",
                "    vec3 normal=normalize(transformedNormal);",
                "    vec3 eyeVector=normalize(-vertexPos);",
                "    vec3 lightDirection = normalize(uLightingPosition);",
                "    float specular = 0.0;",
                "    float directionalLightWeighting = max(dot(normal, - lightDirection), 0.0);",
                "    if(directionalLightWeighting>0.0)",
                "    {",
                "        vec3 halfDir = normalize(-lightDirection + eyeVector);",
                "        float specAngle = max(dot(halfDir, normal), 0.0);",
                "        specular = pow(specAngle, 4.0);",
                "    }",
                "    vec3 iColor = uAmbientColor*materialAmbientColor+",
                "    uDirectionalColor *materialDiffuseColor *",
                "    directionalLightWeighting+uSpecularColor*",
                "    materialSpecularColor*specular;",
                "    gl_FragColor = vec4(iColor, 1.0);",
                "}",
            ].join("\n");


            

            
            //set the caler 100 back from zeo
            this.camera.position.set( 0, 0, 100 );
            
            
            //center obj
            this.sceneObjects.centerPoint = new THREE.Object3D();
            this.scene.add(this.sceneObjects.centerPoint);
            
            
            //planet
            var geometry = new THREE.SphereGeometry( 5, 32, 32 );
            var shaderMaterial = new THREE.ShaderMaterial({
                vertexShader:   blinn_phong_vs,
                fragmentShader: blinn_phong_fs
            });


            var material = new THREE.RawShaderMaterial({
                // uniforms: {
                //     time: { type: "f", value: 1.0 }
                // },
                vertexShader: blinn_phong_vs,
                fragmentShader: blinn_phong_fs,
                side: THREE.DoubleSide,
                transparent: true
            });



            var sphere = new THREE.Mesh( geometry, material );
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
            var satellite = new THREE.Mesh( geometry,  shaderMaterial );
            satellite.position.x = 20;
            satellite.position.y = 20;
            satellite.position.z = 0;
            this.sceneObjects.centerPoint.add( satellite ); 
            
            
        





        


           

            
            
            
           
        };
        
        //create object and run
        App = new app();
        App.loadObjects();
        App.animate();
        console.log(App);
        
        
    });




    
    
  
    
    
    

    
   


    
 