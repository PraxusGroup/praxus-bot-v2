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
              ng-click="sm.removeUser(user)">
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

    function removeUser(user) {
      Dialog
        .confirm('Are you sure?', 'Are you sure you want to delete ' + user.username)
        .then(function(confirm) {
          if (!confirm) Dialog.escapePromise();

          return BotUser.deleteById({id: user.id}).$promise;
        })
        .then(function() {
          Dialog.success('Deleted User', 'Successfully deleted user');

          for (var i = 0; i < sm.users.length; i++) { 
            if (sm.users[i].id === user.id) {
              sm.users.splice(i, 1);
              break;
            }
          }
        })
        .catch(function(err) {
          Dialog.error('Error', 'Unable to delete user' + (err.message || err));
        });
    }
  }
})();