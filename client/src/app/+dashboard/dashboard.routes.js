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
      },
      'navbar@': {
        template: '<side-nav class="slide-in anim-fade"></side-nav>'
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
          where: {
            roles: {
              inq: ['Member', 'Applicant']
            }
          },
          include: 'notes',
          limit: 10,
          order: 'lastForgivenTime DESC'
        }
      };

      return Gamer.find(query).$promise;
    }
    
  }

})();
