
;(function() {
  'use strict';

  angular
    .module('app.landing')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    $stateProvider
      .state({
        name: 'Landing',
        url: '/',
        title: 'Mirror',
        views: {
          'main@': {
            templateUrl: 'app/+landing/landing.html',
            controller: function(){},
            controllerAs: 'vm'
          }
        }
      });
  }

})();
