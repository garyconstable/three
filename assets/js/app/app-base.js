
    
        /*
    _ .-') _            (`\ .-') /`            _  .-')            _ .-') _    .-')    
            ( (  OO) )            `.( OO ),'           ( \( -O )          ( (  OO) )  ( OO ).  
     .-----. \     .'_         ,--./  .--.  .-'),-----. ,------.  ,--.     \     .'_ (_)---\_) 
    /  -.   \,`'--..._)  .-')  |      |  | ( OO'  .-.  '|   /`. ' |  |.-') ,`'--..._)/    _ |  
    '-' _'  ||  |  \  '_(  OO) |  |   |  |,/   |  | |  ||  /  | | |  | OO )|  |  \  '\  :` `.  
       |_  < |  |   ' (,------.|  |.'.|  |_)_) |  |\|  ||  |_.' | |  |`-' ||  |   ' | '..`''.) 
    .-.  |  ||  |   / :'------'|         |   \ |  | |  ||  .  '.'(|  '---.'|  |   / :.-._)   \ 
    \ `-'   /|  '--'  /        |   ,'.   |    `'  '-'  '|  |\  \  |      | |  '--'  /\       / 
     `----'' `-------'         '--'   '--'      `-----' `--' '--' `------' `-------'  `-----'  
    */
    
    
    'use strict';
    
    define([], function () {
        
        //the window.app
        var app = function(){};
        
        //init / setup
        app.prototype.init = function() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.camera = null;
            this.renderer = null;
            this.controls = null;
            this.sceneObjects = [];
        };

        //create renderer
        app.prototype.createRenderer = function(){
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(this.width, this.height);
            document.body.appendChild(this.renderer.domElement);
        };

        //create the scene
        app.prototype.createScene = function(color, near, far){
            if(typeof color === 'undefined' || !color ){
                color = 0x888888;
            }
            if(typeof near === 'undefined' || !near ){
                near = 1500;
            }
            if(typeof far === 'undefined' || !far ){
                far = 4000;
            }
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog( color, near, far );
        };

        //add camera
        app.prototype.addCamera = function(){
            this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000000);
        };

        //dom events
        app.prototype.events = function(){
            window.onresize = function(event) {
                if(typeof App !== "undefined" && typeof App.renderer !== "undefined"){
                    App.width = window.innerWidth;  
                    App.height = window.innerHeight;
                    App.renderer.setSize(App.width, App.height);
                    App.camera.aspect = App.width / App.height;
                    App.camera.updateProjectionMatrix();
                }
            };
        };

        //ambient light
        app.prototype.addAmbientLight = function(color){
            this.scene.add( new THREE.AmbientLight( color ));
        };
        
        //define the app
        var App = App || {};
        window.App = App;
        
        console.log('---> Welcome to 3d Worlds.');
        console.log('---> mailto:')
        console.log('---> garyconstable80@gmail.com')
        console.log('---> AppBase');
        return app;
    });