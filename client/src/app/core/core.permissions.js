(function() {
  'use strict';

  angular
    .module('app.core')
    .run(PermissionsConfig);

  /* @ngInject */
  function PermissionsConfig(PermissionStore) {
    PermissionStore
      .definePermission('isLoggedIn', function(){return true;});
  }

})();
