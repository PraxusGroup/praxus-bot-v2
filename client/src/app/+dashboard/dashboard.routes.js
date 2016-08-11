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
      /*events: mainEvents*/
    };

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        views: dashboardViews,
        data: dashboardData
      });

    /*
    function mainEvents($rootScope, $q, Events) {
      var deferred = $q.defer();

      Events
        .getCachedEvents($rootScope.city)
        .then(function(events) {
          if (events) return $q.resolve(events);

          return Events.getEvents($rootScope.city);
        })
        .then(deferred.resolve)
        .catch(deferred.reject);

      return deferred.promise;
    }
    */
  }

})();
