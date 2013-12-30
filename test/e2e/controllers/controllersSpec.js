describe('E2E: Testing Controllers:', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  var packageName = 'cd1b1f5f09cce72183e0470e26673b21'; // WARN: 服务器应当保证此包始终存在且不被随意修改

  describe('PackageEditCTRL', function() {

    /*
    * 以下测试代码的基础为：
    * 项目中一共有3个场景，第一个场景无任何元素，第二个场景有一个元素但没有动作，第三个场景有一个场景且有一个动作
    */

    beforeEach(function() {
      browser().navigateTo('#/package/' + packageName);
    });

    it('应当在进入编辑器时有设备出现', function () {
      expect(browser().location().path()).toBe('/package/' + packageName);
      expect(element('.layout-stage').count()).toBe(1);
    });

    it('应当在无场景选中时出现项目设置面板', function () {
      element('.layout-scenes').click();
      expect(element('.tools-box:not(.ng-hide)').count()).toBe(1);
      expect(element('.tools-box:not(.ng-hide) .tools-setting').count()).toBe(1);
    });

    it('应当在有场景选中时设置面板自动隐藏', function () {
      element('.layout-scenes').click();
      element('.scene-item:first').click();
      expect(element('.tools-box:not(.ng-hide) .tools-setting').count()).toBe(0);
    });

    it('should have hotspot shown when second scene is selected', function () {
      element('.scene-item:eq(1)').click();
      expect(element('.actor.hotspot').count()).toBe(1);
    });

    it('should have anchor shown only when hotspot is selected', function () {
      element('.scene-item:eq(1)').click();
      expect(element('.anchor.ng-hide').count()).toBe(1);
      // NOTICE: hotspot must be clicked by mousedown and mouseup, due to its DnD implementation.
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      expect(element('.actor.ng-hide').count()).toBe(0);
    });

    it('应当在热区选中时有标识出现', function () {
      element('.scene-item:eq(2)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      expect(element('.scene-goto.ng-hide').count()).toBe(0);
    });

    it('应当在动作列表中选中动作时，设备中的热区也被选中', function () {
      element('.scene-item:eq(1)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      expect(element('.tools-actor-item-selected').count()).toBe(1);
    });

    it('新增一个场景后应当有4个场景', function () {
      element('.scenes-edit button:eq(0)').click();
      expect(element('.scene-item').count()).toBe(4);
    });

    it('删去一个场景后应当有2个场景', function () {
      expect(element('.scene-item').count()).toBe(3);
      element('.scene-item:eq(2)').click();
      element('.scenes-edit button:eq(1)').click();
      expect(element('.scene-item').count()).toBe(2);
    });

    it('新增场景时，若无场景选中，焦点应当在最后一个场景上', function () {
      element('.scenes-edit button:eq(0)').click();
      expect(element('.scene-item').count()).toBe(4);
      expect(element('.scene-item.item-current').count()).toBe(1);
    });

    it('删去元素后，设备中应当不再有热区', function () {
      element('.scene-item:eq(2)').click();
      element('.tools-actor-action:eq(0)').click();
      expect(element('.hotspot').count()).toBe(0);
    });

    it('Position面板中的数值变化时，热区应当有相应的变化', function () {
      element('.scene-item:eq(1)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      input('editStat.selectedElement.posX').enter(0);
      input('editStat.selectedElement.posY').enter(0);
      expect(element('.hotspot').position()).toEqual({"top":0, "left":0});
    });

    it('点击动作列表中的删除按钮，元素应当被删除', function () {
      element('.scene-item:eq(1)').click();
      element('.tools-actor-action:eq(0)').click();
      expect(element('.hotspot').count()).toBe(0);
    });

    it('点击动作列表中的增加按钮，应当新增一个元素', function () {
      element('.scene-item:eq(1)').click();
      element('.tools-title .icon-plus-circled').click();
      expect(element('.hotspot').count()).toBe(2);
    });

    it('对于一个没有动作的元素，点击新增动作按钮应当新增一个动作', function () {
      element('.scene-item:eq(1)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      element('.tools-title-action.icon-plus-circled').click();
      expect(element('.scene-goto').count()).toBe(1);
    });

    it('对于一个已有动作的元素，点击新增动作按钮应当不再新增动作', function () {
      element('.scene-item:eq(2)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      element('.tools-title-action.icon-plus-circled').click();
      expect(element('.scene-goto').count()).toBe(1);
    });

    it('对于一个已有动作的元素，点击删除动作按钮后动作应当不存在', function () {
      element('.scene-item:eq(2)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      element('.tools-title-action.icon-minus-circled').click();
      expect(element('.tools-title-action.icon-minus-circled').count()).toBe(0);
    });

    it('对于一个动作，选择JUMP TO时缩略图文字有对应反应', function () {
      element('.scene-item:eq(2)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      select('editStat.selectedAction.target').option(2);
      expect(element('.scene-goto-thumb p').text()).toEqual('Element with one Action');
    });

    it('当TRANSITION类型选择为无时，TRANSITION方向应当隐藏', function () {
      element('.scene-item:eq(2)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      input('editStat.selectedAction.transitionType').select('none');
      expect(element('.transition-direction.ng-hide').count()).toBeGreaterThan(0);
    });

    it('当TRANSITION类型选择为其它时，TRANSITION方向应当可见', function () {
      element('.scene-item:eq(2)').click();
      element('.hotspot:eq(0)', 'hotspot').mousedown();
      element('.hotspot:eq(0)', 'hotspot').mouseup();
      input('editStat.selectedAction.transitionType').select('push');
      expect(element('.transition-direction.ng-hide').count()).toBe(0);
    });

  });

});
