

console.time('---> App load:');


//define the module
var projects = {
    grid        : ['grid'],
    particles   : ['particles'],
    maze        : ['maze'],
};


//loadApplication is a tag in the HTML template
window.project = projects[window.loadApplication];


//define all the files we may need to load
require.config({
    
    paths: {
        
        //angular
        angular                 : '/assets/bower_components/angular/angular.min',
        angularRoute            : '/assets/bower_components/angular-route/angular-route.min',
        
        //application
        app                     : '/assets/js/application',
        
        //app
        appConsole              : '/assets/js/app/app-console',
        appBase                 : '/assets/js/app/app-base',
        appDefault              : '/assets/js/app/app-default',
        appFunction             : '/assets/js/app/app-functions',
        appGui                  : '/assets/js/app/app-gui',
        appObjLoader            : '/assets/js/app/app-objloader',
        appPointerLockControls  : '/assets/js/app/app-pointerlock',
        appSceneLoader          : '/assets/js/app/app-sceneloader',
        appStorage              : '/assets/js/app/app-storage',
        
        //controls
        orbitControls           : '/assets/js/controls/orbit_controls',
        pointerLockControls     : '/assets/js/controls/pointerlock-controls',
        dragPanControls         : '/assets/js/controls/threex.dragpancontrolls',
        
        //maps
        mapOne                  : '/assets/js/maps/map-0001',
        mapTwo                  : '/assets/js/maps/map-0002',
        
        //models
        teapot                  : '/assets/js/models/teapot.js',
        teapotObj               : '/assets/js/models/teapot.obj',
        
        //particles
        particleOne             : '/assets/js/particles/particle-0001',
        
        //players
        playerOne               : '/assets/js/players/player-0001',
        
        //vendor
        firebase                : '/assets/js/vendor/firebase.2.2.7',
        jquery                  : '/assets/bower_components/jquery/dist/jquery.min',
        three                   : '/assets/bower_components/three.js/three.min',

        //projects
        grid                    : '/projects/grid',
        maze                    : '/projects/maze',
        particles               : '/projects/particles'
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    },
    deps: [
        'jquery', 
        'app'
    ]
    
});


//load the main app file
require([
    'app'
], function (app){ 
    console.timeEnd('---> App load:');
});