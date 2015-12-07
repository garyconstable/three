

    "use strict";

    define( project, [
        
        'angular',
        'angularRoute'
        
    ], function(angular) {

        console.log('---> webapp')

        var app = angular.module('webApp', [
            'ngRoute'
        ]);
        
        app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
        }]);
    
        app.run([
            '$rootScope', function ($rootScope) {
                console.log('---> run')
            }
        ]);

        return app;
    });