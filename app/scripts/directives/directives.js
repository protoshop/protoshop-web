'use strict';
(function () {
  var module = angular.module('toHELL');

  module.directive('pxUnit', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          ctrl.$setValidity('integer', true);
          // NOTE: value considered to be integer only.
          return parseInt(viewValue, 10);
        });
      }
    };
  });

  var FLOAT_REGEXP = /^\-?\d+((\.)\d+)?$/;
  module.directive('timeUnit', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          // NOTE: value considered to be float only.
          return parseFloat(viewValue);
        });
      }
    };
  });
})();
