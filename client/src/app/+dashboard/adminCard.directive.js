;(function () {
  'use strict';

  angular
   .module('app.dashboard')
   .directive('adminCard', adminCard);

  /* @ngInject */
  function adminCard(multiline) {
    var template = multiline(function() {/*
      <div class="card grey darken-3 white-text" ng-click="sm.readNote()">
        <div class="card-content">
          <div class="notes">
            <a tooltipped
              class="btn-floating waves-effect waves-light"
              data-position="left" 
              data-delay="150"
              data-tooltip="Add Note"
              ng-click="sm.addNote($event)">
              <i class="material-icons">note_add</i>
            </a>
          </div>
          <div class="lastActive">
            <a tooltipped 
              data-position="right" 
              data-delay="150"
              data-tooltip="{{sm.gamer.lastDiscordActivity | date:'mediumDate'}}">
              {{ sm.daysAgo }} Days Ago
            </a>
          </div>
          <span class="card-title truncate">{{ sm.gamer.username }}</span>
          <p>
            Notes: {{sm.gamer.notes.length || 0}}
          </p>
        </div>
        <div class="card-action right-align">
          <a class="btn-flat waves-effect waves-light" 
            tooltipped 
            data-position="top" 
            data-delay="150"
            data-tooltip="Add +2 Weeks"
            ng-click="sm.forgive($event)">
            Forgive
          </a>
          <a class="primary-action btn-flat waves-effect waves-light"
            ng-click="sm.remove($event)">
            Remove
          </a>
        </div>
      </div>
      
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        gamer: '='
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($state, MemberNote) {
    var sm = this;

    sm.forgive  = forgive;
    sm.addNote  = addNote;
    sm.remove   = remove;
    sm.readNote = readNote;

    sm.daysAgo = daysBetween(new Date(), new Date(sm.gamer.lastDiscordActivity));

    function daysBetween(date1, date2) {
      var ONE_DAY = 1000 * 60 * 60 * 24;

      return Math.round(
        Math.abs(date1.getTime() - date2.getTime())/ONE_DAY
      );
    }

    function forgive($event) {
      $event.stopPropagation();

      var lastForgivenTime = new Date(sm.gamer.lastForgivenTime);
      lastForgivenTime.setDate(lastForgivenTime.getDate() + 14 );

      sm.gamer.lastForgivenTime = lastForgivenTime.toISOString();

      sm.gamer.$save();
    }

    function addNote($event) {
      $event.stopPropagation();

      var note = {
        postedBy: 'Admin',
        content: 'Test',
        gamerId: sm.gamer.id
      };

      MemberNote
        .create(note)
        .$promise
        .then(function(res) {
          sm.gamer.notes.push(res);
        });
    }

    function remove($event) {
      $event.stopPropagation();

      for (var i = 0; i < sm.gamer.roles.length; i++) {
        if (sm.gamer.roles[i] === 'Member') {
          sm.gamer.roles.splice(i, 1);
        }
      }

      //@TODO: API Call that makes the bot do this in discord too
      sm.gamer.$save();
    }

    function readNote() {
      $state.go('dashboard.gamer', {gamerId: sm.gamer.id});
    }

  }
})();