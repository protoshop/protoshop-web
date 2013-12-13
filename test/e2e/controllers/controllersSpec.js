describe('E2E: Testing Controllers:', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  var packageName = 'cd1b1f5f09cce72183e0470e26673b21'; // NOTE: 服务器应当保证此包始终存在且不被随意修改

  describe('PackageEditCTRL', function() {

    beforeEach(function() {
      browser().navigateTo('#/package/' + packageName);
    });

    it('should have a stage when entering editor', function() {
      expect(browser().location().path()).toBe('/package/' + packageName);
      expect(element('.layout-stage').count()).toBe(1);
    });

    it('should have a settings panel shown when no scene is selected', function() {
      expect(element('.tools-box:not(.ng-hide)').count()).toBe(1);
      expect(element('.tools-box:not(.ng-hide) .tools-setting').count()).toBe(1);
    });

    it('should have settings panel hidden when any scene is selected', function() {
      element('.layout-scenes').click();
      element('.scene-item:first').click();
      expect(element('.tools-box:not(.ng-hide) .tools-setting').count()).toBe(0);
    });

    it('should have hotspot shown when second scene is selected', function() {
      element('.scene-item:eq(1)').click();
      expect(element('.actor.hotspot').count()).toBe(1);
    });

    it('should have anchor shown only when hotspot is selected', function() {
      element('.scene-item:eq(1)').click();
      expect(element('.anchor.ng-hide').count()).toBe(1);
      element('.actor.hotspot:eq(0)').click();
      expect(element('.actor.ng-hide').count()).toBe(0);
    });

    it('should have goto sign shown only when hotspot is selected', function() {
      element('.scene-item:eq(2)').click();
      element('.actor.hotspot:eq(0)').click();
      expect(element('.scene-goto').count()).toBe(1);
    });


  });

});
