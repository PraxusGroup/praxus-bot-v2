//External Lib Constants

/* global 
  swal:false, 
  Materialize:false,
  multiline:false,
  localStorage:false
*/

;(function() {

  'use strict';

  angular
    .module('app.core')
    .constant('Materialize', Materialize)
    .constant('swal', swal)
    .constant('multiline', multiline)
    .constant('localStorage', localStorage);

})();
