describe('Unit: Testing Controllers', function() {

  beforeEach(module('toHELL'));

  describe('Unit: Testing PackageEditCTRL', function() {
    var scope = {};
    var PackageEditCTRL = null;

    it('should have a PackageEditCTRL controller', inject(function($controller) {
      var PackageEditCTRL = $controller('PackageEditCTRL', {
        $scope: scope
      });
      expect(PackageEditCTRL).not.to.equal(null);
    }));

    it('should have a editStat working in PackageEditCTRL controller',
      function() {
        expect(scope.editStat).not.to.equal(undefined);
    });

  });

});