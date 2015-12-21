    
    
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

        var start = Date.now();

        var uniforms = {
            time: { type: "f", value: 1.0 },
        };

        var particleCount = 25000;

        var fragmentShader = [
            'void main() {',
            '   gl_FragColor = vec4(',
            '        255.0,  // R',
            '        255.0,  // G',
            '        255.0,  // B',
            '        1.0     // A',
            '    ); ',
            '}',
        ].join('\n');

        /*
        //direction is the mouse pos
        var dir = mousePos;

        //var dir =  new THREE.Vector3(500, 500, 0);   

        dir.sub( _this.pool[i].position).normalize().multiplyScalar(0.10);

        //acceleration
        _this.pool[i].force = dir;

        //velocity
        _this.pool[i].velocity.add( _this.pool[i].force );

        //position
        _this.pool[i].position.add( _this.pool[i].velocity ); 
        */

        var vertexShader = [
            'attribute vec3 velocity;',
            'uniform float time;',
            'void main() {',

            '   vec3 location = ( position.xyz + velocity ) + time;',

            '   gl_PointSize = 1.00;',
            '   gl_Position = projectionMatrix * modelViewMatrix * vec4( location, 1.0 );',
            '}',
        ].join('\n');

        app.prototype.particles = function(max_particles){

            //self
            var _this = this;

            //material
            var material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader:   vertexShader,
                fragmentShader: fragmentShader,
            });

            //geom
            _this.geometry = new THREE.BufferGeometry();

            //position
            _this.particleVertices = new Float32Array( max_particles * 3 ); // position

            //velocity
            _this.velocity = new Float32Array( max_particles * 3 ); // position

            for (var i = 0; i<max_particles; i++){

                //position
                _this.particleVertices[i * 3 + 0] = Math.floor(Math.random() * 1001) - 500;  
                _this.particleVertices[i * 3 + 1] = Math.floor(Math.random() * 1001) - 500;  
                _this.particleVertices[i * 3 + 2] = Math.floor(Math.random() * 1001) - 500; 

                //velocity
                _this.velocity[i * 3 + 0] = 0.001;  
                _this.velocity[i * 3 + 1] = 0.001;  
                _this.velocity[i * 3 + 2] = 0;   
            }

            //position
            _this.geometry.addAttribute('position', new THREE.BufferAttribute( _this.particleVertices, 3 ));

            //velocity
            _this.geometry.addAttribute('velocity', new THREE.BufferAttribute( _this.velocity, 3 ));

            //point system
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
            var t  = 0.0020 * ( Date.now() - start );
            uniforms.time.value = t;
            //console.log(t)  

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




    
    
  
    
    
    

    
   


    
 