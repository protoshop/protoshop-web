describe('E2E: Testing Controllers:', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  var packageName = 'cb5947eebab907988c0a158a99237781';

  describe('PackageEditCTRL', function() {

    beforeEach(function() {
      browser().navigateTo('#/package/' + packageName);
    });

    it('should have a stage when entering editor', function() {
      expect(browser().location().path()).toBe('/package/' + packageName);
      expect(element('.layout-stage').count()).toBe(1);
    });

    it('should have a settings panel shown when no scene is selected', function() {
      expect(element('.tools-box.ng-hide').count()).toBe(4);
    });

    it('should have settings panel hidden when any scene is selected', function() {
      element('.layout-scenes').click();
      expect(element('.tools-box.ng-hide').count()).toBe(4);
      element('.scene-item:first').click();
      expect(element('.tools-box.ng-hide').count()).toBe(3);
    });

    it('should have hotspot shown only when first scene is selected', function() {
      element('.scene-item:eq(3)').click();
      expect(element('.actor.hotspot').count()).toBe(0);
      element('.scene-item:eq(0)').click();
      expect(element('.actor.hotspot').count()).toBe(1);
    });

    it('should have anchor shown only when hotspot is selected', function() {
      element('.scene-item:eq(0)').click();
      expect(element('.anchor.ng-hide').count()).toBe(1);
      element('.actor.hotspot:eq(0)').click();
      expect(element('.actor.ng-hide').count()).toBe(0);
    });

    it('should have goto sign shown only when hotspot is selected', function() {
      element('.scene-item:eq(0)').click();
      element('.actor.hotspot:eq(0)').click();
      expect(element('.scene-goto').count()).toBe(1);
    });

    // it('should show the correct value in Position panel', function() {
    //   element('.scene-item:eq(0)').click();
    //   element('.actor.hotspot:eq(0)').click();
      
    //   element('.actor.hotspot:eq(0)').query(function (ele, done) {
    //     var xInDevice = ele.position().left;
    //     var x = element('.tools-position input:eq(0)').val();
    //     expect(x).toEqual(xInDevice);
    //     done();
    //   });      
    // });


  });

});
