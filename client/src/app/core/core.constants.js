//External Lib Constants

/* global 
  swal:false, 
  Materialize:false,
  MaterialAvatar:false, 
  multiline:false,
  localStorage:false,
  rg4js: false
*/

;(function() {

  'use strict';

  angular
    .module('app.core')
    .constant('Materialize', Materialize)
    .constant('swal', swal)
    .constant('multiline', multiline)
    .constant('localStorage', localStorage)
    .constant('rg4js', rg4js);

})();
