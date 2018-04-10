(function () {
    'use strict';

    angular.module('PLATEBOX')
            .run(['$rootScope', '$location', 'APP_CONFIG', function ($rootScope, $location, APP_CONFIG) {

                console.log(APP_CONFIG);
        
                $rootScope.loading = false;
                $rootScope.lastPlayerMove = null;
            
                $location.path("/mainGamePanel");
                
                
                
            
                    
                    
            }]);

})();