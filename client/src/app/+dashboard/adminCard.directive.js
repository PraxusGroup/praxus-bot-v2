;(function () {
  'use strict';

  angular
   .module('app.dashboard')
   .directive('adminCard', adminCard);

  /* @ngInject */
  function adminCard(multiline) {
    var template = multiline(function() {/*
      
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
  function Controller($state, Auth) {
    var sm = this;

  }
})();