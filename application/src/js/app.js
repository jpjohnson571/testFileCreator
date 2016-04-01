/* App Module */

angular.module('dc4SearchApp', ['ui.router']);

angular.module('dc4SearchApp').config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];
  function routes($stateProvider, $urlRouterProvider) {
    console.log("routing");
      $urlRouterProvider.otherwise('/company-search/');

      $stateProvider
      .state('company-search', {
          url:'/company-search/',
          templateUrl: '/views/company-search.html',
          // templateUrl: '/views/vendor.tab.html',
          // templateUrl: '/views/doctype.tab.html',
          // templateUrl: '/views/retailer.tab.html',
          // templateUrl: '/views/display.html',
          controller: 'companySearchCtrl'
      })
      .state('vendor-layout', {
          templateUrl: '/views/vendor.tab.html',
      })
      .state('doctype-layout', {
          templateUrl: '/views/doctype.tab.html',
      })
      .state('retailer-layout', {
          templateUrl: '/views/retailer.tab.html',
      });
  }


  angular.module('dc4SearchApp').controller('companySearchCtrl', companySearchCtrl);

    companySearchCtrl.$inject = ["$scope"];
    function companySearchCtrl($scope) {

      $scope.showTab = 'vendor';
      $scope.options = [{
         value: '856'
      }, {
         value: '850'
      }];

      $scope.profiles = [
        {
          name: 'profile1',
          information: 'desired info for this profile goes here',
          capability: {
            name: 'capability1',
            information: 'display capability information here'
          }
        },
        {
          name: 'profile2',
          information: 'desired info for this profile goes here',
          capability: {
            name: 'capability1',
            information: 'display capability information here'
          },
          capability: {
            name: 'capability2',
            information: 'display capability information here'
          }
        },
        {
          name: 'profile3',
          information: 'desired info for this profile goes here',
          capability: {
            name: 'capability1',
            information: 'display capability information here'
          }
        }];

      $scope.documents = [];
      $scope.tab = 'vendor-layout';
      $scope.addDocument = function(document) {
        console.log(document);
        $scope.documents.push(document);
        console.log($scope.documents);
      }
      $scope.removeDocument = function(index) {
        $scope.documents.splice(index, 1);
        console.log($scope.documents);
      }
      $scope.showCapabilities = function(profile, true_false) {
        profile.showCapabilities = true_false;
      }

      console.log('controller');
  }