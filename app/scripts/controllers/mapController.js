(function () {
    'use strict';

    angular.module('PLATEBOX')
        .controller('mapController', ['$scope', '$rootScope', '$element', '$compile', '$timeout', 'mapService', 'playerService',
                             function ($scope,   $rootScope,   $element,   $compile,   $timeout,   mapService,   playerService) {
            
            $scope.specs = {
                w: 30,
                h: 30,
                size: 9
            };
            
            $scope.map = {};
            
            $scope.player = {
                x: 0,
                y: 0
            };
            
            $scope.overflowBoxStyle = function(){
                return{
                    width: '280px',
                    height: '280px',
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
            
            $scope.playerStyle = function(){
                return {
                    transform: 'translate3d(' + ($scope.player.y * $scope.specs.size) + 'px,' + ($scope.player.x * $scope.specs.size) + 'px,0)',
                    width: ($scope.specs.size-1) + 'px',
                    height: ($scope.specs.size-1) + 'px',
                };
            };
            
            $scope.map = mapService.getMap($scope.specs);
            
            
            
            $scope.player = {
                x: $scope.map.rooms[0].x,
                y: $scope.map.rooms[0].y
            };
            
            
            

            
            console.log($scope.map);
            
            $rootScope.$watch('lastPlayerMove', function (newValue, oldValue) {
                if ($rootScope.lastPlayerMove !== null) {
                    console.log(newValue);
                    
                    playerService.movePlayer({
                        direction: newValue.lastDirection,
                        power: 1,
                        playerObject: $scope.player
                    });
                    
                    $rootScope.lastPlayerMove = null;
                }

            }, true);

        }]);

})();