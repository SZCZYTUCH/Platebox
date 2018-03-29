(function() {
    'use strict';

    angular.module('PLATEBOX')
        .service('mapService',['$rootScope', function($rootScope) {
            var self = this;
            
//            this.specs = {
//                w: 40,
//                h: 40,
//                size: 40
//
//            };
//"console.log();"
//
//
//caret-backward
//
//
//caret-backward

            
            
            self.grid = {};
            self.rooms = [];
            self.connectorRegions = [];
            
            self.fillGrid = function (specs) {
                var k = 0;
                for (var i = 0; i <= specs.w; i++) {
                    for (var j = 0; j <= specs.h; j++) {
                        self.grid['G' + i +'_'+ j] = {x: i, y: j, filled: false, background: 'black', type: null};
                        k++;
                    }
                }
            };
            
            self.tries = 40;
            self.roomExtraSize = 1;
            self.windingPercent = 50;
            
            self.generateRooms = function (specs) {
                for (var i = 0; i < self.tries; i++) {
                    var size = _.random(1, 3 + self.roomExtraSize) * 2 + 1;
                    var rectangularity = _.random(0, 1 + _.toInteger(size / 2)) * 2;
                    var width = size;
                    var height = size;
                    if (_.sample([true, false])) {
                        width += rectangularity;
                    } else {
                        height += rectangularity;
                    }

                    var x = _.random( _.toInteger((specs.w - width) / 2) ) * 2 + 1;
                    var y = _.random( _.toInteger((specs.h - height) / 2) ) * 2 + 1;

                    var curent_room = {x:x, y:y, width:width, height:height, doors:[]};

                    var not_overlaping = true;
                    
                    //checks if curent_room overlaps the with other rooms
                    _.forEach(self.rooms, function (other, key) {
                        if (self.isOverlaping(curent_room, other)) {
                            not_overlaping = false;
                        }
                    });
                    
                    //checks if curent_room overlaps the bottom edge
                    if (self.isOverlaping(curent_room, {x: 0, y: specs.h + 1, width: specs.w + 1, height: 1})) {
                        not_overlaping = false;
                    }
                    //checks if curent_room overlaps the right edge
                    if (self.isOverlaping(curent_room, {x: specs.w + 1, y: 0, width: 1, height: specs.h + 1})) {
                        not_overlaping = false;
                    }

                    if (not_overlaping) {
                        self.rooms.push(curent_room);
                    };
                    
                }
            };
            
            self.isOverlaping = function (curent_room, other_room) {
                return !(
                        curent_room.x >= (other_room.x + other_room.width) || 
                        curent_room.y >= (other_room.y + other_room.height) ||
                        (curent_room.x + curent_room.width) <= other_room.x || 
                        (curent_room.y + curent_room.height) <= other_room.y
                );
            };
            
            self.carveRoomSpace = function(){
                _.forEach(self.rooms, function (room, key) {
                    for (var j = 0; j < room.width; j++) {
                        for (var k = 0; k < room.height; k++) {
                            self.carve({x:(room.x+j), y:(room.y+k)}, '#a5c7c7', ('room_'+key) );
                        }
                    }    
                });  
            };
            
            self.generateCorridors = function (specs) {
                for (var y = 1; y < specs.h; y += 2) {
                    for (var x = 1; x < specs.w; x += 2) {
                        //if not filled generate corridor
                        if (!self.grid['G'+(x)+'_'+(y)].filled){
                            self.generateCorridor({x:x,y:y}, specs);
                        };
                    }
                }
            };
            
            self.carve = function(coord, color, type){
                self.grid['G'+(coord.x)+'_'+(coord.y)].background = color;
                self.grid['G'+(coord.x)+'_'+(coord.y)].filled = true;
                self.grid['G'+(coord.x)+'_'+(coord.y)].type = type;
            };
            
            self.uncarve = function(coord){
                self.grid['G'+(coord.x)+'_'+(coord.y)].background = 'black';
                self.grid['G'+(coord.x)+'_'+(coord.y)].filled = false;
                self.grid['G'+(coord.x)+'_'+(coord.y)].type = null;
            };
            
            self.canThisCellBeNextCandidateForCorridor = function(cell, direction, specs){
                //candidate cell can not be room wall, border, can be another corridor tho 
                var cellCopy = angular.copy(cell);
                var key = Object.keys(direction)[0];
                cellCopy[key] = cellCopy[key] + direction[key];
                
                //if out of bounds can not be candidate
                return  (!(cellCopy.x < 0 || cellCopy.y < 0 || cellCopy.x > specs.w || cellCopy.y > specs.h)) && 
                //if filled - can not be candidate
                        (!(self.grid['G'+(cellCopy.x)+'_'+(cellCopy.y)].filled));

            };

            self.generateCorridor = function (startingPoint, specs) {
                var Directions = [{x:-2}, {x:2}, {y:-2}, {y:2}];
                var corridor = [];
                var lastDir;

                self.carve(startingPoint, '#c0de99', 'corridor');

                corridor.push(startingPoint);
                
                while (corridor.length > 0) {
                    var currentlyProbedCell = _.last(corridor);

                    // See which adjacent cells are open and possible candidate.
                    var extensionCandidatesCells = [];
                    
                    _.forEach(Directions, function (dir, key) {
                        if (self.canThisCellBeNextCandidateForCorridor(currentlyProbedCell, dir, specs)){
                            extensionCandidatesCells.push(dir);
                        } 
                    });
                    
                    if (extensionCandidatesCells.length > 0) {
                        // Based on how "windy" passages are, try to prefer carving in the same direction.
                        var dir;
                        
                        if (_.includes(extensionCandidatesCells, lastDir) && _.random(100) > self.windingPercent) {
                            dir = lastDir;
                        } else {
                            dir = _.sample(extensionCandidatesCells);
                        }
                        
                        //carve won candidate
                        var key0 = Object.keys(dir)[0];
                        var startingPointCopy0 = angular.copy(currentlyProbedCell);
                        startingPointCopy0[key0] = startingPointCopy0[key0] + dir[key0];
                        self.carve(startingPointCopy0, '#c0de99', 'corridor');
                        //
                        //carve connector between startingPoint and candidate
                        var startingPointCopy1 = angular.copy(currentlyProbedCell);
                        startingPointCopy1[key0] = startingPointCopy1[key0] + (dir[key0]/2);
                        self.carve(startingPointCopy1, '#c0de99', 'corridor');

                        //add candidate to corridor
                        corridor.push(startingPointCopy0);
                        lastDir = dir;
                    } else {
                        // No adjacent cells open.
                        corridor.pop();

                        // This path has ended.
                        lastDir = null;
                    }
                }
            };
            
            self.canThisCorridorCellBeNextCandidateForDoorConnector = function(cell, direction, specs){
                var cellCopy = angular.copy(cell);
                var key = Object.keys(direction)[0];
                cellCopy[key] = cellCopy[key] + direction[key];
                
                //if out of bounds can not be candidate
                return  (!(cellCopy.x < 0 || cellCopy.y < 0 || cellCopy.x > specs.w || cellCopy.y > specs.h)) && 
                //if not room - can not be candidate
                        ((self.grid['G'+(cellCopy.x)+'_'+(cellCopy.y)].type+'').substring(0, 4) === 'room');
            };
            
            self.canThisNullCellBeNextCandidateForDoorConnector = function(nullCell){
                return (
                (   ( (self.grid['G'+(nullCell.x+1)+'_'+(nullCell.y)].type+'').substring(0, 4) === 'room' ) &&
                    ( (self.grid['G'+(nullCell.x-1)+'_'+(nullCell.y)].type+'').substring(0, 4) === 'room' ) ) 
                ||
                (   ( (self.grid['G'+(nullCell.x)+'_'+(nullCell.y+1)].type+'').substring(0, 4) === 'room' ) &&
                    ( (self.grid['G'+(nullCell.x)+'_'+(nullCell.y-1)].type+'').substring(0, 4) === 'room' ) )
                );
            };
            
            self.createDoorConnections = function (specs) {
                var Directions = [{x:-2}, {x:2}, {y:-2}, {y:2}];

                for (var y = 1; y < specs.h; y++) {
                    for (var x = 1; x < specs.w; x++) {
                        //Find all of the corridor tiles that can connect two (or more) rooms.
                        //if cell is a corridor type check for possible door connection
                        if (self.grid['G'+(x)+'_'+(y)].type === 'corridor'){
                            _.forEach(Directions, function (dir, key) {
                                if (self.canThisCorridorCellBeNextCandidateForDoorConnector({x:x, y:y}, dir, specs)){
                                    var key = Object.keys(dir)[0];
                                    var candidate = {x:x, y:y};
                                    candidate[key] = candidate[key] + (dir[key] / 2);
                                    self.connectorRegions.push({x: candidate.x, y: candidate.y, connectorType: 'c-r', closed: true}); 
                                } 
                            });
                        };
                        // Find all the tiles that can connect two rooms together.
                        //if cell is a null type check for possible door connection between rooms
                        if (self.grid['G'+(x)+'_'+(y)].type === null){
                            if (self.canThisNullCellBeNextCandidateForDoorConnector({x:x, y:y})){
                                self.connectorRegions.push({x:x, y:y, connectorType: 'r-r', closed: true}); 
                            }
                        }
                    }
                };
                
                //link connector regions to rooms
                _.forEach(self.rooms, function (room, k) {
                    for (var j = -1; j < room.width+1; j++) {
                        for (var k = -1; k < room.height+1; k++) {                            
                            var door = _.find(self.connectorRegions, function(connector) { return (connector.x === (room.x+j) && connector.y === (room.y+k)); });
                            if (door !== undefined){  room.doors.push(door);  }
                        }
                    }
                });
                
                //randomly select doors to carve, remove the rest
                _.forEach(self.rooms, function (room, k) {
                    var roomSize  = (room.width*room.height);
                    var maxDoorsPower = Math.floor(Math.pow(roomSize*0.79370005232323, 0.44727752133702440338));
                    var maxDoorsPossible = room.doors.length;
                    var maxDoors = (maxDoorsPower <= maxDoorsPossible)? maxDoorsPower : maxDoorsPossible;
                    var randNumDoors = _.random(1, maxDoors);
                    var finalDoorsArray = [];

                    while (finalDoorsArray.length < randNumDoors && maxDoorsPossible > 0){
                        var drawDoor = null;
                        //TODO optymalize
                        
                        while 
                        (
                            drawDoor === null || 
                            !drawDoor.closed ||
                            //check for door next to door correlation
                            (_.some(finalDoorsArray,   { x: drawDoor.x+1,    y: drawDoor.y     })) ||
                            (_.some(finalDoorsArray,   { x: drawDoor.x,      y: drawDoor.y+1   })) ||
                            (_.some(finalDoorsArray,   { x: drawDoor.x-1,    y: drawDoor.y     })) ||
                            (_.some(finalDoorsArray,   { x: drawDoor.x,      y: drawDoor.y-1   }))
                        )
                        {   
                            //TODO
                            //favour room to room conection
                            //remove already selected doors from the pool
                            drawDoor = _.sample(room.doors);     
                        }
                        
                        finalDoorsArray.push(drawDoor);
                        
                    }
                    room.doors = finalDoorsArray;
                    
                    //carve connectors
                    _.forEach(finalDoorsArray, function (connector, k) {
                        if (connector.connectorType === 'c-r') {
                            self.carve({x:(connector.x), y:(connector.y)}, 'orange', 'door' );
                        } else if (connector.connectorType === 'r-r') {
                            self.carve({x:(connector.x), y:(connector.y)}, 'pink', 'archway' );
                        }

                    });
                    
                });
                
            };
            
            self.isCellAnCorridorOrArchway = function(cell, direction, specs){
                var cellCopy = angular.copy(cell);
                var key = Object.keys(direction)[0];
                cellCopy[key] = cellCopy[key] + direction[key];
                
                //if out of bounds ignore and return false
                return  (!(cellCopy.x < 0 || cellCopy.y < 0 || cellCopy.x > specs.w || cellCopy.y > specs.h)) && 
                //is corridor or is archway
                        (!(self.grid['G'+(cellCopy.x)+'_'+(cellCopy.y)].type === null) );
            };
            
            self.removeCorridorsDeadEnds = function (specs) {
                var Directions = [{x:-1}, {x:1}, {y:-1}, {y:1}];
                var done = false;

                while (!done) {
                    done = true;
                    
                    _.forEach(self.grid, function (cell, key) {
                        
                        if (cell.type === 'corridor' || cell.type === 'door'){
                            // If it only has one exit, it's a dead end.
                            var exits = 0;
                            
                            _.forEach(Directions, function (dir, key) {
                                if (self.isCellAnCorridorOrArchway(cell, dir, specs)){
                                    exits++;
                                } 
                            });
                            
                            if (exits <= 1){ //it's a dead end
                                done = false;
                                self.uncarve({x: cell.x, y: cell.y});
                            }
 
                        }
                    });
                }
            };
            
            self.getMap = function (specs) {
                self.fillGrid(specs);
                self.generateRooms(specs);
                self.carveRoomSpace();
                self.generateCorridors(specs);
                self.createDoorConnections(specs);
                self.removeCorridorsDeadEnds(specs);
                
                return {
                    grid: self.grid,
                    rooms: self.rooms
                };
            };
            
            

    }]);
})();