(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('UsersController', UsersController);

  /* @ngInject */
  function UsersController(users) {
    var vm = this;

    vm.users = users;
  }
})();
