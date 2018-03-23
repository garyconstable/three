
'use strict';

var app = app || {};

var App = App || {};

/**
* Deg to rad
* ==
*/
app.prototype.degToRadians = function( degrees ){
    return degrees * (Math.PI/180);
};
/**
* Rad to deg
* ==
*/
app.prototype.RadToDegrees = function( radians ){
  return radians * (180/Math.PI)
};
