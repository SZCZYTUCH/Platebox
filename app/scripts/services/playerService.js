(function() {
    'use strict';

    angular.module('PLATEBOX')
        .service('playerService',['$rootScope', function($rootScope) {
            var self = this;
    
            self.randomPlayerStartPosition = function(){
                
            };
            
            self.movePlayer = function(move){
                let redirectDirection = '';
                    switch (move.direction) {
                        case 'nw':{
                            redirectDirection = 'se';
                            move.playerObject.x = move.playerObject.x+1; move.playerObject.y = move.playerObject.y+1;
                            break;
                        }
                        case 'n':{
                            redirectDirection = 's';
                            move.playerObject.x = move.playerObject.x+1;
                            break;
                        }
                        case 'ne':{
                            redirectDirection = 'sw';
                            move.playerObject.x = move.playerObject.x+1; move.playerObject.y = move.playerObject.y-1;
                            break;
                        }
                        case 'e':{
                            redirectDirection = 'w';
                            move.playerObject.y = move.playerObject.y-1;
                            break;
                        }
                        case 'se':{
                            redirectDirection = 'nw';
                            move.playerObject.x = move.playerObject.x-1; move.playerObject.y = move.playerObject.y-1;
                            break;
                        }
                        case 's':{
                            redirectDirection = 'n';
                            move.playerObject.x = move.playerObject.x-1;
                            break;
                        }
                        case 'sw':{
                            redirectDirection = 'ne';
                            move.playerObject.x = move.playerObject.x-1; move.playerObject.y = move.playerObject.y+1;
                            break;
                        }
                        case 'w':{
                            redirectDirection = 'e';
                            move.playerObject.y = move.playerObject.y+1;
                            break;
                        }
                    };
                
            };
            
            self.tryAvailability = function(pos){
                
            };

        }]);
})();