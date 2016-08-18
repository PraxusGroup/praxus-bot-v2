;(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .directive('noteModal', noteModal);

  /* @ngInject */
  function noteModal(multiline) {
    var template = multiline(function(){/*
      <modal-pane name="{{ sm.gamer.id }}">
        <modal-title class="primary-action">
          <h5 class="title truncate">{{ sm.gamer.username }}</h5>
          <i class="modal-close-button modal-close material-icons right">clear</i>
        </modal-title>
        <modal-body>
          <div class="row">
            <div class="col s12">
              @{{ sm.user.username }}
            </div>
          </div>
          <div class="row">
            <div class="col s12">
              <div input-field>
                <textarea 
                  ng-model="sm.note.content" 
                  class="materialize-textarea">
                </textarea>
                <label>Note Text</label>
              </div>
            </div>
          </div>
        </modal-body>
        <modal-actions>
          <action-button
            ng-click="sm.addNote()"
            default-message="Add Note"
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
        gamer: '='
      },
      controller: Controller,
      controllerAs: 'sm',
    };

    return directive;
  }

  /* @ngInject */
  function Controller(User, MemberNote, $timeout) {
    var sm = this;

    sm.loading = false;

    sm.addNote = addNote;
    sm.closeModal = closeModal;

    sm.note = {
      content: '',
      gamerId: sm.gamer.id
    };

    User
      .getCurrent()
      .$promise
      .then(function (user) {
        sm.user = user;
        sm.note.postedBy = sm.user.username;
      });

    function addNote() {
      sm.loading = true;

      MemberNote
        .create(sm.note)
        .$promise
        .then(function(res) {
          sm.loading = 'success';
          sm.gamer.notes.push(res);
          sm.closeModal();
        });
    }

    
    function closeModal() {
      var modalId = '#' + sm.gamer.id;
      $(modalId).closeModal();

      $timeout(function() {
        sm.note.content = '';
        sm.loading = false;
      }, 250);
    }
  }
})();