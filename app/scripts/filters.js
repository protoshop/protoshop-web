'use strict';

angular.module('toHELL')

/**
 * Transform a date to 'xxx days ago'
 */

.filter('ago', function () {
  return function (input) {

    var date = new Date(input);
    var seconds = Math.floor((new Date() - date) / 1000);

    var intervals = {
      'year': 31536000,
      'month': 2592000,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };

    var counter;
    for (var intv in intervals) {
      if (counter = Math.floor(seconds / intervals[intv])) {
        return counter + ' ' + intv + 's ago';
      }
    }

  }
});