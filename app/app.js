'use strict';

/* App Module */

var dc4SearchApp = angular.module('dc4SearchApp', [
  'ngRoute',
  'dc4SearchControllers',
  'templates' // looks like its not used/existing, but needed for the different views
]);

dc4SearchApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/company-search', {
        templateUrl: 'company-search.html',
        controller: 'CompanySearchCtrl'
      }).
      otherwise({
        redirectTo: '/company-search'
      });
  }]);
