describe("Unit: Testing Controllers", function() {

  beforeEach(angular.mock.module('toHELL'));
  var toHELL = angular.module('toHELL');

  it('should have a PackageEditCTRL controller', function() {
    expect(toHELL.PackageEditCTRL).not.to.equal(null);
  });

  it('should have a PackageListCTRL controller', function() {
    expect(toHELL.PackageListCTRL).not.to.equal(null);
  });

  it('should have a properly working PackageEditCTRL controller', 
    inject(function($rootScope, $controller/*, $httpBackend*/) {
    var $scope = $rootScope.$new();
    var ctrl = $controller('PackageEditCTRL', {
      $scope : $scope
      // $routeParams : {
      //   q : searchTestAtr
      // }
    });
  }));

  it('should have a properly working PackageListCTRL controller', 
    inject(function($rootScope, $controller/*, $httpBackend*/) {
    var $scope = $rootScope.$new();
    var ctrl = $controller('PackageListCTRL', {
      $scope : $scope
      // $routeParams : {
      //   id : searchID
      // }
    });
  }));

});