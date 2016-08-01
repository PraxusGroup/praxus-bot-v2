
;(function() {
  'use strict';

  angular
    .module('app.core')
    .run(RouterConfig);

  /* @ngInject */
  function RouterConfig($window, $state, $rootScope, $timeout) {
    var stateloaded = false;
    var overlay = $('.lean-overlay');

    $rootScope.stateDeniedHistory = [];

    $state.landing = function() {
      $window.location.href = '/landing';
    };

    // adds backwards compatibility for the old dashboard hashbang event links
    if ($window.location.hash.indexOf('events') > -1) {
      var ext = decodeURIComponent($window.location.hash);
      ext = ext.slice(1);
      $timeout(function(){
        $window.location.href = '/dashboard' + ext;
      });
    }

    $rootScope.$on('$stateChangePermissionDenied', function(event, toState, toParams) {

      var history = $rootScope.stateDeniedHistory;

      // We want to get the redirecting state if any (and if any inherited from the parent)
      var redirectTo = toState.data.permissions ? toState.data.permissions.redirectTo : false;

      if (!redirectTo && toState.name.indexOf('.') > -1) {
        var parent = $state.get(toState.name.split('.')[0]);

        redirectTo = parent.data.permissions ? parent.data.permissions.redirectTo : false;
      }

      // Check to see if we have failed to redirect here already
      if (history.length === 0 || history[history.length - 1] !== toState.name) {

        // Save history for old state to redirect after we auth again
        $rootScope.redirectState = {
          state: toState,
          params: toParams,
          redirect: redirectTo
        };

        $rootScope.stateDeniedHistory.push(toState.name);
      }
    });

    $rootScope.$on('$stateChangePermissionAccepted', function(event, toState, toParams) {
      if ($rootScope.redirectState) {

        // Copy History object so we can reference it after we delete it
        var history = JSON.parse(JSON.stringify($rootScope.redirectState));

        // Make sure that we aren't redirecting to our current state
        if (!history.redirect || toState.name !== history.redirect) {
          event.preventDefault();
          delete $rootScope.redirectState;

          $state.go(history.state.name, history.params);
        }

      // Remove the successful state transition from the state history
      } else if ($rootScope.stateDeniedHistory.indexOf(toState.name) > -1) {
        $rootScope.stateDeniedHistory = $rootScope.stateDeniedHistory.filter(function(state) {
          return state !== toState.name;
        });
      }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

      // Redirects for abstract states; provides backwards compatability for old links
      if (toState.redirectTo) {
       event.preventDefault();
       $state.go(toState.redirectTo, toParams);
      }

      // Fixes bugged overlay (if overlay is open on route change)
      overlay.css('display', 'none');

      /**
       * If our app is loaded and we have an initial state, we want to trigger
       * the scrollTop animations, so that we aren't scrolling top when
       * we have a saved page position from back/forward/reload location changes
       */

      if (stateloaded) {
        startAnimations();
      } else {
        stateloaded = true;
      }
    });

    $('body').on('click', '.lean-overlay', function() {
      $('.lean-overlay').css('display', 'none');
    });

    function startAnimations() {
      $rootScope.$on('animStart', function($event, element, speed) {

        $timeout(function() {
          var pos = $('body').scrollTop();

          if(pos > 10) {
            $('html, body').animate({ scrollTop: 0 }, 200);
          }
        }, 16);
      });
    }
  }

})();
