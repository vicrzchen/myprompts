# Prompt Assistant

Prompt Assistant 是一个Chrome扩展程序，用于管理和快速导入AI提示词(Prompts)。它支持多个AI平台，包括ChatGPT、Claude和Bard等。

## 功能特点

- 提示词分类管理
- 支持多个AI平台
- 快速搜索和筛选
- 一键导入提示词到AI对话框
- 支持自定义AI平台配置
- 提示词版本管理

## 安装说明

1. 克隆仓库

```bash
git clone https://github.com/vicrzchen/myprompts.git
```

2. 安装依赖

```bash
pip install -r requirements.txt
```

3. 初始化数据库

```bash
flask init-db
```

4. 运行应用

```bash
python run.py
```

5. 在Chrome中加载扩展
   - 打开Chrome扩展管理页面 (chrome://extensions/)
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目目录

## 使用方法

1. 点击Chrome工具栏中的扩展图标
2. 使用搜索框或分类筛选找到所需提示词
3. 点击提示词将自动复制并填充到当前打开的AI对话框中

## 开发说明

### 项目结构
```
prompt-assistant/
├── app/
│   ├── static/
│   ├── templates/
│   ├── __init__.py
│   ├── models.py
│   └── routes.py
├── prompts/
│   └── *.json
├── config.py
├── run.py
├── requirements.txt
└── README.md
```

### 技术栈

- 后端：Flask
- 前端：HTML/CSS/JavaScript
- 数据存储：JSON文件
- Chrome扩展：Manifest V3

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 

## 作者

Vic Chen & Cursor
