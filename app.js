/**
 * Created by arnab_000 on 18-06-2014.
 */
var app = angular.module('cApp4',['MwApiActions','ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'form.html',
                controller: 'loginController'
            })

            .state('home', {
                url: '/home',
                templateUrl: 'home.html',
                controller: 'homeController'
            });

    }
]);


app.controller('homeController',function(){

});


app.controller('loginController',['$scope','$state','$q','LoginFactory','UserFactory',function($scope,$state,$q,LoginFactory,UserFactory) {

    $scope.validate = function () {

        //Initialise global user factory by public methods
        UserFactory.setValue('username', $scope.user.username);
        UserFactory.setValue('password', $scope.user.password);

        LoginFactory.logMeIn().then(function(data){

            if (UserFactory.getValue('loginStatus') != "Success") {
                $scope.iferror = true;
                $scope.error = UserFactory.getValue('loginStatus')
            }
            else {
                $scope.error = UserFactory.getValue('loginStatus');
                $state.go('home');
            }

        });

    }


}]);







