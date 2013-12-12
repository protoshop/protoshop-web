'use strict';

(function () {
  var module = angular.module('toHELL');

  module.factory('packageService', function() {
    var packageLoaded = false;
    function PackageServiceInstance() {
      this.package = {
        scenes: []
      };
      this.editStat = {
        selectedScene: null,
        selectedElement: null,
        selectedAction: null,
        sceneHasAdded: false
      };

      this.setPackage = function(pkg) {
        this.package = pkg;
        packageLoaded = true;
      };
      this.setStat = function(es) {
        this.editStat = es;
      };

    }
    return new PackageServiceInstance();
  });
})();
