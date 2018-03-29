(function () {
    'use strict';

    angular.module('PLATEBOX')
        .controller('mapController', ['$scope', '$rootScope', '$element', '$compile', '$timeout', 'mapService', function ($scope, $rootScope, $element, $compile, $timeout, mapService) {

            var self = this; 
            
            $scope.specs = {
                w: 30,
                h: 30,
                size: 9

            };
            
            $scope.mapBoxStyle = function(){
                return{
                    width: ($scope.specs.w * $scope.specs.size)+'px',
                    height: ($scope.specs.h * $scope.specs.size)+'px'
                };
            };
            
            $scope.plateStyle = function (square) {

                return {
                    transform: 'translate3d(' + (square.y * $scope.specs.size) + 'px,' + (square.x * $scope.specs.size) + 'px,0)',
                    width: $scope.specs.size + 'px',
                    height: $scope.specs.size + 'px',
                    'background-color': square.background,
                    
                };

            };
            
            $scope.map = {};
            
            $scope.map = mapService.getMap($scope.specs);
            
            
            console.log($scope.map);

        }]);

})();