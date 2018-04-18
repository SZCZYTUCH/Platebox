(function() {
    'use strict';

    angular.module('PLATEBOX')
        .service('playerService',['$rootScope', function($rootScope) {
            var self = this;
    
            self.randomPlayerStartPosition = function(){
                
            };
            
            self.movePlayer = function(move){
                let redirectDirection = '';
                switch (move.direction){
                    case 'nw':  { redirectDirection = 'se'; break;}
                    case 'n':   { redirectDirection = 's'; break;}
                    case 'ne':  { redirectDirection = 'sw'; break;}
                    case 'e':   { redirectDirection = 'w'; break;}
                    case 'se':  { redirectDirection = 'nw'; break;}
                    case 's':   { redirectDirection = 'n'; break;}
                    case 'sw':  { redirectDirection = 'ne'; break;}
                    case 'w':   { redirectDirection = 'e'; break;}                         
                };
                
                
                //move.playerObject.x = move.playerObject.x+1;
                
                
            };

        }]);
})();