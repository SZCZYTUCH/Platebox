(function() {
    'use strict';

    angular.module('PLATEBOX')
        .service('playerService',['$rootScope', function($rootScope) {
            var self = this;
    
            self.randomPlayerStartPosition = function(){
                
            };
            
            self.tryAvailability = function(x, y, mapObject){
                return mapObject.grid['G'+x+'_'+y].filled;
            };
            
            self.movePlayer = function(move){
                var x, y;
                let redirectDirection = '';
                switch (move.direction) {
                    case 'nw':{
                        redirectDirection = 'se';
                        x = move.playerObject.x+1, y = move.playerObject.y+1;
                        break;
                    }
                    case 'n':{
                        redirectDirection = 's';
                        x = move.playerObject.x+1, y = move.playerObject.y;
                        break;
                    }
                    case 'ne':{
                        redirectDirection = 'sw';
                        x = move.playerObject.x+1, y = move.playerObject.y-1;
                        break;
                    }
                    case 'e':{
                        redirectDirection = 'w';
                        x = move.playerObject.x, y = move.playerObject.y-1;
                        break;
                    }
                    case 'se':{
                        redirectDirection = 'nw';
                        x = move.playerObject.x-1, y = move.playerObject.y-1;
                        break;
                    }
                    case 's':{
                        redirectDirection = 'n';
                        x = move.playerObject.x-1, y = move.playerObject.y;
                        break;
                    }
                    case 'sw':{
                        redirectDirection = 'ne';
                        x = move.playerObject.x-1, y = move.playerObject.y+1;
                        break;
                    }
                    case 'w':{
                        redirectDirection = 'e';
                        x = move.playerObject.x, y = move.playerObject.y+1;
                        break;
                    }
                };
                
                if (self.tryAvailability(x,y, move.mapObject)){ move.playerObject.x = x; move.playerObject.y = y;   }
                
            };
            
            

        }]);
})();