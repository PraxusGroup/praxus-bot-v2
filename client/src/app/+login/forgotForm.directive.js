(function () {
  'use strict';

  angular
    .module('app.login')
    .directive('forgotForm', forgotForm);

  /* @ngInject */
  function forgotForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/+login/forgotForm.html',
      scope: {},
      bindToController: {
        onForgotFailure: '&',
        onForgotSuccess: '&'
      },
      controller: Controller,
      controllerAs: 'sm'
    };

    return directive;
  }

  /* @ngInject */
  function Controller($timeout, Auth){
    var sm = this;

    sm.submitEmail = submitEmail;
    sm.loading = false;

    function submitEmail(login) {
      sm.loading = 'loading';

      Auth
        .forgot(login)
        .then(function() {
          return loadingState('success');
        })
        .then(function(){
          sm.onForgotSuccess(sm.login);
        })
        .catch(function(error) {

          loadingState('error')
            .then(defaultLoadingState);

          sm.onForgotFailure({e: error});
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
