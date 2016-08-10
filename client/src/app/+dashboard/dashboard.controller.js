(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  /* @ngInject */
  function DashboardController($state, User) {
    var vm = this;

    vm.logout = function() {
      User
        .logout()
        .$promise
        .then(function() {
          $state.go('login');
        });
    };
   
  }
})();
