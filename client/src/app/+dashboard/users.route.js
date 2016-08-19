;(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    var views = {
      'main@': {
        templateUrl: 'app/+dashboard/users.html',
        controller: 'UsersController',
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
      users: getUsers,
      current: getCurrentBotUser
    };

    $stateProvider
      .state('dashboard.users', {
        url: '/users',
        views: views,
        data: data,
        resolve: resolve
      });
  }

  /* @ngInject */
  function getCurrentBotUser(BotUser) {
    return BotUser.getCurrent().$promise;
  }

  /* @ngInject */
  function getUsers($stateParams, BotUser) {
    return BotUser.find({}).$promise;
  }

})();
