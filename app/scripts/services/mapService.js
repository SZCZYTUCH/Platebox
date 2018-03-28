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
                    //console.log('starting for '+i);
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
                    if (self.isOverlaping(curent_room, {x: 0, y: specs.w + 1, width: specs.w + 1, height: 1})) {
                        not_overlaping = false;
                    }
                    //checks if curent_room overlaps the right edge
                    if (self.isOverlaping(curent_room, {x: specs.h + 1, y: 0, width: 1, height: specs.h + 1})) {
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
                    //var color = _.sample(['blue', 'green', 'yellow', 'teal']);
                    for (var j = 0; j < room.width; j++) {
                        for (var k = 0; k < room.height; k++) {
                            //console.log('seting up '+'G'+(room.x+j)+'_'+(room.y+k));
                            self.carve({x:(room.x+j), y:(room.y+k)}, '#a5c7c7', ('room_'+key) );
                        }
                    }    
                });  
            };
            
            self.generateCorridors = function (specs) {
                for (var y = 1; y < specs.h; y += 2) {
                    for (var x = 1; x < specs.w; x += 2) {
                        //console.log(self.grid['G'+(x)+'_'+(y)].filled);
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
                //console.log(startingPoint);
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
                    
                    //console.log(extensionCandidatesCells);
                    
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
            
            self.carveDoor = function(door){
                
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
                                    self.connectorRegions.push({cell:candidate, connectorType: 'c-r', closed: true}); 
                                } 
                            });
                        };
                        // Find all the tiles that can connect two rooms together.
                        //if cell is a null type check for possible door connection between rooms
                        if (self.grid['G'+(x)+'_'+(y)].type === null){
                            if (self.canThisNullCellBeNextCandidateForDoorConnector({x:x, y:y})){
                                self.connectorRegions.push({cell:{x:x, y:y}, connectorType: 'r-r', closed: true}); 
                            }
                        }
                    }
                };
                
                //link connector regions to rooms
                _.forEach(self.rooms, function (room, k) {
                    for (var j = -1; j < room.width+1; j++) {
                        for (var k = -1; k < room.height+1; k++) {                            
                            var door = _.find(self.connectorRegions, function(connector) { return (connector.cell.x === (room.x+j) && connector.cell.y === (room.y+k)); });
                            if (door !== undefined){  room.doors.push(door);  }
                        }
                    }
                });
                
                //randomly select doors to carve, remove the rest
                _.forEach(self.rooms, function (room, k) {
                    var roomSize  = (room.width*room.height);
                    var maxDoors = Math.floor(Math.pow(roomSize*0.79370005232323, 0.44727752133702440338));
                    var randNumDoors = _.random(maxDoors);
                    var finalDoorsArray = [];
                    
                    
                    //finalDoorsArray.push(_.sample(room.doors));
                    //finalDoorsArray[0].closed = false;
                    
                    console.log('Room size: '+roomSize);
                    console.log('Maximum doors for the room: '+maxDoors);

//                    while (finalDoorsArray.length < randNumDoors){
//                        var drawDoor = null;
//                        //TODO optymalize
//                        while (drawDoor === null || drawDoor.closed){
//                            drawDoor = _.sample(room.doors);
//                        }
//                        
//                        
//                        
//                    }    
                });
                
                
                
                
                _.forEach(self.connectorRegions, function (connector, k) {
                    //console.log(connector);
                    var cellCopy = connector.cell;
                    if (connector.connectorType === 'c-r'){  
                        self.grid['G'+(cellCopy.x)+'_'+(cellCopy.y)].background = 'orange';
                    } else if(connector.connectorType === 'r-r'){
                        self.grid['G'+(cellCopy.x)+'_'+(cellCopy.y)].background = 'pink';
                    }
                    
                    
                    
                });
                
                console.log(self.rooms);
                
//                for (var pos in bounds.inflate(-1)) {
//                    // Can't already be part of a region.
//                    if (getTile(pos) != Tiles.wall)
//                        continue;
//
//                    //var regions = new Set<int>();
//                    for (var dir in Direction.CARDINAL) {
//                        var region = _regions[pos + dir];
//                        if (region != null)
//                            regions.add(region);
//                    }
//
//                    if (regions.length < 2)
//                        continue;
//
//                    connectorRegions[pos] = regions;
//                }
//
//                var connectors = connectorRegions.keys.toList();
//
//                // Keep track of which regions have been merged. This maps an original
//                // region index to the one it has been merged to.
//                var merged = {};
//                //var openRegions = new Set<int>();
//                for (var i = 0; i <= _currentRegion; i++) {
//                    merged[i] = i;
//                    openRegions.add(i);
//                }
//
//                // Keep connecting regions until we're down to one.
//                while (openRegions.length > 1) {
//                    var connector = rng.item(connectors);
//
//                    // Carve the connection.
//                    _addJunction(connector);
//
//                    // Merge the connected regions. We'll pick one region (arbitrarily) and
//                    // map all of the other regions to its index.
//                    var regions = connectorRegions[connector]
//                            .map((region) => merged[region]);
//                    var dest = regions.first;
//                    var sources = regions.skip(1).toList();
//
//                    // Merge all of the affected regions. We have to look at *all* of the
//                    // regions because other regions may have previously been merged with
//                    // some of the ones we're merging now.
//                    for (var i = 0; i <= _currentRegion; i++) {
//                        if (sources.contains(merged[i])) {
//                            merged[i] = dest;
//                        }
//                    }
//
//                    // The sources are no longer in use.
//                    openRegions.removeAll(sources);
//
//                    // Remove any connectors that aren't needed anymore.
//                    connectors.removeWhere((pos), {
//                        // Don't allow connectors right next to each other.
//                        //if (connector - pos < 2) return true;
//
//                        // If the connector no long spans different regions, we don't need it.
//                        //var regions = connectorRegions[pos].map((region) => merged[region])
//                        //    .toSet();
//
//                        //if (regions.length > 1) return false;
//
//                        // This connecter isn't needed, but connect it occasionally so that the
//                        // dungeon isn't singly-connected.
//                        //if (rng.oneIn(extraConnectorChance)) _addJunction(pos);
//
//                        //return true;
//                    });
//                }
            };
            
            self.getMap = function (specs) {
                self.fillGrid(specs);
                self.generateRooms(specs);
                self.carveRoomSpace();
                
                self.generateCorridors(specs);
                
                self.createDoorConnections(specs);
                //self.grid['G50_27'].background = 'blue';
                
                return {
                    grid: self.grid,
                    rooms: self.rooms
                };
            };
            
            

    }]);
})();