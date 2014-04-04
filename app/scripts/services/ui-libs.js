'use strict';

angular.module('toHELL')

/**
 * UI Component Libs Service
 */
.factory('uilibs',function($http){
  return $http.get('scripts/assets/libs.json');
});
