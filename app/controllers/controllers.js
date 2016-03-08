'use strict';

/* Controllers */

var dc4SearchControllers = angular.module('dc4SearchControllers', []);

dc4SearchControllers.controller('CompanySearchCtrl', ['$scope', '$http',
  function($scope, $http){
    $scope.test = 'Hello, world!';
}]);
