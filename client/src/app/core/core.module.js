;(function() {
  'use strict';

  angular
    .module('app.core', [
      /* Angular Modules */
      'ngAnimate',
      'ngSanitize',
      'ngTouch',
      /* Cross-app Modules */
      'blocks.exception',
      'blocks.logger',
      'lbServices',
      /* Router Modules */
      'ui.router',
      'ct.ui.router.extras.core',
      'permission',
      'permission.ui',
      'anim-in-out',
      /* 3rd Party Modules */
      'LocalForageModule',
      'ui.materialize'
    ]);

})();
