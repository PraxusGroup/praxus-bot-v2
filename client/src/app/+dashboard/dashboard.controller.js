(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  /* @ngInject */
  function DashboardController($state, Auth) {
    var vm = this;

    vm.logout = function() {
      Auth
        .logout()
        .$promise
        .then(function() {
          console.log('beans');
          $state.go('login');
        });
    };
   
  }
})();
