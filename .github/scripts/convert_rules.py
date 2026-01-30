import os
import yaml
import datetime

# --- 配置区域 ---
# 输入目录 (YAML文件所在)
SOURCE_DIR = 'agency-resource/rule/yaml'
# 输出目录 (LIST文件生成位置)
TARGET_DIR = 'agency-resource/rule/list'

# 动态获取仓库信息 (格式: 用户名/仓库名, 例如 User/proxy-resource)
# 如果在本地测试，回退到默认值
REPO_NAME = os.environ.get('GITHUB_REPOSITORY', 'User/proxy-resource')
# 分支名称 (通常是 main 或 master)
BRANCH_NAME = os.environ.get('GITHUB_REF_NAME', 'main')

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"创建目录: {directory}")

def get_stats(payload):
    """统计规则类型数量"""
    stats = {}
    for rule in payload:
        # 规则格式通常为 "TYPE,Value,..."
        parts = rule.split(',')
        if parts:
            rule_type = parts[0].strip()
            stats[rule_type] = stats.get(rule_type, 0) + 1
    return stats

def generate_header(original_content, filename_no_ext, stats):
    """生成新的文件头，保留元数据并更新链接"""
    today = datetime.datetime.now().strftime('%Y%m%d')
    
    lines = original_content.splitlines()
    new_header_lines = []
    
    # 状态标记
    in_stats_block = False
    has_update_date = False
    has_update_url = False
    
    for line in lines:
        stripped = line.strip()
        
        # 遇到 payload 则停止读取头部
        if stripped.startswith('payload:'):
            break
            
        # 跳过旧的统计块
        if stripped == '# 规则计数':
            in_stats_block = True
            continue
        # 简单判断是否还在统计块内 (以#开头且包含冒号，但不是标准元数据)
        if in_stats_block and stripped.startswith('#') and ':' in stripped:
            if not any(k in stripped for k in ['name:', 'content:', 'repo:']):
                continue
        else:
            in_stats_block = False

        # 更新 update_date
        if stripped.startswith('# update_date:'):
            new_header_lines.append(f'# update_date: {today}')
            has_update_date = True
            continue
            
        # 更新 update_url (指向新的 list 文件地址)
        if stripped.startswith('# update_url:'):
            new_url = f'https://raw.githubusercontent.com/{REPO_NAME}/{BRANCH_NAME}/{TARGET_DIR}/{filename_no_ext}.list'
            new_header_lines.append(f'# update_url: {new_url}')
            has_update_url = True
            continue

        # 保留其他原有注释
        if stripped.startswith('#'):
            new_header_lines.append(line)

    # 补全缺失字段
    if not has_update_date:
        new_header_lines.append(f'# update_date: {today}')
    if not has_update_url:
        new_url = f'https://raw.githubusercontent.com/{REPO_NAME}/{BRANCH_NAME}/{TARGET_DIR}/{filename_no_ext}.list'
        new_header_lines.append(f'# update_url: {new_url}')

    # 生成新的统计块
    new_header_lines.append('')
    new_header_lines.append('# 规则计数')
    for r_type, count in sorted(stats.items()):
        new_header_lines.append(f'# {r_type}: {count}')
    new_header_lines.append('')

    return "\n".join(new_header_lines)

def process_file(filename):
    source_path = os.path.join(SOURCE_DIR, filename)
    target_filename = os.path.splitext(filename)[0] + '.list'
    target_path = os.path.join(TARGET_DIR, target_filename)

    print(f"正在处理: {filename} -> {target_filename}")

    try:
        with open(source_path, 'r', encoding='utf-8') as f:
            content_str = f.read()

        # 容错解析 YAML
        if 'payload:' not in content_str:
            print(f"警告: {filename} 缺少 payload 字段，跳过。")
            return

        try:
            yaml_content = yaml.safe_load(content_str)
        except yaml.YAMLError:
            # 尝试仅截取 payload 部分进行解析
            split_content = content_str.split('payload:')
            yaml_payload_str = 'payload:' + split_content[1]
            yaml_content = yaml.safe_load(yaml_payload_str)

        payload = yaml_content.get('payload', [])
        if not payload:
            print(f"信息: {filename} payload 为空。")
            payload = []

        # 1. 统计
        stats = get_stats(payload)

        # 2. 生成头部
        header_text = generate_header(content_str, os.path.splitext(filename)[0], stats)

        # 3. 拼接内容
        final_content = header_text + "\n" + "\n".join(payload) + "\n"

        # 4. 变更检查 (避免无效写入)
        if os.path.exists(target_path):
            with open(target_path, 'r', encoding='utf-8') as f_existing:
                existing_content = f_existing.read()
            if existing_content.strip() == final_content.strip():
                print(f"跳过: {target_filename} 内容未变更。")
                return

        # 5. 写入
        with open(target_path, 'w', encoding='utf-8') as f_out:
            f_out.write(final_content)
        print(f"成功写入: {target_path}")

    except Exception as e:
        print(f"错误: 处理 {filename} 失败: {e}")

def main():
    if not os.path.exists(SOURCE_DIR):
        print(f"错误: 源目录 {SOURCE_DIR} 不存在，请检查仓库结构。")
        exit(1)

    ensure_dir(TARGET_DIR)

    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(('.yaml', '.yml'))]
    if not files:
        print("未找到需要转换的 YAML 文件。")
        return

    for file in files:
        process_file(file)

if __name__ == '__main__':
    main()
