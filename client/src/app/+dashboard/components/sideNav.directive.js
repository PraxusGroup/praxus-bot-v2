(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .directive('sideNav', sideNav);

  /* @ngInject */
  function sideNav(multiline) {
    var template = multiline(function(){/*
      <ul id="slide-out" class="side-nav fixed">
        <li ui-sref-active-eq="active">
          <a ui-sref="dashboard">
            Dashboard
            <i class="material-icons">dashboard</i>
          </a>
        </li>
        <li ui-sref-active-eq="active">
          <a ui-sref="dashboard.users">
            Bot Users
            <i class="material-icons">android</i>
          </a>
        </li>
        <li>
          <a ng-click="sm.logout()">
            Logout
            <i class="material-icons">exit_to_app</i>
          </a>
        </li>
      </ul>
      <nav class="hide-on-large-only navbar-mobile">
        <a class="button-collapse" 
          data-activates="slide-out" 
          data-sidenav="left"
          data-menuwidth="225"
          data-closeonclick="true">

          <i class="material-icons">menu</i>
        </a>
      </nav>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($state, Auth) {
    var sm = this;

    sm.logout = function() {
      Auth
        .logout()
        .$promise
        .then(function() {
          $state.go('login');
        });
    };
  }
})();
