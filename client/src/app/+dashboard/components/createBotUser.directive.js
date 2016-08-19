;(function () {
  'use strict';

  angular
   .module('app.dashboard')
   .directive('createBotUser', createBotUser);

  /* @ngInject */
  function createBotUser(multiline) {
    var template = multiline(function() {/*
      <ul class="collection">
        <li class="collection-item primary-color white-text"
          ng-href="#Create-New-BotUser-Modal"
          modal>
          <div>
            Create New Admin BotUser
            <a class="secondary-content">
              <i class="material-icons white-text">add_circle</i>
            </a>
          </div>
        </li>
      </ul>
      <bot-user-modal 
        users="sm.users">
      </bot-user-modal>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        users: '='
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller(BotUser) {
    var sm = this;

  }
})();

