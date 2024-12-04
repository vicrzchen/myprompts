from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from app.models import PromptManager, AIConfigManager

bp = Blueprint('main', __name__)
prompt_manager = PromptManager()
ai_config_manager = AIConfigManager()

@bp.route('/')
def index():
    prompts = prompt_manager.get_all_prompts()
    return render_template('prompt_list.html', prompts=prompts)

@bp.route('/prompt/new', methods=['GET', 'POST'])
def new_prompt():
    if request.method == 'POST':
        prompt_data = {
            'title': request.form['title'],
            'content': request.form['content'],
            'version': request.form['version'],
            'author': request.form['author'],
            'category': request.form['category'],
            'ai_platform': request.form['ai_platform']
        }
        prompt_manager.save_prompt(prompt_data, prompt_data['category'])
        flash('提示词已添加')
        return redirect(url_for('main.index'))
    return render_template('prompt_edit.html')

@bp.route('/prompt/<category>/<int:index>/edit', methods=['GET', 'POST'])
def edit_prompt(category, index):
    prompts = prompt_manager.get_all_prompts()
    prompt = next((p for p in prompts 
                  if p['category'] == category and prompts.index(p) == index), None)
    
    if request.method == 'POST':
        prompt_data = {
            'title': request.form['title'],
            'content': request.form['content'],
            'version': request.form['version'],
            'author': request.form['author'],
            'ai_platform': request.form['ai_platform']
        }
        prompt_manager.update_prompt(category, index, prompt_data)
        flash('提示词已更新')
        return redirect(url_for('main.index'))
    
    return render_template('prompt_edit.html', prompt=prompt)

@bp.route('/prompt/<category>/<int:index>/delete', methods=['POST'])
def delete_prompt(category, index):
    success = prompt_manager.delete_prompt(category, index)
    if success:
        flash('提示词已成功删除')
    else:
        flash('删除失败：未找到对应的提示词')
    return redirect(url_for('main.index'))

@bp.route('/ai-config', methods=['GET', 'POST'])
def ai_config():
    if request.method == 'POST':
        name = request.form['name']
        selector = request.form['selector']
        ai_config_manager.save_config(name, selector)
        flash('AI配置已更新')
    
    configs = [{"name": k, "selector": v["selector"]} 
              for k, v in ai_config_manager.get_config().items()]
    return render_template('ai_config.html', configs=configs) 