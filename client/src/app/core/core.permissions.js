(function() {
  'use strict';

  angular
    .module('app.core')
    .run(PermissionsConfig);

  /* @ngInject */
  function PermissionsConfig(PermissionStore, LoopBackAuth) {
    PermissionStore
      .definePermission('isLoggedIn', function() {
        return LoopBackAuth.currentUserId ? true : false;
      });
  }

})();
