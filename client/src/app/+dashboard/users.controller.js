(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('UsersController', UsersController);

  /* @ngInject */
  function UsersController(users, current) {
    var vm = this;

    vm.users   = users;
    vm.current = current;
  }
})();
