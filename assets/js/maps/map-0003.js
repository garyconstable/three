
    'use strict';
    
    define([ 
        'three'
    ], function (THREE) {

        //map definition
        var map = function( mapSize, app, HORIZONTAL_UNIT, VERTICAL_UNIT ){    
            this.width = mapSize;
            this.depth = this.width;
            this.map = this.createMaze();
            this.horizontalUnit = HORIZONTAL_UNIT;
            this.verticalUnit = VERTICAL_UNIT;

            this.zSize = this.getMapLength() * this.horizontalUnit;
            this.xSize  = this.map[0].length * this.horizontalUnit;
            this.voxelCount = 0;
            
            this.app = app;
        };

        //length of map (array length)
        map.prototype.getMapLength = function(){
            return this.map.length;
        };

        //create maze
        map.prototype.createMaze = function() {

            var x = this.width,
                y = this.depth,
                n = x * y-1,
                _this = this;

            if (n<0) { return; }

            //true means open
            var horiz =[]; 

            for (var j= 0; j<x+1; j++){
                horiz[j]= [];
            }

            //true means open       
            var verti =[]; 

            for (var j= 0; j<y+1; j++){
                verti[j]= [];
            }

            //current location  
            var here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];

            //stack ov locations that need to be revisited
            var path = [here];

            //not yet visited - true means needs to be visited
            var unvisited = [];

            var next = null;

            for (var j = 0; j<x+2; j++) {

                unvisited[j] = [];

                for (var k= 0; k<y+1; k++){
                    unvisited[j].push(j>0 && j<x+1 && k>0 && (j !== here[0]+1 || k !== here[1]+1));
                }
            }

            while (0<n) {

                var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
                    [here[0]-1, here[1]], [here[0],here[1]-1]];

                var neighbors = [];

                for (var j = 0; j < 4; j++){

                    if (unvisited[potential[j][0]+1][potential[j][1]+1]){
                        neighbors.push(potential[j]);
                    }
                }

                if (neighbors.length) {

                    n = n-1;

                    next= neighbors[Math.floor(Math.random()*neighbors.length)];

                    unvisited[next[0]+1][next[1]+1]= false;

                    if (next[0] === here[0]){

                        horiz[next[0]][(next[1]+here[1]-1)/2]= true;

                    }else{

                        verti[(next[0]+here[0]-1)/2][next[1]]= true;
                    }

                    path.push(here = next);

                } else {

                    here = path.pop();

                }
            }

            return _this.drawMap({
                x: x, 
                y: y, 
                horiz: horiz, 
                verti: verti
            });
           
        };

        //draw map - in console
        map.prototype.drawMap = function( m ){

            var width = this.width;
            var height = this.depth;

            //maze to be drawn
            var m = m;

            //lines of text representing the maze
            var text = [];

            //characters of current line;
            var line;

            var rows = [];

            for (var j= 0; j<m.x*2+1; j++) {
                
                var line= [];

                if (0 == j%2){

                    for (var k=0; k<m.y*4+1; k++){

                        if (0 == k%4){ 

                            line[k]= '+';

                        }else{

                            if (j>0 && m.verti[j/2-1][Math.floor(k/4)]){

                                line[k]= ' ';

                            }else{

                                line[k]= '-';

                            }
                        }
                    }

                }else{

                    for (var k=0; k<m.y*4+1; k++){

                        if (0 == k%4){

                            if (k>0 && m.horiz[(j-1)/2][k/4-1]){

                                line[k]= ' ';

                            }else{

                                line[k]= '|';

                            }

                        }else{
                            line[k]= ' ';
                        }
                    }
                }

                if (0 == j) {
                    line[1]= line[2]= line[3]= ' ';
                }

                if (m.x*2-1 == j){
                    line[4*m.y]= ' ';
                }

                rows.push(line);
                text.push(line.join('')+'\r\n');
            }

            console.log(text.join(''))
            return rows;
        };

        //load the floor (same size as map)
        map.prototype.loadFloor = function(color){
            if( typeof color === 'undefined' || !color ){
                color = 0x729BA8;
            }
            var plane = new THREE.Mesh(
                new THREE.PlaneGeometry( this.zSize, this.xSize, 50, 50 ),
                new THREE.MeshPhongMaterial({
                    color: color,
                    side: THREE.DoubleSide
                })
            );
            plane.castShadow = false;
            plane.receiveShadow = true;
            plane.rotation.x +=  ( 90 * (Math.PI/180) );
            plane.rotation.z +=  ( 90 * (Math.PI/180) );
            plane.position.x += this.horizontalUnit / 2;
            plane.position.y -= 100;
            plane.position.z += this.horizontalUnit / 2;            
            this.app.scene.add(plane);
        }
        
        
        //load the floor (same size as map)
        map.prototype.loadRoof = function(color){
            if( typeof color === 'undefined' || !color ){
                color = 0x729BA8;
            }
            var plane = new THREE.Mesh(
                new THREE.PlaneGeometry( this.zSize, this.xSize, 50, 50 ),
                new THREE.MeshPhongMaterial({
                    color: color,
                    side: THREE.DoubleSide
                })
            );
            plane.castShadow = false;
            plane.receiveShadow = true;
            plane.rotation.x +=  ( 90 * (Math.PI/180) );
            plane.rotation.z +=  ( 90 * (Math.PI/180) );
            plane.position.x += this.horizontalUnit / 2;
            plane.position.y += this.verticalUnit;
            plane.position.z += this.horizontalUnit / 2;            
            this.app.scene.add(plane);
        }


        //add voxel
        map.prototype.addVoxel = function(type, row, col) {

            var _this = this;
            var z = (row+1) * _this.horizontalUnit - this.zSize * 0.5;
            var x = (col+1) * _this.horizontalUnit - this.xSize * 0.5;
            var voxelCount = 0;
            
            switch(type) {
                case ' ': break;
                case 'S':
                    //spawnPoints.push(new THREE.Vector3(x, 0, z));
                    break;
                case '|':
                case '+':
                case '-':
                    
                    var geo = new THREE.CubeGeometry(
                        _this.horizontalUnit,
                        _this.verticalUnit, 
                        _this.horizontalUnit
                    );
                    
                    var material = new THREE.MeshPhongMaterial({
                        color: 0x729BA8
                    });

                    var mesh = new THREE.Mesh(geo, material);
                    mesh.position.set(x, (_this.verticalUnit * 0.5 - 100), z);
                    mesh.castShadow = true;
                    mesh.receiveShadow = false;
                    _this.app.scene.add(mesh);
                    _this.voxelCount++;
                    break;
            }
            
           
        };

        // load the map to the scene
        map.prototype.loadMap = function(){
            
            var _this = this;
            var newMap = [];
            
            for( var x = 0; x < _this.map.length; x++){

                var str = "";
                
                for(var y=0; y < _this.map[x].length; y++){
                    str = str + _this.map[x][y];
                }
                
                newMap.push(str);
            }

            for (var i = 0; i<newMap.length; i++) {
                for (var j = 0; j < newMap[i].length; j++) {
                    _this.addVoxel(newMap[i].charAt(j), i, j);
                }
            }
            
             console.log( 'Voxels', _this.voxelCount);
             
        }

        //return the map for require.js
        return map;
});