

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
        
        //controls
        orbitControls           : '/assets/js/controls/orbit-controls',
        pointerLockControls     : '/assets/js/controls/pointerlock-controls',
        dragPanControls         : '/assets/js/controls/threex.dragpancontrols',
        
        //maps
        mazeOne                 : '/assets/js/maps/map-0001',
        mazeTwo                 : '/assets/js/maps/map-0002',
        
        //models
        teaPotJs                : '/assets/js/models/teapot.js',
        teaPotObj               : '/assets/js/models/teapot.obj',
        
        //particles
        particleOne             : '/assets/js/particles/particle-0001',
        
        //players
        payerOne                : '/assets/js/players/player-0001',
        
        //vendor
        firebase                : '/assets/js/vendor/firebase.2.2.7',
        jquery                  : '/assets/bower_components/jquery/dist/jquery.min',
        three                   : '/assets/bower_components/three.js/three.min',
       
        //projects
        particles               : '/projects/particles/js/app',
    }
});


//define the module
var modules = [];
modules['particles'] = 
[
    //    'appBase',   
    //    'particleOne', 
    //    'particles',
    //    'appGui',
    //    'appStorage',
    //    'appSceneLoader',
    //    'appFunction',

    'particles'
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
    console.log(app);
});
