(function() {
    'use strict';

    angular.module('PLATEBOX')
        .service('drawService',['$rootScope', function($rootScope) {
            var self = this;
            self.mapShape = new createjs.Shape();
                    
            self.drawMap = function(map, specs){
                
                _.forEach(map.grid, function (cell, key) {
                    
                    var x0, y0;
                    x0 = (cell.y * specs.size)+1;
                    y0 = (cell.x * specs.size)+1;
                    
                    self.mapShape.graphics.beginFill(cell.background);
                    self.mapShape.graphics.rect(x0, y0, specs.size-1, specs.size-1);      
                    self.mapShape.graphics.endFill();     

                });
                
                return self.mapShape;
            };
            


        }]);
})();