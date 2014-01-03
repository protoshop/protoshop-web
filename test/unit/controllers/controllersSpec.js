describe('单元测试: 控制器测试', function() {

  beforeEach(module('toHELL'));

  describe('单元测试: 测试PackageEditCTRL', function() {
    var scope = {};
    var PackageEditCTRL = null;

    it('应当存在一个PackageEditCTRL控制器', inject(function($controller) {
      var PackageEditCTRL = $controller('PackageEditCTRL', {
        $scope: scope
      });
      expect(PackageEditCTRL).not.to.equal(null);
    }));

    it('控制器中应当存在一个非空的editStat',
      function() {
        expect(scope.editStat).not.to.equal(undefined);
    });

    it('控制器中应当存在一个非空的package', function () {
      expect(scope.package).not.to.equal(undefined);
    });

  });

});