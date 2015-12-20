    
    
    'use strict';
    
    define([
        'three', 
        'appBase',   
        'particleOne',
        'stats'
    ], function (THREE, app, particleOne, stats) {
        
        console.log('---> Particles App');

        var stat = new Stats();
        stat.setMode( 0 );
        stat.domElement.style.position = 'absolute';
        stat.domElement.style.left = '0px';
        stat.domElement.style.top = '0px';
        document.body.appendChild( stat.domElement );

        var uniforms = {
            time: { type: "f", value: 1.0 },
        };

        var particleCount = 25000;

        var fragmentShader = [
            '/**',
            ' * Set the colour to a lovely pink.',
            ' * Note that the color is a 4D Float',
            ' * Vector, R,G,B and A and each part',
            ' * runs from 0.0 to 1.0',
            ' */',
            'void main() {',
            '   gl_FragColor = vec4(',
            '        255.0,  // R',
            '        255.0,  // G',
            '        255.0,  // B',
            '        1.0   // A',
            '    ); ',
            '}',
        ].join('\n');


        var vertexShader = [
            'uniform float time;',
            'void main() {',
            '   vec3 newPos = position;',
            '   newPos.x += time;',
            '   gl_PointSize = 1.00;',
            '   gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );',
            '}',
        ].join('\n');

        app.prototype.particles = function(max_particles){

            var _this = this;

            var material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader,
            });

            _this.geometry = new THREE.BufferGeometry();
            _this.particleVertices = new Float32Array( max_particles * 3 ); // position

            for (var i = 0; i<max_particles; i++){
                //position
                _this.particleVertices[i * 3 + 0] = Math.floor(Math.random() * 1001) - 500;  
                _this.particleVertices[i * 3 + 1] = Math.floor(Math.random() * 1001) - 500;  
                _this.particleVertices[i * 3 + 2] = Math.floor(Math.random() * 1001) - 500;  
            }

            _this.geometry.addAttribute('position', new THREE.BufferAttribute( _this.particleVertices, 3 ));

            _this.system = new THREE.Points(
                _this.geometry,
                material
            );

            // _this.system.sort = false;
            // _this.system.position.set(0,0,0);
            // _this.system.rotation.set(0,0,0);
            _this.scene.add(_this.system);
        };
        
        //load the world
        app.prototype.loadWorld = function(){
            $('#console, #sidebar').hide();
            this.events();
            this.init();
            this.createRenderer();
            this.createScene();
            this.addCamera();
            this.addAmbientLight();
            this.particles(particleCount);
        };
        
        //renderer
        app.prototype.render = function(){
            var _this = this;
            uniforms.time.value += 0.05;

            // for( var i = 0; i < _this.pool.length; i++ )
            // { 
            //     var dir = new THREE.Vector3(0,0,0)
            //     dir.sub( _this.pool[i].position).normalize().multiplyScalar(0.10);
            //     _this.pool[i].force = dir;
            //     _this.pool[i].velocity.add( _this.pool[i].force );
            //     _this.pool[i].position.add( _this.pool[i].velocity ); 
            // }

            // _this.geometry.verticesNeedUpdate = true;
            // _this.geometry.colorsNeedsUpdate = true; 


            // var timer = 0.0001 * Date.now();
            // this.camera.position.x = Math.cos( timer ) * 1000;
            // this.camera.position.z = Math.sin( timer ) * 1000;
            // this.camera.lookAt( this.scene.position );
        };
        
        //animate function
        app.prototype.animate = function(){
            stat.begin();
            if (typeof App.render === 'function') { 
                App.render();
                App.renderer.render( App.scene, App.camera );
                stat.end();
                requestAnimationFrame( App.animate );
            }
        };

        //create object and run
        App = new app();
        App.loadWorld();
        App.animate();
        console.log(App);
    });




    
    
  
    
    
    

    
   


    
 