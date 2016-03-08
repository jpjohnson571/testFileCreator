'use strict';

/* App Module */

var dc4SearchApp = angular.module('dc4SearchApp', [
  'ngRoute',
  'dc4SearchControllers'
]);

dc4SearchApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/company-search', {
        templateUrl: 'views/company-search.html',
        controller: 'CompanySearchCtrl'
      }).
      otherwise({
        redirectTo: '/company-search'
      });
  }]);
