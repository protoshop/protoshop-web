module.exports = {
  "text": {
    "posX": 0,
    "posY": 0,
    "width": 320,
    "height": 44,
    "textSize": 12,
    "lineHeight": 18,
    "color": "white"
  },
  "bar": {
    "posX": 0,
    "posY": 0,
    "width": 320,
    "height": 44,
    "backgroundColor": "transparent",
    "backgroundImage": "/path/to/img.jpg",
    "color": "white",
    "elements": []                          // 待定：要不要区分 bar 左侧图标和右侧图标？
  },
  "button": {
    "posX": 0,
    "posY": 0,
    "width": 80,
    "height": 44,
    "backgroundColor": "blue",              // 可以是：色彩名称（red）/十六进制RGB（#AABBCC）
    "backgroundImage": "/path/to/img.jpg",  // 无此属性或值为空的时候，无背景图
    "color": "white",
    "elements": [],
    "label": "Submit"
  },
  "list": {
    "posX": 0,
    "posY": 0,
    "width": 320,
    "height": 320,
    "backgroundColor": "transparent",
    "backgroundImage": "/path/to/img.jpg",
    "color": "white",
    "items": [],                            // items 即为此列表的列表项目
    "elements": []
  }
};