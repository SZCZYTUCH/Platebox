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
                        self.grid['G' + i +'_'+ j] = {x: i, y: j, filled: false, background: 'white'};
                        k++;
                    }
                }
            };
            
            self.tries = 1000;
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
            
//            self.distanceTo = function (curent_room, other) {
//                var dx = curent_room.x - other.x;
//                var dy = curent_room.y - other.y;
//                return Math.sqrt(dx * dx + dy * dy);
//            };
            
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
                            self.grid['G'+(room.x+j)+'_'+(room.y+k)].background = color;
                        }
                    }    
                });  
            };
            
            self.getMap = function (specs) {
                self.fillGrid(specs);
                self.generateRooms(specs);
                self.carveRoomSpace();
                
                //self.grid['G50_27'].background = 'blue';
                
                return {
                    grid: self.grid,
                    rooms: self.rooms
                };
            };
            
            

    }]);
})();