
console.time('---> App load:');

//define all the files we may need to load
require.config({
    
    paths: {
        
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
        mapTwo                  : '/assets/js/maps/map-0001',
        
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
        particles               : '/projects/particles/js/app'
    },
    shim: {
        three: {
            exports: 'THREE'
        }
    }
});


//define the module
var modules = [];
modules['particles'] = ['particles'];


//loadApplication is a tag in the HTML template
window.moduleList = modules[window.loadApplication];


//load the main app file
require([
    'jquery',
    'firebase',
    'three',
    '/assets/js/application.js' 
], function ($, Firebase, THREE, application){ 
    console.log(application)
    console.timeEnd('---> App load:');
});
