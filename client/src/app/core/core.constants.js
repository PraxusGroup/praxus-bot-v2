//External Lib Constants

/* global 
  swal:false, 
  Materialize:false,
  MaterialAvatar:false, 
  multiline:false 
*/

;(function() {

  'use strict';

  angular
    .module('app.core')
    .constant('Materialize', Materialize)
    .constant('swal', swal)
    .constant('multiline', multiline);

})();
