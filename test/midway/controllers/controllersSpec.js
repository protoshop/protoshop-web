describe('Midway: Testing Controllers', function() {

  var tester = null;
  beforeEach(function() {
    if(tester) {
      tester.destroy();
    }
    tester = ngMidwayTester('toHELL');
  });
  afterEach(function() {
    tester.destroy();
    tester = null;
  });

  it('should load the PackageEditCTRL controller properly when /package/zaq1xsw2 route is accessed', 
    function(done) {
      tester.visit('/package/zaq1xsw2', function() {
        tester.path().should.eq('/package/zaq1xsw2');
        var current = tester.inject('$route').current;
        var controller = current.controller;
        var scope = current.scope;
        expect(controller).to.eql('PackageEditCTRL');
        done();
      });
  });

  // beforeEach(module('toHELL'));

  // describe('Unit: Testing PackageEditCTRL', function() {
  //   var scope = {};
  //   var PackageEditCTRL = null;

  //   it('should have a PackageEditCTRL controller', inject(function($controller) {
  //     var PackageEditCTRL = $controller('PackageEditCTRL', {
  //       $scope: scope
  //     });
  //     expect(PackageEditCTRL).not.to.equal(null);
  //   }));

  //   it('should have a editStat working in PackageEditCTRL controller',
  //     function() {
  //       expect(scope.editStat).not.to.equal(undefined);
  //   });

  // });

});