;(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .directive('botUserModal', botUserModal);

  /* @ngInject */
  function botUserModal(multiline) {
    var template = multiline(function(){/*
      <modal-pane name="Create-New-BotUser-Modal">
        <modal-title class="primary-action">
          <h5 class="title truncate">{{ sm.botUser.username || 'Create New User' }}</h5>
          <i class="modal-close-button modal-close material-icons right">clear</i>
        </modal-title>
        <modal-body>
          <div class="row">
            <div class="col s12">
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <material-input
                name="username"
                label="Username"
                placeholder=" "
                required="true"
                ng-model="sm.botUser.username">
              </material-input>
              <material-input
                name="email"
                label="Email"
                placeholder=" "
                type="email"
                validate="true"
                required="true"
                ng-model="sm.botUser.email">
              </material-input>
              <material-input
                name="password"
                label="Password"
                required="true"
                placeholder=" "
                type="password"
                ng-model="sm.botUser.password">
              </material-input>
              <material-input
                name="confirm"
                label="Confirm Password"
                placeholder=" "
                required="true"
                type="password"
                ng-model="sm.confirm">
              </material-input>
            </div>
          </div>
        </modal-body>
        <modal-actions>
          <action-button
            ng-click="sm.addNewBotUser()"
            default-message="New User"
            loading-state="sm.loading">
          </action-button>
          <div 
            ng-click="sm.closeModal()"
            class="modal-close btn btn-flat waves-effect waves-light">
            Cancel
          </div>
        </modal-actions>
      </modal-pane>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        users: '='
      },
      controller: Controller,
      controllerAs: 'sm',
    };

    return directive;
  }

  /* @ngInject */
  function Controller(BotUser, Dialog, $timeout) {
    var sm = this;

    sm.loading = false;

    sm.addNewBotUser = addNewBotUser;
    sm.closeModal = closeModal;

    function addNewBotUser() {
      sm.loading = true;

      return;

      if (sm.confirm !== sm.botUser.password) {

        return Dialog.error(
            'Confirm Password Incorrect', 
            'Your confirm password does not match the password you entered'
          )
          .then(function() {
            sm.loading = false;
          });
      }

      BotUser
        .create(sm.botUser)
        .$promise
        .then(function(res) {
          sm.users.push(res);

          return Dialog.success('Added User', 'Successfully added user');
        })
        .then(function(res) {
          sm.loading = 'success';
          sm.closeModal();
        });
    }
    
    function closeModal() {
      var modalId = '#Create-New-BotUser-Modal';
      $(modalId).closeModal();

      $timeout(function() {
        sm.botUser = {};
        sm.loading = false;
      }, 250);
    }
  }
})();