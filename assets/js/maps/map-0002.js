
    'use strict';
    
    define([
        'appBase',   
        'three'
    ], function (app, THREE) {

        //map definition
        var map = function(App){

            this.startPosition = null,
            this.units = 1,
            this.width = 10,
            this.depth = 10,
            this.wallHeight = 1200;
            this.unitSize = 700;

            this.cols = 0;
            this.rows = 0;


            this.cube = new THREE.BoxGeometry(this.unitSize, this.wallHeight, this.unitSize);

            this.texture_1 = THREE.ImageUtils.loadTexture('/assets/img/doom2-plut/a-brick1.png');
            this.texture_1.wrapS = THREE.RepeatWrapping;

            this.texture_2 = THREE.ImageUtils.loadTexture('/assets/img/doom2-plut/a-dbri1.png');
            this.texture_2.wrapS = THREE.RepeatWrapping;

            this.materials = [

                new THREE.MeshLambertMaterial({
                    map: this.texture_1,
                    //side:  THREE.DoubleSide	
                }),
                new THREE.MeshLambertMaterial({
                    map: this.texture_2,
                    //side:  THREE.DoubleSide	
                }),
             ];
        };

        //create maze
        map.prototype.createMaze = function() {

            var x = this.width;
            var y = this.depth;

            var n=x*y-1;

            if (n<0) {
                console.log("illegal maze dimensions");
                return;
            }

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
                    unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
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

                    if (next[0] == here[0]){

                        horiz[next[0]][(next[1]+here[1]-1)/2]= true;

                    }else{

                        verti[(next[0]+here[0]-1)/2][next[1]]= true;
                    }

                    path.push(here = next);

                } else {

                    here = path.pop();

                }
            }

            return {x: x, y: y, horiz: horiz, verti: verti};

        };

        //draw map
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

        //map init
        map.prototype.init = function(){

            var m = this.createMaze(),
                m = this.drawMap( m );

                return m;			
        } 
        
        
        
        
        return map;
});