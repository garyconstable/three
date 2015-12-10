
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
            },
            
            
            mousePosition2D: function(xPos, yPos, maxX, maxY)
            {
                var pos = new THREE.Vector3( 0, 0, -200);
                var ww = "innerWidth" in window ? window.innerWidth: document.documentElement.offsetWidth; 
                var wh = "innerHeight" in window ? window.innerHeight: document.documentElement.offsetHeight; 
                
                var wUnit = (ww / 2) / maxX;
                var hUnit = (wh / 2) / maxY;

                if(xPos < (ww / 2)){
                    xPos = 0 - ((ww / 2) - xPos) / wUnit;
                }else{
                    xPos = ( xPos - (ww / 2) ) / wUnit
                }
                pos.x = xPos;
                
                if(yPos < (wh / 2)){
                    yPos = 0 - ((wh / 2) - yPos) / hUnit;
                }else{
                    yPos = ( yPos - (wh / 2) ) / hUnit;
                }
                pos.y = yPos;                
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

    

    




