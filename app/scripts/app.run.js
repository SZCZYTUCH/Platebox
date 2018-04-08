(function () {
    'use strict';

    angular.module('PLATEBOX')
            .run(['$rootScope', '$location', 'APP_CONFIG', function ($rootScope, $location, APP_CONFIG) {

                console.log(APP_CONFIG);
        
                $rootScope.loading = false;
            
                $location.path("/mainGamePanel");
                
                $rootScope.lastPlayerMove = null;
                $rootScope.$watch('lastPlayerMove', function (newValue, oldValue) {
                    if ($rootScope.lastPlayerMove !== null) {
                        console.log(newValue);
                        $rootScope.lastPlayerMove = null;
                    }

                }, true);
            
                    
                    
            }]);

})();