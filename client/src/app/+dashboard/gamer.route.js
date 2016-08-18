;(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    var views = {
      'main@': {
        templateUrl: 'app/+dashboard/gamer.html',
        controller: 'GamerController',
        controllerAs: 'vm'
      }
    };

    var data = {
      permissions: {
        only: ['isLoggedIn'],
        redirectTo: 'login'
      }
    };

    var resolve = {
      gamer: getGamer
    };

    $stateProvider
      .state('dashboard.gamer', {
        url: '/gamer/:gamerId',
        views: views,
        data: data,
        resolve: resolve
      });
  }

  /* @ngInject */
  function getGamer($stateParams, Gamer) {
    var query = {
      filter: {
        where: {
          id: $stateParams.gamerId
        },
        include: 'notes'
      }
    };

    return Gamer.findOne(query).$promise;
  }

})();
