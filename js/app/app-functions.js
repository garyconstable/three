


    'use strict';

    var app = app || {};

    var App = App || {};
    
    /**
     * 
     * @param {type} degrees
     * @returns {Number}
     */
    app.prototype.degToRadians = function( degrees ){
        return degrees * (Math.PI/180);
    };

    /**
     * 
     * @param {type} radians
     * @returns {Number}
     */
    app.prototype.RadToDegrees = function( radians ){
        return radians * (180/Math.PI)
    };




