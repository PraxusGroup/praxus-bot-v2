;(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .config(AppConfig);

  /* @ngInject */
  function AppConfig($stateProvider) {

    var views = {
      'main@': {
        templateUrl: 'app/+dashboard/membersList.html',
        controller: 'MembersListController',
        controllerAs: 'vm'
      },
      'navbar@': {
        template: '<side-nav class="slide-in anim-fade"></side-nav>'
      }
    };

    var data = {
      permissions: {
        only: ['isLoggedIn'],
        redirectTo: 'login'
      }
    };

    var resolve = {
      gamers: getGamers,
      current: getCurrentBotUser
    };

    $stateProvider
      .state('dashboard.members', {
        url: '/members',
        title: 'Members List',
        views: views,
        data: data,
        resolve: resolve
      });
    
  }

  /* @ngInject */
  function getCurrentBotUser(BotUser) {
    return BotUser.getCurrent().$promise;
  }

  /* @ngInject */
  function getGamers($q, Gamer) {
    var deferred = $q.defer();

    var query = {
      filter: {
        include: ['notes'],
        order: 'username DESC'
      }
    };

    return Gamer.find(query).$promise;
  }

})();
