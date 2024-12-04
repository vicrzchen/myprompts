import json
import os
from datetime import datetime

class PromptManager:
    @staticmethod
    def get_prompts_dir():
        return os.path.join(os.path.dirname(os.path.dirname(__file__)), 'prompts')

    @staticmethod
    def get_ai_config_path():
        return os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ai.json')

    def get_all_prompts(self):
        prompts = []
        prompts_dir = self.get_prompts_dir()
        for filename in os.listdir(prompts_dir):
            if filename.endswith('.json'):
                category = filename[:-5]  # 移除 .json 后缀
                file_path = os.path.join(prompts_dir, filename)
                with open(file_path, 'r', encoding='utf-8') as f:
                    category_prompts = json.load(f)
                    for prompt in category_prompts:
                        prompt['category'] = category
                    prompts.extend(category_prompts)
        return prompts

    def save_prompt(self, prompt_data, category):
        file_path = os.path.join(self.get_prompts_dir(), f"{category}.json")
        prompts = []
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                prompts = json.load(f)
        
        # 转换字段名
        new_prompt = {
            "标题": prompt_data['title'],
            "内容": prompt_data['content'],
            "版本": prompt_data['version'],
            "作者": prompt_data['author'],
            "适配ai": prompt_data['ai_platform']
        }
        prompts.append(new_prompt)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(prompts, f, ensure_ascii=False, indent=2)

    def update_prompt(self, category, index, prompt_data):
        file_path = os.path.join(self.get_prompts_dir(), f"{category}.json")
        with open(file_path, 'r', encoding='utf-8') as f:
            prompts = json.load(f)
        
        if 0 <= index < len(prompts):
            prompts[index] = {
                "标题": prompt_data['title'],
                "内容": prompt_data['content'],
                "版本": prompt_data['version'],
                "作者": prompt_data['author'],
                "适配ai": prompt_data['ai_platform']
            }
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(prompts, f, ensure_ascii=False, indent=2)

    def delete_prompt(self, category, index):
        file_path = os.path.join(self.get_prompts_dir(), f"{category}.json")
        with open(file_path, 'r', encoding='utf-8') as f:
            prompts = json.load(f)
        
        if 0 <= index < len(prompts):
            prompts.pop(index)
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(prompts, f, ensure_ascii=False, indent=2)

class AIConfigManager:
    @staticmethod
    def get_config():
        config_path = PromptManager.get_ai_config_path()
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    @staticmethod
    def save_config(name, selector):
        config_path = PromptManager.get_ai_config_path()
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        config[name] = {"selector": selector}
        
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)