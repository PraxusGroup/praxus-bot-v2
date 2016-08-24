(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  /* @ngInject */
  function DashboardController(gamers, current) {
    var vm = this;

    vm.gamers  = gamers;
    vm.current = current;
    vm.lastActvityFilter = lastActvityFilter;

    function lastActvityFilter(item) {
      var cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 1);

      if (!item.roles.includes('Member') && !item.roles.includes('Applicant')) {
        return false;
      }

      return new Date(item.lastForgivenTime) < cutoff;
    }

    throw new Error('angular');
  }
})();
