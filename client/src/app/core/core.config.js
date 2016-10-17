;(function() {
  'use strict';

  angular
    .module('app.core')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig(
    $compileProvider,
    $httpProvider,
    $locationProvider,
    $urlRouterProvider,
    $uiViewScrollProvider) {

    //Performance Improvements
    $compileProvider.debugInfoEnabled(false);

    $httpProvider.useApplyAsync(true);

    //If these walls could talk
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('login');
    });

    $uiViewScrollProvider.useAnchorScroll();

    $httpProvider.interceptors.push(handleUnauth);
 
  }

  /* @ngInject */
  function handleUnauth($q, $location, LoopBackAuth) {
    return {
      responseError: function(rejection) {
        if (rejection.status === 401) {

          //Now clearing the loopback values from client browser for safe logout...
          LoopBackAuth.clearUser();
          LoopBackAuth.clearStorage();
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    };
  }

})();
