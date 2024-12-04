let messageListener = null;

function setupMessageListener() {
  // 移除旧的监听器（如果存在）
  if (messageListener) {
    chrome.runtime.onMessage.removeListener(messageListener);
  }

  messageListener = async (request, sender, sendResponse) => {
    console.log('收到消息:', request);
    if (request.action === 'insertPrompt') {
      const { prompt, aiConfig } = request;
      console.log('查找元素使用的选择器:', aiConfig.selector);
      // 添加重试机制
      let retryCount = 0;
      const maxRetries = 5;
      
      function findElement() {
        const inputElement = document.querySelector(aiConfig.selector);
        if (inputElement) {
          return inputElement;
        }
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`重试查找元素 (${retryCount}/${maxRetries})`);
          return new Promise(resolve => setTimeout(() => resolve(findElement()), 500));
        }
        return null;
      }
      
      const inputElement = await findElement();
      console.log('找到的元素:', inputElement);
      
      if (inputElement) {
        console.log('元素是否为contenteditable:', inputElement.hasAttribute('contenteditable'));
        if (inputElement.hasAttribute('contenteditable')) {
          inputElement.focus();
          inputElement.innerHTML = '';
          
          if (document.execCommand) {
            document.execCommand('insertText', false, prompt);
          } else {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(inputElement);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            
            const textNode = document.createTextNode(prompt);
            range.insertNode(textNode);
            range.selectNodeContents(inputElement);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        } else {
          inputElement.value = prompt;
        }
        
        console.log('尝试触发input事件');
        const events = [
          new Event('input', { bubbles: true, composed: true }),
          new Event('change', { bubbles: true, composed: true }),
          new InputEvent('input', { bubbles: true, composed: true }),
          new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }),
          new KeyboardEvent('keypress', { key: 'Enter', bubbles: true, composed: true }),
          new KeyboardEvent('keyup', { key: 'Enter', bubbles: true, composed: true })
        ];
        
        events.forEach(event => {
          console.log('触发事件:', event.type);
          inputElement.dispatchEvent(event);
        });
        
        sendResponse({ success: true });
      } else {
        console.error('未找到输入元素');
        sendResponse({ success: false, error: '未找到输入元素' });
      }
    }
    return true;
  };

  chrome.runtime.onMessage.addListener(messageListener);
}

// 初始化监听器
setupMessageListener();

// 处理扩展重新加载的情况
chrome.runtime.connect().onDisconnect.addListener(() => {
  console.log('扩展连接断开，重新设置监听器');
  setupMessageListener();
}); 