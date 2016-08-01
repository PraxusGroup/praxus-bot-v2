(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('selectable', selectable);

  /* @ngInject */
  function selectable(multiline) {
    var template = multiline(function(){/*
      <a class="center-align waves-effect waves-light btn-flat"
        ng-click="dm.toggleSelect()"
        ng-class="dm.color">
        <span ng-transclude></span>
      </a>
    */});

    var directive = {
      restrict: 'E',
      transclude: true,
      template: template,
      scope: {},
      bindToController: {
        value: '=',
        selected: '=',
        checked: '=',
        other: '='
      },
      controller: Controller,
      controllerAs: 'dm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($scope){
    var dm = this;

    dm.checked = dm.checked || false;
    dm.toggleSelect = toggleSelect;

    function toggleSelect() {

      if(dm.selected === dm.value) {
        if (!dm.checked) {
          dm.checked = !dm.checked;
        }
      } else {
        dm.checked = !dm.checked;
      }

      if (dm.checked) {
        dm.selected = dm.value;
      }
    }

    $scope.$watch('dm.checked', toggleColor);

    function toggleColor() {
      dm.color = dm.checked ? 'primary-action' : 'grey-text';
    }
  }
})();
