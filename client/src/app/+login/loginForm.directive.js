(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('loginForm', loginForm);

  /* @ngInject */
  function loginForm(multiline) {
    var template = multiline(function(){/*
      <form name="login" ng-submit="sm.submitLogin(sm.login)">
        <material-input
          name="email"
          label="Email"
          type="email"
          required="true"
          validate="true"
          ng-model="sm.login.email">
        </material-input>
        <material-input
          name="password"
          label="Password"
          type="password"
          required="true"
          ng-model="sm.login.password">
        </material-input>

        <action-button
          style="btn-full"
          default-message="LOG IN"
          loading-state="sm.loading">
        </action-button>
      </form>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        onLoginFailure: '&',
        onLoginSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($timeout, $stateParams, BotUser){
    var sm = this;

    sm.submitLogin = submitLogin;
    sm.loading = false;

    if ($stateParams.email) {
      sm.login = {
        email: $stateParams.email.replace(/\s/g, '+')
      };
    }

    function submitLogin(login) {
      sm.loading = 'loading';

      var user = null;

      BotUser
        .login(login)
        .$promise
        .then(function (res) {
          user = res || {};

          return loadingState('success', 600);
        })
        .then(function() {
          sm.onLoginSuccess({user: user});
        })
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          sm.onLoginFailure({e: error});
        });
    }

    function defaultLoadingState() {
      return loadingState(false, 1200);
    }

    function loadingState(state, time) {
      if(!time) time = 300;

      return $timeout(function(){
        sm.loading = state;
      }, time);
    }

  }
})();