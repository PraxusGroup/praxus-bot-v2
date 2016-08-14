;(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    var dashboardViews = {
      'main@': {
        templateUrl: 'app/+dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      }
    };

    var dashboardData = {
      permissions: {
        only: ['isLoggedIn'],
        redirectTo: 'login'
      }
    };

    var dashboardResolve = {
      gamers: getGamers
    };

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        views: dashboardViews,
        data: dashboardData,
        resolve: dashboardResolve
      });

    
    function getGamers($q, Gamer) {
      var deferred = $q.defer();

      var query = {
        filter: {
          include: 'notes',
          limit: 10,
          order: 'lastForgivenTime DESC'
        }
      };

      Gamer
        .find(query)
        .$promise
        .then(function(gamers) {
          var temp = [];
          gamers.forEach(function(gamer) {
            temp.push(gamer);
          });
          
          deferred.resolve(temp);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }
    
  }

})();
