
    
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
        
        /**
         * 
         * --
         * @returns {app-base_L18.app}
         */
        var app = function(){

            try {
                this.bindings();
                this.cleanup();
            }
            catch(err) {
                console.log(err)
            }

            this.firebaseScene = null;
            this.version = 1;          
            return this;
        };
        
        //define the app
        var App = App || {};
        window.App = App;
        
        console.log('---> Welcome to 3d Worlds by <garyconstable80@gmail.com>');
        console.log('---> AppBase');
        return app;
    });