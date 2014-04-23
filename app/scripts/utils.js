'use strict';

angular.module('toHELL')

.run(function () {

  /**
   * 修剪数字，使其不超过指定范围
   * 
   * @param {Number} max
   * @param {Number} min
   * @returns {Number}
   */
  Number.prototype.crop = function (max, min) {
    if (max < min) {
      max = [min, min = max][0];
    }
    return this > max ? max : this < min ? min : this;
  };

  /**
   * 检查数字是否超出指定范围
   * @param {Number} max
   * @param {Number} min
   * @returns {boolean}
   */
  Number.prototype.overflow = function(max, min){
    if (max < min) {
      max = [min, min = max][0];
    }
    return this > max || this < min;
  };

})

.constant('utils', {});
