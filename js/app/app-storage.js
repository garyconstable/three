

'use strict';

var app = app || {};


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
};

/**
 * 
 * @param {type} object
 * @param {type} property
 * @param {type} value
 * @returns {undefined}
 */
app.prototype.setStorage = function(object, property, value){
    
    var _scene = JSON.parse(localStorage.getItem(this.app_name));
    if( !_scene ){ _scene = {}; }
    if( !_scene[object] ){ _scene[object] = {};} 
    _scene[object][property] = value;
    localStorage.setItem( this.app_name, JSON.stringify(_scene) );
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
            
        }
        
    });
    
};
