;(function () {
  'use strict';

  angular
   .module('app.dashboard')
   .directive('noteCard', noteCard);

  /* @ngInject */
  function noteCard(multiline) {
    var template = multiline(function() {/*
      <div class="card grey darken-3 white-text">
        <div class="card-content">
          <span class="card-title truncate">@{{ dm.note.postedBy }}</span>
          <p class="flow-text">
            {{ dm.note.content }}
          </p>
        </div>
      </div>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        note: '='
      },
      controller: function() {},
      controllerAs: 'dm'
    };

    return directive;
  }
})();