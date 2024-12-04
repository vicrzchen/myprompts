// 监听插件安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Prompt Assistant 插件已安装');
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'LOG') {
    console.log('来自内容脚本的消息:', request.message);
  }
  return true;
});

// 处理插件图标点击事件
chrome.action.onClicked.addListener((tab) => {
  // 由于我们使用的是 popup，这个事件实际上不会被触发
  // 但保留这个处理器以备将来可能需要
  console.log('插件图标被点击');
}); 