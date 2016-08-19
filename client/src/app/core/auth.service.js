(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('Auth', AuthService);

  /* @ngInject */
  function AuthService($q, localStorage, BotUser, LoopBackAuth) {
    var service = {
      logout: logout
    };

    return service;

    // Removed state from this, may want to add it back in later
    function logout() {
      var deferred = $q.defer();

      BotUser
        .logout()
        .$promise
        .then(function(res) {
          deferred.resolve(res);
        })
        .catch(function(err) {
          LoopBackAuth.clearUser();
          LoopBackAuth.clearStorage();
          localStorage.clear();
          deferred.resolve(err);
        });

      return {
        $promise: deferred.promise
      };
    }
  }
})();
