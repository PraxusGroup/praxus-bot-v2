;(function() {
  'use strict';

  angular
    .module('app.login')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'landing',
        url: '/',
        redirectTo: 'login'
      })
      .state({
        name: 'login',
        url: '/login?token&email',
        views: {
          'main@': {
            templateUrl: 'app/+login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
          }
        },
        data: {
          permissions: {
            except: ['isLoggedIn'],
            redirectTo: 'dashboard'
          }
        }
      });
  }

})();
