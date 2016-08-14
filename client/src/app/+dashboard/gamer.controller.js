(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('GamerController', GamerController);

  /* @ngInject */
  function GamerController(gamer) {
    var vm = this;

    vm.gamer = gamer;
  }
})();
