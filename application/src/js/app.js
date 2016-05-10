/* App Module */

angular.module('dc4SearchApp', ['ui.router', 'webui-core']);

angular.module('dc4SearchApp').config(routes);

  routes.$inject = ['$stateProvider', '$urlRouterProvider'];
  function routes($stateProvider, $urlRouterProvider) {
    // console.log("routing");
      $urlRouterProvider.otherwise('/company-search/');
      $stateProvider.state('company-search', {
          url:'/company-search/',
          templateUrl: '/views/company-search.html',
          controller: 'companySearchCtrl'
      })
    }


  angular.module('dc4SearchApp').controller('companySearchCtrl', companySearchCtrl);

    companySearchCtrl.$inject = ["$scope"];
    function companySearchCtrl($scope) {

      $scope.tabs = [
        { title:"Vendor", url:"views/vendor.tab.html", index: 0},
        { title:"DataType", url:"views/doctype.tab.html", index: 1},
        { title:"Retailer", url:"views/retailer.tab.html", index: 2}
      ]


      $scope.currentTab = 0;

      $scope.onClickTab = function (tab) {
          $scope.currentTab = tab.index;
      }
      $scope.nextTab = function() {
        if ($scope.currentTab == 2){
          $scope.currentTab = 0;
        } else {
          $scope.currentTab += 1;
        }
      }
      $scope.previousTab = function() {
        if ($scope.currentTab == 2){
          $scope.currentTab -= 1;
        } else {
          $scope.currentTab -= 1;
        }
      }


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
      $scope.addDocument = function(document) {
        console.log(document);
        $scope.documents.push(document);
        console.log($scope.documents);
      };
      $scope.removeDocument = function(index) {
        $scope.documents.splice(index, 1);
        console.log($scope.documents);
      };
      $scope.showCapabilities = function(profile, true_false) {
        profile.showCapabilities = true_false;
      };

      // console.log('controller');
  }
