
    'use strict';

    define([
        'three'
    ], function (THREE) {
        
        console.log('---> AppFunctions');
        
        var f = {
            
            mousePosition3D: function(xPos, yPos, zPos, app)
            {
                var vector = new THREE.Vector3();
                vector.set(
                    ( xPos / yPos ) * 2 - 1,
                    - ( yPos / app.renderer.context.drawingBufferHeight ) * 2 + 1,
                    0.5 
                );
                vector.unproject( app.camera );
                var dir = vector.sub( app.camera.position ).normalize();
                var distance = - app.camera.position.z / dir.z;
                var pos = app.camera.position.clone().add( dir.multiplyScalar( distance ) );
                return pos;
            }
        };
        
       
        
        return f;
        
        

        /**
         * 
         * --
         * @param {type} degrees
         * @returns {Number}
         */
        app.prototype.degToRadians = function( degrees ){
            return degrees * (Math.PI/180);
        };



        /**
         * 
         * --
         * @param {type} radians
         * @returns {Number}
         */
        app.prototype.RadToDegrees = function( radians ){
            return radians * (180/Math.PI)
        };

    });

    

    




