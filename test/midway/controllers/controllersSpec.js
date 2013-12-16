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

  var packageName = 'cd1b1f5f09cce72183e0470e26673b21';

  describe('Midway: Testing PackageEditCTRL', function() {
    it('should load the PackageEditCTRL controller properly when /package/' + packageName + ' route is accessed', 
      function(done) {
        tester.visit('/package/' + packageName, function() {
          tester.path().should.eq('/package/' + packageName);
          var current = tester.inject('$route').current;
          var controller = current.controller;
          var scope = current.scope;
          expect(controller).to.eql('PackageEditCTRL');
          done();
      });
    });
  });

});