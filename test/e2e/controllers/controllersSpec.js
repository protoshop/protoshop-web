describe("E2E: Testing Controllers", function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should have a working editor page controller that applies the editor to the scope', function() {
    browser().navigateTo('#/package/zaq1xsw2');
    expect(browser().location().path()).toBe("/package/zaq1xsw2");
    expect(element('.layout-stage').count()).toBe(1);
  });

});
