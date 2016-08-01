(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('loginForm', loginForm);

  /* @ngInject */
  function loginForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/+login/loginForm.html',
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
  function Controller($timeout, $stateParams, Auth){
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

      Auth
        .login(login)
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
