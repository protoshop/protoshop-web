
/**
 * Transform data to FormData
 */
angular.module('toHELL').factory('formDataObject', function() {
  return function(data) {
    var fd = new FormData();
    angular.forEach(data, function(value, key) {
      fd.append(key, value);
    });
    return fd;
  };
});