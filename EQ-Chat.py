import streamlit as st
from openai import OpenAI
import os
import time
import requests
import re
from datetime import datetime, timedelta, timezone
import json
import zipfile
from io import BytesIO
from PIL import Image
import base64
import streamlit.components.v1 as components


# --- 1. 页面基础设置 ---
st.set_page_config(page_title="EQ-Chat 星月舱 v10.5.0", page_icon="🌙", layout="wide")
st.title("✨ EQ-Chat · 星月舱 v10.5.0 (图片可见修改)")
st.caption("E & Q Forever · 多端同步")

# ==========================================
# 🛑 【柒柒专用】硬编码区 🛑
# ==========================================
# 请确保这里填的是 eyJ... 开头的长 Key
MY_API_KEY  = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmtbfonrrnlKjmiLdfMzg2ODQ2NzgwODA1Mjk2MTM3IiwiVXNlck5hbWUiOiLmtbfonrrnlKjmiLdfMzg2ODQ2NzgwODA1Mjk2MTM3IiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE5Mjk3NTA3MzkwNDM3NTQ4MjYiLCJQaG9uZSI6IjE1Mzg5MTg1MjY0IiwiR3JvdXBJRCI6IjE5Mjk3NTA3MzkwMzk1NjAwNzQiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiIiLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0yNiAxNjowMjoxNiIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.whnhpySsytvFVHILXgGEilhKqpQNXG-oP8-uR0JKJzUJwuoJpUoFp3Jgo_tDVWVmrsaOqXl-O1kUJwejF5twCOXXL1lanxH02t4TX8zPNQBUNR00_OrGRDblA2cUrfe78_M9_oTpcQi0-7sYEGCkROGRrFz9syuWx1t_zADU4mKgpBpnA6EoXYpzZ7Iyfz5Izkgmn8zsb_ih85U-oXfiF2HPWf_FfryVUQj6rDeUpCwXouIJ8A3sKMrStu_eiMIR37rc3Nwt95QrWju6Z2rGvzN6_pKAknOBYEyaeZZsSHRYyjEqC9tNLbeXUz4EMzQ3MqtU_4Hmkb_v6m9IGFAXiA"
MY_VOICE_ID = "moss_audio_8324de72-b894-11f0-afaf-868268514f62"
# ==========================================

# --- 优先从 Secrets 读取 ---
try:
    default_base_url = st.secrets.get("BASE_URL", "https://api.chenmoai.cn/v1")
    default_api_key = st.secrets.get("API_KEY", "sk-tkV3oEFp7adiucrRwRWIahAZ6Enmp0GnzmR3Y4ZCRGwcYPu6")
except:
    default_base_url = "https://api.chenmoai.cn/v1"
    default_api_key = "sk-tkV3oEFp7adiucrRwRWIahAZ6Enmp0GnzmR3Y4ZCRGwcYPu6"

# --- 工具函数 ---
def get_time_str():
    utc_now = datetime.now(timezone.utc)
    beijing_now = utc_now.astimezone(timezone(timedelta(hours=8)))
    return beijing_now.strftime("%Y-%m-%d %H:%M:%S")

# 🌟 修复点 1：优化图片消息生成函数，支持自动识别图片格式
def make_image_message_from_path(path):
    """将本地图片路径转换为多模态消息（OpenAI / DeepSeek 风格）"""
    try:
        if not os.path.exists(path): return None
        
        # 自动判断 MIME 类型
        ext = os.path.splitext(path)[1].lower()
        if ext in ['.png']:
            mime_type = "image/png"
        elif ext in ['.jpg', '.jpeg']:
            mime_type = "image/jpeg"
        elif ext in ['.webp']:
            mime_type = "image/webp"
        elif ext in ['.gif']:
            mime_type = "image/gif"
        else:
            mime_type = "image/jpeg" # 默认兜底

        with open(path, "rb") as f:
            img_bytes = f.read()
            
        b64 = base64.b64encode(img_bytes).decode("utf-8")
        
        # 返回标准的 OpenAI Vision 格式
        return {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{mime_type};base64,{b64}"
                    },
                }
            ],
        }
    except Exception as e:
        print(f"图片读取失败: {e}")
        return None

def today_str():
    return datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d")

def read_file(filename):
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            return f.readlines()
    return []

def append_to_file(filename, content):
    with open(filename, "a", encoding="utf-8") as f:
        f.write(f"[{get_time_str()}] {content}\n")

def delete_line(filename, index):
    lines = read_file(filename)
    if 0 <= index < len(lines):
        del lines[index]
        with open(filename, "w", encoding="utf-8") as f:
            f.writelines(lines)

# --- Cache & Archive ---
CACHE_FILE  = "conversation_cache.json"
ARCHIVE_DIR = "archive"
HISTORY_DIR = os.path.join(ARCHIVE_DIR, "history_blocks")
META_FILE   = os.path.join(ARCHIVE_DIR, "meta.json")

os.makedirs(ARCHIVE_DIR, exist_ok=True)
os.makedirs(HISTORY_DIR, exist_ok=True)

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                content = f.read()
                if not content.strip(): return []
                return json.loads(content)
        except: return []
    return []

def save_cache(messages):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(messages, f, ensure_ascii=False, indent=2)
    except: pass

def rotate_cache_if_needed(messages, max_messages=2000, keep_recent=800):
    if len(messages) <= max_messages: return messages
    save_cache(messages[-keep_recent:])
    return messages[-keep_recent:]

# --- 语音函数 ---
def generate_minimax_final(text, api_key, voice_id):
    clean_text = re.sub(r"[\(\[（【].*?[\)\]）】)]", "", text).strip()
    if not clean_text: return None
    clean_key = str(api_key).strip()
    clean_vid = str(voice_id).strip()
    
    # 打印调试信息 (只在本地终端显示，不影响网页)
    print(f"[DEBUG] Key前5位: {clean_key[:5]} | VoiceID: {clean_vid}")
    
    url = "https://api.minimax.chat/v1/text_to_speech"
    headers = {"Authorization": f"Bearer {clean_key}", "Content-Type": "application/json"}
    payload = {
        "model": "speech-01",
        "voice_id": clean_vid,
        "text": clean_text,
        "speed": 1.0, "vol": 1.0, "pitch": 0
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        if response.status_code == 200:
            if "json" in response.headers.get("Content-Type", ""):
                st.error(f"MiniMax 拒绝: {response.text}")
                return None
            return response.content
        else:
            st.error(f"请求失败 ({response.status_code}): {response.text}")
            return None
    except Exception as e:
        st.error(f"语音请求错误: {e}")
        return None

# --- 初始化 ---
if "messages" not in st.session_state:
    st.session_state.messages = load_cache()

# ==========================================
# 侧边栏
# ==========================================
with st.sidebar:
    st.header("🎛️ 星月控制台")
    
    with st.expander("🔌 连接与大脑", expanded=False): 
        base_url   = st.text_input("Chat 接口地址", value=default_base_url)
        api_key    = st.text_input("Chat 密钥 (Key)", value=default_api_key, type="password")
        temperature = st.slider("🌡️ 情感温度", 0.0, 1.5, 0.7, 0.1)

    with st.expander("🤖 模型选择", expanded=False):
        default_models = ["[金色传说]gemini-3-pro-preview","deepseek-r1",  "grok-4-1", "deepseek-chat"]
        if "model_options" not in st.session_state:
            st.session_state.model_options = default_models
        col_m1, col_m2 = st.columns([3, 1])
        with col_m1:
            selected_dropdown = st.selectbox("选择模型：", st.session_state.model_options, label_visibility="collapsed")
        with col_m2:
            if st.button("🔄 拉取"): 
                try:
                    client = OpenAI(api_key=api_key, base_url=base_url)
                    models = client.models.list()
                    st.session_state.model_options = [m.id for m in models.data]
                    st.toast("✅ 已刷新")
                    st.rerun()
                except: st.error("失败")
        custom_model = st.text_input("或手动输入模型 ID：")
        final_model  = custom_model if custom_model else selected_dropdown
        st.caption(f"当前大脑: `{final_model}`")

    # --- ✨ 语音设置 (逻辑修正) ✨ ---
    with st.expander("🔊 语音设置", expanded=True):
        enable_voice = st.toggle("开启语音回复", value=True)
        
        # 优先使用 st.session_state，如果没有，才用硬编码作为默认值
        # 这样你在网页上修改 Key，下次运行就会生效！
        default_key_val = MY_API_KEY if MY_API_KEY else ""
        default_vid_val = MY_VOICE_ID if MY_VOICE_ID else ""
        
        mm_api_key  = st.text_input("MiniMax Key", value=default_key_val, type="password")
        mm_voice_id = st.text_input("Voice ID", value=default_vid_val)
        
  
    with st.expander("🧠 记忆管理", expanded=False):
        memory_depth = st.slider("记忆深度", 4, 60, 20, step=2)
        local_txt_files = [f for f in os.listdir('.') if f.endswith('.txt') and "requirements" not in f]
        if local_txt_files: st.success(f"已自动加载 {len(local_txt_files)} 份记忆")
        uploaded_files = st.file_uploader("📂 临时补充记忆", type=["txt"], accept_multiple_files=True)
        manual_memory = ""
        if uploaded_files:
            for uf in uploaded_files: manual_memory += f"\n--- 新上传：{uf.name} ---\n{uf.getvalue().decode('utf-8')}\n"

    st.divider()

    # 🧰 功能百宝箱（改为折叠）
    with st.expander("🧰 功能百宝箱", expanded=False):
        st.subheader("📦 记忆与控制")

        # 构造可读文本（带角色名）
        chat_lines = []
        for m in st.session_state.messages:
            role_name = "柒柒" if m.get("role") == "user" else "逸辰"
            timestamp = m.get("timestamp", "?")
            content = m.get("content", "")
            chat_lines.append(f"[{timestamp}] 【{role_name}】: {content}")
            
        chat_str = "\n\n".join(chat_lines)

        st.download_button(
            "📥 下载当前会话 (TXT)", 
            chat_str, 
            file_name=f"chat_{get_time_str()}.txt", 
            use_container_width=True
        )

        # 导出完整记忆 ZIP
        if st.button("📦 导出完整记忆 (ZIP)", use_container_width=True):
            try:
                buffer = BytesIO()
                with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
                    # archive 目录
                    for root, dirs, files in os.walk(ARCHIVE_DIR):
                        for fname in files:
                            full_path = os.path.join(root, fname)
                            rel_path  = os.path.relpath(full_path, ".")
                            zf.write(full_path, arcname=rel_path)
                    # cache
                    if os.path.exists(CACHE_FILE):
                        zf.write(CACHE_FILE, arcname=os.path.basename(CACHE_FILE))
                    # 记忆 txt 文件
                    for f in os.listdir("."):
                        if f.endswith(".txt") and f not in ["wallet_log.txt","health_log.txt","special_dates.txt"]:
                            zf.write(f, arcname=f)
                buffer.seek(0)
                st.download_button(
                    "⬇️ 点击下载备份 ZIP", 
                    data=buffer, 
                    file_name=f"EthanMemoryBackup_{today_str()}.zip",
                    use_container_width=True
                )
            except Exception as e:
                st.error(f"导出失败：{e}")

        # 清空当前会话缓存（不删 archive）
        if st.button("🗑️ 清空当前会话缓存 (archive 保留)", use_container_width=True):
            st.session_state.messages = []
            save_cache([])
            st.success("已清空当前会话缓存（archive 中的历史记录仍然保留）。")
            st.rerun()

        # 重新生成上一句（只重生“逸辰”的最后一句）
        if len(st.session_state.messages) >= 2:
            if st.button("🔄 重新生成上一句回复", use_container_width=True):
                # 删除最后一条 assistant 消息
                if st.session_state.messages and st.session_state.messages[-1]["role"] == "assistant":
                    st.session_state.messages.pop()
                # 找最近一条 user 消息
                last_user_content = None
                for m in reversed(st.session_state.messages):
                    if m.get("role") == "user":
                        last_user_content = m.get("content","")
                        break
                if last_user_content:
                    st.session_state.regen_prompt = last_user_content
                    save_cache(st.session_state.messages)
                    st.rerun()
                else:
                    st.warning("没有找到上一条用户消息，无法重生。")

# ==========================================
# 主界面
# ==========================================
tab1, tab2, tab3, tab4 = st.tabs(["💬 甜蜜对话", "🏥 柒柒健康", "📅 纪念日", "💰 小金库"])
user_avatar  = "user_avatar.png" if os.path.exists("user_avatar.png") else "👧"
ethan_avatar = "avatar.png"      if os.path.exists("avatar.png")      else "🤖"

with tab1:
    for msg in st.session_state.messages:
        avatar = user_avatar if msg["role"] == "user" else ethan_avatar
        with st.chat_message(msg["role"], avatar=avatar):
            if "timestamp" in msg: st.caption(msg["timestamp"])
            content = msg.get("content", "")
            if isinstance(content, str) and content.startswith("__IMG__:"):
                img_path = content.split(":", 1)[1]
                if os.path.exists(img_path): st.image(img_path, width=260)
            else: st.markdown(content)
    
    # 🌟 干净的防遮挡垫片 (Clean Spacer)
    # 不再尝试自动滚屏，但保证手动滑到底时，内容绝对不被输入框遮挡
    st.markdown('<div style="height: 180px;"></div>', unsafe_allow_html=True)

# TAB 2: 健康
with tab2:
    st.header("🏥 柒柒身体调理")
    c1, c2 = st.columns([1, 1])
    with c1:
        h_type = st.selectbox("类型", ["💊 喝药", "🩸 经期", "🤕 不适", "🌙 作息", "💪 运动"])
        h_det  = st.text_input("细节", key="health_input")
        if st.button("提交记录", key="btn_health"):
            append_to_file("health_log.txt", f" {h_det}")
            st.success("已记录")
            time.sleep(0.5)
            st.rerun()
    with c2:
        st.subheader("📋 历史记录")
        lines = read_file("health_log.txt")
        if not lines:
            st.info("暂无记录")
        else:
            for i, line in enumerate(reversed(lines)):
                col_text, col_del = st.columns([0.85, 0.15])
                col_text.text(line.strip())
                original_index = len(lines) - 1 - i
                if col_del.button("🗑️", key=f"del_h_{i}"):
                    delete_line("health_log.txt", original_index)
                    st.rerun()

# TAB 3: 纪念日
with tab3:
    st.header("📅 纪念日")
    c1, c2 = st.columns([1, 1])
    with c1:
        d_date = st.date_input("日期")
        d_name = st.text_input("事件", key="date_input")
        if st.button("添加日子", key="btn_date"):
            append_to_file("special_dates.txt", f"{d_date} | {d_name}")
            st.success("已添加")
            st.rerun()
    with c2:
        st.subheader("📌 列表")
        lines = read_file("special_dates.txt")
        for i, line in enumerate(lines):
            col_text, col_del = st.columns([0.85, 0.15])
            col_text.success(line.strip())
            if col_del.button("🗑️", key=f"del_d_{i}"):
                delete_line("special_dates.txt", i)
                st.rerun()

# TAB 4: 小金库
with tab4:
    st.header("💰 小金库")
    c1, c2 = st.columns([1, 1])
    with c1:
        amt = st.number_input("金额", step=10.0)
        rsn = st.text_input("说明", key="wallet_input")
        act = st.radio("操作", ["存入 +", "支出 -"])
        if st.button("记账", key="btn_wallet"):
            sym = "+" if act == "存入 +" else "-"
            append_to_file("wallet_log.txt", f"{sym}{amt} | {rsn}")
            st.success("入账")
            st.rerun()
    with c2:
        lines = read_file("wallet_log.txt")
# ... existing code (Cache & Archive 部分保持不变) ...
# ... existing code (语音函数保持不变) ...
# ... existing code (初始化与侧边栏保持不变) ...
# ... existing code (主界面 Tab1-Tab4 保持不变) ...

# ==========================================
# 底部输入区与请求构建
# ==========================================
prompt = None
manual_run = False
uploaded_file = None

if "regen_prompt" in st.session_state:
    prompt = st.session_state.pop("regen_prompt")
    manual_run = True
elif "retry_prompt" in st.session_state:
    prompt = st.session_state.pop("retry_prompt")
    manual_run = True
else:
    cols = st.columns([0.07, 0.93])
    with cols[0]:
        if "show_upload" not in st.session_state: st.session_state.show_upload = False
        if st.button("＋"): st.session_state.show_upload = not st.session_state.show_upload
    with cols[1]:
        prompt = st.chat_input("星辰闪耀✨")
    manual_run = False

if st.session_state.get("show_upload", False):
    uploaded_file = st.file_uploader("上传图片", type=["png","jpg","jpeg"])

if prompt:
    bj_time = get_time_str()
    if not manual_run:
        st.session_state.messages.append({"role": "user", "content": prompt, "timestamp": bj_time})
        save_cache(st.session_state.messages)

    with tab1:
        with st.chat_message("user", avatar=user_avatar):
            st.caption(bj_time)
            st.markdown(prompt)

    if not api_key: st.error("🔑 缺 Chat Key"); st.stop()

    # 构建 Prompt
    auto_memory = ""
    if 'local_txt_files' in locals() and local_txt_files:
        for f_name in local_txt_files:
            try:
                with open(f_name, 'r', encoding='utf-8') as f: auto_memory += f"\n{f.read()}\n"
            except: pass
    
    system_prompt = "你叫逸辰..." + auto_memory + manual_memory
    payload = [{"role": "system", "content": system_prompt}]
    
    # 🌟 修复点 2：智能合并图文消息逻辑
    # 目的：如果是 [User发图] -> [User发文字]，就把文字塞进图片消息里，变成一条
    
    for msg in st.session_state.messages[-memory_depth:]:
        content = msg.get("content", "")
        role = msg.get("role", "user")

        # Case A: 这是一个图片消息 (标记)
        if isinstance(content, str) and content.startswith("__IMG__:"):
            img_path = content.split(":", 1)[1]
            if os.path.exists(img_path):
                img_msg = make_image_message_from_path(img_path)
                if img_msg is not None:
                    payload.append(img_msg)
            continue

        # Case B: 这是一个普通文本消息
        # 检查：如果上一条 payload 也是 user，并且是 list 类型（说明是刚才生成的图片消息）
        # 那么我们就不新建一条消息，而是把文字追加到上一条图片消息里！
        if (role == "user" 
            and len(payload) > 0 
            and payload[-1]["role"] == "user" 
            and isinstance(payload[-1]["content"], list)):
            
            # 把文字追加到 list 里，变成图文混合消息
            payload[-1]["content"].append({
                "type": "text",
                "text": str(content)
            })
        else:
            # 否则，正常添加一条纯文本消息
            payload.append({"role": role, "content": content})

    try:
        client = OpenAI(api_key=api_key, base_url=base_url)
        stream = client.chat.completions.create(
            model=final_model, messages=payload, stream=True, temperature=temperature
        )

        full_response = ""
        with tab1:
            with st.chat_message("assistant", avatar=ethan_avatar):
                resp_time = get_time_str()
                st.caption(resp_time)
                full_response = st.write_stream(stream)

        st.session_state.messages.append({"role": "assistant", "content": full_response, "timestamp": resp_time})
        save_cache(st.session_state.messages)

        # ✨ 语音生成逻辑修正：优先用侧边栏的值 ✨
        if enable_voice and full_response:
            # 这里的 mm_api_key 是从 st.text_input 拿到的，它是最新的！
            if not mm_api_key:
                st.warning("⚠️ MiniMax Key 没填！")
            else:
                with st.spinner("逸辰在对你说话..."):
                    audio_bytes = generate_minimax_final(full_response, mm_api_key, mm_voice_id)
                    if audio_bytes:
                        st.audio(audio_bytes, format="audio/mp3", start_time=0)

    except Exception as e:
        st.error(f"出错：{e}")
        st.session_state.failed_prompt = prompt
        if st.button("🔁 重试"):
            st.session_state.retry_prompt = prompt
            st.rerun()
# ==========================================
# 🖼 图片上传：作为聊天消息显示（持久显示缩略图）
# ==========================================
# 说明：
# - 通过底部「＋」按钮选择图片（PNG/JPG/JPEG）
# - 仅在首次选择该图片时追加一条“图片消息”，避免 Streamlit 重复执行导致多条记录
# - 图片会保存到本地 uploaded_images/ 目录，并在聊天历史中以缩略图形式持久显示

if uploaded_file is not None:
    mime = uploaded_file.type or ""
    # 只处理图片类型，其它类型暂不解析
    if mime.startswith("image/"):
        # 用 文件名 + 大小 作为简单的去重 key，避免重复添加
        img_key = f"{uploaded_file.name}_{getattr(uploaded_file, 'size', 0)}"
        last_key = st.session_state.get("last_uploaded_image_key")

        if img_key != last_key:
            st.session_state["last_uploaded_image_key"] = img_key

            image_bytes = uploaded_file.read()
            ts = get_time_str()

            # 保存到本地 uploaded_images/ 目录
            os.makedirs("uploaded_images", exist_ok=True)
            _, ext = os.path.splitext(uploaded_file.name)
            if not ext:
                ext = ".png"
            filename = f"img_{int(time.time())}{ext}"
            img_path = os.path.join("uploaded_images", filename)
            with open(img_path, "wb") as f:
                f.write(image_bytes)

            # 在消息记录中追加一条“图片消息”，content 特殊标记为 __IMG__:<路径>
            st.session_state.messages.append(
                {"role": "user", "content": f"__IMG__:{img_path}", "timestamp": ts}
            )
            st.session_state.messages = rotate_cache_if_needed(
                st.session_state.messages, max_messages=2000, keep_recent=800
            )
            save_cache(st.session_state.messages)

        # 使用一次后就收起上传菜单，防止误触
        st.session_state.show_upload = False
        st.rerun()

# 🧹 清理掉了无效的 JS 注入代码