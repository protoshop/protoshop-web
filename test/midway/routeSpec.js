describe("Midway: Testing Routes", function() {

  var tester;
  beforeEach(function() {
    tester = ngMidwayTester('toHELL');
  });

  afterEach(function() {
    tester.destroy();
    tester = null;
  });

  it("should have a working package route", function() {
    // TODO
  });
});
