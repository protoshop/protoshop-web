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

  describe('Midway: Testing PackageEditCTRL', function() {
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
  });

});