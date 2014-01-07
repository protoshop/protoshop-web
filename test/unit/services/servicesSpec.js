describe('单元测试：服务测试', function() {

  beforeEach(module('toHELL'));

  describe('测试：editService', function() {
    var es = null;
    

    beforeEach(inject(function (editService) {
      var pkg = {
        "splash": {
          "image": "",
          "duration": "",
          "delay": "",
          "transferType": ""
        },
        "appName": "TestFrontend",
        "appIcon": "http://wxddb1.qa.nt.ctripcorp.com/packages/icon.png",
        "appID": "cd1b1f5f09cce72183e0470e26673b21",
        "scenes": [
        {
          "name": "No Element",
          "elements": [],
          "order": 0,
          "id": 1388113984786,
          "background": ""
        },
        {
          "name": "No Action",
          "elements": [
          {
            "actions": [],
            "height": 42,
            "width": 120,
            "posY": 293,
            "posX": 128,
            "type": "hotspot"
          }
          ],
          "order": 1,
          "id": 1388113991313,
          "background": ""
        },
        {
          "name": "Element with one Action",
          "elements": [
          {
            "actions": [
            {
              "transitionDirection": "up",
              "target": 1388113984786,
              "transitionDuration": 3.25,
              "transitionDelay": 0,
              "transitionType": "push",
              "type": "jumpto"
            }
            ],
            "height": 42,
            "width": 120,
            "posY": 295,
            "posX": 177,
            "type": "hotspot"
          }
          ],
          "order": 2,
          "id": 1388114014225,
          "background": ""
        }
        ]
      };
      var stat = {
        selectedScene: null,
        selectedElement: null,
        selectedAction: null,
        gotoSignStyle: {
          top: '',
          right: ''
        },
        gotoLineStyle: {
          width: '264px'
        },
        sceneHasAdded: false // 表示场景列表中是否有后添加的场景。这个变量与新增场景自动聚焦相关。
      };
      es = editService;
      editService.setPackage(pkg);
      editService.setStat(stat);
    }));

    it('应当存在一个有效的editService服务对象实例', function () {
      expect(es.package).not.to.equal(undefined);
    });

    it('增加scene后scene数量应为4', function () {
      es.addScene();
      expect(es.package.scenes.length).to.equal(4);
    });

    it('新增的scene应当被自动选中', function () {
      var s = es.addScene();
      expect(s).to.equal(es.editStat.selectedScene);
    });

    it('删除scene后scene数量应为2', function () {
      es.removeScene(es.package.scenes[0]);
      expect(es.package.scenes.length).to.equal(2);
    });

    it('新增的scene的element数量应为0', function () {
      es.addScene();
      expect(es.package.scenes[es.package.scenes.length - 1].elements.length).to.equal(0);
    });

    it('为新scene新增hotspot后element应为1', function () {
      es.addScene();
      es.addHotspotElement();
      expect(es.package.scenes[es.package.scenes.length - 1].elements.length).to.equal(1);
    });

    it('为新scene新增hotspot后element应为1', function () {
      es.addScene();
      es.addHotspotElement();
      expect(es.package.scenes[es.package.scenes.length - 1].elements.length).to.equal(1);
    });

    it('新增的element应当被自动选中', function () {
      var s = es.addScene();
      es.addHotspotElement();
      expect(s.elements[0]).to.equal(es.editStat.selectedElement);
    });

    it('新增的element不应有action', function () {
      var s = es.addScene();
      es.addHotspotElement();
      expect(s.elements[0].actions.length).to.equal(0);
    });

    it('新增的element被删除后element数量应为0', function () {
      var s = es.addScene();
      es.addHotspotElement();
      es.removeElement(s.elements[0]);
      expect(s.elements.length).to.equal(0);
    });

    it('为新的element添加action后，action数量应为1', function () {
      var s = es.addScene();
      es.addHotspotElement();
      es.addAction();
      expect(s.elements[0].actions.length).to.equal(1);
    });

    it('element应至多只能添加一个action', function () {
      var s = es.addScene();
      es.addHotspotElement();
      es.addAction();
      es.addAction();
      es.addAction();
      expect(s.elements[0].actions.length).to.equal(1);
    });

    it('action被删除后该element的action数量应为0', function () {
      var s = es.addScene();
      es.addHotspotElement();
      es.addAction();
      es.removeAction(es.editStat.selectedAction);
      expect(s.elements[0].actions.length).to.equal(0);
    });

  });

});