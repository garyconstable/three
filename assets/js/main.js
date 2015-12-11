

console.time('---> App load:');


//define the module
var projects = {
    grid            : ['grid'],
    particles       : ['particles'],
    particles_0001  : ['particles_0001'],
    maze            : ['maze'],
    shader_0001     : ['shader_0001'],
    shader_0002     : ['shader_0002'],
};

var get = function(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

var appName = get('app');
if(typeof appName !== 'undefined'){
    window.project = projects[appName];
}else{
    //window.project = projects[window.loadApplication];
    window.project = projects.shader_0002;
}

//loadApplication is a tag in the HTML template
//window.project = projects[window.loadApplication];

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
        orbitControls           : '/assets/js/controls/orbit-controls',
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
        
        //shaders
        ShaderLib               : '/assets/js/shaders/ShaderLib',
        
        //vendor
        firebase                : '/assets/js/vendor/firebase.2.2.7',
        jquery                  : '/assets/bower_components/jquery/dist/jquery.min',
        three                   : '/assets/bower_components/three.js/three.min',

        //projects
        grid                    : '/projects/grid',
        maze                    : '/projects/maze',
        particles               : '/projects/particles',
        particles_0001          : '/projects/particles_0001',
        shader_0001             : '/projects/shader_0001',
        shader_0002             : '/projects/shader_0002'
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