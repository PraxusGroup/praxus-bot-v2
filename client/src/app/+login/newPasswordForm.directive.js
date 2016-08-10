(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('newPasswordForm', newPasswordForm);

  /* @ngInject */
  function newPasswordForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/+login/newPasswordForm.html',
      scope: {},
      bindToController: {
        onResetFailure: '&',
        onResetSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($timeout, $state, $stateParams, Auth){
    var sm = this;

    sm.submitReset = submitReset;
    sm.loading = false;

    sm.reset = {
      email: $stateParams.email.replace(/\s/g, '+'),
      token: $stateParams.token
    };

    function submitReset(reset) {
      sm.loading = 'loading';

      if(sm.reset.password !== sm.reset.confirm) {
        loadingState('error')
          .then(defaultLoadingState);

        return sm.onResetFailure({
          e: 'Passwords do not match'
        });
      }

      Auth
        .reset(reset)
        .then(function(){
          return loadingState('success');
        })
        .then(sm.onResetSuccess)
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          if (error.status === 403) {
            $state.go('login', null, {reload: true, inherit: false});
          }

          sm.onResetFailure({e: error});
        });
    }

    function defaultLoadingState() {
      return loadingState(false, 600);
    }

    function loadingState(state, time) {
      if(!time) time = 1200;

      return $timeout(function(){
        sm.loading = state;
      }, time);
    }

  }
})();
