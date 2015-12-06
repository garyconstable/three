
    'use strict';

    define([
        'appBase'
    ], function (app) {

        console.log('---> AppFunctions');
        
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

    

    




