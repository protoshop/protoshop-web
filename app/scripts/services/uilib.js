'use strict';

angular.module('toHELL')

/**
 * UI Component Libs Service
 */

.factory('uilib', function ($http) {
  return $http.get('scripts/assets/components.json');
})

.factory('uiprops', function ($http) {
  return $http.get('scripts/assets/props.json');
});
