let prompts = [];

async function loadPrompts() {
  const categories = ['hobbies', 'lifestyle', 'work', 'health', 'learning', 'wealth', 'general'];
  
  for (const category of categories) {
    try {
      const response = await fetch(`prompts/${category}.json`);
      const data = await response.json();
      prompts = prompts.concat(data.map(item => ({...item, category})));
    } catch (error) {
      console.error(`Error loading ${category}.json:`, error);
    }
  }
  
  renderPrompts(prompts);
  setupFilters();
}

function renderPrompts(filteredPrompts) {
  const promptList = document.getElementById('promptList');
  promptList.innerHTML = '';
  
  filteredPrompts.forEach(prompt => {
    const div = document.createElement('div');
    div.className = 'prompt-item';
    div.innerHTML = `
      <div class="prompt-title">${prompt.标题}</div>
      <div class="prompt-meta">
        <span>${getCategoryName(prompt.category)}</span>
        <span>·</span>
        <span>${prompt.适配ai}</span>
        <span>·</span>
        <span>${prompt.作者}</span>
      </div>
    `;
    
    div.addEventListener('click', () => {
      copyToClipboard(prompt.内容);
      insertToAIInput(prompt);
    });
    
    promptList.appendChild(div);
  });
}

function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const aiFilter = document.getElementById('aiFilter');
  
  // 添加AI选项
  const uniqueAIs = [...new Set(prompts.map(p => p.适配ai))];
  uniqueAIs.forEach(ai => {
    const option = document.createElement('option');
    option.value = ai;
    option.textContent = ai;
    aiFilter.appendChild(option);
  });
  
  function filterPrompts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const ai = aiFilter.value;
    
    const filtered = prompts.filter(prompt => {
      const matchesSearch = prompt.标题.toLowerCase().includes(searchTerm) ||
                          prompt.内容.toLowerCase().includes(searchTerm);
      const matchesCategory = !category || prompt.category === category;
      const matchesAI = !ai || prompt.适配ai === ai;
      
      return matchesSearch && matchesCategory && matchesAI;
    });
    
    renderPrompts(filtered);
  }
  
  searchInput.addEventListener('input', filterPrompts);
  categoryFilter.addEventListener('change', filterPrompts);
  aiFilter.addEventListener('change', filterPrompts);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

async function insertToAIInput(prompt) {
  try {
    const response = await fetch('ai.json');
    const aiConfig = await response.json();
    console.log('获取到的AI配置:', aiConfig);
    console.log('当前prompt的适配AI:', prompt.适配ai);
    console.log('将要使用的选择器:', aiConfig[prompt.适配ai]?.selector);
    
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      console.log('当前标签页:', tabs[0].url);
      try {
        // 然后发送消息
        const response = await chrome.tabs.sendMessage(tabs[0].id, {
          action: 'insertPrompt',
          prompt: prompt.内容,
          aiConfig: aiConfig[prompt.适配ai]
        });
        
        console.log('消息发送成功，响应:', response);
      } catch (error) {
        console.error('发送消息失败:', error);
        // 如果失败，尝试重新注入content script并重试
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: injectPrompt,
            args: [prompt.内容, aiConfig[prompt.适配ai].selector]
          });
        } catch (err) {
          console.error('注入脚本失败:', err);
        }
      }
    });
  } catch (error) {
    console.error('Error loading AI config:', error);
  }
}

// 直接注入到页面的函数
function injectPrompt(promptText, selector) {
  const inputElement = document.querySelector(selector);
  if (inputElement) {
    if (inputElement.hasAttribute('contenteditable')) {
      inputElement.innerHTML = promptText;
    } else {
      inputElement.value = promptText;
    }
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  return false;
}

function getCategoryName(category) {
  const categoryMap = {
    'hobbies': '兴趣',
    'lifestyle': '生活',
    'work': '工作',
    'health': '健康',
    'learning': '学习',
    'wealth': '财富',
    'general': '通用'
  };
  return categoryMap[category] || category;
}

document.addEventListener('DOMContentLoaded', loadPrompts); 