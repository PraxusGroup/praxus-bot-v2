(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('MembersListController', MembersListController);

  /* @ngInject */
  function MembersListController(gamers, current) {
    var vm = this;

    vm.gamers  = gamers;
    vm.current = current;
  }
})();
