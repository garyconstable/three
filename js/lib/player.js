

'use strict';

var app = app || {};

var player = function(app){
    
    this.app = app;
    this.cube = new THREE.BoxGeometry(200, 200, 200);
    this.player_skin = THREE.ImageUtils.loadTexture('/img/doom2-plut/a-brbrk.png');
    this.player_skin.wrapS = THREE.RepeatWrapping;

    this.materials = [
        new THREE.MeshLambertMaterial({
            map : this.player_skin,
            side: THREE.DoubleSide	
        }),
    ];
    
    this.addCube( this.cube, app.camera.position.x, app.camera.position.y, app.camera.position.z, 0);
};


player.prototype.addCube = function( cube, x, y, z, mat ){
    
    var _this = this,
        box = new THREE.Mesh( cube, _this.materials[mat] );

        box.position.x = x ;
        box.position.y = y ;
        box.position.z = z ;
    
    console.log(this.app.camera.position, box.position);
    
    _this.app.scene.add(box);
    
};