(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('materialTime', materialTime);

  /* @ngInject */
  function materialTime(multiline) {
    var template = multiline(function(){/*
      <div input-field>
        <select class="" ng-model="dm.model" material-select watch>
          <option 
            ng-repeat="value in dm.timeOptions"
            ng-selected="value == dm.model">{{value}}</option>
        </select>
        <label class="select">{{ dm.label }}</label>
      </div>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        model: '=ngModel',
        name: '@',
        label: '@',
        format: '@'
      },
      controller: function() {},
      controllerAs: 'dm',
      link: link
    };

    return directive;

    function link(scope, element) {
      var dm = scope.dm;

      dm.timeOptions = [];

      var timeStart = 7;
      var timeSelection = 'AM';
      var timeIncrement = '30';

      while (timeStart <= 12) {
        if (timeStart === 12) {
          timeSelection = 'PM';
        }

        addTime();
      }

      timeStart = 1;
      timeSelection = 'PM';

      while (timeStart <= 11) {
        addTime();
      }

      function addTime() {
        var time = timeStart + '';

        if (time.length === 1) {
          time = '0' + time;
        }

        dm.timeOptions.push(time + ':00 ' + timeSelection);
        dm.timeOptions.push(time + ':' + timeIncrement + ' ' + timeSelection);

        timeStart++;
      }
    }
  }
})();