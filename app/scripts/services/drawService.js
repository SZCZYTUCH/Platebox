(function() {
    'use strict';

    angular.module('PLATEBOX')
        .service('drawService',['$rootScope', function($rootScope) {
            var self = this;
            self.mapShape = new createjs.Shape();
                    
            self.drawMap = function(map, specs){
                
                
                
                
                
                return self.mapShape;
            };
            


        }]);
})();