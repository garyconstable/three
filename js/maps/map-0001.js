


	'use strict';

	var app = app || {};

	app.prototype.loadMap = function() {
		
		var WALLHEIGHT = 1200;

		var UNITSIZE = 1000;

		var texture_1 = THREE.ImageUtils.loadTexture('/img/stone-0001.jpg');
		 	texture_1.wrapS = THREE.RepeatWrapping;

		var materials = [
			new THREE.MeshLambertMaterial({
				map: texture_1,
				side:  THREE.DoubleSide	
			}),
			new THREE.MeshLambertMaterial({
				map: texture_1,
				side:  THREE.DoubleSide
			}),
         ];

		var cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
		/*
		var map = [ // 1  2  3  4  5  6  7  8  9
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
	           [1, 1, 0, 0, 0, 0, 0, 1, 1, 1,], // 1
	           [1, 1, 0, 0, 2, 0, 0, 0, 0, 1,], // 2
	           [1, 0, 0, 0, 0, 2, 0, 0, 0, 1,], // 3
	           [1, 0, 0, 2, 0, 0, 2, 0, 0, 1,], // 4
	           [1, 0, 0, 0, 2, 0, 0, 0, 1, 1,], // 5
	           [1, 1, 1, 0, 0, 0, 0, 1, 1, 1,], // 6
	           [1, 1, 1, 0, 0, 1, 0, 0, 1, 1,], // 7
	           [1, 1, 1, 1, 1, 1, 0, 0, 1, 1,], // 8
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
	           ], mapW = map.length, mapH = map[0].length;
		*/
	    var map = [ // 1  2  3  4  5  6  7  8  9
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 1
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 2
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 3
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 4
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 5
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 6
	           [1, 0, 0, 0, 1, 0, 0, 0, 0, 1,], // 7
	           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
	           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
	           ], mapW = map.length, mapH = map[0].length;       

           	this.map = map;

           	var units = mapW;

			for (var i = 0; i < mapW; i++) {
				for (var j = 0, m = map[i].length; j < m; j++) {
					if (map[i][j]) {
						var wall = new THREE.Mesh( cube, materials[map[i][j]-1]);
						wall.position.x = (i - units/2) * UNITSIZE;
						wall.position.y = WALLHEIGHT/2;
						wall.position.z = (j - units/2) * UNITSIZE;
						this.scene.add(wall);
					}
				}
			}
	};