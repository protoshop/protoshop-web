'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('packageService', function () {
    function PackageServiceInstance() {
      this.package = {
        scenes: []
      };
      this.editStat = {
        selectedScene  : null,
        selectedElement: null,
        selectedAction : null
      };

      this.setPackage = function (pkg) {
        this.package = pkg;
      };
      this.setStat = function (es) {
        this.editStat = es;
      };

    }

    return new PackageServiceInstance();
  });
})();
