(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  /* @ngInject */
  function DashboardController(Gamer, gamers) {
    var vm = this;

    vm.gamers = gamers;
   
  }
})();
