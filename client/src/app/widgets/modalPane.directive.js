(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('modalPane', modalPane);

  /* @ngInject */
  function modalPane(multiline) {
    var template = multiline(function(){/*
      <!-- Modal Structure -->
      <div id="{{ dm.name }}" class="modal" ng-class="dm.modalClass">
        <div class="modal-title" ng-transclude="titleBar"></div>
        <div class="modal-content" ng-transclude="body"></div>
        <div class="modal-footer" ng-transclude="actions"></div>
      </div>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        name: '@',
        modalClass: '@'
      },
      transclude: {
        'body': 'modalBody',
        'actions': 'modalActions',
        'titleBar': '?modalTitle'
      },
      controller: Controller,
      controllerAs: 'dm'
    };

    return directive;

  }

  /* @ngInject */
  function Controller(){
    var dm = this;
  }
})();
