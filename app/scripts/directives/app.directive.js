(function () {
    'use strict';

    angular.module('PLATEBOX')
    
        .directive("boxHandle", function () {
            return {
       
                link: function (scope, element, attrs, ctr) {
                    element[0].scope = scope;
                    element[0].scope.box.element = element;
                    element[0].scope.box.patchPlateElement = angular.element(angular.element(angular.element(angular.element(element).children()[0])).children()[1]);
                }
            };
        });

})();