(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('actionButton', actionButton);

  /* @ngInject */
  function actionButton(multiline) {
    var template = multiline(function(){/*
      <button type="submit"
        ng-class="dm.style"
        ng-disabled="dm.loadingState || dm.disabled"
        class="btn btn-flat primary-action waves-effect waves-light">
        <span ng-if="!dm.loadingState">{{ dm.defaultMessage }}</span>

        <div ng-if="dm.loadingState === 'loading' || dm.loadingState === true" 
          class="preloader-svg-wrapper animate-bounce">
          <img ng-src="images/svg-loaders/{{ dm.loaderAnimation || 'three-dots' }}.svg" />
        </div>

        <span ng-if="dm.loadingState === 'error'">
          {{ dm.errorMessage || 'Error' }}
        </span>

        <span ng-if="dm.loadingState === 'success'">
          {{ dm.successMessage || 'Success!' }}
        </span>
      </button>
    */});

    var directive = {
      restrict: 'E',
      template: template,
      scope: {},
      bindToController: {
        style: '@',
        defaultMessage: '@',
        loadingState: '=',
        loaderAnimation: '@',
        errorMessage: '@',
        successMessage: '@',
        disabled: '=ngDisabled'
      },
      controller: function() {},
      controllerAs: 'dm'
    };

    return directive;
  }
})();
