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
      users: getUsers
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
  function getUsers($stateParams, User) {
    return User.find({}).$promise;
  }

})();
