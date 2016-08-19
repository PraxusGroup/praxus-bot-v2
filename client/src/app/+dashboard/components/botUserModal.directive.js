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
        </modal-body>
        <modal-actions>
          <action-button
            ng-click="sm.addNewBotUser()"
            style=""
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
  function Controller(BotUser, $timeout) {
    var sm = this;

    sm.loading = false;

    sm.addNewBotUser = addNewBotUser;
    sm.closeModal = closeModal;

    function addNewBotUser() {
      sm.loading = true;

      BotUser
        .create(sm.botUser)
        .$promise
        .then(function(res) {
          sm.users.push(res);
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