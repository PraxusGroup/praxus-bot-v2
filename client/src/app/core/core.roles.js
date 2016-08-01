(function() {
  'use strict';

  angular
    .module('app.core')
    .run(RoleConfig);

  /* @ngInject */
  function RoleConfig(RoleStore) {
    RoleStore.defineRole('MEMBER', ['isLoggedIn']);
  }

})();
