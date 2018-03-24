(function() {
    'use strict';

    angular.module('PLATEBOX')
            .config(['$routeProvider', function ($routeProvider) { 
                    $routeProvider.when("/",                        {templateUrl: "templates/mainGamePanel.html", reloadOnSearch: false, name: 'mainGamePanel'});
                    $routeProvider.when("/mainGamePanel",           {templateUrl: "templates/mainGamePanel.html", reloadOnSearch: false, name: 'mainGamePanel'});
                    
                    $routeProvider.otherwise({redirectTo: "/mainGamePanel"});
                }]);

})();




