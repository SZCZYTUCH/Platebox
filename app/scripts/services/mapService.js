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

            
            
            self.grid = {};
            self.rooms = [];
            
            self.fillGrid = function (specs) {
                var k = 0;
                for (var i = 0; i <= specs.w; i++) {
                    for (var j = 0; j <= specs.h; j++) {
                        //var invar = _.sample(self.sampleArray);
                        self.grid['G' + i +'_'+ j] = {x: i, y: j, filled: false, background: 'black'};
                        k++;
                    }
                }
            };
            
            self.tries = 220;
            self.roomExtraSize = 1;
            
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

                    var curent_room = {x:x, y:y, width:width, height:height};

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
                    var color = _.sample(['blue', 'green', 'yellow', 'teal']);
                    for (var j = 0; j < room.width; j++) {
                        for (var k = 0; k < room.height; k++) {
                            //console.log('seting up '+'G'+(room.x+j)+'_'+(room.x+k));
                            self.carve( {x:(room.x+j), y:(room.y+k)});
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
                            //self.generateCorridor({x:x,y:y});
                        };
                    }
                }
            };
            
            self.carve = function(coord){
                self.grid['G'+(coord.x)+'_'+(coord.y)].background = 'white';
                self.grid['G'+(coord.x)+'_'+(coord.y)].filled = true;
            };
            
            self.canThisCellBeNextCandidate = function(cell){
                //candidate cell can not be room wall, border, can be another corridor tho
                
                
                
                
                
                
                
                
                //todo
            };
            
            //todo
            self.generateCorridor = function (startingPoint) {
                
                var Directions = [{x:-1}, {x:1}, {y:-1}, {y:1}];
                var corridor = [];
                var lastDir;

                //_startRegion();
                self.carve(startingPoint);

                corridor.push(startingPoint);
                
                while (corridor.length > 0) {
                    var currentlyProbedCell = _.last(corridor);

                    // See which adjacent cells are open and possible candidate.
                    var extensionCandidatesCells = []; //<Direction>
                    
                    _.forEach(Directions, function (dir, key) {
                        var cellDirection = 0;
                        if (self.canThisCellBeNextCandidate(currentlyProbedCell, dir)){
                            extensionCandidatesCells.add(dir);
                        } 
                    });


                    if (extensionCandidatesCells.length > 0) {
                        // Based on how "windy" passages are, try to prefer carving in the
                        // same direction.
                        var dir;
                        if (extensionCandidatesCells.contains(lastDir) && rng.range(100) > windingPercent) {
                            dir = lastDir;
                        } else {
                            dir = rng.item(extensionCandidatesCells);
                        }

                        _carve(currentlyProbedCell + dir);
                        _carve(currentlyProbedCell + dir * 2);

                        corridor.add(currentlyProbedCell + dir * 2);
                        lastDir = dir;
                    } else {
                        // No adjacent cells open.
                        corridor.removeLast();

                        // This path has ended.
                        lastDir = null;
                    }
                }

            };
            
            self.getMap = function (specs) {
                self.fillGrid(specs);
                self.generateRooms(specs);
                self.carveRoomSpace();
                
                self.generateCorridors(specs);
                
                //self.grid['G50_27'].background = 'blue';
                
                return {
                    grid: self.grid,
                    rooms: self.rooms
                };
            };
            
            

    }]);
})();