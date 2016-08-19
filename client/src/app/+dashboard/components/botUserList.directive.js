;(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .directive('botUserList', botUserList);

  /* @ngInject */
  function botUserList(multiline) {
    var template = multiline(function(){/*
     <ul class="collection">
        <li class="collection-item" ng-repeat="user in sm.users">
          <div> 
            {{ user.username }} {{ user.id === sm.current.id ? '(You)' : '' }}
            <a ng-if="user.id !== sm.current.id"
              class="secondary-content"
              ng-click="sm.removeUser(user.id)">
              <i class="material-icons">delete</i>
            </a>
          </div>
        </li>
      </ul>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        users: '=',
        current: '='
      },
      controller: Controller,
      controllerAs: 'sm',
    };

    return directive;
  }

  /* @ngInject */
  function Controller(BotUser, Dialog) {
    var sm = this;

    sm.removeUser = removeUser;

    function removeUser(userId) {
      BotUser
        .deleteById({id: userId})
        .$promise
        .then(function() {
          Dialog.success('Deleted User', 'Successfully deleted user');
        })
        .catch(function(err){
          Dialog.error('Error', 'Unable to delete user' + (err.message || err));
        });
    }
  }
})();