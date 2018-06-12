(function () {
    'use strict';

    angular.module('PLATEBOX')
        .controller('mapController', ['$scope', '$rootScope', '$element', '$compile', '$timeout', 'mapService', 'playerService', 'drawService',
                             function ($scope,   $rootScope,   $element,   $compile,   $timeout,   mapService,   playerService,   drawService) {
            
            $scope.specs    = { w: 30,  h: 30,  size: 9 };
            $scope.map      = {};
            $scope.player   = { x: 0,   y: 0 };
            $scope.mapCanvas = new createjs.Stage("mapCanvas");
            //var container = new createjs.Container();
            createjs.Touch.enable($scope.mapCanvas);
            $scope.map = mapService.getMap($scope.specs);
            $scope.map.create_js_shape = drawService.drawMap($scope.map, $scope.specs);
            $scope.mapCanvas.addChild($scope.map.create_js_shape);
            $scope.mapCanvas.update();
            
            
//            $scope.map.create_js_shape.on("pressmove", function(evt) {
//                console.log(evt);
//                evt.target.x = evt.stageX;
//                evt.target.y = evt.stageY;
//            });
//            $scope.map.create_js_shape.on("pressup", function(evt) { console.log("up"); })
            
            
            $scope.overflowBoxStyle = function(){
                return{
                    width: '280px',
                    height: '280px',
                };
            };
            
            $scope.canvasSize = function(){
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
            
            
            $scope.testClick = function(){
                console.log('testClick');
                
                $scope.mapCanvas.scaleX = 2;
                $scope.mapCanvas.scaleY = 2;
                $scope.mapCanvas.update();
            };
            
            
            $scope.player.x = $scope.map.rooms[0].x;
            $scope.player.y = $scope.map.rooms[0].y;

            console.log($scope.map);
            
            $rootScope.$watch('lastPlayerMove', function (newValue, oldValue) {
                if ($rootScope.lastPlayerMove !== null) {
                    console.log(newValue);
                    
                    playerService.movePlayer({
                        direction: newValue.lastDirection,
                        power: 1,
                        playerObject: $scope.player,
                        mapObject: $scope.map
                    });
                    
                    $rootScope.lastPlayerMove = null;
                }

            }, true);
            
        }]);

})();