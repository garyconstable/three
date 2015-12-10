

    'use strict';

    define([
        'appBase',   
    ], function (app) {
        
        
        
        //        var app = app || {};
        //
        //        var App = App || {};



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
            return _scene[object][property];
        };



        /**
         *
         */
        app.prototype.sceneLoad = function(){

            var _scene = JSON.parse(localStorage.getItem(this.app_name));

            var _this = this;

            if ( _this.firebaseScene !== null && typeof(_this.firebaseScene) !== "undefined" ){

                console.log('----> load from firebase', _this.firebaseScene);

                var _count = 0;

                for (var key in _this.firebaseScene ) {


                    var obj = _this.firebaseScene[key];

                    if( _count === 0 ){
                        _this.selectedObject = key;
                    }

                    _this.loadGeometry(obj, key, false);

                    _count++;

                }


            }else if( _scene ){


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

                _this.SceneToFirebase();

            }else{

                console.log('----> load from config');

                _this.loadFromDefaults();

            }
        };



        /**
         *
         * @returns {undefined}
         */
        app.prototype.loadSceneObjectsFromStorage = function(){

            var _this = this;
            _this.sceneLoad();

            //        this.SceneFromFireBase();
            //
            //        var _this = this;
            //
            //        var _keepTrying = true;
            //
            //
            //        setTimeout(function(){
            //            _keepTrying = false;
            //        },3000);
            //
            //
            //        var checkFirebaseInterval = setInterval(function(){
            //
            //            if ( typeof _this.firebaseScene !== null  && typeof _this.firebaseScene !== "undefined"  ) {
            //
            //                clearInterval(checkFirebaseInterval);
            //
            //                console.log('----> load firebase data');
            //
            //                _this.sceneLoad();
            //
            //            };
            //
            //
            //
            //            if( _keepTrying === false ){
            //                clearInterval(checkFirebaseInterval);
            //                console.log('trying failed')
            //                _this.sceneLoad();
            //            }
            //
            //        }, 500);
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
         */
        app.prototype.SceneFromFireBase = function(){

            var _this = this;

            var _scene = null;

            var myFirebaseRef = new Firebase("https://threejs-scene.firebaseio.com/");

            myFirebaseRef.once("value", function(snapshot) {

                var data = snapshot.exportVal();

                if( data !== null && typeof (data[_this.app_name]) !== "undefined" ){

                    _this.firebaseScene = data[_this.app_name]
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

                var obj = {};

                obj[this.app_name] = _scene;

                var myFirebaseRef = new Firebase("https://threejs-scene.firebaseio.com/");

                myFirebaseRef.set(obj);

            }

        };
        
        
        
        console.log('---> AppStorage');
        return app;
        
        
    });



   

    
