(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .directive('sideNav', sideNav);

  /* @ngInject */
  function sideNav(multiline) {
    var template = multiline(function(){/*
      
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller() {
    var sm = this;


  }
})();
