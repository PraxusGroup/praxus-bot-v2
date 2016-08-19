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
          <div class="notes"
            ng-href="#{{sm.gamer.id}}"
            ng-click="sm.stopEvent($event)"
            modal>
            <a tooltipped
              class="btn-floating waves-effect waves-light"
              data-position="left" 
              data-delay="150"
              data-tooltip="Add Note">
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
          <a class="btn-flat white-text waves-effect waves-light" 
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
      <note-modal gamer="sm.gamer" current="sm.current"></note-modal>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        gamer: '=',
        current: '='
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($state, MemberNote) {
    var sm = this;

    sm.forgive   = forgive;
    sm.remove    = remove;
    sm.readNote  = readNote;
    sm.stopEvent = stopEvent;

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

    function stopEvent($event) {
      $event.stopPropagation();
    }

    function remove($event) {
      $event.stopPropagation();

      for (var i = 0; i < sm.gamer.roles.length; i++) {
        if (sm.gamer.roles[i] === 'Member' || 
          sm.gamer.roles[i] === 'Applicant') {
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