(function() {
    'use strict';

    angular.module('PLATEBOX')

        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }]);
        

})();

