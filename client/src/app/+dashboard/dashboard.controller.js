(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  /* @ngInject */
  function DashboardController(gamers) {
    var vm = this;

    vm.gamers = gamers;
    vm.lastActvityFilter = lastActvityFilter;

    function lastActvityFilter(item) {
      var cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 1);

      //return true;

      return new Date(item.lastForgivenTime) < cutoff;
    }
  }
})();
