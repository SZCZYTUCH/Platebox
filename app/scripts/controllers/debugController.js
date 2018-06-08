(function () {
    'use strict';

    angular.module('PLATEBOX')
        .controller('debugController', ['$scope', '$rootScope', '$element', '$compile', '$timeout', function ($scope, $rootScope, $element, $compile, $timeout) {
            
            $scope.testtest = function(){
                console.log('test test');
            };
            
            $scope.generateMap = function(){
                $element.append($compile('<div class="plate-map" ng-controller="mapController" >\
                </div>')($scope)); 
                
                
                

            };
                
            $scope.generateGrid = function(){
                $element.append($compile('<div class="plate-body" ng-controller="gridController" >\
                    <div class="plate-main" ng-style="mainPlateStyle()">\
                            <div class="plate-box" ng-style="plateStyle(box)" ng-repeat="box in grid" box-handle>\
                                <div class="plate-inn">\
                                    <div ng-style="plateBackground(box)"></div>\
                                    <div></div>\
                                </div>\
                            </div>\
                    </div>\
                </div>')($scope));  
//
//                <div class="plate-info flex-center"><div class="plate-box plate-reroll" ng-click="reRoll()" >R</div></div>\
//                <div class="plate-info"  ng-bind="scoreVar.str" ></div>\
//                <div class="plate-info"><span ng-repeat="can in candidates">[{{can.invar}}]</span></div>\
//                <div class="plate-info"><span ng-repeat="p in patch">[{{p.x}} {{p.y}}] -\> </span></div>\
//                <div ng-style="plateBackground(box)">{{box.invar}}</div>\
//                <div>({{box.x}},{{box.y}}) ({{box.xPos}},{{box.yPos}})</div>\
//                <div>{{box.taken}}</div>\
//                <div class="plate-info" ng-click="begin()" ng-bind="currentInvar" ></div>\
            };
            
            
            //$scope.generateMap();
            //$scope.generateGrid();
            
        }]);

})();