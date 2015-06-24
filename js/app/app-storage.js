

    'use strict';

    var app = app || {};

    var App = App || {};


    /**
     * 
     * @param {type} object
     * @param {type} name
     * @returns {undefined}
     */
    app.prototype.setStorageObject = function(object, name){

        var _scene = localStorage.getItem(this.app_name);

        if( !_scene ){ 
            _scene = {}; 
        }else{
            _scene = JSON.parse( _scene );
        }

        if( !_scene[name] ){ 
            _scene[name] = object;
        }

        localStorage.setItem( this.app_name, JSON.stringify(_scene)  );
        
        this.SceneToFirebase();
    };

    /**
     * 
     * @param {type} object
     * @param {type} property
     * @param {type} value
     * @returns {undefined}
     */
    app.prototype.setStorage = function(object, property, value){

        var  _key = this.selectedObject;
        
        var _this = this;

        if(typeof _key !== "undefined"){
                        //cyliner position x 310
            console.log( _key, object, property, value );

            var _scene = localStorage.getItem(this.app_name);

            if( !_scene ){ 
                _scene = {}; 
            }else{
                _scene = JSON.parse( _scene );
            }

            if( !_scene[_key] ){ 
                _scene[_key] = {};
            }

            if( !_scene[_key][object] ){ 
                _scene[_key][object] = {};
            }

            _scene[_key][object][property] = value;

            localStorage.setItem( this.app_name, JSON.stringify(_scene)  );
            
            _this.SceneToFirebase();
            
            console.log(_scene)

        }

    };

    /**
     * 
     * @param {type} object
     * @param {type} property
     * @returns {unresolved}
     */
    app.prototype.getStorage = function(object, property){
        var _scene = JSON.parse(localStorage.getItem(this.app_name));
        return _scene[object][property]
    };

    /**
     * 
     * @returns {undefined}
     */
    app.prototype.loadSceneObjectsFromStorage = function(){

        console.log(localStorage)

        //localStorage.clear();

        var _this = this;

        var _scene = JSON.parse(localStorage.getItem(this.app_name));

        if( !_scene){

            console.log('----> load from config');

            this.loadFromDefaults();

        }else{

            console.log('----> load from storage');

            var _count = 0;

            for (var key in _scene ) {

                var obj = _scene[key];

                if( _count === 0 ){
                    _this.selectedObject = key;
                }

                _this.loadGeometry(obj, key, false);

                _count++;

            }

        }

    };

    /**
     * 
     * @returns {undefined}
     */
    app.prototype.loadFromDefaults = function(){

        var _this  = this,
            _count = 0;

        $.ajax({

            url: this.config_file,
            async: false,
            success: function (data){

                //console.log('scene', data);

                for (var key in data ) {

                    var obj = data[key];

                    if( _count === 0 ){
                        _this.selectedObject = key;
                    }

                    _this.loadGeometry(obj, key, true);

                    _count++;

                }
                
                
                
                _this.SceneToFirebase();
                
                

            }

        });

    };
    
    
    /**
     * 
     * @returns {undefined}
     */
    app.prototype.SceneToFirebase = function(){
        
        var _scene = JSON.parse(localStorage.getItem(this.app_name));
        
        if( _scene ){
            
            var obj = {}
            obj[this.app_name] = _scene;
            
            var myFirebaseRef = new Firebase("https://threejs-scene.firebaseio.com/");
            
            myFirebaseRef.set(obj);

        }
        
    }
