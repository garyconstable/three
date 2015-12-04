

//define all the files we may need to load
require.config({
    paths: {
        
        //app
        appBase                 : '/assets/js/app/app-base',
        appDefault              : '/assets/js/app/app-default',
        appFunction             : '/assets/js/app/app-functions',
        appGui                  : '/assets/js/app/app-gui',
        appObjLoader            : '/assets/js/app/app-objloader',
        appPointerLockControls  : '/assets/js/app/app-pointerlock',
        appSceneLoader          : '/assets/js/app/app-sceneloader',
        appStorage              : '/assets/js/app/app-storage',
        
        //vendor
        firebase                : '/assets/js/vendor/firebase.2.2.7',
        jquery                  : '/assets/bower_components/jquery/dist/jquery.min',
        three                   : '/assets/bower_components/three.js/three.min',
        
        //particles
        particleOne             : '/assets/js/particles/particle-0001',
        
        //projects
        particles               : '/projects/particles/js/app'
    }
});


//define the module
var modules = [];
modules['particles'] = 
[
    'appBase',   
    'particleOne', 
    'particles',
    'appGui',
    'appStorage',
    'appSceneLoader',
    'appFunction',
];


//loadApplication is a tag in the HTML template
window.moduleList = modules[window.loadApplication];


//load the main app file
require([
    'jquery',
    'firebase',
    'three',
    '/assets/js/application.js' 
], function ($, Firebase, THREE, app){ 
    console.log(app)
});
